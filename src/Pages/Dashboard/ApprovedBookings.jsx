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
import { useState } from "react";
import SearchBar from "../../Components/Sheared/SearchBar";
import EmptyState from "../../Components/Sheared/EmptyState";
import WrapContainer from "../../Components/AnimateCompnent/WrapContainer";
import WrapTr from "../../Components/AnimateCompnent/WrapTr";

const ApprovedBookings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch approved bookings
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["approvedBookings", user.email, searchTerm],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `bookings/approved?email=${user.email}&search=${searchTerm}`
      );
      return res.data;
    },
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

  const handlePayment = async (bookingId) => {
        navigate(`/dashboard/payment-page/${bookingId}`);
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

  return (
    <WrapContainer>
      <div className="w-11/12 lg:w-11/12 lg:container mx-auto my-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Approved Bookings</h2>
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder={"Search Approved Bookings...."}
        ></SearchBar>
      </div>

      {isLoading ? (
        <Loading></Loading>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12">
          <EmptyState
            title={
              searchTerm
                ? "No booking match your search"
                : "You have no pending Booking"
            }
            message={
              searchTerm
                ? "You haven't booked any Court By this name or type"
                : "No Approved Booking Available"
            }
            iconType={searchTerm ? "search" : "add"}
          />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-content/5">
          <table className="table table-zebra table-sm lg:table-md w-full rounded-2xl">
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
              {bookings?.map((booking, index) => (
                <WrapTr key={booking._id}>
                  <td>{index + 1}</td>
                  <td className="py-2 px-4">{booking.courtName}</td>
                  <td className="py-2 px-4 ">{booking.courtType}</td>
                  <td className="py-2 px-4 ">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 ">
                    {booking.slots.map((slot, i) => (
                      <div key={i}>
                        {slot.startTime}-{slot.endTime}
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
                    <div className="flex space-x-2 justify-center">
                      <button
                        onClick={() => handlePayment(booking._id)}
                        className="btn btn-primary btn-sm text-white"
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

export default ApprovedBookings;
