import React from 'react';
import styles from '../../style/MazeInfo.module.css'; 
import star from '../../assets/icons/star.svg';

export default function MazeRating({ value, iconSrc }) {
  return (
    <div className={styles.mazeRating}>
      <img className={styles.ratingIcon} alt="별점" src={ star } />
      <div className={styles.ratingValue}>{value}</div>
    </div>
  );
}
