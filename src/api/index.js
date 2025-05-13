import axios from 'axios';

// axios 인스턴스 생성
const api = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
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

// Response 인터셉터 추가 (토큰 만료 처리)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // 토큰 만료 에러이고, 재시도하지 않은 요청인 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // 리프레시 토큰으로 새로운 액세스 토큰 발급
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await api.post('/api/v1/users/refresh', { refreshToken });
                const { accessToken } = response.data;
                
                // 새로운 액세스 토큰 저장
                localStorage.setItem('accessToken', accessToken);
                
                // 원래 요청의 Authorization 헤더 업데이트
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                
                // 원래 요청 재시도
                return api(originalRequest);
            } catch (refreshError) {
                // 리프레시 토큰도 만료된 경우 로그아웃 처리
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
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