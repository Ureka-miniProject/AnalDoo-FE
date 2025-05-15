<template>
  <div class="mypage-container">
    <div class="profile-header">
      <div class="profile-info">
        <div class="profile-avatar">
          <svg width="60" height="60" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6" fill="#e0e7ef"/><ellipse cx="12" cy="19" rx="9" ry="5" fill="#e0e7ef"/></svg>
        </div>
        <div>
          <div class="profile-email">{{ myInfo.email }}</div>
          <div class="profile-nickname">{{ myInfo.nickname }}</div>
        </div>
        <button class="edit-profile-btn" @click="openEditModal" title="프로필 편집">
          <svg width="22" height="22" fill="none" stroke="#4a90e2" stroke-width="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3.414a2 2 0 01.586-1.414z"/></svg>
        </button>
      </div>
      <div class="profile-actions">
        <button @click="fetchCreated" :class="{active: activeTab==='created'}">생성한 대회</button>
        <button @click="fetchJoined" :class="{active: activeTab==='joined'}">참가한 대회</button>
      </div>
    </div>
    <div class="competition-list">
      <div v-if="loading" class="loading">불러오는 중...</div>
      <div v-else-if="competitions.length === 0" class="empty">
        {{ activeTab === 'created' ? '생성한 대회가 없습니다.' : '참가한 대회가 없습니다.' }}
      </div>
      <div v-else>
        <div
          v-for="item in competitions"
          :key="item.id"
          class="competition-card"
        >
          <div class="comp-header">
            <div class="comp-title" @click="goToDetail(item.id)">{{ item.name }}</div>
            <button class="delete-btn" @click.stop="handleDelete(item.id)" title="삭제">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
            </button>
          </div>
          <div class="comp-info" @click="goToDetail(item.id)">
            <span v-if="item.competitionDate">일시: {{ formatDate(item.competitionDate) }}</span>
            <span v-if="item.local">장소: {{ item.local }}</span>
            <span v-if="item.status">상태: {{ item.status }}</span>
            <span v-if="item.sportType">종목: {{ item.sportType }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 프로필 편집 모달 테스트 -->
    <div v-if="showEditModal" class="modal" @click.self="closeEditModal">
      <div class="modal-content">
        <h3>프로필 편집</h3>
        <label>닉네임</label>
        <input v-model="editNickname" :disabled="editLoading" maxlength="20" />
        <div v-if="nicknameError" class="error-message">{{ nicknameError }}</div>
        <button @click="saveNickname" :disabled="editLoading">닉네임 저장</button>
        <div class="divider"></div>
        <button class="pw-toggle-btn" @click="showPwInput = !showPwInput">
          {{ showPwInput ? '비밀번호 변경 취소' : '비밀번호 변경' }}
        </button>
        <div v-if="showPwInput" class="pw-change-area">
          <input type="password" v-model="editPassword" placeholder="새 비밀번호" :disabled="editLoading" maxlength="20" />
          <button @click="savePassword" :disabled="editLoading">비밀번호 저장</button>
          <div v-if="pwError" class="error-message">{{ pwError }}</div>
        </div>
        <button class="close-btn" @click="closeEditModal">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'

const router = useRouter()
const myInfo = ref({})
const competitions = ref([])
const activeTab = ref('created')
const loading = ref(false)

// 프로필 편집 모달 관련 상태
const showEditModal = ref(false)
const editNickname = ref('')
const editPassword = ref('')
const showPwInput = ref(false)
const editLoading = ref(false)
const nicknameError = ref('')
const pwError = ref('')

const openEditModal = () => {
  editNickname.value = myInfo.value.nickname
  editPassword.value = ''
  showPwInput.value = false
  nicknameError.value = ''
  pwError.value = ''
  showEditModal.value = true
}
const closeEditModal = () => {
  showEditModal.value = false
}

const saveNickname = async () => {
  nicknameError.value = ''
  if (!editNickname.value.trim()) {
    nicknameError.value = '닉네임을 입력하세요.'
    return
  }
  editLoading.value = true
  try {
    await api.patch('/api/v1/users/nickname', { newNickname: editNickname.value })
    myInfo.value.nickname = editNickname.value
    closeEditModal()
  } catch (e) {
    nicknameError.value = e.response?.data?.message || '닉네임 변경 실패'
  } finally {
    editLoading.value = false
  }
}

const savePassword = async () => {
  pwError.value = ''
  if (!editPassword.value || editPassword.value.length < 8) {
    pwError.value = '비밀번호는 8자 이상이어야 합니다.'
    return
  }
  editLoading.value = true
  try {
    await api.patch('/api/v1/users/updatePassword', { newPassword: editPassword.value })
    showPwInput.value = false
    editPassword.value = ''
    pwError.value = '비밀번호가 변경되었습니다.'
  } catch (e) {
    pwError.value = e.response?.data?.message || '비밀번호 변경 실패'
  } finally {
    editLoading.value = false
  }
}

// 사용자 정보 가져오기
const fetchMyInfo = async () => {
  try {
    const response = await api.get('/api/v1/users/mypage');
    myInfo.value = response.data;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
};

// 신청한 대회 불러오기
const fetchCreated = async () => {
  activeTab.value = 'created'
  loading.value = true
  try {
    const response = await api.get('/api/v1/users/my-created');
    competitions.value = response.data;
  } catch (error) {
    console.error('Failed to fetch created contests:', error);
    competitions.value = []
  } finally {
    loading.value = false
  }
};

const fetchJoined = async () => {
  activeTab.value = 'joined'
  loading.value = true
  try {
    const response = await api.get('/api/v1/users/my-joined');
    competitions.value = response.data;
  } catch (error) {
    console.error('Failed to fetch joined contests:', error);
    competitions.value = []
  } finally {
    loading.value = false
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${d.getMonth()+1}.${d.getDate()}`
}

const goToDetail = (id) => {
  router.push(`/match/${id}`)
}

const handleDelete = async (id) => {
  if (!confirm('정말로 삭제하시겠습니까?')) return;
  
  try {
    const url = activeTab.value === 'created' 
      ? `/api/v1/competitions/${id}`
      : `/api/v1/reservation/${id}`;
    
    await api.delete(url);
    
    // 삭제 후 목록 새로고침
    if (activeTab.value === 'created') {
      await fetchCreated();
    } else {
      await fetchJoined();
    }
    
    alert('삭제되었습니다.');
  } catch (error) {
    console.error('삭제 실패:', error);
    alert(error.response?.data?.message || '삭제에 실패했습니다.');
  }
};

onMounted(() => {
  fetchMyInfo();
  fetchCreated();
});
</script>

<style scoped>
.mypage-container {
  max-width: 600px;
  margin: 40px auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 2rem 1.5rem;
}
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}
.profile-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  position: relative;
}
.edit-profile-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 0.5rem;
  padding: 0.2rem;
  position: absolute;
  right: -36px;
  top: 10px;
  transition: background 0.15s;
}
.edit-profile-btn:hover {
  background: #e0e7ef;
  border-radius: 50%;
}
.profile-avatar {
  width: 60px; height: 60px;
  border-radius: 50%;
  background: #e0e7ef;
  display: flex; align-items: center; justify-content: center;
}
.profile-email {
  font-size: 1.1rem;
  color: #666;
}
.profile-nickname {
  font-size: 1.3rem;
  font-weight: bold;
  color: #222;
}
.profile-actions {
  display: flex;
  gap: 1rem;
}
.profile-actions button {
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 20px;
  background: #e0e7ef;
  color: #333;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.profile-actions button.active,
.profile-actions button:hover {
  background: #4a90e2;
  color: #fff;
}
.competition-list {
  margin-top: 1.5rem;
}
.competition-card {
  background: #f8fafd;
  border-radius: 10px;
  padding: 1rem 1.2rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.comp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.delete-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #666;
  border-radius: 4px;
  transition: all 0.2s;
}
.delete-btn:hover {
  background: #fee;
  color: #e74c3c;
}
.comp-title {
  cursor: pointer;
  flex: 1;
  font-size: 1.1rem;
  font-weight: bold;
}
.comp-title:hover {
  color: #4a90e2;
}
.comp-info span {
  display: inline-block;
  margin-right: 1.2rem;
  color: #555;
  font-size: 0.97rem;
}
.loading, .empty {
  text-align: center;
  color: #aaa;
  margin: 2rem 0;
  font-size: 1.1rem;
}
/* 프로필 편집 모달 스타일 */
.modal {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.18);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 2.2rem 2.2rem 1.5rem 2.2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.13);
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: stretch;
  position: relative;
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
.divider {
  border-top: 1px solid #eee;
  margin: 10px 0;
}
.pw-toggle-btn {
  background: #e0e7ef !important;
  color: #333 !important;
  border: none !important;
  margin-bottom: 0 !important;
}
.pw-change-area input {
  margin-bottom: 6px;
}
.error-message {
  color: #e74c3c;
  margin: 8px 0;
  font-size: 0.98rem;
  font-weight: 500;
}
@media (max-width: 600px) {
  .mypage-container { padding: 1rem 0.3rem; }
  .profile-header { padding: 0 0.2rem; }
  .competition-card { padding: 0.7rem 0.5rem; }
  .modal-content { min-width: 90vw; padding: 1.2rem 0.5rem 1rem 0.5rem; }
}
</style> 