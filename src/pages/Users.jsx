import useUserStore from "../stores/userStore"

function Users() {

  const user = useUserStore(state => state.user)
  const logout = useUserStore(state => state.logout)
  return (
    <div>
      <button onClick={logout} className="btn">Logout</button>
    </div>
    
  )
}
export default Users

// import React, { useState, useEffect, useCallback } from 'react';
// import { toast } from 'react-toastify';
// import { publicApi, privateApi } from '../api'; // ◀️ สมมติว่า import API clients มาแล้ว

// // --- UI Components (สามารถแยกเป็นไฟล์ของตัวเองได้) ---
// const LoadingSpinner = ({ text = "กำลังโหลด..." }) => (
//     <div className="flex items-center justify-center h-full text-gray-500">
//         <span className="loading loading-dots loading-lg"></span>
//         <p className="ml-2">{text}</p>
//     </div>
// );

// const ErrorDisplay = ({ message }) => (
//     <div className="alert alert-error shadow-lg">
//         <span>เกิดข้อผิดพลาด: {message}</span>
//     </div>
// );

// // --- Feature Components ---

// const WeatherDisplay = ({ weather, isFavorited, onFavoriteToggle }) => {
//     if (!weather) return null;
//     return (
//         <div className="card bg-base-100/50 backdrop-blur-sm shadow-xl w-full">
//             <div className="card-body items-center text-center">
//                 <div className="card-actions justify-end w-full absolute top-2 right-2">
//                      <button className="btn btn-ghost btn-circle" onClick={() => onFavoriteToggle(weather.city, weather.cityId, isFavorited)} title={isFavorited ? "ลบออกจากรายการโปรด" : "เพิ่มเป็นรายการโปรด"}>
//                         <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isFavorited ? 'text-red-500' : 'text-gray-400'}`} fill={isFavorited ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
//                     </button>
//                 </div>
//                 <h2 className="card-title text-2xl mt-4">{weather.city}</h2>
//                 <p className="text-sm opacity-70">
//                     เวลาท้องถิ่น: {new Date((weather.dt + weather.timezone) * 1000).toLocaleTimeString("th-TH", { timeZone: "UTC", hour: "2-digit", minute: "2-digit" })}
//                 </p>
//                 <div className="flex items-center my-2">
//                     {weather.icon && <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt={weather.description} className="w-20 h-20"/>}
//                     <p className="text-6xl font-bold">{Math.round(weather.temperature)}°</p>
//                 </div>
//                 <p className="text-xl capitalize">{weather.description}</p>
//                 <div className="divider my-2"></div>
//                 <div className="flex justify-around w-full">
//                     <div className="text-center"><p className="font-semibold opacity-70">ความชื้น</p><p className="text-lg font-bold">{weather.humidity}%</p></div>
//                     <div className="text-center"><p className="font-semibold opacity-70">ความเร็วลม</p><p className="text-lg font-bold">{weather.windSpeed} m/s</p></div>
//                     {weather.chanceOfRain > 0 && <div className="text-center"><p className="font-semibold opacity-70">โอกาสเกิดฝน</p><p className="text-lg font-bold">{weather.chanceOfRain}%</p></div>}
//                 </div>
//             </div>
//         </div>
//     );
// };

// const FiveDayForecast = ({ cityId }) => {
//     const [forecast, setForecast] = useState([]);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if (!cityId) return;
//         setLoading(true);
//         privateApi.get(`/weather/${cityId}/forecast`)
//             .then(res => {
//                 const dailyForecasts = res.data.forecasts.filter(item => item.time.includes("12:00:00"));
//                 setForecast(dailyForecasts);
//             })
//             .catch(() => toast.error("ไม่สามารถโหลดข้อมูลพยากรณ์ 5 วันได้"))
//             .finally(() => setLoading(false));
//     }, [cityId]);
    
//     if (!cityId) return null;
//     if (loading) return <div className="card bg-base-100/50 backdrop-blur-sm shadow-xl w-full min-h-[10rem] flex justify-center items-center"><LoadingSpinner /></div>;

