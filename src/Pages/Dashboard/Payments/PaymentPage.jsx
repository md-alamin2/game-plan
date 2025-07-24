import { useParams } from 'react-router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement} from '@stripe/react-stripe-js';
// import { toast } from 'react-toastify';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import PaymentForm from './PaymentForm';
import { useQuery } from '@tanstack/react-query';
import useUserRole from '../../../Hooks/useUserRole';
import Loading from '../../../Components/Sheared/Loading';

// Load Stripe outside component to avoid recreating
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentPage = () => {
  const axiosSecure = useAxiosSecure();
  const {role} = useUserRole();
  // const [loading, setLoading] = useState(false)
  // const [clientSecret, setClientSecret] = useState('');
  const {bookingId} = useParams();

  const {data: booking={}, isPending} = useQuery({
    queryKey:["booking", bookingId],
    queryFn: async()=>{
      const res = await axiosSecure.get(`booking/${bookingId}`);
      return res.data
    },
    enabled: role==="member"
  })


  if (isPending ) {
    return <Loading></Loading>
  }

  if (!booking) {
    return (
      <div className="alert alert-error">
        Failed to load payment information. Please try again.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Complete Your Payment</h2>
      
      <Elements stripe={stripePromise}>
        <PaymentForm booking={booking} />
      </Elements>
    </div>
  );
};

export default PaymentPage;