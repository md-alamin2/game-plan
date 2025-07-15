import React from "react";

const ExclusiveOfferCard = ({ offer }) => {
  return (
    <div className="card bg-base-200 hover:shadow-xl transition-shadow duration-300">
      <div className="card-body">
        <div className="flex items-center justify-between  mb-6">
          <div className="text-4xl">{offer.icon}</div>
          {/* Discount Badge */}
          <div className="badge badge-primary">{offer.discount}</div>
        </div>

        {/* Offer Content */}
        <div className="flex flex-col h-full">
          <h2 className="text-2xl font-bold">{offer.title}</h2>
          <p className="text-gray-600 mb-6">{offer.description}</p>

          {/* Coupon Code */}
          <div className="mt-auto">
            <div className="mb-2 space-y-2">
              <p className="text-sm text-center">Coupon Code</p>
              <div className="text-lg font-bold text-center p-2 border-2 border-dashed border-gray-400 rounded">
                {offer.code}
              </div>
            </div>
            <button className="btn btn-primary w-full">Use Code</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExclusiveOfferCard;
