import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loading from "../../Components/Sheared/Loading";
import { HiOutlineViewColumns, HiOutlineSquares2X2 } from "react-icons/hi2";
import {
  FaMoneyBillWave,
  FaReceipt,
  FaTag,
  FaGift,
  FaCalendarAlt,
} from "react-icons/fa";
import EmptyState from "../../Components/Sheared/EmptyState";
import SearchBar from "../../Components/Sheared/SearchBar";

const PaymentHistory = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [viewType, setViewType] = useState("table"); // 'table' or 'card'
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch confirmed payments
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["PaymentHistory", user.email, searchTerm],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `payments?email=${user.email}&search=${searchTerm}`
      );
      return res.data;
    },
  });

  return (
    <div className="w-11/12 lg:w-11/12 lg:container mx-auto my-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Payment History</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setViewType(viewType === "table" ? "card" : "table")}
            className="flex items-center gap-2 btn  text-sm font-semibold transition-all duration-300 border shadow hover:shadow-md hover:btn-primary hover:text-white "
          >
            {viewType === "table" ? (
              <>
                <HiOutlineSquares2X2 className="text-xl transition-transform duration-300" />
                Card View
              </>
            ) : (
              <>
                <HiOutlineViewColumns className="text-xl transition-transform duration-300" />
                Table View
              </>
            )}
          </button>
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder={"Search payments...."}
          ></SearchBar>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : payments.length === 0 ? (
        <div className="text-center py-12">
          <EmptyState
            title={
              searchTerm
                ? "No payment match your search"
                : "You don't make any confirm payment"
            }
            message={
              searchTerm
                ? "You haven't make any payment By this court name or transaction Id"
                : "No Confirmed Booking Available"
            }
            iconType={searchTerm ? "search" : "add"}
          />
        </div>
      ) : viewType === "table" ? (
        <div className="overflow-x-auto rounded-box border border-base-content/5">
          <table className="table table-zebra table-sm md:table-md w-full rounded-2xl">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th>#</th>
                <th>Court</th>
                <th>Paid</th>
                <th>Transaction Id</th>
                <th>Coupon Used</th>
                <th>Coupon Discount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={payment._id} className="hover:bg-gray-50 text-center">
                  <td>{index + 1}</td>
                  <td>{payment.courtName}</td>
                  <td>${payment.amount}</td>
                  <td>{payment.transactionId}</td>
                  <td>{payment.couponCode || "Not used"}</td>
                  <td>
                    {payment.discountAmount
                      ? `$${payment.discountAmount}`
                      : "No Discount"}
                  </td>
                  <td>
                    {new Date(payment.pay_at_string).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {payments.map((payment, index) => (
            <div
              key={payment._id}
              className="border rounded-lg shadow-md p-4 bg-white"
            >
              <h3 className="text-lg font-semibold mb-2">
                #{index + 1} - {payment.courtName}
              </h3>

              <p className="flex items-center gap-2">
                <FaMoneyBillWave className="text-primary" />
                <p className="font-semibold">
                  Paid:<span className="font-normal">${payment.amount}</span>
                </p>
              </p>

              <p className="flex flex-wrap items-center gap-2">
                <FaReceipt className="text-primary" />
                <p className="font-semibold">
                  Transaction ID:
                  <span className="font-normal">{payment.transactionId}</span>
                </p>
              </p>

              <p className="flex items-center gap-2">
                <FaTag className="text-primary" />
                <p className="font-semibold">
                  Coupon Used:
                  <span className="font-normal">
                    {payment.couponCode || "Not used"}
                  </span>
                </p>
              </p>

              <p className="flex items-center gap-2">
                <FaGift className="text-primary" />
                <p className="font-semibold">
                  Discount:{" "}
                  <span className="font-normal">
                    {payment.discountAmount
                      ? `$${payment.discountAmount}`
                      : "No Discount"}
                  </span>
                </p>
              </p>

              <p className="flex items-center gap-2">
                <FaCalendarAlt className="text-primary" />
                <p className="font-semibold">
                  Date:{" "}
                  <span className="font-normal">
                    {new Date(payment.pay_at_string).toLocaleDateString()}
                  </span>
                </p>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
