import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  FaMoneyBillWave,
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
} from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import Loading from "../../Components/Sheared/Loading";
import useUserRole from "../../Hooks/useUserRole";

const ApprovedBookings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { role } = useUserRole();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch approved bookings
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["approvedBookings", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`bookings/approved?user=${user.email}`);
      return res.data;
    },
    enabled: role === "member",
  });

  // Cancel booking mutation
  const { mutate: cancelBooking } = useMutation({
    mutationFn: async (bookingId) => {
      await axiosSecure.delete(`bookings/${bookingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["approvedBookings"]);
      toast.success("Booking cancelled successfully");
    },
    onError: () => {
      toast.error("Failed to cancel booking");
    },
  });

  const handlePayment = (bookingId) => {
    navigate(`/dashboard/payment-form?bookingId=${bookingId}`);
  };

  const handleCancel = (bookingId) => {
    Swal.fire({
      title: "Confirm Cancellation",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "Go back",
    }).then((result) => {
      if (result.isConfirmed) {
        cancelBooking(bookingId);
      }
    });
  };

  if (role !== "member") {
    return <div className="text-center py-10">Member access required</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Approved Bookings</h2>

      {isLoading ? (
        <Loading></Loading>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">
            No approved bookings pending payment
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-content/5">
          <table className="table table-zebra table-sm md:table-md w-full rounded-2xl">
            <thead>
              <tr className="bg-gray-100">
                <th></th>
                <th>Court</th>
                <th>Type</th>
                <th>Date</th>
                <th>Slots</th>
                <th>Status</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings?.map((booking, index) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td>{index + 1}</td>
                  <td className="py-2 px-4">{booking.courtName}</td>
                  <td className="py-2 px-4 ">{booking.courtType}</td>
                  <td className="py-2 px-4 ">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 ">
                    {booking.slots.map((slot, i) => (
                      <div key={i}>
                        {slot.startTime} - {slot.endTime}
                      </div>
                    ))}
                  </td>
                  <td className="py-2 px-4">
                    <span className="badge badge-soft badge-success">
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 ">${booking.totalCost}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePayment(booking._id)}
                        className="btn btn-primary btn-sm"
                      >
                        <FaMoneyBillWave className="mr-1" />
                        Pay
                      </button>
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="btn btn-error btn-sm"
                      >
                        <FaTimes className="mr-1" />
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApprovedBookings;
