import { useState } from "react";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import { FaPaperPlane } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { toast } from "react-toastify";
import Loading from "../../Components/Sheared/Loading";
import { motion } from "framer-motion";

const ReviewForm = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    courtName: "",
    rating: 0,
    review: "",
    user: {
      name: user.displayName,
      img: user.photoURL,
    },
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setFormData({
        ...formData,
        author: {
          ...formData.user,
          name: value,
        },
      });
    } else if (name === "position") {
      setFormData({
        ...formData,
        user: {
          ...formData.user,
          position: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Review post mutation
  const { mutate: postReview, isPending } = useMutation({
    mutationFn: async (review) => {
      await axiosSecure.post("reviews", review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingBookings", user?.email]);
      Swal.fire({
        title: "Your Review submit successfully!",
        text: "Thanks for your honest review",
        icon: "success",
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.courtName || !formData.review || !formData.user.name) {
      setError("Please fill all fields and select a rating");
      return;
    }
    postReview(formData);
  };

  isPending && <Loading></Loading>;

  return (
    <motion.div
      className="w-11/12 max-w-2xl mx-auto p-6 my-10 md:my-30 border border-gray-300 rounded-2xl"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <title>Rate US</title>
      <motion.h2
        className="text-3xl font-bold mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Leave a Review
      </motion.h2>
      <p className="text-gray-600 mb-6">Share your experience with us</p>

      {error && (
        <div className="alert alert-error mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {/* Name */}
        <div className="form-control">
          <label className="label">
            <p className="label-text">
              Your Name<span className="text-red-500">*</span>
            </p>
          </label>
          <input
            type="text"
            name="name"
            disabled
            value={formData.user.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Task Title */}
        <div className="form-control">
          <label className="label">
            <p className="label-text">
              Court Name<span className="text-red-500">*</span>
            </p>
          </label>
          <input
            type="text"
            name="courtName"
            value={formData.courtName}
            onChange={handleChange}
            placeholder="Court name"
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Rating */}
        <div className="form-control">
          <label className="label">
            <p className="label-text">
              Rating<span className="text-red-500">*</span>
            </p>
          </label>
          <div className="rating rating-lg">
            {[1, 2, 3, 4, 5].map((star) => (
              <input
                key={star}
                type="radio"
                name="rating"
                className={`mask mask-star ${
                  star <= (hoverRating || formData.rating)
                    ? "bg-amber-300"
                    : "bg-gray-400"
                }`}
                onClick={() => setFormData({ ...formData, rating: star })}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="form-control flex flex-col">
          <label className="label">
            <p className="label-text">
              Your Review<span className="text-red-500">*</span>
            </p>
          </label>
          <textarea
            name="review"
            value={formData.review}
            onChange={handleChange}
            className="textarea textarea-bordered h-24 w-full"
            placeholder="Share your experience..."
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="form-control mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className={`btn btn-primary text-white ${
              isPending ? "loading" : ""
            }`}
            disabled={isPending}
          >
            <FaPaperPlane />
            {isPending ? "" : "Submit Review"}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default ReviewForm;
