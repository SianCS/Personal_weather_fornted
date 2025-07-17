import { useEffect } from "react";
import { useForm } from "react-hook-form";

export const AddFavoriteModal = ({ cityData, onClose, onSubmit }) => {
    const { register, handleSubmit, setValue } = useForm();

    useEffect(() => {
        if (cityData) {
            setValue('favoriteName', cityData.city);
        }
    }, [cityData, setValue]);

    const handleFormSubmit = (data) => {
        onSubmit(cityData.cityId, data.favoriteName);
        onClose();
    };

    return (
        <dialog id="add_fav_modal" className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">เพิ่มเป็นเมืองโปรด</h3>
                <p className="py-2">ตั้งชื่อเล่นสำหรับ "{cityData.city}" (ไม่บังคับ)</p>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
                    <input
                        type="text"
                        placeholder="เช่น บ้าน, ที่ทำงาน"
                        {...register("favoriteName")}
                        className="input input-bordered w-full"
                    />
                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>ยกเลิก</button>
                        <button type="submit" className="btn btn-primary">บันทึก</button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop"><button onClick={onClose}>close</button></form>
        </dialog>
    );
};