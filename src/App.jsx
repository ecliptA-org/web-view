import React, { useState, useEffect } from 'react';
import MapView from './components/MapView';
import ScanButton from './components/ScanButton';
import StoreButton from './components/StoreButton';

const DEFAULT_CENTER = [37.5665, 126.9780]; // 서울

export default function App() {
  const [mazes, setMazes] = useState([]);
  const [center, setCenter] = useState(DEFAULT_CENTER); // 초기 중심 좌표 (서울)
  const [currentMarkerPos, setCurrentMarkerPos] = useState(DEFAULT_CENTER); // currentAddMarker 위치
  const [showPopup, setShowPopup] = useState(false); // 팝업 표시 상태

  const goToSpace = (scene, spaceId) => {
    window.Unity?.call(JSON.stringify({
      type: 'go_to_space',
      target: scene,
      user_space_idd: spaceId
    }));
  };

  // Unity에서 토큰을 수신하여 로컬 스토리지에 저장
  useEffect(() => {
    window.receiveTokenFromUnity = function (tokenObj) { 
      if (typeof tokenObj === 'string') {
        try {
          tokenObj = JSON.parse(tokenObj);
        } catch {
          console.error('토큰 파싱 오류:', tokenObj);
          return;
        }
      }
      if (tokenObj.access_token) localStorage.setItem('jwtToken', tokenObj.access_token);
      if (tokenObj.refresh_token) localStorage.setItem('jwtRefreshToken', tokenObj.refresh_token);

      // 디버깅용
      console.log('access_token 저장:', tokenObj.access_token);
      console.log('refresh_token 저장:', tokenObj.refresh_token);
    };
  }, []);


  // Unity에서 위치 업데이트 메시지를 수신하여 마커 위치를 업데이트
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userPos = [pos.coords.latitude, pos.coords.longitude];
          setCenter(userPos);
          setCurrentMarkerPos(userPos);
        },
        (err) => {
          // 위치 권한 거부시 center(서울) 유지
          setCenter(DEFAULT_CENTER);
          setCurrentMarkerPos(DEFAULT_CENTER);
        }
      );
    } else {
      setCenter(DEFAULT_CENTER);
      setCurrentMarkerPos(DEFAULT_CENTER);
    }
  }, []);

  // Unity 메시지 수신 핸들러
  useEffect(() => {
    window.updateMapToLocation = (lat, lng) => {
      setCenter([lat, lng]);
      setCurrentMarkerPos([lat, lng]);
    };
  }, []);

  // 스캔 버튼 클릭 핸들러
  const handleScanButton = () => {
    if (currentMarkerPos) {
      console.log("스캔 버튼 클릭됨");
      setShowPopup(true);
    } else {
      alert('공간을 생성할 위치로 마커를 옮겨주세요.');
    }
  };

  // 방탈출 추가 확인 핸들러
  const handleConfirm = async () => {
    if (!currentMarkerPos) {
      alert("마커 위치 오류");
      return;
    }

    const title = prompt('방탈출 이름 입력:', '새 방탈출');
    if (!title) return;
    const memo = prompt('메모 입력(선택)', '');

    const lat = currentMarkerPos[0].toFixed(4);
    const lng = currentMarkerPos[1].toFixed(4);

    // 공간 저장 api 연동
    try {
      const res = await fetch('https://hyorim.shop/api/user-space', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        },
        body: JSON.stringify({
          location: {
            latitude: Number(lat),
            longitude: Number(lng)
          },
          space_name: title,
          memo: memo
        })
      });

      if (!res.ok) {
        const err = await res.text();
        alert('저장 실패: ' + err);
        return;
      }

      // 서버에서 user_space_id 받기
      const data = await res.json();
      const spaceId = data?.user_space_id;

      // 상태 초기화
      setShowPopup(false);
      setCurrentMarkerPos(center);
      alert("방탈출이 추가되었습니다");

      // 씬 이동 
      goToSpace('SpaceScan', spaceId);
    } catch (err) {
      alert('서버 오류, 다시 시도해 주세요.');
    }
  };

  // 방탈출 추가 취소 핸들러
  const handleCancel = () => {
    setShowPopup(false);
  };

  // 마커 드래그 시 위치 업데이트
  const handleMarkerDrag = (newPos) => {
    setCurrentMarkerPos(newPos);
  };

  // 지도 이동 마커 핸들러
  const handleMapMove = async (bounds) => {
    const { ne_lat, ne_lng, sw_lat, sw_lng } = bounds;
    if (!ne_lat || !ne_lng || !sw_lat || !sw_lng) return;
    console.log('지도 요청 경계값:', ne_lat, ne_lng, sw_lat, sw_lng);

    const response = await fetch(`https://hyorim.shop/api/map?ne_lat=${bounds.ne_lat}&ne_lng=${bounds.ne_lng}&sw_lat=${bounds.sw_lat}&sw_lng=${bounds.sw_lng}&status=active`);
    const nearbyMazes = await response.json();
    console.log('조회된 공간 탈출:', nearbyMazes.spaces);
    setMazes(nearbyMazes.spaces ?? []); // 현재 영역의 마커만 업데이트 
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
        <ScanButton onAdd={handleScanButton} />
      </div>
      <div style={{ zIndex: 0 }}>
        <MapView
          mazes={mazes}
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
