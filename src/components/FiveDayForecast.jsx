import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { privateApi } from "../api";

// --- UI Component (สามารถแยกเป็นไฟล์ของตัวเองได้) ---
const LoadingSpinner = ({ text = "กำลังโหลด..." }) => (
    <div className="flex items-center justify-center h-full text-gray-500">
        <span className="loading loading-dots loading-lg"></span>
        <p className="ml-2">{text}</p>
    </div>
);

// 🔽 แก้ไข: เพิ่ม export  ที่นี่
export function FiveDayForecast({ cityId }) {
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!cityId) return;
        setLoading(true);
        privateApi.get(`/weather/${cityId}/forecast`)
            .then(res => {
                // จัดกลุ่มข้อมูลตามวัน เพื่อให้ได้ข้อมูลพยากรณ์ 1 รายการต่อวัน
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
            .catch((err) => { // ✅ แก้ไข: เพิ่มการแสดง Error ที่ละเอียดขึ้น
                // แสดง Error ที่แท้จริงใน Console ของเบราว์เซอร์
                console.error("Forecast API Error:", err.response || err);
                
                // แสดงข้อความแจ้งเตือนให้ผู้ใช้
                const errorMessage = err.response?.data?.error || "ไม่สามารถโหลดข้อมูลพยากรณ์ 5 วันได้";
                toast.error(errorMessage);
            })
            .finally(() => setLoading(false));
    }, [cityId]);
    
    if (!cityId) return null;
    if (loading) return <div className="card bg-base-100/50 backdrop-blur-sm shadow-xl w-full min-h-[10rem] flex justify-center items-center"><LoadingSpinner text="โหลดพยากรณ์..."/></div>;

    return (
        <div className="card bg-base-100/50 backdrop-blur-sm shadow-xl w-full">
            <div className="card-body">
                <h2 className="card-title mx-auto">พยากรณ์ 5 วันข้างหน้า</h2>
                <div className="flex justify-between overflow-x-auto">
                    {forecast.slice(0, 5).map(day => (
                        <div key={day.time} className="flex flex-col items-center text-center p-2 flex-shrink-0">
                            <p className="font-semibold text-sm">{new Date(day.time).toLocaleDateString('th-TH', { weekday: 'short' })}</p>
                            <img src={day.icon} alt={day.description} className="w-12 h-12"/>
                            <p className="font-bold">{Math.round(day.temperature)}°</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
