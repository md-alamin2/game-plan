import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useUserRole from "../../Hooks/useUserRole";
import Loading from "../../Components/Sheared/Loading";
import Swal from "sweetalert2";

const Announcements = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const { role, roleLoading } = useUserRole();
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
        searchTerm
          ? `announcements/search?title=${searchTerm}`
          : "announcements"
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
        text: "Announcement update successfully",
        icon: "success",
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
        text: "This announcement has been deleted",
        icon: "success",
      });
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
  };

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
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6">Announcements</h2>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search announcements by title..."
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="btn btn-secondary"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Create Form (for admins) */}
      {role === "admin" && (
        <form
          onSubmit={handleNewSubmit(createAnnouncement)}
          className="mb-8 bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-xl font-semibold mb-4">
            Create New Announcement
          </h3>
          <div className="space-y-4">
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
                className={`w-full p-2 border rounded focus:outline-none ${
                  newErrors.title
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-primary"
                }`}
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
                className={`w-full p-2 border rounded focus:outline-none ${
                  newErrors.description
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
              />
              {newErrors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {newErrors.description.message}
                </p>
              )}
            </div>
            <button type="submit" className="btn btn-primary text-white">
              Post Announcement
            </button>
          </div>
        </form>
      )}

      {/* Announcements List */}
      {isLoading ? (
        <Loading></Loading>
      ) : announcements.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm
            ? "No announcements match your search"
            : "No announcements yet"}
        </div>
      ) : (
        <ul className="space-y-6">
          {announcements.map((announcement) => (
            <li
              key={announcement._id}
              className="bg-white p-6 rounded-lg shadow-sm border"
            >
              {editingId === announcement._id ? (
                <form
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
                        className={`w-full p-2 border rounded ${
                          editErrors.title
                            ? "border-red-500 focus:ring-red-500"
                            : "focus:ring-blue-500"
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
                        className={`w-full p-2 border rounded ${
                          editErrors.description
                            ? "border-red-500 focus:ring-red-500"
                            : "focus:ring-blue-500"
                        }`}
                      />
                      {editErrors.description && (
                        <p className="mt-1 text-sm text-red-600">
                          {editErrors.description.message}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary text-white"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="btn btn-secondary text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {announcement.title}
                  </h3>
                  <p className="whitespace-pre-wrap text-gray-700 mb-3">
                    {announcement.description || announcement.text}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      Posted on:{" "}
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </p>
                    {role === "admin" && (
                      <div className="space-x-2">
                        <button
                          onClick={() => startEditing(announcement)}
                          className="btn btn-primary text-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            Swal.fire({
                              title: "Are you sure?",
                              text: "You won't be able to revert this!",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#3085d6",
                              cancelButtonColor: "#d33",
                              confirmButtonText: "Yes, delete it!",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                deleteAnnouncement(announcement._id);
                              }
                            })
                          }
                          className="btn btn-error"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Announcements;
