import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useUserRole from "../../Hooks/useUserRole";
import { FaSearch, FaTrash, FaUserCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Loading from "../../Components/Sheared/Loading";
import SearchBar from "../../Components/Sheared/SearchBar";
import EmptyState from "../../Components/Sheared/EmptyState";
import WrapContainer from "../../Components/AnimateCompnent/WrapContainer";
import WrapTr from "../../Components/AnimateCompnent/WrapTr";
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
      await axiosSecure.delete(`users?email=${userEmail}`);
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
        deleteMember(userEmail);
      }
    });
  };

  return (
    <WrapContainer>
      <title>Manage Members</title>
      <div className="w-11/12 lg:w-11/12 lg:container mx-auto my-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          Manage Members
        </h2>
        {/* search bar */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder={"Search by name or email...."}
        ></SearchBar>
      </div>

      {isLoading ? (
        <Loading></Loading>
      ) : members.length === 0 ? (
        <EmptyState
          title={
            searchTerm ? "No member match your search" : "No member found"
          }
          iconType={searchTerm? "search" :""}
        />
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-content/5">
          <table className="table table-zebra table-sm lg:table-md w-full rounded-2xl">
            <thead>
              <tr className="bg-base-200 text-center">
                <th>
                  Name
                </th>
                <th>
                  Email
                </th>
                <th>
                  Member Since
                </th>
                <th>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <WrapTr key={member._id}>
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
                        <div className="text-sm font-medium">
                          {member.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {member.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(member.member_since).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center">
                    <button
                      onClick={() => handleDelete(member.email, member.name)}
                      className="btn btn-error flex items-center gap-1"
                    >
                      <FaTrash /> Remove
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

export default ManageMembers;
