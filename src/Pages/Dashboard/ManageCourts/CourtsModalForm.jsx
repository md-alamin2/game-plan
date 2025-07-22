import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";

const CourtModalForm = ({ court, onClose, onSuccess }) => {
  const axiosSecure = useAxiosSecure();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(court?.image || "");
  const [isUploading, setIsUploading] = useState(false);
  const [timeSlots, setTimeSlots] = useState(
    court?.slots ||
      Array(4).fill({ startTime: "", endTime: "", available: true })
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    // setValue,
  } = useForm({
    defaultValues: {
      name: court?.name || "",
      sportType: court?.sportType || "Sports Type",
      price: court?.price || 0,
      priceUnit: court?.priceUnit || "hour",
      description: court?.description || "",
      features: court?.features?.join(", ") || "",
      // slots: court?.slots?.map((slot) => slot.time).join(", ") || "",
      image: court?.image || "",
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setImageFile(file);
  };

  const uploadImageToImgBB = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    setIsUploading(true);

    try {
      const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        formData
      );
      return data.data.display_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleTimeSlotChange = (index, field, value) => {
    const newSlots = [...timeSlots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setTimeSlots(newSlots);
  };

  const onSubmit = async (data) => {
    try {
      let imageUrl= data.image

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadImageToImgBB(imageFile);
      }



      const courtData = {
        ...data,
        image: imageUrl,
        features: data.features.split(",").map((f) => f.trim()),
        slots: timeSlots,
      };

        if (court?._id) {
        // Update existing court
        await axiosSecure.put(`courts/${court._id}`, courtData);
        Swal.fire({
          title: "Court Updated Successfully",
          icon: "success",
          timer: 2000,
        });
      } else {
        // Create new court
        await axiosSecure.post("courts", courtData);
        Swal.fire({
          title: "Court Added Successfully",
          icon: "success",
          timer: 2000,
        });
        reset()
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save court");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Court Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Court Name*</span>
          </label>
          <input
            type="text"
            {...register("name", { required: "Court name is required" })}
            className={`input input-bordered ${
              errors.name ? "input-error" : ""
            }`}
          />
          {errors.name && (
            <span className="label-text-alt text-error">
              {errors.name.message}
            </span>
          )}
        </div>

        {/* Sport Type */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Sport Type*</span>
          </label>
          <select
            {...register("sportType", { required: true })}
            className="select select-bordered"
          >
            <option value="Sports Type" disabled>
              Select Sports Type
            </option>
            <option value="Tennis">Tennis</option>
            <option value="Badminton">Badminton</option>
            <option value="Cricket">Cricket</option>
            <option value="Football">Football</option>
          </select>
        </div>

        {/* Price */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Price*</span>
          </label>
          <input
            type="number"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price must be positive" },
            })}
            className={`input input-bordered ${
              errors.price ? "input-error" : ""
            }`}
          />
          {errors.price && (
            <span className="label-text-alt text-error">
              {errors.price.message}
            </span>
          )}
        </div>

        {/* Price Unit */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Price Unit*</span>
          </label>
          <select
            {...register("priceUnit", { required: true })}
            className="select select-bordered"
          >
            <option value="hour">Per Hour</option>
            <option value="session">Per Session</option>
            <option value="day">Per Day</option>
          </select>
        </div>

        {/* Description */}
        <div className="form-control md:col-span-2 flex flex-col">
          <label className="label">
            <span className="label-text">Description*</span>
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            className={`textarea textarea-bordered w-full ${
              errors.description ? "textarea-error" : ""
            }`}
            rows={3}
          />
          {errors.description && (
            <span className="label-text-alt text-error">
              {errors.description.message}
            </span>
          )}
        </div>

        {/* Features */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Features (comma separated)*</span>
          </label>
          <input
            type="text"
            {...register("features", { required: "Features are required" })}
            className={`input input-bordered ${
              errors.features ? "input-error" : ""
            }`}
            placeholder="Professional Surface, Ball Machine, Night Lighting"
          />
          {errors.features && (
            <span className="label-text-alt text-error">
              {errors.features.message}
            </span>
          )}
        </div>

        {/* Time Slots */}
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text">Time Slots (Max 4)*</span>
          </label>
          <div className="space-y-2">
            {timeSlots.slice(0, 4).map((slot, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="time"
                  value={slot.startTime || ""}
                  onChange={(e) =>
                    handleTimeSlotChange(index, "startTime", e.target.value)
                  }
                  className="input input-bordered"
                  required={index === 0}
                />
                <span>to</span>
                <input
                  type="time"
                  value={slot.endTime || ""}
                  onChange={(e) =>
                    handleTimeSlotChange(index, "endTime", e.target.value)
                  }
                  className="input input-bordered"
                  required={index === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text">Court Image*</span>
          </label>
          <div className="flex flex-col gap-4">
            {imagePreview && (
              <div className="w-full max-w-xs h-48 border rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Court preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input file-input-bordered w-full max-w-xs"
              required={!court?._id}
            />
            {isUploading && (
              <span className="text-sm text-gray-500">Uploading image...</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-ghost"
          disabled={isSubmitting || isUploading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting || isUploading ? (
            <>
              <span className="loading loading-spinner"></span>
              Saving...
            </>
          ) : (
            "Save Court"
          )}
        </button>
      </div>
    </form>
  );
};

export default CourtModalForm;
