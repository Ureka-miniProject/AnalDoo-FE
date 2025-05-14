import axios from 'axios';

// axios 인스턴스 생성
const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // 모든 요청에 withCredentials 추가
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
    (error) => {
        return Promise.reject(error);
    }
);

// 토큰 재발급 중인지 확인하는 플래그
let isRefreshing = false;
// 재발급 대기 중인 요청들을 저장하는 배열
let refreshSubscribers = [];

// 재발급 대기 중인 요청들을 실행하는 함수
const onRefreshed = (token) => {
    refreshSubscribers.forEach(callback => callback(token));
    refreshSubscribers = [];
};

// 재발급 대기 중인 요청을 추가하는 함수
const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

// Response 인터셉터 추가 (토큰 만료 처리)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config, response } = error;
        if (response?.status === 401 && !config._retry) {
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
                console.log('Reissue response:', reissueRes);
                const { accessToken } = reissueRes.data;
                
                // 토큰 저장
                localStorage.setItem('accessToken', accessToken);
                
                // Authorization 헤더 업데이트
                config.headers.Authorization = `Bearer ${accessToken}`;
                
                // 대기 중인 요청들 처리
                onRefreshed(accessToken);
                
                return api(config);
            } catch (refreshError) {
                console.error('Reissue failed:', refreshError);
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // 403(Forbidden) 발생 시 바로 로그아웃 처리
        if (response?.status === 403) {
            localStorage.clear();
            window.location.href = '/login';
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

// 인증 관련 API
export const authAPI = {
    // 로그인
    login: (credentials) => api.post('/api/v1/users/login', credentials),
    // 로그아웃
    logout: () => api.post('/api/v1/users/logout'),
    // 회원가입
    register: (userData) => api.post('/api/v1/users/join', userData),
};

// 대회 관련 API
export const competitionAPI = {
    // 대회 생성
    createCompetition: (data) => api.post('/api/v1/competitions', data),
};

export default api; 