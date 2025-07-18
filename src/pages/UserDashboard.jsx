import { useCallback, useEffect, useState } from "react";
import useUserStore from "../stores/userStore";
import { toast } from "react-toastify";
import { FavoritesList } from "../components/FavoritesList";
import {
  privateApi,
  // publicApi,
  searchByCityName,
  searchByLagLon,
} from "../api";
import MapDisplay from "../components/MapDisplay";
import { WeatherDisplay } from "../components/WeatherDisplay";
import { FiveDayForecast } from "../components/FiveDayForecast";
import { LocationIcon, SearchIcon } from "../icons";
import LoadingUi from "../components/LoadingUi";
import ErrorUi from "../components/ErrorUi";
import { RenameFavoriteModal } from "../components/RenameFavoriteModal";
import { AddFavoriteModal } from "../components/AddFavoriteModal";

function UserDashboard() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const [weather, setWeather] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cityInput, setCityInput] = useState("");
  const [clickedPosition, setClickedPosition] = useState(null);
  const [renameFavoriteData, setRenameFavoriteData] = useState(null);
  const [addFavoriteData, setAddFavoriteData] = useState(null);


 const fetchWeather = useCallback(async (apiCall, overrideDisplayName = null) => {
    setLoading(true);
    setError(null);
    setClickedPosition(null);
    setWeather(null); 

    try {
      const res = await apiCall();
      const weatherData = res.data;

      // ถ้ามีการส่งชื่อที่ต้องการแสดงผลมา ให้ใช้ชื่อนั้นแทน
      if (overrideDisplayName) {
        weatherData.city = overrideDisplayName;
      }
      
      console.log("Weather data received:", weatherData);
      setWeather(weatherData);
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.response?.data?.error || e.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFavorites = useCallback(() => {
    privateApi
      .get("/favorites")
      .then((res) => setFavorites(res.data.favorites || []))
      .catch(() => toast.error("ไม่สามารถโหลดรายการโปรดได้"));
  }, []);

  const handleGetCurrentLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(() =>
          searchByLagLon(position.coords.latitude, position.coords.longitude)
        );
      },
      () => {
        // ถ้าผู้ใช้ไม่อนุญาต ให้แสดงข้อความและดึงข้อมูลของกรุงเทพฯ แทน
        toast.error("ไม่สามารถเข้าถึงตำแหน่งปัจจุบันได้, กำลังแสดงข้อมูลของกรุงเทพฯ");
        fetchWeather(() => searchByCityName("Bangkok"));
      }
    );
  }, [fetchWeather]);

  useEffect(() => {
    handleGetCurrentLocation();
    fetchFavorites();
  }, [handleGetCurrentLocation, fetchFavorites]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = cityInput.trim();
    if (!query) return;

    const coords = query.split(",").map((s) => parseFloat(s.trim()));
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      const [lat, lon] = coords;
      fetchWeather(() => searchByLagLon(lat, lon));
    } else {
      fetchWeather(() => searchByCityName(query));
    }
  };

  // ✨ HIGHLIGHT: 1. ปรับปรุงฟังก์ชัน handleFavoriteToggle
 const handleFavoriteToggle = async (currentWeather, isFavorited) => {
      if (isFavorited) {
          const favToRemove = favorites.find(f => f.cityId === currentWeather.cityId);
          if (favToRemove) {
              await privateApi.delete(`/favorites/${favToRemove.id}`);
              fetchFavorites();
              toast.success(`ลบ ${currentWeather.city} ออกจากรายการโปรดแล้ว`);
          }
      } else {
          if (!currentWeather || typeof currentWeather.cityId !== 'number') {
              toast.error("ไม่สามารถเพิ่มเมืองโปรดได้: ข้อมูลเมืองไม่สมบูรณ์");
              return;
          }
          setAddFavoriteData(currentWeather);
      }
  };

  const handleConfirmAddFavorite = async (cityId, favoriteName) => {
    try {
        await privateApi.post('/favorites', { 
            cityId: cityId,
            favoriteName: favoriteName?.trim() || null
        });
        fetchFavorites();
        toast.success(`เพิ่มเป็นรายการโปรดแล้ว`);
    } catch (err) {
        toast.error(err.response?.data?.error || "ไม่สามารถเพิ่มเมืองโปรดได้");
    }
  };

  const handleMapClick = (latlng) => {
    const { lat, lng } = latlng;
    setClickedPosition([lat, lng]);
    setCityInput(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    fetchWeather(() => searchByLagLon(lat, lng));
  };
  
  // ✨ HIGHLIGHT: 4. เปลี่ยน handleFavoriteRename ให้เปิด Modal
  const handleFavoriteRename = (favId, currentName) => {
    setRenameFavoriteData({ id: favId, currentName: currentName });
  };

  // ✨ HIGHLIGHT: 5. สร้างฟังก์ชันสำหรับจัดการการ submit จาก Modal แก้ไขชื่อ
  const handleConfirmRename = async (favId, newName) => {
    if (newName !== null && newName.trim() !== "") {
        try {
            await privateApi.patch(`/favorites/${favId}`, { favoriteName: newName.trim() });
            toast.success("แก้ไขชื่อสำเร็จ!");
            fetchFavorites();
        } catch (err) {
            toast.error(err.response?.data?.error || "ไม่สามารถแก้ไขชื่อได้");
        }
    }
  };

   // ✨ HIGHLIGHT: 2. ปรับปรุง handleSelectFavorite ให้ส่งชื่อที่ต้องการแสดงผลไปด้วย
  const handleSelectFavorite = (favorite) => {
    // ดึงข้อมูลอากาศโดยใช้พิกัดที่แม่นยำของเมืองโปรด
    // และส่ง "ชื่อเล่น" (หรือชื่อจริง) ไปเป็น overrideDisplayName
    fetchWeather(
      () => searchByLagLon(favorite.latitude, favorite.longitude),
      favorite.favoriteName || favorite.locationName
    );
  };

  

  const isFavorited = weather ? favorites.some(fav => fav.cityId === weather.cityId) : false;

   if (weather) {
    console.log("Passing cityId to FiveDayForecast:", weather.cityId);
  }


  return (
    <div
      className="min-h-screen w-full bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1621059776653-759002b39153?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      <div className="min-h-screen w-full bg-black/10 backdrop-blur-sm">
        {/* ✨ HIGHLIGHT: เพิ่ม Navbar สำหรับแสดงข้อมูลผู้ใช้และปุ่ม Logout */}
        {/* ======================================================= */}
        <div className="navbar bg-transparent px-4 md:px-8 pt-4">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl text-white">WeatherVista</a>
            </div>
            <div className="flex-none gap-2">
                {user && (
                    <div className="flex items-center gap-4">
                        <span className="font-semibold text-white hidden sm:inline">สวัสดี, {user.email}</span>
                        <button onClick={logout} className="btn btn-outline btn-primary">
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>

        <div className="container mx-auto p-4">

          {/* ✨ HIGHLIGHT: 6. เพิ่ม Modal component เข้าไปใน JSX */}
      {addFavoriteData && (
        <AddFavoriteModal
            cityData={addFavoriteData}
            onClose={() => setAddFavoriteData(null)}
            onSubmit={handleConfirmAddFavorite}
        />
      )}
      {renameFavoriteData && (
        <RenameFavoriteModal
            favoriteData={renameFavoriteData}
            onClose={() => setRenameFavoriteData(null)}
            onSubmit={handleConfirmRename}
        />
      )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="md:col-span-1 flex flex-col gap-6">
              <form
                onSubmit={handleSearch}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  placeholder="ค้นหาชื่อเมือง..."
                  className="input input-bordered w-full pr-24"
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex z-10">
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    className="btn btn-ghost btn-circle"
                    title="ใช้ตำแหน่งปัจจุบัน"
                  >
                    <LocationIcon />
                  </button>
                  <button
                    type="submit"
                    className="btn btn-ghost btn-circle"
                    title="ค้นหา"
                  >
                    <SearchIcon />
                  </button>
                </div>
              </form>

              {loading && <LoadingUi />}
              {error && <ErrorUi message={error} />}
              {weather && (
                <>
                  <WeatherDisplay
                    weather={weather}
                    isFavorited={isFavorited}
                    onFavoriteClick={() =>
                      handleFavoriteToggle(weather, isFavorited)
                    }
                  />
                  <FiveDayForecast cityId={weather.cityId} />
                </>
              )}
            </div>

            {/* Right Column */}
            <div className="md:col-span-2 flex flex-col gap-6">
              <FavoritesList
                favorites={favorites}
                onSelect={handleSelectFavorite}
                onDelete={(favId) => {
                  const favToDelete = favorites.find((f) => f.id === favId);
                  if (favToDelete) {
                    handleFavoriteToggle({ cityId: favToDelete.cityId, city: favToDelete.locationName }, true);
                  }
                }}
                onRename={handleFavoriteRename} 
              />
              <div className="flex-grow min-h-[30rem]">
                <MapDisplay
                  weather={weather}
                  onMapClick={handleMapClick}
                  clickedPosition={clickedPosition}
                  favorites={favorites}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UserDashboard;
