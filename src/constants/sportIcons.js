export const SPORT_ICONS = {
  FOOTBALL: '⚽',
  BADMINTON: '🏸',
  JIUJITSU: '🥋'
}

export const SPORT_LABELS = {
  FOOTBALL: '풋볼',
  BADMINTON: '배드민턴',
  JIUJITSU: '주짓수'
}

export const COMPETITION_STATUS = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED'
}

export const COMPETITION_STATUS_LABELS = {
  [COMPETITION_STATUS.OPEN]: '모집중',
  [COMPETITION_STATUS.CLOSED]: '모집마감'
}

export const COMPETITION_STATUS_COLORS = {
  [COMPETITION_STATUS.OPEN]: '#4CAF50',    // 초록색
  [COMPETITION_STATUS.CLOSED]: '#FF5722'    // 주황색
}

export const LOCALS = {
  SEOUL: 'SEOUL',
  DAEGU: 'DAEGU',
  GWANGJU: 'GWANGJU'
}

export const LOCAL_LABELS = {
  [LOCALS.SEOUL]: '서울',
  [LOCALS.DAEGU]: '대구',
  [LOCALS.GWANGJU]: '광주'
}

export const getSportIcon = (sportType) => SPORT_ICONS[sportType] || '🎯'
export const getSportLabel = (sportType) => SPORT_LABELS[sportType] || sportType
export const getLocalLabel = (local) => LOCAL_LABELS[local] || local 