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
import WrapContainer from "../../Components/AnimateCompnent/WrapContainer";
import WrapTr from "../../Components/AnimateCompnent/WrapTr";

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
    <WrapContainer>
      <title>Pending Bookings</title>
      <div className="w-11/12 lg:w-11/12 lg:container mx-auto my-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold ">Your Pending Bookings</h2>
          {/* search bar */}
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder={"Search Pending Bookings...."}
          ></SearchBar>
        </div>

        {isLoading ? (
          <Loading></Loading>
        ) : pendingBookings?.length === 0 ? (
          <EmptyState
            title={
              searchTerm
                ? "No booking match your search"
                : "You have no pending Booking"
            }
            message={
              searchTerm
                ? "You haven't booked any Court By this name or type"
                : "Let's book a court"
            }
            iconType={searchTerm ? "search" : "add"}
            actionButton={
              <button
                onClick={() => {
                  navigate("/courts");
                }}
                className="btn btn-primary text-white flex items-center gap-2"
              >
                <FaPlus /> Let's Book a Court
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-box border border-base-content/5">
            <table className="table table-zebra table-sm lg:table-md w-full rounded-2xl">
              <thead>
                <tr className="bg-base-200 text-center">
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
                  <WrapTr key={booking._id}
                    >
                    <td>{index + 1}</td>
                    <td className="py-2 px-4">{booking.courtName}</td>
                    <td className="py-2 px-4 ">{booking.courtType}</td>
                    <td className="py-2 px-4 ">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 flex flex-col justify-center items-center ">
                      {booking.slots.map((slot, i) => (
                        <div key={i}>
                          {slot.startTime}-{slot.endTime}
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
                  </WrapTr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </WrapContainer>
  );
};

export default PendingBookings;
