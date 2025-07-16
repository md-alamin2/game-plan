import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAxios from "../../Hooks/useAxios";
import useAuth from "../../Hooks/useAuth";

const PendingBookings = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const axiosInstance = useAxios();

  // Fetch ONLY the logged-in user's pending bookings
  const {
    data: pendingBookings=[],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pendingBookings", user?.email],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `bookings/pending?user=${user?.email}`,
        // {
        //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        // }
      );
      return data;
    },
    enabled: !!user?.email, // Only fetch when user exists
  });

  // Cancel booking mutation
  const { mutate: cancelBooking } = useMutation({
    mutationFn: async (bookingId) => {
        console.log(bookingId);
      await axiosInstance.delete(`cancel-bookings/${bookingId}`, 
    //     {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //       "User-Email": user?.email, // Additional security check
    //     },
    //   }
    );
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
  if (isLoading) return <div>Loading your bookings...</div>;
  if (isError) return <div>Error loading your bookings</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Pending Bookings</h2>

      {pendingBookings?.length === 0 ? (
        <p>You have no pending bookings</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Court</th>
                <th className="py-2 px-4 border-b">Type</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Slots</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingBookings?.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    {booking.courtName}
                  </td>
                  <td className="py-2 px-4 border-b ">
                    {booking.courtType}
                  </td>
                  <td className="py-2 px-4 border-b ">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b ">
                    {booking.slots.join(", ")}
                  </td>
                  <td className="py-2 px-4 border-b ">
                    ${booking.totalCost}
                  </td>
                  <td className="py-2 px-4 border-b ">
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
