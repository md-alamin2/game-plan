import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useUserRole from "../../Hooks/useUserRole";
import { FaSearch, FaTrash, FaUserCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Loading from "../../Components/Sheared/Loading";
// import useAuth from "../../Hooks/useAuth";

const ManageMembers = () => {
  const { role } = useUserRole();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch approved members (users with approved bookings)
  const { data: members = [], isLoading } = useQuery({
    queryKey: ["members", searchTerm],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        searchTerm ? `members?search=${searchTerm}` : "members"
      );
      return data;
    },
    enabled: role === "admin",
  });

  // Delete member mutation
  const { mutate: deleteMember } = useMutation({
    mutationFn: async (userEmail) => {
      await axiosSecure.delete(`members?email=${userEmail}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["members"]);
      toast.success("Member removed successfully");
    //   setLoading(false);
    },
    onError: () => {
      toast.error("Failed to remove member");
    },
  });

  const handleDelete = (userEmail, name) => {
    Swal.fire({
      title: `Remove ${name}?`,
      text: "This will revoke their member status!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMember(userEmail)
      }
    });
  };

  if (role !== "admin") {
    return <div className="text-center py-10">Admin access required</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaUserCheck className="text-blue-500" />
          Manage Members
        </h2>
        <div className="relative mt-4 md:mt-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <Loading></Loading>
      ) : members.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? "No members match your search" : "No members found"}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member Since
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={member.image || "/default-user.png"}
                          alt={member.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(member.member_since).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDelete(member.email, member.name)}
                      className="btn btn-error flex items-center gap-1"
                    >
                      <FaTrash /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageMembers;
