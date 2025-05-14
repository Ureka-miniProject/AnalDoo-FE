import axios from 'axios';

// axios 인스턴스 생성
const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // 모든 요청에 쿠키 포함
});

// Request 인터셉터 추가
api.interceptors.request.use(
    (config) => {
        // 로그인과 회원가입 요청은 Authorization 헤더 제외
        if (config.url.includes('/login') || config.url.includes('/join')) {
            return config;
        }

        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 토큰 재발급 중인지 확인하는 플래그
let isRefreshing = false;
// 재발급 대기 중인 요청들을 저장하는 배열
let refreshSubscribers = [];

// 대기 중인 요청에 토큰을 적용해 실행
const onRefreshed = (token) => {
    refreshSubscribers.forEach(callback => callback(token));
    refreshSubscribers = [];
};

// 재발급 대기 큐에 콜백 추가
const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

// Response 인터셉터 추가 (401, 403 처리)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config, response } = error;

        // 토큰 만료 (401 + code === 'ACCESS_TOKEN_EXPIRED') 처리
        if (
            response?.status === 401 &&
            !config._retry &&
            response?.data?.code === 'ACCESS_TOKEN_EXPIRED'
        ) {
            console.log('401 detected! Try reissue...');

            if (isRefreshing) {
                console.log('Already refreshing, queue request');
                return new Promise(resolve => {
                    addRefreshSubscriber(token => {
                        config.headers.Authorization = `Bearer ${token}`;
                        resolve(api(config));
                    });
                });
            }

            config._retry = true;
            isRefreshing = true;

            try {
                console.log('Try to call /reissue');
                const reissueRes = await api.post('/api/v1/users/reissue');
                const { accessToken } = reissueRes.data;

                // 토큰 저장
                localStorage.setItem('accessToken', accessToken);
                config.headers.Authorization = `Bearer ${accessToken}`;

                // 대기 중인 요청들에 새 토큰 전달
                onRefreshed(accessToken);

                return api(config);
            } catch (refreshError) {
                console.error('Reissue failed:', refreshError);
                // 토큰 재발급 실패 시 로컬 스토리지 클리어하고 메인 페이지로 리다이렉트
                localStorage.clear();
                window.location.href = '/';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // 접근 권한 없음 (403): 즉시 로그아웃
        if (response?.status === 403) {
            localStorage.clear();
            window.location.href = '/';
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

// 인증 관련 API
export const authAPI = {
    login: (credentials) => api.post('/api/v1/users/login', credentials),
    logout: () => api.post('/api/v1/users/logout'),
    register: (userData) => api.post('/api/v1/users/join', userData),
};

// 대회 관련 API
export const competitionAPI = {
    createCompetition: (data) => api.post('/api/v1/competitions', data),
};

export default api;