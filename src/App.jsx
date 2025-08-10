import React, { useState, useEffect } from 'react';
import MapView from './components/MapView';
import ScanButton from './components/ScanButton';
import StoreButton from './components/StoreButton';

export default function App() {
  const [mazes, setMazes] = useState({});   // { "lat,lng": [{ id, title }] }
  const [adding, setAdding] = useState(false);
  const [center, setCenter] = useState([37.5665, 126.9780]);
  const [uiMode, setUiMode] = useState("idle"); // uiMode 상태
  const [currentMarkerPos, setCurrentMarkerPos] = useState(null); // currentAddMarker 위치
  const [showPopup, setShowPopup] = useState(false); // 팝업 표시 상태

  // Unity 메시지 수신 핸들러
  useEffect(() => {
    window.updateMapToLocation = (lat, lng) => {
      setCenter([lat, lng]);
      setCurrentMarkerPos([lat, lng]); // 마커 위치 설정

      // uiMode가 "adding"일 때만 팝업 표시
      if (uiMode === "adding") {
        setShowPopup(true);
      }
    };
  }, [uiMode]);

  // 방탈출 추가 모드 활성화 핸들러
  const handleAddMaze = () => {
    if (window.Unity) {
      setUiMode("adding");
      setAdding(true);
      window.Unity.call(JSON.stringify({ type: 'request_location' }));
    }
  };

  // 방탈출 추가 확인 핸들러
  const handleConfirm = () => {
    if (!currentMarkerPos) {
      alert("마커 위치 오류: 다시 시도하세요");
      return;
    }

    const title = prompt('방탈출 이름 입력:', '새 방탈출');
    if (!title) return;

    const id = "maze" + Date.now();
    const lat = currentMarkerPos[0].toFixed(4);
    const lng = currentMarkerPos[1].toFixed(4);
    const key = `${lat},${lng}`;

    // 미로 데이터 추가
    setMazes(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), { id, title }]
    }));

    // Unity로 메시지 전송
    if (window.Unity) {
      const message = {
        type: "maze_added",
        id,
        title,
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      };
      window.Unity.call(JSON.stringify(message));
    }

    // 상태 초기화
    setCurrentMarkerPos(null);
    setShowPopup(false);
    setAdding(false);
    setUiMode("idle");
    alert("방탈출이 추가되었습니다");
  };

  // 방탈출 추가 취소 핸들러
  const handleCancel = () => {
    setShowPopup(false);
    setCurrentMarkerPos(null);
    setAdding(false);
    setUiMode("idle");
  };

  // 마커 드래그 시 위치 업데이트
  const handleMarkerDrag = (newPos) => {
    setCurrentMarkerPos(newPos);
  };

  // 지도 이동 마커 핸들러
  const handleMapMove = async (bounds) => {
    const response = await fetch(`/api/map?ne_lat=${bounds.ne_lat}&ne_lng=${bounds.ne_lng}&sw_lat=${bounds.sw_lat}&sw_lng=${bounds.sw_lng}&status=active`);
    const nearbyMazes = await response.json();
    setMazes(nearbyMazes); // 현재 영역의 마커만 업데이트 
  };

  return (
    <>
      <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999 }}>
        <StoreButton />
      </div>
      <div style={{
        position: 'fixed', bottom: 24, left: '50%',
        transform: 'translateX(-50%)', zIndex: 9999
      }}>
        <ScanButton />
      </div>
      <div style={{ zIndex: 0 }}>
        <MapView
          mazes={mazes}
          adding={adding}
          center={center}
          currentMarkerPos={currentMarkerPos}
          showPopup={showPopup}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onMarkerDrag={handleMarkerDrag}
          onMapMove={handleMapMove}
        />
      </div>
    </>
  );
}
