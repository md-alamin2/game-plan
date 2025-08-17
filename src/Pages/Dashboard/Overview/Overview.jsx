import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaChartLine,
  FaTrophy,
  FaTableTennis
} from 'react-icons/fa';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { motion } from 'framer-motion';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loading from '../../../Components/Sheared/Loading';
import useAuth from '../../../Hooks/useAuth';
import MembersDashboard from './MembersOverview';
import useUserRole from '../../../Hooks/useUserRole';

// Register Chart.js components
Chart.register(...registerables);

const Overview = () => {
  const axiosSecure = useAxiosSecure();
  const [timeRange, setTimeRange] = useState('week');
  const {user}= useAuth();
  const {role, roleLoading} = useUserRole()

  // Fetch dashboard stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats', timeRange],
    queryFn: async () => {
      const res = await axiosSecure.get(`/dashboard/stats?range=${timeRange}`);
      return res.data;
    },
    enabled: role === 'admin' && !roleLoading
  });

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Chart data
  const bookingTrendsData = {
    labels: stats?.trendLabels,
    datasets: [
      {
        label: 'Bookings',
        data: stats?.bookingTrends,
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
    ],
  };

  const courtPopularityData = {
    labels: stats?.courtPopularity?.labels,
    datasets: [
      {
        data: stats?.courtPopularity?.data,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(244, 63, 94, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (isLoading || roleLoading) {
    return (
      <Loading></Loading>
    );
  }

  return (
    <div>
      {role==="admin"?<div className="p-6 space-y-8">
      {/* Header and Time Range Selector */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
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

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3 }}
          className="card bg-base-100 shadow-md"
        >
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FaUsers className="text-2xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500">Total Members</h3>
                <p className="text-2xl font-bold">{stats?.totalMembers || 0}</p>
              </div>
            </div>
            <div className="mt-2 text-sm text-primary flex items-center">
              <FaChartLine className="mr-1" />
              <span>+{stats?.memberGrowth || 0}% from last period</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.1 }}
          className="card bg-base-100 shadow-md"
        >
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FaCalendarAlt className="text-2xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500">Total Bookings</h3>
                <p className="text-2xl font-bold">{stats?.totalBookings || 0}</p>
              </div>
            </div>
            <div className="mt-2 text-sm text-primary flex items-center">
              <FaChartLine className="mr-1" />
              <span>+{stats?.bookingGrowth || 0}% from last period</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.2 }}
          className="card bg-base-100 shadow-md"
        >
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-primary">
                <FaMoneyBillWave className="text-2xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500">Total Revenue</h3>
                <p className="text-2xl font-bold">${stats?.totalRevenue?.toLocaleString() || 0}</p>
              </div>
            </div>
            <div className="mt-2 text-sm text-primary flex items-center">
              <FaChartLine className="mr-1" />
              <span>+{stats?.revenueGrowth || 0}% from last period</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.3 }}
          className="card bg-base-100 shadow-md"
        >
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FaTrophy className="text-2xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500">Top Court</h3>
                <p className="text-2xl font-bold flex items-center">
                  <FaTableTennis className="mr-2" />
                  {stats?.topCourt || 'Tennis'}
                </p>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <span>{stats?.topCourtBookings || 0} bookings this period</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="card bg-base-100 shadow-md p-6"
        >
          <h3 className="text-xl font-bold mb-4">Booking Trends</h3>
          <Bar 
            data={bookingTrendsData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }} 
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card bg-base-100 shadow-md p-6"
        >
          <h3 className="text-xl font-bold mb-4">Court Popularity</h3>
          <div className="h-64 flex items-center justify-center">
            <Pie 
              data={courtPopularityData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                }
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>:<MembersDashboard />}
    </div>
  );
};

export default Overview;