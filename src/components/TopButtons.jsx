import React from 'react';
import styles from '../style/Button.module.css';

export default function TopButtons({ onAdd }) {
  const changeScene = (scene) => {
    window.Unity?.call(JSON.stringify({ type: 'scene_change', target: scene }));
  };

  return (
    <>
      <button className={styles.topBtn} onClick={onAdd}>미로 추가</button>
      <button className={styles.topBtn} onClick={() => changeScene('SpaceScene')}>공간 인식</button>
    </>
  );
}