import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import styles from '../style/AdjustPopup.module.css';

export default function AdjustPopup({ onConfirm, onCancel, lat, lng }) {
  const [snapshotUrl, setSnapshotUrl] = useState(null);

  useEffect(() => {
    // Leaflet map이 렌더링된 DOM 요소를 선택
    const mapContainer = document.querySelector('.leaflet-container');
    if (!mapContainer) return;

    // html2canvas로 스냡샷 생성
    html2canvas(mapContainer, {
      width: 297,
      height: 147,
      scale: window.devicePixelRatio, // 고해상도 지원
    })
      .then(canvas => {
        setSnapshotUrl(canvas.toDataURL('image/png'));
      })
      .catch(err => {
        console.error('Snapshot error:', err);
      });
  }, []);

  return (
    <div className={styles.adjustPopup}>
      <p>이 위치에 방탈출을 생성하시겠습니까?</p>
      {snapshotUrl ? (
        <img
          src={snapshotUrl}
          alt="현재 위치 지도 스냅샷"
          className={styles.staticMapImage}
        />
      ) : (
        <p>지도를 불러오는 중...</p>
      )}
      <button className={styles.confirmBtn} onClick={onConfirm}>
        <p>네, 계속 진행할래요</p>
      </button>
      <button className={styles.cancelBtn} onClick={onCancel}>
        <p>아니오, 다시 고를래요</p>
      </button>
    </div>
  );
}
