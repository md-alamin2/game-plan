import { useQuery } from '@tanstack/react-query';
import { 
  FaCalendarAlt, 
  FaHistory,
  FaBook,
  FaChartLine,
  FaUserClock,
  FaMoneyBillWave
} from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { motion } from 'framer-motion';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useState } from 'react';
import Loading from '../../../Components/Sheared/Loading';
import useAuth from '../../../Hooks/useAuth';
import UpcomingBookings from './UpcommingBookings';

// Register Chart.js
Chart.register(...registerables);

const MemberDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const [timeRange, setTimeRange] = useState('month');
    const { user } = useAuth();

  // Fetch member-specific stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['memberStats', timeRange],
    queryFn: async () => {
      const res = await axiosSecure.get(`/member/dashboard?email=${user.email}`, { 
        params: { range: timeRange } 
      });
      return res.data;
    }
  });
  console.log(stats)

  // Activity chart data
  const activityData = {
    labels: stats?.activityLabels,
    datasets: [
      {
        label: 'Court Bookings',
        data: stats?.bookingActivity,
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
    ],
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <select 
          className="select select-bordered"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Member Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-white shadow-md"
        >
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FaCalendarAlt className="text-2xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500">Upcoming Bookings</h3>
                <p className="text-2xl font-bold">{stats?.upcomingBookings || 0}</p>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Next: {stats?.nextBookingDate || 'No bookings'}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-white shadow-md"
        >
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FaHistory className="text-2xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500">Total Bookings</h3>
                <p className="text-2xl font-bold">{stats?.totalBookings || 0}</p>
              </div>
            </div>
            <div className="mt-2 text-sm text-green-600 flex items-center">
              <FaChartLine className="mr-1" />
              <span>+{stats?.bookingGrowth || 0}% from last period</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-white shadow-md"
        >
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FaUserClock className="text-2xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500">Favorite Court</h3>
                <p className="text-2xl font-bold">{stats?.favoriteCourt || 'None'}</p>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {stats?.favoriteCourtBookings || 0} bookings
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts and Upcoming Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card bg-white shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">My Activity</h3>
          <Bar 
            data={activityData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1
                  }
                }
              }
            }}
          />
        </div>

        <div className="space-y-6">
          <div className="card bg-white shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Upcoming Bookings</h3>
            <UpcomingBookings bookings={stats?.recentBookings || []} />
          </div>

          <div className="card bg-white shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Membership Status</h3>
              <span className="badge badge-success">Active</span>
            </div>
            <div className="space-y-2">
              <p>
                <FaBook className="inline mr-2" />
                <strong>Member since:</strong> {new Date(stats?.memberSince).toDateString()}
              </p>
              <p>
                <FaMoneyBillWave className="inline mr-2" />
                <strong>Total spent:</strong> ${stats?.totalSpent?.toFixed(2) || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;