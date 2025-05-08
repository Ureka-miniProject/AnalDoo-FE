<template>
  <div class="create-match-overlay">
    <div class="create-match-modal">
      <h2>대회 주최하기</h2>
      
      <form @submit.prevent="handleSubmit" class="create-match-form">
        <div class="form-group">
          <label>대회명</label>
          <input v-model="formData.name" type="text" required placeholder="대회명을 입력하세요">
        </div>

        <div class="form-group">
          <label>종목</label>
          <select v-model="formData.sportType" required>
            <option value="" disabled selected>종목을 선택하세요</option>
            <option value="FOOTBALL">풋볼</option>
            <option value="BADMINTON">배드민턴</option>
            <option value="JIUJITSU">주짓수</option>
          </select>
        </div>

        <div class="form-group">
          <label>대회 설명</label>
          <textarea v-model="formData.content" required placeholder="대회에 대한 상세 설명을 입력하세요"></textarea>
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label>모집 시작일</label>
            <input v-model="formData.recruitStartDate" type="date" required>
          </div>
          <div class="form-group half">
            <label>모집 종료일</label>
            <input v-model="formData.recruitEndDate" type="date" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label>대회 날짜</label>
            <input v-model="formData.matchDate" type="date" required>
          </div>
          <div class="form-group half">
            <label>대회 시간</label>
            <input v-model="formData.matchTime" type="time" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label>참가비</label>
            <div class="input-with-unit">
              <input v-model.number="formData.entryFee" type="number" required placeholder="0">
              <span class="unit">원</span>
            </div>
          </div>
          <div class="form-group half">
            <label>상금</label>
            <div class="input-with-unit">
              <input v-model.number="formData.reward" type="number" required placeholder="0">
              <span class="unit">원</span>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label>최소 참가 인원</label>
            <div class="input-with-unit">
              <input v-model.number="formData.minCount" type="number" required min="1">
              <span class="unit">명</span>
            </div>
          </div>
          <div class="form-group half">
            <label>최대 참가 인원</label>
            <div class="input-with-unit">
              <input v-model.number="formData.maxCount" type="number" required min="1">
              <span class="unit">명</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>주소</label>
          <div class="address-inputs">
            <div class="form-row">
              <div class="form-group half">
                <input v-model="formData.local" type="text" required placeholder="시/도">
              </div>
              <div class="form-group half">
                <input v-model="formData.street" type="text" required placeholder="도로명 주소">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group half">
                <input v-model="formData.zipcode" type="text" required placeholder="우편번호">
              </div>
              <div class="form-group half">
                <input v-model="formData.detail" type="text" placeholder="상세 주소">
              </div>
            </div>
          </div>
        </div>

        <div class="button-group">
          <button type="button" class="cancel-btn" @click="goHome">취소</button>
          <button type="submit" class="submit-btn">
            <span class="btn-text">대회 생성하기</span>
          </button>
        </div>
      </form>
    </div>

    <!-- 알림창 컴포넌트 -->
    <div v-if="showAlert" class="alert-overlay" @click="closeAlert">
      <div class="alert-box" @click.stop>
        <div class="alert-icon">✓</div>
        <div class="alert-message">대회가 성공적으로 생성되었습니다!</div>
        <button class="alert-button" @click="closeAlert">확인</button>
      </div>
    </div>
  </div>
</template>

<script>
import { competitionAPI } from '@/api'

