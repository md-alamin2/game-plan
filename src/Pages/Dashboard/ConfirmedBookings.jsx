import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import Loading from "../../Components/Sheared/Loading";

const ConfirmedBookings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Fetch confirmed bookings
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["confirmedBookings"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `bookings/confirmed?user=${user.email}`
      );
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading></Loading>
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold">Confirmed Bookings</h2>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No confirmed bookings yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-content/5">
          <table className="table table-zebra table-sm md:table-md w-full rounded-2xl">
            <thead>
              <tr className="bg-gray-100">
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
                    <span className="badge badge-soft badge-primary">
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 ">
                    <button
                      onClick={()=>Swal.fire({
                        title: "Canceling policy",
                        text: `Hi ${user.displayName}, thanks for your booking! Our cancellation policy: 24 hours notice is required to avoid a 30% charge for late cancellations or no-shows. Call on : +1 (555) 123-4567  to cancel your booking. Thank you`,
                        icon: "question",
                      })}
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

export default ConfirmedBookings;
