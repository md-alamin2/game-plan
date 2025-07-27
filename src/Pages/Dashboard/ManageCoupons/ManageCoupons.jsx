import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useUserRole from "../../../Hooks/useUserRole";
import { useForm } from "react-hook-form";
import { FaPlus, FaSearch } from "react-icons/fa";
import Loading from "../../../Components/Sheared/Loading";
import SearchBar from "../../../Components/Sheared/SearchBar";
import EmptyState from "../../../Components/Sheared/EmptyState";
import WrapContainer from "../../../Components/AnimateCompnent/WrapContainer";
import WrapItem from "../../../Components/AnimateCompnent/WrapItem";
import WrapTr from "../../../Components/AnimateCompnent/WrapTr";

const ManageCoupons = () => {
  const axiosSecure = useAxiosSecure();
  const { role, roleLoading } = useUserRole();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      code: "",
      discountPercentage: 0,
      expiryDate: "",
      maxUses: 1,
      active: true,
    },
  });

  // Fetch coupons
  const {
    data: coupons = [],
    isLoading,
  } = useQuery({
    queryKey: ["coupons", searchTerm],
    queryFn: async () => {
      const res = await axiosSecure.get(`coupons/all?search=${searchTerm}`);
      return res.data;
    },
    enabled: role === "admin",
  });

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  // Mutation for adding/updating coupon
  const { mutate: couponMutation } = useMutation({
    mutationFn: async (couponData) => {
      return editingCoupon
        ? axiosSecure.patch(`coupons/${editingCoupon._id}`, couponData)
        : axiosSecure.post("coupons", couponData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      Swal.fire({
        title: "Success!",
        text: editingCoupon
          ? "Coupon updated successfully!"
          : "Coupon added successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  // Mutation for deleting coupon
  const { mutate: deleteMutation } = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`coupons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      Swal.fire({
        title: "Deleted!",
        text: "Coupon has been deleted.",
        icon: "success",
        confirmButtonText: "OK",
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete coupon");
    },
  });

  // Open modal for editing
  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setValue("code", coupon.code);
    setValue("discountPercentage", coupon.discountPercentage);
    setValue("expiryDate", coupon.expiryDate.split("T")[0]);
    setValue("maxUses", coupon.maxUses);
    setValue("active", coupon.active);
    setIsOpen(true);
  };

  // Close modal and reset form
  const closeModal = () => {
    reset();
    setEditingCoupon(null);
    setIsOpen(false);
  };

  // Confirm before deletion
  const confirmDelete = (id) => {
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
        deleteMutation(id);
      }
    });
  };

  if (roleLoading) return <Loading></Loading>;

  return (
    <WrapContainer>
      <div className="w-11/12 lg:w-11/12 lg:container mx-auto my-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Coupons</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* search bar */}
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder={"Search coupons..."}
          ></SearchBar>

          <button
            onClick={() => {
              setIsOpen(true);
            }}
            className="btn btn-primary text-white flex items-center gap-2"
          >
            <FaPlus /> Add Coupon
          </button>
        </div>
      </div>

      {/* Coupons Table */}
      {isLoading ? (
        <Loading></Loading>
      ) : coupons.length === 0 ? (
        <EmptyState
          title={
            searchTerm ? "No coupon match your search" : "No coupon available"
          }
          iconType={searchTerm ? "search" : ""}
        />
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-content/5">
          <table className="table table-zebra table-sm md:table-md w-full rounded-2xl">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th>#</th>
                <th>Code</th>
                <th>Discount (%)</th>
                <th>Expiry Date</th>
                <th>Max Uses</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon, index) => (
                <WrapTr key={coupon._id}>
                  <td>{index + 1}</td>
                  <td className="font-bold">{coupon.code}</td>
                  <td>{coupon.discountPercentage}%</td>
                  <td>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                  <td>{coupon.maxUses}</td>
                  <td>
                    <span
                      className={`badge badge-soft ${
                        coupon.active ? "badge-success" : "badge-error"
                      }`}
                    >
                      {coupon.active ? "Active" : "Expired"}
                    </span>
                  </td>
                  <td className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="btn btn-sm btn-warning"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(coupon._id)}
                      className="btn btn-sm btn-error"
                      disabled={deleteMutation.isLoading}
                    >
                      {deleteMutation.isLoading ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </WrapTr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Coupon Modal */}
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
                    {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
                  </Dialog.Title>

                  <form
                    onSubmit={handleSubmit(couponMutation)}
                    className="mt-4 space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Coupon Code
                      </label>
                      <input
                        type="text"
                        className="input w-full"
                        {...register("code", {
                          required: "Coupon code is required",
                          pattern: {
                            value: /^[A-Z0-9]+$/,
                            message:
                              "Only uppercase letters and numbers allowed",
                          },
                          minLength: {
                            value: 4,
                            message: "Minimum 4 characters required",
                          },
                          maxLength: {
                            value: 20,
                            message: "Maximum 20 characters allowed",
                          },
                        })}
                      />
                      {errors.code && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.code.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Discount Percentage
                      </label>
                      <input
                        type="number"
                        className="input w-full"
                        {...register("discountPercentage", {
                          required: "Discount is required",
                          min: {
                            value: 1,
                            message: "Minimum 1% discount",
                          },
                          max: {
                            value: 100,
                            message: "Maximum 100% discount",
                          },
                          valueAsNumber: true,
                        })}
                      />
                      {errors.discountPercentage && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.discountPercentage.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        className="input w-full"
                        {...register("expiryDate", {
                          required: "Expiry date is required",
                          validate: {
                            futureDate: (value) => {
                              const selectedDate = new Date(value);
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return (
                                editingCoupon ||
                                selectedDate >= today ||
                                "Date must be in the future"
                              );
                            },
                          },
                        })}
                      />
                      {errors.expiryDate && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.expiryDate.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Max Uses
                      </label>
                      <input
                        type="number"
                        className="input w-full"
                        {...register("maxUses", {
                          required: "Max uses is required",
                          min: {
                            value: 1,
                            message: "Minimum 1 use required",
                          },
                          max: {
                            value: 1000,
                            message: "Maximum 1000 uses allowed",
                          },
                          valueAsNumber: true,
                        })}
                      />
                      {errors.maxUses && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.maxUses.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="checkbox"
                        {...register("active")}
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Active
                      </label>
                    </div>

                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="btn btn-secondary text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary text-white"
                      >
                        {editingCoupon ? "Update" : "Add"}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
    </WrapContainer>
  );
};

export default ManageCoupons;