export default {
  name: 'CreateMatch',
  data() {
    return {
      showAlert: false,
      formData: {
        name: '',
        sportType: 'FOOTBALL',
        content: '',
        recruitStartDate: '',
        recruitEndDate: '',
        matchDate: '',
        matchTime: '',
        entryFee: 0,
        reward: 0,
        minCount: 1,
        maxCount: 1,
        local: '',
        street: '',
        zipcode: '',
        detail: ''
      }
    }
  },
  methods: {
    goHome() {
      this.$router.push('/')
    },
    async handleSubmit() {
      try {
        // 날짜와 시간 데이터를 LocalDateTime 형식으로 변환
        const startDate = new Date(this.formData.recruitStartDate)
        const endDate = new Date(this.formData.recruitEndDate)
        const matchDateTime = new Date(`${this.formData.matchDate}T${this.formData.matchTime}`)

        // 백엔드 API 요청 데이터 형식에 맞게 변환
        const requestData = {
          name: this.formData.name,
          content: this.formData.content,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          competitionDate: matchDateTime.toISOString(),
          entryFee: this.formData.entryFee,
          entryCount: this.formData.maxCount,
          sportType: this.formData.sportType,
          local: this.formData.local,
          street: this.formData.street,
          zipcode: this.formData.zipcode,
          detail: this.formData.detail || ''
        }

        // 백엔드 API 호출
        const response = await competitionAPI.createCompetition(requestData)
        console.log('대회 생성 성공:', response.data)
        
        // 성공 알림창 표시
        this.showAlert = true
        
        // 2초 후 자동으로 홈으로 이동
        setTimeout(() => {
          this.closeAlert()
        }, 2000)
      } catch (error) {
        console.error('대회 생성 실패:', error.response?.data || error.message)
        alert(error.response?.data?.message || '대회 생성에 실패했습니다. 다시 시도해주세요.')
      }
    },
    closeAlert() {
      this.showAlert = false
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.create-match-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.create-match-modal {
  background: white;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  padding: 32px 40px;
  margin: 0;
  position: relative;
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h2 {
  font-size: 28px;
  margin-bottom: 35px;
  color: #1a1a1a;
  text-align: center;
  font-weight: 700;
  position: relative;
}

h2::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(to right, #3578ff, #1a56ff);
  border-radius: 2px;
}

.create-match-form {
  width: 100%;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 28px;
  width: 100%;
}

.form-row {
  display: flex;
  gap: 24px;
  margin-bottom: 28px;
  width: 100%;
}

.half {
  flex: 1;
  margin-bottom: 0;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 15px;
  transition: color 0.2s;
}

.input-with-unit {
  position: relative;
  display: flex;
  align-items: center;
}

.unit {
  position: absolute;
  right: 15px;
  color: #666;
  font-size: 14px;
  pointer-events: none;
}

input, select, textarea {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.2s;
  background: #f8f9fa;
  box-sizing: border-box;
  color: #2c3e50;
}

input[type="number"] {
  padding-right: 40px;
}

input:hover, select:hover, textarea:hover {
  border-color: #d0d0d0;
  background: #fff;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #3578ff;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(53, 120, 255, 0.1);
}

textarea {
  height: 120px;
  resize: vertical;
  line-height: 1.6;
}

input[type="date"], input[type="time"] {
  color: #2c3e50;
  font-family: inherit;
  cursor: pointer;
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232c3e50' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 15px;
  padding-right: 45px;
}

.button-group {
  display: flex;
  gap: 16px;
  margin-top: 40px;
}

.cancel-btn {
  flex: 1;
  padding: 16px 32px;
  border: 2px solid #e8e8e8;
  background: white;
  color: #666;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #f8f9fa;
  border-color: #d0d0d0;
  color: #333;
}

.submit-btn {
  flex: 1;
  background: linear-gradient(to right, #3578ff, #1a56ff);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.btn-text {
  position: relative;
  z-index: 1;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #1a56ff, #3578ff);
  opacity: 0;
  transition: opacity 0.2s;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(53, 120, 255, 0.3);
}

.submit-btn:hover::before {
  opacity: 1;
}

.submit-btn:active {
  transform: translateY(0);
  box-shadow: 0 3px 10px rgba(53, 120, 255, 0.2);
}

/* 스크롤바 스타일링 */
.create-match-modal::-webkit-scrollbar {
  width: 10px;
}

.create-match-modal::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 5px;
}

.create-match-modal::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 5px;
  border: 2px solid #f1f1f1;
}

.create-match-modal::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

@media (max-width: 768px) {
  .create-match-modal {
    width: 95%;
    padding: 24px 28px;
    margin: 0;
  }
  
  .form-row {
    flex-direction: column;
    gap: 20px;
  }
  
  .half {
    width: 100%;
  }
  
  h2 {
    font-size: 24px;
    margin-bottom: 30px;
  }
  
  .button-group {
    flex-direction: column;
    gap: 12px;
  }

  input, select, textarea {
    padding: 12px 16px;
    font-size: 14px;
  }

  label {
    font-size: 14px;
  }
}

.alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  animation: fadeIn 0.2s ease-out;
}

.alert-box {
  background: white;
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease-out;
  max-width: 90%;
  width: 400px;
}

.alert-icon {
  width: 60px;
  height: 60px;
  background: #4CAF50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin: 0 auto 20px;
}

.alert-message {
  font-size: 18px;
  color: #333;
  margin-bottom: 25px;
  font-weight: 600;
}

.alert-button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.alert-button:hover {
  background: #43A047;
  transform: translateY(-1px);
}

.alert-button:active {
  transform: translateY(0);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .alert-box {
    width: 85%;
    padding: 25px;
  }

  .alert-icon {
    width: 50px;
    height: 50px;
    font-size: 28px;
    margin-bottom: 15px;
  }

  .alert-message {
    font-size: 16px;
    margin-bottom: 20px;
  }
}

.address-inputs {
  width: 100%;
}

.address-inputs .form-row {
  margin-bottom: 12px;
}

.address-inputs .form-row:last-child {
  margin-bottom: 0;
}
</style> 