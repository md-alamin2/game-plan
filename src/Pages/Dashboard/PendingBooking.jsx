import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loading from "../../Components/Sheared/Loading";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import EmptyState from "../../Components/Sheared/EmptyState";
import { useNavigate } from "react-router";
import SearchBar from "../../Components/Sheared/SearchBar";

const PendingBookings = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch ONLY the logged-in user's pending bookings
  const { data: pendingBookings = [], isLoading } = useQuery({
    queryKey: ["pendingBookings", user?.email, searchTerm],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `bookings/pending?email=${user?.email}&search=${searchTerm}`
      );
      return data;
    },
    enabled: !!user?.email, // Only fetch when user exists
  });

  // Cancel booking mutation
  const { mutate: cancelBooking } = useMutation({
    mutationFn: async (bookingId) => {
      await axiosSecure.delete(`bookings/${bookingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingBookings", user?.email]);
      toast.success("Booking cancelled successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    },
  });

  

  return (
    <div className="w-11/12 lg:container mx-auto mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold ">Your Pending Bookings</h2>
        {/* search bar */}
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={"Search Pending Bookings...."}></SearchBar>
      </div>
      
      {isLoading?<Loading></Loading>:pendingBookings?.length === 0 ? (
        <EmptyState
          title={
            searchTerm ? "No booking match your search" : "You have no pending Booking"
          }
          message={searchTerm? "You haven't booked any Court By this name or type": "Let's book a court"}
          iconType={searchTerm? "search" :"add"}
          actionButton={
            <button
              onClick={() => {
                navigate("/courts")
              }}
              className="btn btn-primary text-white flex items-center gap-2"
            >
              <FaPlus /> Let's Book a Court
            </button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-content/5">
          <table className="table table-zebra table-sm md:table-md w-full rounded-2xl">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th>#</th>
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
                <tr key={booking._id} className="hover:bg-gray-50 text-center">
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
