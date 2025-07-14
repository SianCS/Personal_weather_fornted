import React, { useEffect } from 'react';
// 🔽 สำหรับแผนที่ (จำเป็นต้องติดตั้ง: npm install leaflet react-leaflet)
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Tooltip } from 'react-leaflet';
// 📝 หมายเหตุ: ในโปรเจกต์จริง คุณต้อง import CSS ของ Leaflet ในไฟล์หลัก (เช่น App.jsx)
// import 'leaflet/dist/leaflet.css';

// --- Helper Component: สำหรับอัปเดตตำแหน่งของแผนที่ ---
const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 12);
        }
    }, [center, map]);
    return null;
};

// --- Helper Component: สำหรับจัดการเมื่อผู้ใช้คลิกบนแผนที่ ---
const MapClickHandler = ({ onMapClick }) => {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng); 
        },
    });
    return null;
};

/**
 * คอมโพเนนต์สำหรับแสดงแผนที่แบบ Interactive
 */
function MapDisplay({ weather, onMapClick, clickedPosition, favorites = [] }) {
    const mainPosition = 
        (weather && typeof weather.latitude === 'number' && typeof weather.longitude === 'number')
            ? [weather.latitude, weather.longitude] 
            : [13.7563, 100.5018];

  return (
        <div className="card bg-base-100/50 backdrop-blur-sm shadow-xl w-full h-full">
            <div className="card-body p-0 overflow-hidden rounded-2xl">
                <MapContainer center={mainPosition} zoom={10} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* Marker หลักสำหรับเมืองที่แสดงผล */}
                    {weather && weather.latitude && <Marker position={mainPosition} />}
                    
                    {/* Marker ชั่วคราวสำหรับตำแหน่งที่คลิก */}
                    {clickedPosition && <Marker position={clickedPosition} />}

                    {/* ✅ แสดง Marker สำหรับทุกเมืองในรายการโปรด */}
                    {favorites.map(fav => (
                        <Marker
                            key={`fav-${fav.id}`}
                            position={[fav.latitude, fav.longitude]}
                        >
                            {/* ✨ HIGHLIGHT: เพิ่ม Tooltip เพื่อแสดงชื่อบนแผนที่ */}
                            <Tooltip
                                permanent // 👈 ทำให้แสดงผลตลอดเวลา
                                direction="top" // 👈 แสดงชื่อเหนือ Marker
                                offset={[0, -15]} // 👈 ปรับตำแหน่งเล็กน้อย
                                opacity={1}
                                className="leaflet-tooltip-custom" // 👈 เพิ่ม class สำหรับ styling (optional)
                            >
                                {fav.favoriteName || fav.locationName}
                            </Tooltip>
                            <Popup>
                                <b>{fav.favoriteName || fav.locationName}</b> <br />
                                (เมืองโปรด)
                            </Popup>
                        </Marker>
                    ))}

                    <MapUpdater center={mainPosition} />
                    <MapClickHandler onMapClick={onMapClick} />
                </MapContainer>
            </div>
        </div>
    );
};

// เพิ่ม CSS สำหรับปรับแต่ง Tooltip (ตัวอย่าง)
const customTooltipStyle = `
.leaflet-tooltip-custom {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 8px;
  font-weight: bold;
  color: #333;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = customTooltipStyle;
document.head.appendChild(styleSheet);


export default MapDisplay;
