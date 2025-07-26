import CouponCard from "../../Components/Sheared/CouponCard";
import Loading from "../../Components/Sheared/Loading";
import useAxios from "../../Hooks/useAxios";
import { useQuery } from '@tanstack/react-query';

const ExclusiveOffers = () => {
  const axiosInstance = useAxios()

  // Fetch coupons
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const res = await axiosInstance.get('/coupons');
      return res.data;
    },
  });

  isLoading && <Loading></Loading>

  return (
    <div className="my-18 md:my-40 bg-base-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Exclusive Offers
          </h1>
          <p className="text-xl text-gray-600">
            Save more with our special promotion codes
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coupons.map((coupon) => (
            <CouponCard
              key={coupon._id}
              coupon={coupon}
            ></CouponCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExclusiveOffers;
