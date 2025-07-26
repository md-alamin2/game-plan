import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useUserRole from "../../Hooks/useUserRole";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Loading from "../../Components/Sheared/Loading";
import SearchBar from "../../Components/Sheared/SearchBar";
import { useState } from "react";
import EmptyState from "../../Components/Sheared/EmptyState";

const BookingsApproval = () => {
  const { role } = useUserRole();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState();

  // Fetch pending bookings
  const {
    data: pendingBookings = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["pendingBookings", searchTerm],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`bookings/pending/all?search=${searchTerm}`);
      return data;
    },
    enabled: role === "admin", // Only fetch if admin
  });

  // Approve/Reject mutations
  const { mutate: updateBookingStatus } = useMutation({
    mutationFn: async ({ id, status, user }) => {
      await axiosSecure.patch(`bookings/${id}`, { status, user });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingBookings"]);
      toast.success("Booking status updated!");
    },
    onError: () => {
      toast.error("Failed to update booking");
    },
  });

  const handleApprove = (id, user) => {
    Swal.fire({
      title: "Approve Booking?",
      text: "This will confirm the booking and notify the user",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        updateBookingStatus({ id, status: "approved", user });
      }
    });
  };

  const handleReject = (id) => {
    Swal.fire({
      title: "Reject Booking?",
      text: "This will cancel the booking request",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        updateBookingStatus({ id, status: "rejected" });
      }
    });
  };

  return (
    <div className="w-11/12 lg:container mx-auto mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold mb-6">Pending Bookings Approval</h2>

      {/* search bar */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder={"Search Pending Bookings...."}
      ></SearchBar>
      </div>
      {isLoading ? (
        <Loading></Loading>
      ) : pendingBookings.length === 0 ? (
        <EmptyState
          title={
            searchTerm ? "No booking match your search" : "No pending Booking"
          }
          message={searchTerm? "No pending booking court or user match your search": "There is no pending booking"}
          iconType={searchTerm? "search" :""}
        />
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-content/5">
          <table className="table table-zebra table-sm md:table-md w-full rounded-2xl">
            <thead>
              <tr className="bg-gray-100">
                <th>#</th>
                <th className="px-4 py-2 text-left">Court</th>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Slots</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingBookings.map((booking, index) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td>{index + 1}</td>
                  <td className="px-4 py-3">{booking.courtName}</td>
                  <td className="px-4 py-3">{booking.user}</td>
                  <td className="px-4 py-3">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {booking.slots.map((slot, i) => (
                      <div key={i}>
                        {slot.startTime} - {slot.endTime}
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-3">${booking.totalCost}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleApprove(booking._id, booking.user)}
                      className="btn btn-sm btn-success text-white"
                      title="Approve"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => handleReject(booking._id)}
                      className="btn btn-sm btn-error text-white"
                      title="Reject"
                    >
                      <FaTimes />
                    </button>
                    <button
                      className="btn btn-sm btn-info text-white"
                      title="View Details"
                      onClick={() => {
                        // Implement view details modal
                        Swal.fire({
                          title: "Booking Details",
                          html: `
                            <div class="text-left">
                              <p><strong>Court:</strong> ${
                                booking.courtName
                              }</p>
                              <p><strong>User:</strong> ${booking.user}</p>
                              <p><strong>Date:</strong> ${new Date(
                                booking.bookingDate
                              ).toLocaleDateString()}</p>
                              <p><strong>Slots:</strong> ${booking.slots.map(
                                (s) =>
                                  `<span>${s.startTime} - ${s.endTime}</span>`
                              )}</p>
                              <p><strong>Price:</strong> $${
                                booking.totalCost
                              }</p>
                              <p><strong>Status:</strong> Pending</p>
                            </div>
                          `,
                          confirmButtonText: "Close",
                        });
                      }}
                    >
                      <FaEye />
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

export default BookingsApproval;
