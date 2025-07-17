import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { privateApi } from "../api";
import LoadingUi from "./LoadingUi";

// --- UI Component (สามารถแยกเป็นไฟล์ของตัวเองได้) ---


// 🔽 แก้ไข: เพิ่ม export  ที่นี่
export function FiveDayForecast({ cityId }) {
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!cityId) return;
        setLoading(true);
        privateApi.get(`/weather/${cityId}/forecast`)
            .then(res => {
                // ✨ HIGHLIGHT: เปลี่ยนมาใช้วิธีจัดกลุ่มตามวัน เพื่อความแม่นยำ
                // โดยจะสร้าง Object ที่มี key เป็นวันที่ (e.g., "2025-07-13")
                // แล้วเก็บข้อมูลพยากรณ์แรกของวันนั้นๆ
                const dailyForecasts = Object.values(
                    res.data.forecasts.reduce((acc, item) => {
                        const date = item.time.split(' ')[0];
                        if (!acc[date]) {
                            acc[date] = item;
                        }
                        return acc;
                    }, {})
                );
                setForecast(dailyForecasts);
            })
            .catch(() => toast.error("ไม่สามารถโหลดข้อมูลพยากรณ์ 5 วันได้"))
            .finally(() => setLoading(false));
    }, [cityId]);
    
    if (!cityId) return null;
    if (loading) return <div className="card bg-base-100/50 backdrop-blur-sm shadow-xl w-full min-h-[10rem] flex justify-center items-center"><LoadingUi text="โหลดพยากรณ์..."/></div>;

    return (
        <div className="card bg-base-100/50 backdrop-blur-sm shadow-xl w-full">
            <div className="card-body">
                <h2 className="card-title flex justify-center">พยากรณ์ 5 วันข้างหน้า</h2>
                <p className="text-xs opacity-70">(ข้อมูลอัพเดตทุก 3 ชม)</p>
                <div className="flex justify-between overflow-x-auto">
                    {forecast.slice(0, 5).map(day => (
                        <div key={day.time} className="flex flex-col items-center text-center p-2 rounded-lg hover:bg-white/50 transition flex-shrink-0 w-24">
                            <p className="font-semibold text-sm">{new Date(day.time).toLocaleDateString('th-TH', { weekday: 'short' })}</p>
                            <img src={day.icon} alt={day.description} className="w-14 h-14"/>
                            <p className="font-bold text-xl">{Math.round(day.temperature)}°</p>
                            
                            {/* ✨ HIGHLIGHT: เพิ่มรายละเอียด */}
                            <p className="text-xs text-gray-600">รู้สึก {Math.round(day.feels_like)}°</p>
                            <p className="text-xs capitalize text-blue-800 mt-1 h-8 truncate" title={day.description}>{day.description}</p>
                            
                            {day.chanceOfRain > 0 && (
                                <div className="flex items-center text-xs text-blue-600 font-semibold mt-1">
                                    <span>💧 {day.chanceOfRain}%</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

