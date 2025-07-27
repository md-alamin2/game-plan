import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaSearch } from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useUserRole from "../../Hooks/useUserRole";
import { toast } from "react-toastify";
import Loading from "../../Components/Sheared/Loading";
import Swal from "sweetalert2";
import SearchBar from "../../Components/Sheared/SearchBar";
import EmptyState from "../../Components/Sheared/EmptyState";
import WrapContainer from "../../Components/AnimateCompnent/WrapContainer";
import WrapTr from "../../Components/AnimateCompnent/WrapTr";

const ManageConfirmedBookings = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { role, roleLoading } = useUserRole();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch confirmed bookings with search filter
  const {
    data: bookings = [],
    isLoading,
  } = useQuery({
    queryKey: ["confirmedBookings", searchTerm],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `bookings/confirmed/all?search=${searchTerm}`
      );
      return res.data;
    },
    enabled: role === "admin",
  });

  // Cancel booking mutation
  const { mutate: cancelBooking } = useMutation({
    mutationFn: async (booking) => {
      await axiosSecure.delete(`manage/booking/${booking.bookingId}`, {
        data: booking,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["confirmedBookings", searchTerm]);
      Swal.fire({
        title: "Canceled!",
        text: "The booking has been canceled",
        icon: "success",
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    },
  });

  const handleCancelBooking = async (bookingId, courtId, slots) => {
    const booking = {
      bookingId,
      courtId,
      slots,
    };
    cancelBooking(booking);
  };

  if (roleLoading) {
    return <Loading></Loading>;
  }

  return (
    <WrapContainer>
      <title>Manage Bookings</title>
      <div className="w-11/12 lg:w-11/12 lg:container mx-auto my-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Bookings</h2>

        {/* search bar */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder={"Search by court or user..."}
        ></SearchBar>
      </div>

      {isLoading ? (
        <Loading></Loading>
      ) : bookings.length === 0 ? (
        <EmptyState
          title={
            searchTerm ? "No matching bookings found" : "No confirmed bookings yet"
          }
          message={searchTerm? "No confirmed booking court match your search": "There is no Confirmed booking"}
          iconType={searchTerm? "search" :""}
        />
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-content/5">
          <table className="table table-zebra table-sm md:table-md w-full rounded-2xl">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th>#</th>
                <th>Court</th>
                <th>Type</th>
                <th>User</th>
                <th>Date</th>
                <th>Slots</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings?.map((booking, index) => (
                <WrapTr key={booking._id}>
                  <td>{index + 1}</td>
                  <td className="py-2 px-4">{booking.courtName}</td>
                  <td className="py-2 px-4 ">{booking.courtType}</td>
                  <td className="py-2 px-4 ">{booking.user}</td>
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
                    <span className="badge badge-soft badge-primary">
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 ">
                    <button
                      onClick={() =>
                        Swal.fire({
                          title: "Are you sure?",
                          text: "You won't be able to revert this!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#3085d6",
                          cancelButtonColor: "#d33",
                          confirmButtonText: "Yes, Cancel it!",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            handleCancelBooking(
                              booking._id,
                              booking.courtId,
                              booking.slots
                            );
                          }
                        })
                      }
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

export default ManageConfirmedBookings;
