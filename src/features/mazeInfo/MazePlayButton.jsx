import React from 'react';
import styles from '../../style/MazeInfo.module.css'; 

export default function MazePlayButton({ spaceId, label = "플레이" }) {
  const goToSpace = (scene, userSpaceId) => {
    window.Unity?.call(JSON.stringify({
      type: 'scene_change',
      target: scene,
      user_space_id: userSpaceId
    }));
  };

  return (
    <div className={styles.mazePlayButton} onClick={() => goToSpace('SpacePlayScene', spaceId)}>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
