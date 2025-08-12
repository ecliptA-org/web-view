import React from 'react';
import styles from '../../style/MazeInfo.module.css'; 

export default function MazePlayerCard({
  rank,     
  name,        
  time, // 클리어 시간
  avatarSrc, // 프로필 이미지 URL 
  trend, // 랭킹 변화  
  highlight=false
}) {
  // 랭킹 변화 화살표 렌더링
  let trendArrow = null;
  if(trend === 'up') {
    trendArrow = <img 
      src="../../../assets/up.svg" 
      alt="상승" 
      className={styles.trendArrow} />;
  } else if(trend === 'down') {
    trendArrow = <img 
      src="../../../assets/down.svg" 
      alt="하락" 
      className={styles.trendArrow} />;
  }

  return (
    <div className={styles.rectangleCard}>
      {/* 등수 */}
      <div className={styles.rank}>{rank}</div>
      {/* 프로필 이미지 */}
      <div
        className={styles.avatar}
        style={{ backgroundImage: `url(${avatarSrc})` }}
      />
      {/* 사용자 정보 및 기록 */}
      <div className={styles.infoCol}>
        <div className={styles.player}>{name}</div>
        <div className={styles.time}>{time}</div>
      </div> 
      
      {trendArrow}
    </div>
  );
}
