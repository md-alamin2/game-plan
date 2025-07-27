import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import Loading from "../../Components/Sheared/Loading";
import { useState } from "react";
import SearchBar from "../../Components/Sheared/SearchBar";
import EmptyState from "../../Components/Sheared/EmptyState";
import WrapContainer from "../../Components/AnimateCompnent/WrapContainer";
import WrapTr from "../../Components/AnimateCompnent/WrapTr";

const ConfirmedBookings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch confirmed bookings
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["confirmedBookings", user.email, searchTerm],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `bookings/confirmed?email=${user.email}&search=${searchTerm}`
      );
      return res.data;
    },
  });

  return (
    <WrapContainer>
      <title>Confirmed Bookings</title>
      <div className="w-11/12 lg:w-11/12 lg:container mx-auto my-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Confirmed Bookings</h2>
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder={"Search Confirmed Bookings...."}
          ></SearchBar>
        </div>

        {isLoading ? (
          <Loading></Loading>
        ) : bookings.length === 0 ? (
          <EmptyState
            title={
              searchTerm
                ? "No booking match your search"
                : "You have no Confirmed Booking"
            }
            message={
              searchTerm
                ? "You haven't booked any Court By this name or type"
                : "No Confirmed Booking Available"
            }
            iconType={searchTerm ? "search" : "add"}
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
                  <th>Action</th>
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
                      <span className="badge badge-soft badge-primary">
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 ">
                      <button
                        onClick={() =>
                          Swal.fire({
                            title: "Canceling policy",
                            text: `Hi ${user.displayName}, thanks for your booking! Our cancellation policy: 24 hours notice is required to avoid a 30% charge for late cancellations or no-shows. Call on : +1 (555) 123-4567  to cancel your booking. Thank you`,
                            icon: "question",
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

export default ConfirmedBookings;