//     return (
//         <div className="card bg-base-100/50 backdrop-blur-sm shadow-xl w-full">
//             <div className="card-body">
//                 <h2 className="card-title">พยากรณ์ 5 วันข้างหน้า</h2>
//                 <div className="flex justify-between">
//                     {forecast.slice(0, 5).map(day => (
//                         <div key={day.time} className="flex flex-col items-center text-center p-2">
//                             <p className="font-semibold text-sm">{new Date(day.time).toLocaleDateString('th-TH', { weekday: 'short' })}</p>
//                             <img src={day.icon} alt={day.description} className="w-12 h-12"/>
//                             <p className="font-bold">{Math.round(day.temperature)}°</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// const FavoritesList = ({ favorites, onSelect, onDelete }) => (
//     <div className="card bg-base-100/50 backdrop-blur-sm shadow-xl w-full">
//         <div className="card-body">
//             <h2 className="card-title">เมืองโปรด</h2>
//             <div className="flex flex-wrap gap-2">
//                 {favorites.length > 0 ? favorites.map(fav => (
//                     <div key={fav.id} className="flex items-center bg-base-200 rounded-full">
//                         <button onClick={() => onSelect(fav.locationName)} className="btn btn-ghost btn-sm rounded-r-none">{fav.favoriteName || fav.locationName}</button>
//                         <button onClick={() => onDelete(fav.id, fav.locationName)} className="btn btn-ghost btn-sm btn-circle">✕</button>
//                     </div>
//                 )) : <p className="opacity-70">คุณยังไม่มีเมืองโปรด...</p>}
//             </div>
//         </div>
//     </div>
// );

// const MapDisplay = ({ weather }) => {
//     // ในโปรเจกต์จริง ส่วนนี้จะใช้ react-leaflet เพื่อแสดงแผนที่แบบ Interactive
//     // ตอนนี้จะเป็นแค่ Placeholder เพื่อให้เห็น Layout
//     const lat = weather?.latitude || 13.75;
//     const lon = weather?.longitude || 100.51;
//     return (
//         <div className="card bg-base-100/50 backdrop-blur-sm shadow-xl w-full h-full flex items-center justify-center">
//              <div className="card-body items-center text-center">
//                 <h2 className="card-title">แผนที่</h2>
//                 <p>ตำแหน่ง: {lat.toFixed(4)}, {lon.toFixed(4)}</p>
//                 <div className="w-full h-64 bg-gray-300 mt-4 rounded-lg flex items-center justify-center text-gray-500">
//                     Map will be here
//                 </div>
//             </div>
//         </div>
//     );
// };


// // --- Main Page Component for Logged-in Users ---
// function UserDashboard() {
//   const [weather, setWeather] = useState(null);
//   const [favorites, setFavorites] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [cityInput, setCityInput] = useState("");

//   const fetchWeather = useCallback(async (cityName) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await publicApi.get(`/weather?city=${cityName}`);
//       setWeather(res.data);
//     } catch (e) {
//       setError(e.response?.data?.error || e.message);
//     } finally {
//       setLoading(false);
//     }
//   }, []);
  
//   const fetchFavorites = useCallback(() => {
//       privateApi.get('/favorites')
//         .then(res => setFavorites(res.data.favorites || []))
//         .catch(() => toast.error("ไม่สามารถโหลดรายการโปรดได้"));
//   }, []);

//   useEffect(() => {
//     fetchWeather('Bangkok'); // โหลดกรุงเทพฯเป็นค่าเริ่มต้น
//     fetchFavorites();
//   }, [fetchWeather, fetchFavorites]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (cityInput.trim()) {
//       fetchWeather(cityInput.trim());
//     }
//   };

//   const handleFavoriteToggle = async (cityName, cityId, isFavorited) => {
//       try {
//           if (isFavorited) {
//               const favToRemove = favorites.find(f => f.cityId === cityId);
//               if (favToRemove) {
//                   await privateApi.delete(`/favorites/${favToRemove.id}`);
//                   fetchFavorites(); // โหลดรายการโปรดใหม่
//                   toast.success(`ลบ ${cityName} ออกจากรายการโปรดแล้ว`);
//               }
//           } else {
//               await privateApi.post('/favorites', { cityName });
//               fetchFavorites(); // โหลดรายการโปรดใหม่
//               toast.success(`เพิ่ม ${cityName} เป็นรายการโปรดแล้ว`);
//           }
//       } catch (err) {
//           toast.error(err.response?.data?.error || err.message);
//       }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         {/* Left Column */}
//         <div className="md:col-span-1 flex flex-col gap-6">
//           <form onSubmit={handleSearch}>
//             <input type="text" value={cityInput} onChange={(e) => setCityInput(e.target.value)} placeholder="ค้นหาชื่อเมือง..." className="input input-bordered w-full" />
//           </form>
          
//           {loading && <LoadingSpinner />}
//           {error && <ErrorDisplay message={error} />}
//           {weather && (
//             <WeatherDisplay 
//                 weather={weather} 
//                 favorites={favorites}
//                 onFavoriteToggle={handleFavoriteToggle}
//             />
//           )}
//           {weather && <FiveDayForecast cityId={weather.cityId} />}
//         </div>

//         {/* Right Column */}
//         <div className="md:col-span-2 flex flex-col gap-6">
//             <FavoritesList 
//                 favorites={favorites}
//                 onSelect={fetchWeather}
//                 onDelete={(favId, cityName) => handleFavoriteToggle(cityName, true)}
//             />
//             <div className="flex-grow">
//                 <MapDisplay weather={weather} />
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default UserDashboard;
