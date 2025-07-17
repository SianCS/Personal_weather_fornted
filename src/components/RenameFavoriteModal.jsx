import { useEffect } from "react";
import { useForm } from "react-hook-form";

export const RenameFavoriteModal = ({ favoriteData, onClose, onSubmit }) => {
    const { register, handleSubmit, setValue } = useForm();

    useEffect(() => {
        if (favoriteData) {
            setValue('favoriteName', favoriteData.currentName);
        }
    }, [favoriteData, setValue]);

    const handleFormSubmit = (data) => {
        onSubmit(favoriteData.id, data.favoriteName);
        onClose();
    };

    return (
        <dialog id="rename_fav_modal" className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">แก้ไขชื่อเมืองโปรด</h3>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
                    <input
                        type="text"
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
