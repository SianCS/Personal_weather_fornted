export const FavoritesList = ({ favorites, onSelect, onDelete, onRename }) => {
    return (
        <div className="card bg-base-100/50 backdrop-blur-sm shadow-xl w-full">
            <div className="card-body">
                <h2 className="card-title">เมืองโปรด</h2>
                <div className="flex flex-wrap gap-2">
                    {favorites.length > 0 ? favorites.map(fav => (
                        <div key={fav.id} className="tooltip" data-tip={fav.locationName}>
                            <div className="flex items-center bg-base-200 rounded-full">
                                {/* ✨ HIGHLIGHT: 1. เมื่อคลิกที่นี่ จะเรียก onSelect ซึ่งจะไปเรียก fetchWeather */}
                                <button onClick={() => onSelect(fav.locationName)} className="btn btn-ghost btn-sm rounded-r-none">{fav.favoriteName || fav.locationName}</button>
                                <button onClick={() => onRename(fav.id, fav.favoriteName || fav.locationName)} className="btn btn-ghost btn-circle btn-sm" title="แก้ไขชื่อ">✏️</button>
                                <button onClick={() => onDelete(fav.id)} className="btn btn-ghost btn-sm btn-circle" title="ลบ">✕</button>
                            </div>
                        </div>
                    )) : <p className="opacity-70">คุณยังไม่มีเมืองโปรด...</p>}
                </div>
            </div>
        </div>
    );
};