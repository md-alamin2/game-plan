import { useState, useRef } from "react";
import {
  FaEnvelope,
  FaCalendarAlt,
  FaHistory,
  FaSignOutAlt,
  FaCamera,
  FaEdit,
  FaTableTennis,
  FaUsers,
  FaUserShield,
  FaUser,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import { Link } from "react-router";
import useUserRole from "../../Hooks/useUserRole";
import useAdminState from "../../Hooks/useAdminState";
import CountUp from "react-countup";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loading from "../../Components/Sheared/Loading";

const MyProfile = () => {
  const { user, logoutUser, updateUser, setLoading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.photoURL || "");
  const fileInputRef = useRef(null)
  const axiosSecure = useAxiosSecure();
  const { courtState, membersState, usersState, isLoading } = useAdminState();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      displayName: user?.displayName || "",
      email: user?.email || "",
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setSelectedImage(file);
  };

  const uploadImageToImgBB = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        formData
      );
      const imgUrl = data.data.display_url;
      return imgUrl;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    }
  };

  const onSubmit = async (data) => {
    setIsUploading(true);
    try {
      let imageUrl = imagePreview;

      // Only upload if new image was selected
      if (selectedImage) {
        imageUrl = await uploadImageToImgBB(selectedImage);
      }

      // Update both name and image in your database
      await updateUser({
        displayName: data.displayName,
        photoURL: imageUrl,
      });

      const res = await axiosSecure.patch(`users?email=${user.email}`, {
        name: data.displayName,
        image: imageUrl,
      });

      if (res.data.modifiedCount) {
        Swal.fire({
          title: "Profile Updated!",
          text: "Your profile has been updated successfully.",
          icon: "success",
          timer: 2000,
        });
        reset();
        setIsEditing(false);
        setSelectedImage(null); // Reset selected image after save
        setIsUploading(false);
        setLoading(false);
      }
    } catch (error) {
      setIsUploading(false);
      toast.error("Failed to update profile");
      console.error("Update error:", error);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to logout!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        logoutUser()
          .then(() => {
            Swal.fire({
              title: "Logout!",
              text: "User logout successfully",
              icon: "success",
            });
          })
          .catch((error) => {
            const errorMessage = error.code;
            toast.error(`Login failed ${errorMessage}`, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          });
      }
    });
  };

  isLoading && <Loading></Loading>

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">My Profile</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-sm btn-primary text-white flex items-center gap-1"
              >
                <FaEdit />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditing(false);
                  reset();
                  setImagePreview(user?.photoURL || "");
                  setSelectedImage(null);
                }}
                className="btn btn-sm btn-outline btn-error"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center">
                  <div className="avatar mb-4 relative">
                    <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img
                        src={imagePreview || "/default-avatar.jpg"}
                        alt="Profile Preview"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="absolute bottom-0 right-0 btn btn-circle btn-sm btn-primary"
                      disabled={isUploading}
                    >
                      <FaCamera />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  {selectedImage && (
                    <span className="text-sm text-gray-500">
                      New image selected
                    </span>
                  )}
                  {isUploading && (
                    <span className="text-sm text-gray-500">Uploading...</span>
                  )}
                </div>

                {/* Form Fields */}
                <div className="flex-1 space-y-4">
                  <div className="form-control flex items-center gap-2">
                    <label className="label">
                      <span className="label-text">Full Name:</span>
                    </label>
                    <input
                      type="text"
                      {...register("displayName", {
                        required: "Name is required",
                        minLength: {
                          value: 3,
                          message: "Name must be at least 3 characters",
                        },
                      })}
                      className={`input input-bordered ${
                        errors.displayName ? "input-error" : ""
                      }`}
                    />
                    {errors.displayName && (
                      <span className="text-xs text-error">
                        {errors.displayName.message}
                      </span>
                    )}
                  </div>

                  <div className="form-control flex items-center gap-2">
                    <label className="label">
                      <span className="label-text">Email:</span>
                    </label>
                    <input
                      type="email"
                      {...register("email")}
                      className="input input-bordered"
                      disabled
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="btn btn-primary text-white"
                      disabled={isSubmitting || isUploading}
                    >
                      {isUploading
                        ? "Uploading..."
                        : isSubmitting
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Info */}
              <div className="flex flex-col items-center">
                <div className="avatar mb-4">
                  <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={user?.photoURL} alt="Profile" />
                  </div>
                </div>
                <h2 className="text-xl font-bold">{user?.displayName}</h2>
                {role === "admin" ? (
                  ""
                ) : (
                  <p className="text-gray-500">
                    {role === "member" ? "Member" : "User"} since{" "}
                    {new Date(
                      user?.metadata?.creationTime
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <FaEnvelope className="text-gray-400 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>

                <div>
                  {role === "admin" ? (
                    <p className="font-bold flex items-center gap-4">
                      <FaUser></FaUser> Admin
                    </p>
                  ) : (
                    <div className="flex items-center gap-4">
                      <FaCalendarAlt className="text-gray-400 text-xl" />
                      <div>
                        <p className="text-sm text-gray-500">
                          {role === "member" ? "Member" : "User"} Since
                        </p>
                        <p className="font-medium">
                          {new Date(
                            user?.metadata?.creationTime
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="divider"></div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link to="/dashboard/pending-bookings">
                    <button className="btn btn-secondary text-white hidden md:flex">
                      <FaHistory className="mr-2" />
                      Pending Bookings
                    </button>
                  </Link>
                  <button onClick={handleLogout} className="btn btn-error w-full md:w-fit">
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {role === "admin" && !isEditing && (
          <>
            <div className="divider"></div>
            <h3 className="font-bold text-lg px-6">Admin Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 pt-2">
              <div className="stat bg-base-100 rounded-lg shadow p-4">
                <div className="stat-figure text-primary">
                  <FaTableTennis className="text-2xl" />
                </div>
                <div className="stat-title">Total Courts</div>
                <div className="stat-value text-primary">
                  {roleLoading ? (
                    "..."
                  ) : (
                    <CountUp
                      end={courtState?.length}
                      duration={2.5}
                      className="text-4xl font-bold"
                      enableScrollSpy={true}
                    />
                  )}
                </div>
              </div>

              <div className="stat bg-base-100 rounded-lg shadow p-4">
                <div className="stat-figure text-secondary">
                  <FaUsers className="text-2xl" />
                </div>
                <div className="stat-title">Total Users</div>
                <div className="stat-value text-secondary">
                  {roleLoading ? (
                    "..."
                  ) : (
                    <CountUp
                      end={usersState?.length}
                      duration={2.5}
                      className="text-4xl font-bold"
                      enableScrollSpy={true}
                    />
                  )}
                </div>
              </div>

              <div className="stat bg-base-100 rounded-lg shadow p-4">
                <div className="stat-figure text-accent">
                  <FaUserShield className="text-2xl" />
                </div>
                <div className="stat-title">Total Members</div>
                <div className="stat-value text-accent">
                  {roleLoading ? (
                    "..."
                  ) : (
                    <CountUp
                      end={membersState?.length}
                      duration={2.5}
                      className="text-4xl font-bold"
                      enableScrollSpy={true}
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
