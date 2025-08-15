import React from 'react';
import styles from '../style/Button.module.css';
import mypage from '../assets/icons/mypage.svg';

const MyPageButton = () => {
	const changeScene = (scene) => {
    window.Unity?.call(JSON.stringify({ type: 'scene_change', target: scene }));
  };

  	return (
    		<button className={styles.MyPageButton} onClick={() => changeScene('MyPage')}>
				<img alt="" src={ mypage } />
    		</button>);
};

export default MyPageButton;