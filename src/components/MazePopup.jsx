import React from 'react';
import MazePlayerCard from '../features/mazeInfo/MazePlayerCard';
import MazePlayButton from '../features/mazeInfo/MazePlayButton';
import MazeRating from '../features/mazeInfo/MazeRating';
import styles from '../style/MazePopup.module.css';

export default function MazePopup({ list }) {
  return (
    <div className={styles.mazePopup}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between'}}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', gap: '4px' }}>
          <div className={styles.mazeTitle}>주홍글자님의 방</div>
          <div className={styles.mazeMemo}>서울특별시 동소문로 41-39</div>
        </div>
        <MazeRating value={4.5} iconSrc="Star 1.svg" />
      </div>

      {/* 랭킹 카드 */}
      <div className={styles.popupRoomItem}>
        <MazePlayerCard rank={1} name="방탈출천재" time="0:30:20" badgeIconSrc="Polygon 2.svg" avatarSrc="..." />
        <MazePlayerCard rank={2} name="안녕하세요" time="0:30:20" badgeIconSrc="Polygon 2.svg" avatarSrc="..." highlight />
        <MazePlayerCard rank={3} name="배고픈곰돌이" time="0:30:20" badgeIconSrc="Polygon 2.svg" avatarSrc="..." />
      </div>

      <MazePlayButton />
    </div>
  );
}
