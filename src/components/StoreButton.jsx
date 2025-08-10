import React from 'react';
import styles from '../style/Button.module.css';
import cart from '../assets/icons/cart.svg';

const StoreButton = () => {
	const changeScene = (scene) => {
    window.Unity?.call(JSON.stringify({ type: 'scene_change', target: scene }));
  };

  	return (
    		<button className={styles.StoreButton} onClick={() => changeScene('Shop')}>
      			<img className={styles.iconCart} alt="" src={ cart } />
      			<div className={styles.textStore} >상점</div>
    		</button>);
};

export default StoreButton;