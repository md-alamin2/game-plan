import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import useAuth from "../../Hooks/useAuth";
import PrivateRoutes from "../../Routes/PrivateRoute";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const BookingModal = ({ court, isOpen, closeModal }) => {
  const availableSlots = court.slots.filter(s=>s.available ===true);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [dateError, setDateError] = useState(false)

  // Calculate total cost
  const totalCost = selectedSlots.length * court.price;

  const toggleSlot = (slot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const HandleBookingSlot = async () => {
    if(new Date(selectedDate)< new Date()){
      return setDateError(true)
    }
    setDateError(false)
    // Handle booking submission
    const bookingData = {
      courtId: court._id,
      courtName: court.name,
      courtType: court.sportType,
      user: user?.email,
      bookingDate: new Date(selectedDate),
      booking_at:new Date(),
      slots: selectedSlots,
      totalCost,
      status: "pending",
    };
    const res = await axiosSecure.post("bookings", bookingData);
    if (res.data.insertedId) {
      Swal.fire({
        title: "Request submitted successfully!",
        text: "Your booking request will be reviewed by the admin. Please wait for confirmation.",
        icon: "success",
      });
      closeModal();
      navigate("/dashboard/pending-bookings");
      setSelectedDate("");
      setSelectedSlots([]);
    } else {
      toast.error(`Something went wrong`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Book {court.name}
                </Dialog.Title>

                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Court Type
                      </label>
                      <div className="mt-1 p-2 border rounded">
                        {court.sportType}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Price per Hour
                      </label>
                      <div className="mt-1 p-2 border rounded">
                        ${court.price}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                    />

                  </div>
                    {dateError && <p className="text-red-500">Date should be any future date</p>}

                   <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Available Time Slots
                    </label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => toggleSlot(slot)}
                          className={`btn text-sm ${
                            selectedSlots.some(s => 
                              s.startTime === slot.startTime && 
                              s.endTime === slot.endTime
                            )
                              ? "btn-primary text-white"
                              : " text-gray-800 hover:bg-gray-200"
                          }`}
                          disabled={!slot.available}
                        >
                          {slot.startTime}-{slot.endTime}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-lg font-medium">
                      Total Cost:{" "}
                      <span className="font-bold">${totalCost}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Select multiple slots to calculate total
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    className="btn btn-secondary text-white cursor-pointer"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <PrivateRoutes>
                    <button
                      type="button"
                      className="btn btn-primary text-white cursor-pointer"
                      onClick={HandleBookingSlot}
                      disabled={!selectedDate || selectedSlots.length === 0}
                    >
                      Submit Request
                    </button>
                  </PrivateRoutes>
                </div>

                <p className="mt-4 text-sm text-gray-500">
                  Your booking request will be sent to admin for approval
                </p>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BookingModal;
