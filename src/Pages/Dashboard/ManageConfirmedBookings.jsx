import { useState } from 'react';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { FaSearch, FaCheckCircle, FaCalendarAlt, FaClock, FaDollarSign } from 'react-icons/fa';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useUserRole from '../../Hooks/useUserRole';
import { toast } from 'react-toastify';
import Loading from '../../Components/Sheared/Loading';

const ManageConfirmedBookings = () => {
  const axiosSecure = useAxiosSecure();
  const {role, roleLoading}= useUserRole();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch confirmed bookings with search filter
  const { 
    data: bookings = [], 
    isLoading, 
  } = useQuery({
    queryKey: ['confirmedBookings', searchTerm],
    queryFn: async () => {
      const res = await axiosSecure.get(`bookings/confirmed?search=${searchTerm}`);
      return res.data
    },
    enabled: role === "admin"
  });

  // Cancel booking mutation
  const { mutate: cancelBooking } = useMutation({
    mutationFn: async (bookingId) => {
      await axiosSecure.delete(`bookings/${bookingId}`);
    },
    onSuccess: () => {
      QueryClient.invalidateQueries(["confirmedBookings", searchTerm]);
      toast.success("Booking cancelled successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    },
  });

  if (roleLoading) {
    return <Loading></Loading>
  }

  if (role !== "admin") {
    return <div className="text-center py-10">Admin access required</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Confirmed Bookings</h2>
        
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by court or user..."
            className="input input-bordered pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {isLoading?<Loading></Loading>:bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">
            {searchTerm ? 'No matching bookings found' : 'No confirmed bookings yet'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-content/5">
                  <table className="table table-zebra table-sm md:table-md w-full rounded-2xl">
                    <thead>
                      <tr className="bg-gray-100">
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
                        <tr key={booking._id} className="hover:bg-gray-50">
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
                              onClick={()=>cancelBooking(booking._id)}
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

export default ManageConfirmedBookings;