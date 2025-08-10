import React from 'react';
import styles from '../../style/MazeInfo.module.css'; 

export default function MazePlayButton({ onClick, label = "플레이" }) {
  return (
    <div className={styles.mazePlayButton} onClick={onClick}>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
