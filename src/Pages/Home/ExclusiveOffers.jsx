import CouponCard from "../../Components/Sheared/CouponCard";
import Loading from "../../Components/Sheared/Loading";
import useAxios from "../../Hooks/useAxios";
import { useQuery } from '@tanstack/react-query';
import { motion } from "framer-motion";

const ExclusiveOffers = () => {
  const axiosInstance = useAxios();

  // Fetch coupons
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const res = await axiosInstance.get('/coupons');
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  return (
    <motion.div
      className="my-18 md:my-40 bg-base-100"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Exclusive Offers
          </h1>
          <p className="text-xl text-gray-600">
            Save more with our special promotion codes
          </p>
        </motion.div>

        {/* Offers Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {coupons.map((coupon) => (
            <motion.div
              key={coupon._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <CouponCard coupon={coupon} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ExclusiveOffers;
