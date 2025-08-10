import React from 'react';
import { Popup } from 'react-leaflet';

export default function MazePopup({ list }) {
  // 기존 마커 클릭 시 리스트 표시
  return (
    <Popup>
      {list.map(item => (
        <button key={item.id} onClick={() => window.Unity?.call(JSON.stringify({
          type: 'maze_selected',
          id: item.id
        }))}>
          {item.title}
        </button>
      ))}
    </Popup>
  );
}
