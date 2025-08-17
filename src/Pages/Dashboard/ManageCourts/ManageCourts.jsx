import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import useUserRole from "../../../Hooks/useUserRole";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import CourtCard from "../../Courts/CourtCard";
import Loading from "../../../Components/Sheared/Loading";
import CourtModalForm from "./CourtsModalForm";
import EmptyState from "../../../Components/Sheared/EmptyState";
import SearchBar from "../../../Components/Sheared/SearchBar";

const ManageCourts = () => {
  const { role } = useUserRole();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);

  // Fetch all courts with search
  const { data: courts = [], isLoading } = useQuery({
    queryKey: ["courts", searchTerm],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`courts?search=${searchTerm}`);
      return data;
    },
    enabled: role === "admin",
  });

  // Delete court mutation
  const { mutate: deleteCourt } = useMutation({
    mutationFn: async (courtId) => {
      await axiosSecure.delete(`/courts/${courtId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["courts"]);
      toast.success("Court deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete court");
    },
  });

  const handleDelete = (courtId, courtName) => {
    Swal.fire({
      title: `Delete ${courtName}?`,
      text: "This will remove all related bookings!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCourt(courtId);
      }
    });
  };

  return (
    <div className="w-11/12 lg:w-11/12 lg:container mx-auto my-6">
      <title>Manage courts</title>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold">Manage Courts</h2>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* search bar */}
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder={"Search courts..."}
          ></SearchBar>

          <button
            onClick={() => {
              setEditingCourt(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary text-white flex items-center gap-2"
          >
            <FaPlus /> Add Court
          </button>
        </div>
      </div>

      {isLoading ? (
        <Loading></Loading>
      ) : courts.length === 0 ? (
        <EmptyState
          title={
            searchTerm ? "No courts match your search" : "No courts available"
          }
          message="You haven't created any Court By this name or type"
          iconType={searchTerm ? "search" : "add"}
          actionButton={
            <button
              onClick={() => {
                setEditingCourt(null);
                setIsModalOpen(true);
              }}
              className="btn btn-primary text-white flex items-center gap-2"
            >
              <FaPlus /> Add Court
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {courts.map((court) => (
            <div key={court._id} className="relative">
              <CourtCard court={court} handleDelete={handleDelete} setEditingCourt={setEditingCourt} setIsModalOpen={setIsModalOpen} />
            </div>
          ))}
        </div>
      )}

      {/* Court Modal using Headless UI */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black opacity-50" />
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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-base-100 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6"
                  >
                    {editingCourt ? "Edit Court" : "Add New Court"}
                  </Dialog.Title>

                  <CourtModalForm
                    court={editingCourt}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                      queryClient.invalidateQueries(["courts"]);
                      setIsModalOpen(false);
                    }}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ManageCourts;
