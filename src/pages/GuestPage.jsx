import { useCallback, useEffect, useState } from "react";
import LoadingUi from "../components/LoadingUi"; // ◀️ สมมติว่า path ถูกต้อง
import ErrorUi from "../components/ErrorUi"; // ◀️ สมมติว่า path ถูกต้อง
// import { searchByCityName, searchByLagLon } from "../api/weatherApi"; // ◀️ สมมติว่า path ถูกต้อง
import Login from "./Login";
import { AddFavoriteIcon, LocationIcon, SearchIcon } from "../icons";
import { searchByCityName, searchByLagLon } from "../api";
// import { searchByCityName } from "../api";

function GuestPage() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cityInput, setCityInput] = useState("");

  // ฟังก์ชันสำหรับดึงข้อมูลอากาศ (ใช้เป็น wrapper)
  const fetchWeather = useCallback(async (apiCall) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiCall(); // เรียกใช้ฟังก์ชัน API ที่ส่งเข้ามา
      setWeather(res.data);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // โหลดข้อมูลจากตำแหน่งปัจจุบันเมื่อเปิดหน้าครั้งแรก
    handleGetCurrentLocation();
  }, [fetchWeather]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      fetchWeather(() => searchByCityName(cityInput.trim()));
    }
  };

  // ✅ ฟังก์ชันสำหรับแจ้งเตือนและนำทางไปหน้า Login
  const handleAuthRedirect = () => {
    document.getElementById("my_modal_2").showModal();
  };

  // ฟังก์ชันสำหรับกดปุ่มตำแหน่งปัจจุบัน
  const handleGetCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(() =>
          searchByLagLon(position.coords.latitude, position.coords.longitude)
        );
      },
      () => {
        // หากเข้าถึงตำแหน่งไม่ได้ ให้แสดงข้อผิดพลาด หรือใช้ค่าเริ่มต้น
        setError(
          "ไม่สามารถเข้าถึงตำแหน่งปัจจุบันได้ กำลังแสดงข้อมูลของกรุงเทพฯ"
        );
        fetchWeather(() => searchByCityName("Bangkok"));
      }
    );
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1499346030926-9a72daac6c63?q=80&w=2070&auto=format&fit=crop')",
      }}
    >
      <div className="min-h-screen w-full bg-black/10 backdrop-blur-sm ...">
        <div className="container mx-auto p-4 flex justify-center">
          <div className="w-full max-w-md flex flex-col gap-6">
            <div className="flex justify-end w-220 ">
              {/* Open the modal using document.getElementById('ID').showModal() method */}
              <button
                className="btn btn-primary"
                onClick={() =>
                  document.getElementById("my_modal_2").showModal()
                }
              >
                Login
              </button>
              <dialog id="my_modal_2" className="modal">
                <div className="modal-box">
                  <h3 className="font-bold text-lg text-center">Hello!</h3>
                  <p className="py-4 text-center">
                    ถ้าต้องการ ฟีเจอร์อื่นๆ เช่น ดูแผนที่ พยากรณ์ 5 วันข้างหน้า
                    หรือ เพิ่มรายการโปรด กรุณา Login{" "}
                  </p>
                  <Login />
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>
            </div>
            {/* ปรับปรุงฟอร์มให้มีปุ่มค้นหาและปุ่มตำแหน่งปัจจุบัน */}
            <form
              onSubmit={handleSearch}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="ค้นหาชื่อเมือง..."
                className="w-full px-5 py-3 pl-12 text-lg rounded-full shadow-lg border-2 bg-white/50"
              />
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
                title="ใช้ตำแหน่งปัจจุบัน"
              >
                <LocationIcon />
              </button>
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
                title="ค้นหา"
              >
                <SearchIcon />
              </button>
            </form>
            
                <button className="group transition" onClick={handleAuthRedirect}>
              {" "}
              {/* 1. เพิ่ม group ที่นี่ */}
              <AddFavoriteIcon className="w-10 absolute right-120 bottom-182 group-hover:fill-red-600 transition " />{" "}
              {/* 2. เพิ่ม group-hover ที่นี่ */}
            </button>
            
            
            <div className="flex-grow flex items-center justify-center min-h-[20rem]">
              {loading && <LoadingUi />}
              {error && <ErrorUi message={error} />}
              {weather && (
                <div className="bg-white/30 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full text-center">
                  <p className="text-2xl font-medium">{weather.city}</p>

                  {/* แสดงเวลาท้องถิ่น */}
                  {weather.dt && weather.timezone && (
                    <p className="text-sm text-gray-700 mt-1">
                      เวลาท้องถิ่น:{" "}
                      {new Date(
                        (weather.dt + weather.timezone) * 1000
                      ).toLocaleTimeString("th-TH", {
                        timeZone: "UTC",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </p>
                  )}

                  <div className="flex items-center justify-center my-2">
                    {/* ใช้ icon จาก API โดยตรง */}
                    {weather.icon && (
                      <img
                        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                        alt={weather.description}
                        className="w-24 h-24"
                      />
                    )}
                    <p className="text-6xl font-bold">
                      {Math.round(weather.temperature)}°
                    </p>
                  </div>
                  <p className="text-xl capitalize">{weather.description}</p>

                  {/* ✅ เพิ่มส่วนแสดง Humidity, Wind Speed, และ Chance of Rain */}
                  <div className="flex justify-around w-full mt-4 pt-4 border-t border-gray-300/50">
                    <div className="text-center">
                      <p className="font-semibold text-gray-600">ความชื้น</p>
                      <p className="text-lg font-bold">{weather.humidity}%</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-600">ความเร็วลม</p>
                      <p className="text-lg font-bold">
                        {weather.windSpeed} m/s
                      </p>
                    </div>
                    {/* ส่วนนี้จะแสดงผลก็ต่อเมื่อ Backend ส่งข้อมูล chanceOfRain มาให้ */}
                    {weather.chanceOfRain !== undefined && (
                      <div className="text-center">
                        <p className="font-semibold text-gray-600">
                          โอกาสเกิดฝน
                        </p>
                        <p className="text-lg font-bold">
                         💧 {weather.chanceOfRain}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestPage;
