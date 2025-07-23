import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaCopy, FaCheck } from 'react-icons/fa';

const CouponCard = ({ coupon }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    toast.success('Coupon code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative p-5 rounded-lg shadow-lg border-2 ${coupon.active ? 'border-primary' : 'border-gray-300 opacity-70'} bg-white transition-all hover:shadow-xl`}>
      {/* Ribbon for active coupons */}
      {coupon.active && (
        <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
          ACTIVE
        </div>
      )}

      {/* Coupon Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-800">{coupon.code}</h3>
        <button 
          onClick={handleCopy}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Copy coupon code"
        >
          {copied ? <FaCheck className="text-primary" /> : <FaCopy className="text-gray-500 cursor-pointer" />}
        </button>
      </div>

      {/* Coupon Details */}
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="text-3xl font-bold text-primary mr-2">
            {coupon.discountPercentage}%
          </span>
          <span className="text-gray-600">OFF</span>
        </div>

        <div className="text-sm text-gray-500">
          <p>Valid until: {new Date(coupon.expiryDate).toLocaleDateString()}</p>
          <p>Max uses: {coupon.maxUses}</p>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Copy code and apply at checkout
        </p>
      </div>
    </div>
  );
};

export default CouponCard;