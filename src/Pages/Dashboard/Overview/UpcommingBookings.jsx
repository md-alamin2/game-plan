import { FaClock, FaCalendarAlt, FaCheckCircle, FaBaseballBall } from 'react-icons/fa';
import { motion } from 'framer-motion';

const UpcomingBookings = ({ bookings }) => {
  // Format booking data for display
  const formatBooking = (booking) => ({
    id: booking._id,
    court: booking.courtName || booking.courtType || 'Unknown Court',
    date: new Date(booking.booking_at).toLocaleDateString(),
    time: `${booking?.slots[0]?.startTime} - ${booking?.slots[0].endTime}`,
    status: booking.status || 'confirmed'
  });

  const upcomingBookings = bookings.map(formatBooking);

  if (upcomingBookings.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="inline-block p-4 bg-gray-100 rounded-full mb-3">
          <FaCalendarAlt className="text-gray-400 text-2xl" />
        </div>
        <h4 className="font-medium text-gray-500">No upcoming bookings</h4>
        <p className="text-sm text-gray-400 mt-1">
          Book a court to see it appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {upcomingBookings.map((booking, index) => (
        <motion.div
          key={booking.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start p-4 border rounded-lg transition-colors"
        >
          <div className="flex-shrink-0 p-3 bg-blue-100 text-primary rounded-lg mr-4 hidden md:block">
            <FaBaseballBall className="text-xl" />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold">{booking.court}</h4>
              <span className={`text-xs px-2 py-1 rounded-full ${
                booking.status === 'confirmed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {booking.status}
              </span>
            </div>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <FaClock className="mr-2 text-gray-400" />
              <span>{booking.time}</span>
            </div>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <FaCalendarAlt className="mr-2 text-gray-400" />
              <span>{booking.date}</span>
            </div>
          </div>
          {booking.status === 'confirmed' && (
            <div className="ml-4 text-green-500">
              <FaCheckCircle className="text-xl" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default UpcomingBookings;