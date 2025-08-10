import React from 'react';
import styles from '../style/Button.module.css';
import scan from '../assets/scan.svg';

const ScanButton = ({ onAdd }) => {
  	return (
    		<button className={styles.ScanButton} onClick={onAdd}>
      			<img className={styles.icon} src={ scan } />
    		</button>);
};

export default ScanButton;