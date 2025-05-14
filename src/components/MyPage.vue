<template>
  <HeaderBar />
  <div class="mypage-container">
    <aside class="profile-side">
      <div class="nickname-row">
        <span>{{ user.nickname }}</span>
      </div>
      <div class="info-list">
        <div class="info-row">
          <span class="info-label">이메일</span>
          <span class="info-value">{{ user.email }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">닉네임</span>
          <span class="info-value">{{ user.nickname }}</span>
        </div>
      </div>
      <div class="button-group">
        <button class="main-btn" @click="showNicknameModal = true">닉네임 수정</button>
        <button class="main-btn" @click="showPasswordModal = true">비밀번호 변경</button>
      </div>
    </aside>

    <main class="contest-table-side">
      <h2>신청한 대회</h2>
      <table>
        <thead>
          <tr>
            <th>날짜</th>
            <th>대회명</th>
            <th>장소</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contest in contests" :key="contest.id">
            <td>{{ contest.date }}</td>
            <td>{{ contest.name }}</td>
            <td>{{ contest.location }}</td>
          </tr>
        </tbody>
      </table>
      <!-- 개최한 대회 표도 추후 추가 가능 -->
    </main>

    <!-- 닉네임 수정 모달 -->
    <div v-if="showNicknameModal" class="modal">
      <div class="modal-content">
        <h3>닉네임 수정</h3>
        <input v-model="newNickname" placeholder="새 닉네임" />
        <div v-if="nicknameError" class="error-message">{{ nicknameError }}</div>
        <button @click="updateNickname">저장</button>
        <button @click="() => { showNicknameModal = false; nicknameError = '' }">닫기</button>
      </div>
    </div>

    <!-- 비밀번호 변경 모달 -->
    <div v-if="showPasswordModal" class="modal">
      <div class="modal-content">
        <h3>비밀번호 변경</h3>
        <input type="password" v-model="newPassword" placeholder="새 비밀번호" />
        <button @click="updatePassword">저장</button>
        <button @click="showPasswordModal = false">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeaderBar from './HeaderBar.vue'
import { ref, onMounted } from 'vue'
import api from '../api'

const user = ref({})
const contests = ref([])
const showNicknameModal = ref(false)
const showPasswordModal = ref(false)
const newNickname = ref('')
const newPassword = ref('')
const nicknameError = ref('')

// 사용자 정보 가져오기
const fetchUser = async () => {
  try {
    const response = await api.get('/api/v1/users/mypage');
    user.value = response.data;
    newNickname.value = response.data.nickname;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
};

// 신청한 대회 불러오기
const fetchContests = async () => {
  try {
    const response = await api.get('/api/v1/contests/applied');
    contests.value = response.data;
  } catch (error) {
    console.error('Failed to fetch contests:', error);
  }
};

onMounted(() => {
  fetchUser();
  fetchContests();
});

// 닉네임 업데이트
const updateNickname = async () => {
  nicknameError.value = '';
  try {
    await api.patch('/api/v1/users/updateNickname', 
      { newNickname: newNickname.value }
    );
    user.value.nickname = newNickname.value;
    showNicknameModal.value = false;
    alert('닉네임이 변경되었습니다.');
  } catch (error) {
    nicknameError.value = error.response?.data?.message || '닉네임 변경 중 오류가 발생했습니다.';
  }
};

// 비밀번호 업데이트
const updatePassword = async () => {
  try {
    await api.patch('/api/v1/users/updatePassword', 
      { newPassword: newPassword.value }
    );
    showPasswordModal.value = false;
    newPassword.value = '';
    alert('비밀번호가 변경되었습니다.');
  } catch (error) {
    alert('비밀번호 변경 중 오류가 발생했습니다.');
  }
};
</script>

<style scoped>
.mypage-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 40px;
  min-height: 100vh;
  background: #f7f8fa;
  padding: 40px 0;
}

.profile-side {
  width: 320px;
  min-width: 220px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 22px;
}

.nickname-row {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 1.5rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 8px;
}

.info-list {
  width: 100%;
  margin: 18px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.08rem;
  background: #f7f8fa;
  border-radius: 7px;
  padding: 10px 14px;
  font-weight: 500;
}
.info-label {
  color: #4a90e2;
  font-weight: 700;
  min-width: 60px;
  letter-spacing: 0.01em;
}
.info-value {
  color: #222;
  font-weight: 500;
  word-break: break-all;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 18px;
  width: 100%;
}
.main-btn {
  flex: 1 1 0;
  background: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  font-size: 1.08rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(74,144,226,0.07);
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s;
}
.main-btn:hover {
  background: #357abd;
  box-shadow: 0 4px 16px rgba(74,144,226,0.13);
}

.contest-table-side {
  flex: 1;
  min-width: 320px;
  max-width: 700px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  padding: 32px 36px;
  margin-left: 0;
}

.contest-table-side h2 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 18px;
  color: #222;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

th, td {
  padding: 12px 16px;
  text-align: left;
  font-size: 1rem;
}

th {
  background: #f0f4f8;
  color: #333;
  font-weight: 600;
  border-bottom: 2px solid #e0e6ed;
}

tr:not(:last-child) td {
  border-bottom: 1px solid #f0f0f0;
}

.modal {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.25);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: stretch;
}
.modal-content h3 {
  margin-bottom: 8px;
  font-size: 1.2rem;
  font-weight: 700;
  color: #222;
}
.modal-content input {
  padding: 10px 12px;
  border: 1px solid #e0e6ed;
  border-radius: 7px;
  font-size: 1rem;
  margin-bottom: 8px;
}
.modal-content button {
  width: 100%;
  padding: 12px 0;
  border: none;
  border-radius: 8px;
  font-size: 1.08rem;
  font-weight: 600;
  margin-bottom: 10px;
  background: #4a90e2;
  color: #fff;
  cursor: pointer;
  transition: background 0.18s;
  box-shadow: 0 2px 8px rgba(74,144,226,0.07);
}
.modal-content button:last-child {
  background: #fff;
  color: #4a90e2;
  border: 1.5px solid #4a90e2;
  margin-bottom: 0;
}
.modal-content button:hover:not(:last-child) {
  background: #357abd;
}
.modal-content button:last-child:hover {
  background: #f0f4f8;
}
.error-message {
  color: #e74c3c;
  margin: 8px 0;
  font-size: 0.98rem;
  font-weight: 500;
}

/* 반응형: 태블릿 이하 */
@media (max-width: 900px) {
  .mypage-container {
    flex-direction: column;
    align-items: center;
    gap: 24px;
    padding: 24px 0;
  }
  .profile-side, .contest-table-side {
    width: 90vw;
    min-width: unset;
    max-width: 600px;
    padding: 24px 16px;
  }
  .contest-table-side {
    margin-left: 0;
  }
}

/* 반응형: 모바일 */
@media (max-width: 600px) {
  .mypage-container {
    padding: 10px 0;
    gap: 14px;
  }
  .profile-side, .contest-table-side {
    width: 98vw;
    max-width: 98vw;
    padding: 16px 6px;
    border-radius: 10px;
  }
  .nickname-row {
    font-size: 1.1rem;
    gap: 8px;
  }
  th, td {
    padding: 8px 6px;
    font-size: 0.98rem;
  }
  .modal-content {
    min-width: 90vw;
    padding: 1.2rem 0.5rem 1rem 0.5rem;
  }
}
</style> 