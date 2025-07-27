import React, { useState } from "react";
import BookingModal from "./BookingModal";
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useLocation } from "react-router";

const CourtCard = ({
  court,
  setEditingCourt,
  setIsModalOpen,
  handleDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const availableSlots = court.slots.filter((s) => s.available === true);
  const location = useLocation();
  console.log(location);

  return (
    <motion.div
      className="card h-full bg-base-100 shadow-md hover:shadow-xl transition duration-500"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.1 }}
    >
      <figure className="relative">
        <motion.img whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }} className="h-60 w-full" src={court.image} alt={court.name} />
        <span className="badge badge-secondary absolute top-2 left-2">
          {court.sportType}
        </span>
      </figure>

      <div className="card-body text-start">
        <div className="flex justify-between items-start">
          <h2 className="card-title">{court.name}</h2>
          <span className="text-xl font-bold">
            {`$${court.price}/${court.priceUnit}`}
          </span>
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
            {availableSlots
              .slice(0, court.displayedSlots || 3)
              .map((slot, i) => (
                <span key={i}>
                  {slot.available && (
                    <span className="badge badge-outline">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  )}
                </span>
              ))}
            {availableSlots.length > 3 && (
              <span className="badge badge-ghost">
                +{availableSlots.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className="card-actions">
          <button
            onClick={() => setIsOpen(true)}
            className="btn btn-primary w-full text-white"
          >
            Book Now
          </button>
          <BookingModal
            court={court}
            isOpen={isOpen}
            closeModal={() => setIsOpen(false)}
          />
        </div>
      </div>
      {location.pathname === "/dashboard/manage-courts" && (
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={() => {
              setEditingCourt(court);
              setIsModalOpen(true);
            }}
            className="btn btn-sm btn-circle btn-warning text-white"
            title="Edit court"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(court._id, court.name)}
            className="btn btn-sm btn-circle btn-error text-white"
            title="Delete court"
          >
            <FaTrash />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default CourtCard;
