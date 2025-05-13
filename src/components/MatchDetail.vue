<template>
  <div class="match-detail-page">
    <div class="match-detail-container">
      <!-- 왼쪽 정보 섹션 -->
      <div class="info-section">
        <div class="header-section">
        <h2 class="match-title">{{ match.name }}</h2>
          <div class="match-status" :class="statusClass" :style="{ background: statusColor }">
            {{ statusLabel }}
          </div>
        </div>

        <div class="point-grid">
          <div class="point-item">
            <span class="icon">{{ sportIcon }}</span>
            <span class="label">종목</span>
            <span class="value">{{ displaySportType }}</span>
          </div>
          <div class="point-item">
            <span class="icon">📅</span>
            <span class="label">모집기간</span>
            <span class="value">{{ formattedRecruitPeriod }}</span>
          </div>
          <div class="point-item">
            <span class="icon">🗓️</span>
            <span class="label">대회일시</span>
            <span class="value">{{ formattedMatchDate }}</span>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">
              <span class="info-label-icon">🏅</span>
              <span>개최자</span>
            </div>
            <span class="info-value">{{ match.host }}</span>
          </div>
          <div class="info-item">
            <div class="info-label">
              <span class="info-label-icon">📍</span>
              <span>대회 장소</span>
            </div>
            <span class="info-value">{{ match.address.fullAddress }}</span>
          </div>
        </div>

        <div class="description-box">
          <h3>📋 대회 설명</h3>
          <p>{{ match.content }}</p>
        </div>
      </div>

      <!-- 오른쪽 신청 섹션 -->
      <div class="main-section">
        <div class="price-section">
          <div class="price-label">참가비</div>
        <div class="price">{{ match.entryFee.toLocaleString() }}원</div>
        </div>

        <div class="reward-section">
          <div class="reward-label">상금</div>
          <div class="reward">{{ match.reward.toLocaleString() }}원</div>
        </div>
        
        <div class="entry-info">
          <div class="progress-bar">
            <div 
              class="progress" 
              :style="{ width: (match.entryCount / match.limitCount * 100) + '%' }"
            ></div>
          </div>
          <div class="entry-count">
            <span class="current">{{ match.entryCount }}</span>
            <span class="separator">/</span>
            <span class="limit">{{ match.limitCount }}명</span>
          </div>
          <div class="entry-status">
            <div class="remaining-count">{{ match.limitCount - match.entryCount }}자리</div>
            <div class="remaining-text">남았어요!</div>
          </div>
        </div>

        <button class="apply-btn" @click="requestPay">
          <span class="btn-text">신청하기</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import { getSportIcon, getSportLabel, COMPETITION_STATUS, COMPETITION_STATUS_LABELS, COMPETITION_STATUS_COLORS } from '@/constants/sportIcons'

export default {
  name: 'MatchDetail',
  data() {
    return {
      match: {
        id: 1,
        name: '풋살 페스티벌',
        content: '이 대회는 누구나 즐겁게 참여할 수 있는 친선 경기입니다. 경기 규칙은 현장 공지 예정이며, 페어플레이 정신을 중요시합니다.',
        period: {
          startDate: '2025-06-01',
          endDate: '2025-06-10'
        },
        matchDate: '2025-06-15 14:30',
        entryFee: 20000,
        entryCount: 10,
        limitCount: 12,
        reward: 300000,
        sportType: 'FOOTBALL',
        host: '김희진',
        address: {
          fullAddress: '부산 시민체육관 A구장'
        },
        status: COMPETITION_STATUS.OPEN
      }
    }
  },
  computed: {
    statusLabel() {
      return COMPETITION_STATUS_LABELS[this.match.status] || '상태 없음'
    },
    statusColor() {
      return COMPETITION_STATUS_COLORS[this.match.status] || '#999'
    },
    statusClass() {
      return {
        'status-open': this.match.status === 'OPEN',
        'status-closed': this.match.status === 'CLOSED'
      }
    },
    sportIcon() {
      return getSportIcon(this.match.sportType)
    },
    displaySportType() {
      return getSportLabel(this.match.sportType)
    },
    formattedRecruitPeriod() {
      const s = new Date(this.match.period.startDate)
      const e = new Date(this.match.period.endDate)
      return `${s.getMonth() + 1}/${s.getDate()} ~ ${e.getMonth() + 1}/${e.getDate()}`
    },
    formattedMatchDate() {
      const d = new Date(this.match.matchDate)
      const day = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]
      const h = d.getHours().toString().padStart(2, '0')
      const m = d.getMinutes().toString().padStart(2, '0')
      return `${d.getMonth() + 1}월 ${d.getDate()}일 (${day}) ${h}:${m}`
    }
  },
  methods: {
    requestPay() {
      const IMP = window.IMP
      IMP.init(process.env.VUE_APP_IAMPORT_KEY)

      // 먼저 예약 요청
      api.post('/api/v1/reservation', {
        competitionId: this.match.id
      })
        .then(response => {
          // 예약 성공 시 결제 준비 요청
          const reservationId = response.data.reservationId
          return api.post(`/api/v1/payments/prepare/${reservationId}`)
        })
        .then(response => {
          IMP.request_pay({
            channelKey: response.data.channelKey,
            pay_method: response.data.payMethod,
            merchant_uid: response.data.merchantUId,
            name: response.data.name,
            amount: response.data.amount,
            buyer_email: response.data.buyerEmail,
            buyer_name: response.data.buyerName
          }, (response) => {
            // 결제창이 닫힌 경우 
            if (!response.success) {
              return
            }

            if (response.error_code != null) {
              return alert(`결제에 실패하였습니다. 에러 내용: ${response.error_msg}`)
            }

            api.post('/api/v1/payments/verify', {
              impUid: response.imp_uid,
              merchantUid: response.merchant_uid,
              amount: response.paid_amount
            }).then(() => {
              alert('결제가 성공적으로 완료되었습니다.')
            }).catch(() => {
              alert('결제 검증에 실패했습니다.')
            })
          })
        })
        .catch(error => {
          if (error.response) {
            alert(error.response.data.message)
          }
        })
    }
  },
  mounted() {
    // iamport 스크립트 동적 로드
    const script = document.createElement('script')
    script.src = 'https://cdn.iamport.kr/v1/iamport.js'
    document.head.appendChild(script)
  }
}
</script>

