import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loading from "../../Components/Sheared/Loading";

const PendingBookings = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch ONLY the logged-in user's pending bookings
  const {
    data: pendingBookings = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pendingBookings", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `bookings/pending?user=${user?.email}`
      );
      return data;
    },
    enabled: !!user?.email, // Only fetch when user exists
  });

  // Cancel booking mutation
  const { mutate: cancelBooking } = useMutation({
    mutationFn: async (bookingId) => {
      await axiosSecure.delete(`cancel-bookings/${bookingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingBookings", user?.email]);
      toast.success("Booking cancelled successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    },
  });

  if (!user) return <div>Please login to view bookings</div>;
  if (isLoading) return <Loading></Loading>;
  if (isError) return <div>Error loading your bookings</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Pending Bookings</h2>

      {pendingBookings?.length === 0 ? (
        <p>You have no pending bookings</p>
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
              {pendingBookings?.map((booking, index) => (
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
                    {booking.status === "pending" ? (
                      <span className="badge badge-soft badge-warning">
                        {booking.status}
                      </span>
                    ) : (
                      <span className="badge badge-soft badge-error">
                        {booking.status}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4 ">${booking.totalCost}</td>
                  <td className="py-2 px-4 ">
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      className="btn btn-error"
                    >
                      Cancel
                    </button>
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

export default PendingBookings;
