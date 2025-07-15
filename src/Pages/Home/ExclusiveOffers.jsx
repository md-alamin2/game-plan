import ExclusiveOfferCard from "../../Components/Sheared/ExclusiveOfferCard";

const ExclusiveOffers = () => {
  // todo: fetch offers from API
  const offers = [
    {
      id: 1,
      title: "New Member Special",
      discount: "20%",
      description: "Get 20% off your first month membership",
      code: "WELCOME20",
      icon: "🎉",
    },
    {
      id: 2,
      title: "Summer Season Pass",
      discount: "15%",
      description: "15% off summer court bookings",
      code: "SUMMER15",
      icon: "☀️",
    },
    {
      id: 3,
      title: "Refer a Friend",
      discount: "10%",
      description: "10% off when you bring a friend",
      code: "FRIEND10",
      icon: "👫",
    },
  ];

  return (
    <div className="py-16 bg-base-100">
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
          {offers.map((offer) => (
            <ExclusiveOfferCard
              key={offer.id}
              offer={offer}
            ></ExclusiveOfferCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExclusiveOffers;