<style scoped>
.match-detail-page {
  background: #f7f7f7;
  min-height: 100vh;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.match-detail-container {
  max-width: 1200px;
  width: 100%;
  margin: 20px auto;
  display: flex;
  background: #fff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  gap: 40px;
  box-sizing: border-box;
}

.info-section {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.match-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.2;
  flex: 1;
}

.match-status {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
  transition: all 0.3s ease;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.status-open {
  background: linear-gradient(135deg, #4CAF50, #45a049) !important;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.status-closed {
  background: linear-gradient(135deg, #f44336, #e53935) !important;
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.point-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 8px;
}

.point-item {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.point-item .icon {
  font-size: 24px;
}

.point-item .label {
  color: #666;
  font-size: 14px;
}

.point-item .value {
  color: #1a1a1a;
  font-size: 18px;
  font-weight: 600;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-label {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 15px;
}

.info-label-icon {
  width: 22px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-value {
  color: #1a1a1a;
  font-size: 17px;
  font-weight: 500;
  margin-left: 22px;  /* 아이콘 width와 동일하게 */
}

.description-box {
  background: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
  margin-top: 8px;
}

.description-box h3 {
  font-size: 18px;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.description-box p {
  font-size: 16px;
  color: #444;
  line-height: 1.7;
  white-space: pre-line;
}

.main-section {
  flex: 1.2;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  border-radius: 16px;
  background: #f8f9fa;
  height: fit-content;
  align-self: flex-start;
  position: sticky;
  top: 20px;
}

.price-section {
  text-align: center;
}

.price-label {
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
}

.price {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
}

.reward-section {
  text-align: center;
  margin: 20px 0;
  padding: 16px;
  background: #f0f8ff;
  border-radius: 12px;
}

.reward-label {
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
}

.reward {
  font-size: 28px;
  font-weight: 700;
  color: #3578ff;
}

.entry-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 12px;
  margin: 20px 0;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.progress {
  height: 100%;
  background: linear-gradient(to right, #4CAF50, #45a049);
  border-radius: 8px;
  transition: width 0.3s ease;
}

.entry-count {
  text-align: center;
  margin: 4px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.entry-count .separator {
  color: #666;
  margin: 0 4px;
}

.entry-count .current {
  color: #3578ff;
}

.entry-count .limit {
  color: #666;
}

.entry-status {
  background: #e8f5e9;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid rgba(76, 175, 80, 0.2);
  margin-top: 4px;
}

.remaining-count {
  font-size: 24px;
  font-weight: 700;
  color: #2e7d32;
  margin-bottom: 2px;
}

.remaining-text {
  font-size: 16px;
  color: #43a047;
  font-weight: 500;
}

.apply-btn {
  background: linear-gradient(to right, #3578ff, #1a56ff);
  color: white;
  font-size: 18px;
  padding: 16px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.apply-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(53, 120, 255, 0.2);
}

.apply-btn:active {
  transform: translateY(0);
}

@media (max-width: 1024px) {
  .match-detail-container {
    flex-direction: column;
    padding: 24px;
  }

  .main-section {
    position: static;
    width: 100%;
  }

  .point-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

@media (max-width: 768px) {
  .match-detail-page {
    padding: 12px;
}

  .match-detail-container {
    padding: 16px;
    margin: 10px auto;
  }

  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .match-title {
    font-size: 24px;
    width: 100%;
  }

  .match-status {
    font-size: 16px;
    padding: 6px 12px;
    min-width: 80px;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .info-item {
    gap: 8px;
  }

  .entry-info {
    padding: 12px;
  }

  .remaining-count {
    font-size: 20px;
  }

  .remaining-text {
    font-size: 14px;
  }
}
</style>
