import React from 'react';
import styles from '../../style/MazeInfo.module.css'; 

export default function MazePlayButton({ onClick, label = "플레이" }) {
  const changeScene = (scene) => {
    window.Unity?.call(JSON.stringify({ type: 'scene_change', target: scene }));
  };

  return (
    <div className={styles.mazePlayButton} onClick={() => changeScene('SpacePlayScene')}>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
