import React from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

import MazePopup from './MazePopup';
import AdjustPopup from './AdjustPopup'; // 별도 팝업 컴포넌트

import pinIcon from '../assets/icons/pin.svg';

// Leaflet 기본 아이콘 설정
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// 마커 아이콘 
const customIcon = new L.Icon({
  iconUrl: pinIcon,
  iconSize: [32, 32], // pin 크기 
  iconAnchor: [16, 32], // 핀의 끝점을 마커 위치에 맞춤
  popupAnchor: [0, -32], // 팝업이 핀 위에 표시되도록
});

function MapEvents({ onMapMove }) {
  useMapEvents({
    moveend: (event) => {
      const map = event.target;
      const bounds = map.getBounds();

      // 현재 화면에 보이는 영역의 경계 좌표
      const ne = bounds.getNorthEast(); // 북동쪽 모서리
      const sw = bounds.getSouthWest(); // 남서쪽 모서리

      // API 호출을 위한 데이터
      onMapMove({
        ne_lat: ne.lat, ne_lng: ne.lng,
        sw_lat: sw.lat, sw_lng: sw.lng
      });
    },
  });
  return null;
}

export default function MapView({
  mazes,
  center,
  currentMarkerPos,
  showPopup,
  onConfirm,
  onCancel,
  onMarkerDrag,
  onMapMove
}) {

  return (
    <>
      <MapContainer center={center} zoom={16} style={{ height: '100vh' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEvents onMapMove={onMapMove} />

        {/* 기존 미로 마커들 */}
        {Object.entries(mazes).map(([key, list]) => {
          const [lat, lng] = key.split(',').map(Number);
          return (
            <Marker key={key} position={[lat, lng]} icon={customIcon}>
              <MazePopup list={list} />
            </Marker>
          );
        })}

        {/* 새 미로 위치 마커 */}
        {currentMarkerPos && (
          <Marker
            position={currentMarkerPos}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const { lat, lng } = e.target.getLatLng();
                onMarkerDrag([lat, lng]);
              }
            }}
          />
        )}
      </MapContainer>

      {/* 조정 팝업 */}
      {showPopup && currentMarkerPos && (
        <AdjustPopup
          position={currentMarkerPos}
          lat={currentMarkerPos[0]}
          lng={currentMarkerPos[1]}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      )}
    </>
  );
}
