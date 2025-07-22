import React, { useState } from "react";
import BookingModal from "./BookingModal";

const CourtCard = ({ court }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="card h-full bg-base-100 shadow-md hover:shadow-xl hover:scale-102 transition hover:duration-500">
      <figure className="relative">
        <img className="h-60 w-full" src={court.image} alt={court.name} />
        <span className="badge badge-secondary absolute top-2 left-2">
          {court.sportType}
        </span>
      </figure>
      <div className="card-body text-start">
        <div className="flex justify-between items-start">
          <h2 className="card-title">{court.name}</h2>
           <span className="text-xl font-bold">{`$${court.price}/${court.priceUnit}`}</span>
        </div>
        <p>{court.description}</p>

        <div className="">
          <h3 className="font-semibold">Features:</h3>
          <ul className="list-disc pl-5">
            {court.features.map((f, i) => (
              <li key={i}>{typeof f === "string" ? f : f.name}</li>
            ))}
          </ul>
        </div>

        <div className="my-3">
          <h3 className="font-semibold">Available Today:</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {court.slots.slice(0, court.displayedSlots || 3).map((slot, i) => (
              <span key={i} className="badge badge-outline">
                {typeof slot === "string" ? slot : <span>{slot.startTime} - {slot.endTime}</span>}
              </span>
            ))}
            {court.slots.length > 3 && (
              <span className="badge badge-ghost">
                +{court.slots.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className="card-actions">
          <button onClick={() => setIsOpen(true)} className="btn btn-primary w-full text-white">
            Book Now
          </button>
          <BookingModal
            court={court}
            isOpen={isOpen}
            closeModal={() => setIsOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default CourtCard;