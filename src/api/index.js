import axios from 'axios';

// axios 인스턴스 생성
const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 대회 관련 API
export const competitionAPI = {
    // 대회 생성
    createCompetition: (data) => api.post('/competitions', data),
};

export default api; 