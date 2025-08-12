import React, { useState } from 'react';
import styles from '../style/Button.module.css';
import scan from '../assets/scan.svg';

const ScanButton = ({ onAdd }) => {
	const [scanning, setScanning] = useState(false);

	// 클릭하면 애니메이션 
	const handleClick = () => {
		setScanning(true);
		if (onAdd) onAdd();
		setTimeout(() => setScanning(false), 1200);
	};

	return (
    <button className={styles.ScanButton} onClick={handleClick}>
      <img className={styles.icon} src={scan} alt="Scan" />
      <span className={
        scanning ? styles.scanLineMove : styles.scanLineCenter
      } />
    </button>
  );
};

export default ScanButton;