import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useUserRole from '../../Hooks/useUserRole';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const BookingsApproval = () => {
  const { role } = useUserRole();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch pending bookings
  const { data: pendingBookings = [], isLoading, refetch } = useQuery({
    queryKey: ['pendingBookings'],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`bookings/pending?role=${role}`);
      return data;
    },
    enabled: role === 'admin' // Only fetch if admin
  });

  // Approve/Reject mutations
  const { mutate: updateBookingStatus } = useMutation({
    mutationFn: async ({ id, status, user }) => {
      await axiosSecure.patch(`bookings/${id}`, { status, user });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingBookings']);
      toast.success('Booking status updated!');
    },
    onError: () => {
      toast.error('Failed to update booking');
    }
  });

  const handleApprove = (id, user) => {
    Swal.fire({
      title: 'Approve Booking?',
      text: 'This will confirm the booking and notify the user',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        updateBookingStatus({ id, status: 'approved', user });
      }
    });
  };

  const handleReject = (id,) => {
    Swal.fire({
      title: 'Reject Booking?',
      text: 'This will cancel the booking request',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reject!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        updateBookingStatus({ id, status: 'rejected' });
      }
    });
  };

  if (role !== 'admin') {
    return <div className="text-center py-10">Admin access required</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Pending Bookings Approval</h2>
      
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : pendingBookings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No pending bookings</div>
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
                  <td>{index+1}</td>
                  <td className="px-4 py-3">{booking.courtName}</td>
                  <td className="px-4 py-3">{booking.user}</td>
                  <td className="px-4 py-3">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{booking.slots.join(', ')}</td>
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
                          title: 'Booking Details',
                          html: `
                            <div class="text-left">
                              <p><strong>Court:</strong> ${booking.courtName}</p>
                              <p><strong>User:</strong> ${booking.user}</p>
                              <p><strong>Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
                              <p><strong>Slots:</strong> ${booking.slots.join(', ')}</p>
                              <p><strong>Price:</strong> $${booking.totalCost}</p>
                              <p><strong>Status:</strong> Pending</p>
                            </div>
                          `,
                          confirmButtonText: 'Close'
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