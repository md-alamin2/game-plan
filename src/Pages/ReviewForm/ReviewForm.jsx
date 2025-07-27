import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import { FaPaperPlane } from "react-icons/fa";


const ReviewForm = () => {
  const { user } = useAuth();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.courtName || !formData.review || !formData.user.name) {
      setError("Please fill all fields and select a rating");
      return;
    }

    setIsSubmitting(true);
    console.log(formData);

    // try {
    //   // Replace with your API endpoint
    //   await axios.post("https://assignment-10-server-mu-eight.vercel.app/reviews", formData);
    //   Swal.fire({
    //     title: "Your Review submit successfully!",
    //     text: "Thanks for your honest review",
    //     icon: "success",
    //   });
    // } catch (err) {
    //   setError(err.response?.data?.message || "Submission failed");
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <div className="w-11/12 max-w-2xl mx-auto p-6 my-10 md:my-30 border border-gray-300 rounded-2xl">
      <title>Rate US</title>
      <h1 className="text-3xl font-bold mb-2">Leave a Review</h1>
      <p className="text-gray-600 mb-6">
        Share your experience working with us
      </p>

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

      <form onSubmit={handleSubmit} className="space-y-4">

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
          <button
            type="submit"
            className={`btn btn-primary text-white ${
              isSubmitting ? "loading" : ""
            }`}
            disabled={isSubmitting}
          >
            <FaPaperPlane />{isSubmitting ? "" : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
