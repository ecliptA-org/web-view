import React, { useState, useEffect, useCallback } from 'react';
import MazePlayerCard from '../features/mazeInfo/MazePlayerCard';
import MazePlayButton from '../features/mazeInfo/MazePlayButton';
import MazeRating from '../features/mazeInfo/MazeRating';
import styles from '../style/MazePopup.module.css';

export default function MazePopup({ space }) {
  const [score, setScore] = useState(null);

  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  const [profileImages, setProfileImages] = useState({});
  const [imageLoadingStates, setImageLoadingStates] = useState({});

  // 명성치
  useEffect(() => {
    if (!space?.user_space_id) return;
    const token = localStorage.getItem('jwtToken');

    const fetchScore = async () => {
      try {
        const res = await fetch(`http://13.62.89.17/api/user-space/${space.user_space_id}/score`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        setScore(data.score);
        console.log('명성치 응답:', data.score);
      } catch {
        setScore(null);
      }
    };

    fetchScore();
  }, [space?.user_space_id]);

  // 랭킹
  useEffect(() => {
    if (!space?.user_space_id) return;
    setLoading(true); 

    const fetchRanking = async () => {
      const res = await fetch(`http://13.62.89.17/api/user-space/${space.user_space_id}/ranking`);

      const data = await res.json();
      setRanking(data.ranking || []);
      console.log('랭킹응답:', data.ranking);

      setLoading(false);
    };
    fetchRanking();
  }, [space?.user_space_id]);

  const fetchProfileImage = useCallback(async (userId) => {
    // 이미 로딩 중이거나 캐시된 경우 스킵
    if (profileImages[userId] || imageLoadingStates[userId]) return;
    setImageLoadingStates(prev => ({ ...prev, [userId]: true }));
 
    try {
      const res = await fetch(`http://13.62.89.17/api/profile?userId=${userId}`);

      if (!res.ok) throw new Error('프로필 이미지 요청 실패');

      const data = await res.json();
      setProfileImages(prev => ({ ...prev, [userId]: data.url }));
    } catch (error) {
      console.error(`프로필 이미지 로드 실패 (userId: ${userId}):`, error);
      setProfileImages(prev => ({ ...prev, [userId]: null }));
    } finally {
      setImageLoadingStates(prev => ({ ...prev, [userId]: false }));
    }
  }, [imageLoadingStates, profileImages]);

  // 랭킹 정보가 바뀔 때 상위 3명의 이미지 fetch
  useEffect(() => {
    ranking.slice(0, 3).forEach(player => {
      fetchProfileImage(player.user_id);
    });
  }, [ranking, fetchProfileImage]);

  if (!space) return null;

  return (
    <div className={styles.mazePopup}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', gap: '4px' }}>
          <div className={styles.mazeTitle}>{space.space_name || '공간 탈출'}</div>
          <div className={styles.mazeMemo}>{space.memo || '탈출하라!'}</div>
        </div>
        <MazeRating value={score ?? 0} />
      </div>

      {/* 랭킹 카드 */}
      <div className={styles.popupRoomItem}>
        {loading && <div>랭킹 불러오는 중...</div>}
        {!loading && ranking.length === 0 && <div>클리어 랭킹 정보가 없습니다.</div>}

        {!loading && ranking.length > 0 &&
          ranking.slice(0, 3).map((player) => (
            <MazePlayerCard
              key={player.user_id}
              rank={player.current_rank}
              name={player.nickname || `플레이어#${player.user_id}`}
              time={player.clear_time ? formatTime(player.clear_time) : '-'}
              badgeIconSrc="Polygon 2.svg"
              avatarSrc={profileImages[player.user_id]}
            />
          ))
        }
      </div> 

      <MazePlayButton />
    </div>
  );
}

// 시간 변환 
function formatTime(sec) {
  sec = Number(sec) || 0;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return [
    h.toString().padStart(2, '0'),
    m.toString().padStart(2, '0'),
    s.toString().padStart(2, '0'),
  ].join(':');
}