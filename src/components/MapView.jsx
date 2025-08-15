import { useEffect, useState } from 'react';
import { useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

import MazePopup from './MazePopup';
import AdjustPopup from './AdjustPopup'; // 별도 팝업 컴포넌트

import pinIcon from '../assets/icons/pin.svg';

function CenterUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center); // center가 바뀌면 지도도 이동
    }
  }, [center, map]);
  return null;
}

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
  iconSize: [64, 64], // pin 크기 
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
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);
  const [selectedSpaceInfo, setSelectedSpaceInfo] = useState(null);

  const handleMarkerClick = async (space_id) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const res = await fetch(`https://hyorim.shop/api/user-space/${space_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) {
        const errMsg = await res.text();
        alert('권한 오류: ' + errMsg);
        return;
      }
      const data = await res.json();
      setSelectedSpaceInfo(data);
      setSelectedSpaceId(space_id);
    } catch (err) {
      alert('방 상세 정보를 불러오지 못했습니다.');
    }
  };
mapbox://styles/jo-hyroim/cmec2ns7t008o01r9dajt9ft6
  return (
    <>
      <MapContainer center={center} zoom={16} style={{ height: '100vh' }}>
        <CenterUpdater center={center} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEvents onMapMove={onMapMove} />

        {/* 기존 미로 마커들 */}
        {mazes.map(space => {
          const { space_id, latitude, longitude } = space;

          // 좌표값이 정상일 때만 마커 렌더링
          if (!isNaN(latitude) && !isNaN(longitude)) {
            return (
              <Marker
                key={space_id}
                position={[latitude, longitude]}
                icon={customIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(space.space_id)
                }}
              >
                {selectedSpaceId === space_id && selectedSpaceInfo && (
                  <Popup>
                    <MazePopup space={selectedSpaceInfo} />
                  </Popup>
                )}
              </Marker>
            );
          }
          return null;
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

      {/* 공간 탈출 추가 팝업 */}
      {showPopup && currentMarkerPos && (
        <AdjustPopup
          position={currentMarkerPos}
          onConfirm={onConfirm}
          onCancel={onCancel}
          lat={currentMarkerPos[0]}
          lng={currentMarkerPos[1]}
        />
      )}
    </>
  );
}
