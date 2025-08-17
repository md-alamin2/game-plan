import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useUserRole from "../../Hooks/useUserRole";
import {
  FaSearch,
  FaTrash,
  FaUser,
  FaUserShield,
  FaUserTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Loading from "../../Components/Sheared/Loading";
import SearchBar from "../../Components/Sheared/SearchBar";
import EmptyState from "../../Components/Sheared/EmptyState";
import WrapContainer from "../../Components/AnimateCompnent/WrapContainer";
import WrapTr from "../../Components/AnimateCompnent/WrapTr";

const AllUsers = () => {
  const { role } = useUserRole();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Fetch all users with search and filter
  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users", searchTerm, filterRole],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `users?search=${searchTerm}&role=${filterRole}`
      );
      return data;
    },
    enabled: role === "admin",
  });

  // Delete user mutation
  const { mutate: deleteUser, isPending: deleteLoading } = useMutation({
    mutationFn: async (userEmail) => {
      await axiosSecure.delete(`users?email=${userEmail}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete user");
    },
  });

  // Update user role mutation
  const { mutate: updateUserRole, isPending } = useMutation({
    mutationFn: async ({ userEmail, newRole }) => {
      await axiosSecure.patch(`anyUser/role?email=${userEmail}`, {
        role: newRole,
      });
    },
    onSuccess: () => {
      refetch();
      toast.success("User role updated");
    },
  });

  const handleDelete = (userEmail, name) => {
    Swal.fire({
      title: `Delete ${name}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(userEmail);
      }
    });
  };

  const handleRoleChange = (userEmail, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    Swal.fire({
      title: `Change to ${newRole}?`,
      text: `This will ${
        newRole === "admin" ? "grant" : "revoke"
      } admin privileges`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, make ${newRole}`,
    }).then((result) => {
      if (result.isConfirmed) {
        updateUserRole({ userEmail, newRole });
      }
    });
  };

  return (
    <WrapContainer>
      <title>All Users</title>
      <div className="w-11/12 lg:w-11/12 lg:container mx-auto my-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold">Manage All Users</h2>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* search bar */}
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder={"Search by name or email...."}
          ></SearchBar>

          {/* filter by role */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Users</option>
            <option value="admin">Admins</option>
            <option value="member">Members</option>
          </select>
        </div>
      </div>

      {isLoading || isPending || deleteLoading ? (
        <Loading></Loading>
      ) : users.length === 0 ? (
        <EmptyState
          title={
            searchTerm ? "No user match your search" : "No user found"
          }
          iconType={searchTerm? "search" :""}
        />
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-content/5">
          <table className="table table-zebra table-sm md:table-md w-full rounded-2xl">
            <thead>
              <tr className="text-center">
                <th className="text-left">User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <WrapTr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.image || "/default-user.png"}
                          alt={user.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">
                          {user.name}
                        </div>
                        <div className="text-sm">
                          {user.role === "member"
                            ? "Member"
                            : user.role === "admin"
                            ? "Admin"
                            : "Non-member"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`${
                        user.role === "admin"
                          ? "badge badge-primary badge-soft"
                          : "badge badge-secondary badge-soft"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center gap-2">
                    <button
                      onClick={() => handleRoleChange(user.email, user.role)}
                      className={`flex items-center gap-1 ${
                        user.role === "admin"
                          ? "btn btn-error"
                          : "btn btn-primary text-white"
                      }`}
                      title={
                        user.role === "admin" ? "Remove admin" : "Make admin"
                      }
                    >
                      {user.role === "admin" ? (
                        <FaUserTimes />
                      ) : (
                        <FaUserShield />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(user.email, user.name)}
                      className="btn btn-error flex items-center gap-1"
                      title="Delete user"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </WrapTr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </WrapContainer>
  );
};

export default AllUsers;
