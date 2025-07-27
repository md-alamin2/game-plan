import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useUserRole from "../../Hooks/useUserRole";
import Loading from "../../Components/Sheared/Loading";
import Swal from "sweetalert2";
import {
  FaSearch,
  FaBullhorn,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
  FaPlus,
  FaCross,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "../../Components/Sheared/SearchBar";

const Announcements = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const { role, roleLoading } = useUserRole();
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [addAnnouncement, setAddAnnouncement] = useState(false);

  // React Hook Form for new announcement
  const {
    register: registerNew,
    handleSubmit: handleNewSubmit,
    reset: resetNew,
    formState: { errors: newErrors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // React Hook Form for editing
  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    setValue: setEditValue,
    formState: { errors: editErrors },
  } = useForm();

  // Fetch announcements
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements", searchTerm],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        searchTerm ? `announcements?title=${searchTerm}` : "announcements"
      );
      return data;
    },
  });

  // Create announcement mutation
  const { mutate: createAnnouncement } = useMutation({
    mutationFn: async (data) => {
      const { data: response } = await axiosSecure.post("announcements", {
        title: data.title,
        description: data.description,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
      resetNew();
      Swal.fire({
        title: "Success",
        text: "Announcement posted successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: () => {
      toast.error("Failed to post announcement");
    },
  });

  // Update announcement mutation
  const { mutate: updateAnnouncement } = useMutation({
    mutationFn: async ({ id, data }) => {
      await axiosSecure.patch(`announcements/${id}`, {
        title: data.title,
        description: data.description,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
      setEditingId(null);
      Swal.fire({
        title: "Success",
        text: "Announcement updated successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    },
  });

  // Delete announcement mutation
  const { mutate: deleteAnnouncement } = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`announcements/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
      Swal.fire({
        title: "Deleted!",
        text: "Announcement has been deleted",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    },
  });

  const startEditing = (announcement) => {
    setEditingId(announcement._id);
    setEditValue("title", announcement.title);
    setEditValue("description", announcement.description || announcement.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    resetEdit();
  };

  if (roleLoading) return <Loading></Loading>;

  return (
    <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8">
      <title>Announcement</title>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8"
      >
        <div className="flex items-center">
          <FaBullhorn className="text-3xl text-blue-400 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">Announcements</h2>
        </div>

        
          <div className="flex flex-col lg:flex-row items-center gap-4">

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder={"Search announcements..."}
              />
            </motion.div>
            

            {role==="admin" && addAnnouncement?<motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-error"
              onClick={() => {
                setAddAnnouncement(false)
              }}
            >
              <FaTimes /> Cancel
            </motion.button>: role==="admin"&& <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary text-white"
              onClick={() => {
                setAddAnnouncement(true)
              }}
            >
              <FaPlus /> New Announcement
            </motion.button>}
          </div>
      </motion.div>

      {/* Create Form (for admins) */}
      {(role === "admin" && addAnnouncement) && (
        <motion.div
          id="new-announcement-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl shadow-lg border border-indigo-100"
        >
          <h3 className="text-xl font-semibold mb-4 text-blue-400 flex items-center">
            <FaBullhorn className="mr-2" /> Create New Announcement
          </h3>
          <form
            onSubmit={handleNewSubmit(createAnnouncement)}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title*
              </label>
              <input
                id="title"
                {...registerNew("title", { required: "Title is required" })}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  newErrors.title
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
                placeholder="Enter announcement title"
              />
              {newErrors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {newErrors.title.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description*
              </label>
              <textarea
                id="description"
                {...registerNew("description", {
                  required: "Description is required",
                })}
                rows={4}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  newErrors.description
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
                placeholder="Enter announcement details"
              />
              {newErrors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {newErrors.description.message}
                </p>
              )}
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn btn-primary text-white py-3 px-4 rounded-lg shadow-md transition-colors font-medium"
            >
              Post Announcement
            </motion.button>
          </form>
        </motion.div>
      )}

      {/* Announcements List */}
      {isLoading ? (
        <Loading />
      ) : announcements.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <FaSearch className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-600">
            {searchTerm ? "No matching announcements" : "No announcements yet"}
          </h3>
          <p className="text-gray-500 mt-2">
            {searchTerm
              ? "Try a different search term"
              : "Check back later or create one"}
          </p>
        </motion.div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {announcements.map((announcement) => (
              <motion.li
                key={announcement._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                {editingId === announcement._id ? (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleEditSubmit((data) =>
                      updateAnnouncement({ id: announcement._id, data })
                    )}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title*
                        </label>
                        <input
                          {...registerEdit("title", {
                            required: "Title is required",
                          })}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                            editErrors.title
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-indigo-500"
                          }`}
                        />
                        {editErrors.title && (
                          <p className="mt-1 text-sm text-red-600">
                            {editErrors.title.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description*
                        </label>
                        <textarea
                          {...registerEdit("description", {
                            required: "Description is required",
                          })}
                          rows={4}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                            editErrors.description
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-indigo-500"
                          }`}
                        />
                        {editErrors.description && (
                          <p className="mt-1 text-sm text-red-600">
                            {editErrors.description.message}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="btn btn-primary text-white"
                        >
                          <FaCheck /> Save
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={cancelEditing}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="btn btn-secondary text-white"
                        >
                          <FaTimes /> Cancel
                        </motion.button>
                      </div>
                    </div>
                  </motion.form>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        {announcement.title}
                      </h3>
                      {role === "admin" && (
                        <div className="flex items-center gap-2">
                          <motion.button
                            onClick={() => startEditing(announcement)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-warning cursor-pointer"
                            title="Edit"
                          >
                            <FaEdit />
                          </motion.button>
                          <motion.button
                            onClick={() =>
                              Swal.fire({
                                title: "Delete Announcement?",
                                text: "This action cannot be undone",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#d33",
                                cancelButtonColor: "#3085d6",
                                confirmButtonText: "Delete",
                                cancelButtonText: "Cancel",
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  deleteAnnouncement(announcement._id);
                                }
                              })
                            }
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-red-500 cursor-pointer"
                            title="Delete"
                          >
                            <FaTrash />
                          </motion.button>
                        </div>
                      )}
                    </div>
                    <p className="whitespace-pre-wrap text-gray-700 mb-4">
                      {announcement.description || announcement.text}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        Posted on:{" "}
                        {new Date(announcement.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
};

export default Announcements;
