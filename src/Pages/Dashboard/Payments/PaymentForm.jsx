import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import { useState } from "react";
import { FaCreditCard, FaCheckCircle } from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";

const PaymentForm = ({ booking }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState({});
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(booking.totalCost);
  const [isProcessing, setIsProcessing] = useState(false);

  // Apply coupon
  const handleApplyCoupon = async () => {
    try {
      const response = await axiosSecure.get(`coupon?code=${couponCode}`);
      setCoupon(response.data);
      if (response.data.length <= 0) {
        return toast.error("Invalid coupon code");
      }
      const discountPercentage = response?.data?.discountPercentage;
      const discountAmount = (booking.totalCost * discountPercentage) / 100;
      setDiscount(discountAmount);
      setFinalPrice(booking.totalCost - discountAmount);
      toast.success(`Coupon applied! ${discountPercentage}% discount`);
    } catch (error) {
      toast.error("Invalid or expired coupon code", { error });
      setDiscount(0);
      setFinalPrice(booking.totalCost);
    }
  };

  // Handle payment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    const card = elements.getElement(CardElement);

    if (!card) {
      return;
    }

    // step-1: validate card
    if (error) {
      setIsProcessing(false);
      return setError(error.message);
    } else {
      setError("");

      const amount = finalPrice * 100;

      // step-2 create payment intent
      const res = await axiosSecure.post("create-payment-intent", {
        amount,
        bookingId: booking._id,
      });

      const clientSecret = res.data.clientSecret;

      try {
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              type: "card",
              card: elements.getElement(CardElement),
              billing_details: {
                name: user.displayName,
                email: user.email,
              },
            },
          }
        );

        if (error) {
          toast.error(error.message);
          setIsProcessing(false);
          return;
        }

        const maxUses = coupon.maxUses - 1;
        if (paymentIntent.status === "succeeded") {
          // Save payment to database
          const paymentData = {
            bookingId: booking._id,
            courtId: booking.courtId,
            slots: booking.slots,
            email: user.email,
            amount: finalPrice,
            couponCode: discount > 0 ? couponCode : null,
            maxUses,
            discountAmount: discount,
            transactionId: paymentIntent.id,
          };

          const paymentRes = await axiosSecure.post("/payments", paymentData);
          if (paymentRes.data.insertedId) {
            setIsProcessing(false);
            Swal.fire({
              title: "Payment Successfully",
              icon: "success",
            });
            navigate("/dashboard/confirmed-bookings")
          }
        }
      } catch (error) {
        toast.error("Payment failed. Please try again.", { error });
        setIsProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      {/* Coupon Section */}
      <div className="bg-base-200 p-4 rounded-lg">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter coupon code"
            className="input input-bordered flex-1"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          />
          <button
            type="button"
            onClick={handleApplyCoupon}
            className="btn btn-secondary"
          >
            Apply
          </button>
        </div>
        {discount > 0 && (
          <p className="mt-2 text-primary">
            Discount applied: ${discount} (New total: ${finalPrice})
          </p>
        )}
      </div>

      {/* Booking Details */}
      <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 md:gap-6">
        <div className="form-control flex flex-col ">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            value={booking.user}
            readOnly
            className="input input-bordered bg-base-200 w-full"
          />
        </div>

        <div className="form-control flex flex-col">
          <label className="label">
            <span className="label-text">Court Name</span>
          </label>
          <input
            type="text"
            value={booking.courtName}
            readOnly
            className="input input-bordered bg-base-200 w-full"
          />
        </div>

        <div className="form-control flex flex-col">
          <label className="label">
            <span className="label-text">Court Type</span>
          </label>
          <input
            type="text"
            value={booking.courtType}
            readOnly
            className="input input-bordered bg-base-200 w-full"
          />
        </div>

        <div className="form-control flex flex-col">
          <label className="label">
            <span className="label-text">Date</span>
          </label>
          <input
            type="text"
            value={new Date(booking.bookingDate).toLocaleDateString()}
            readOnly
            className="input input-bordered bg-base-200 w-full"
          />
        </div>

        <div className="form-control flex flex-col">
          <label className="label">
            <span className="label-text">Amount</span>
          </label>
          <input
            type="text"
            value={`$${finalPrice}`}
            readOnly
            className="input input-bordered bg-base-200 w-full font-bold"
          />
          {discount > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Original price: ${booking.totalCost}
            </p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Time Slots</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {booking.slots.map((slot, index) => (
              <span key={index} className="btn btn-primary text-white">
                {slot.startTime} - {slot.endTime}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stripe Card Element */}
      <div className="border rounded-lg p-4">
        <label className="label">
          <span className="label-text">Card Details</span>
        </label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}

      {/* Submit Button */}
      <button
        type="submit"
        className="btn btn-primary text-white w-full mt-6"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <>
            <FaCreditCard className="mr-2" />
            Pay ${finalPrice}
          </>
        )}
      </button>
    </form>
  );
};

export default PaymentForm;
