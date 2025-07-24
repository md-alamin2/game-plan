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

const PaymentHistory = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [viewType, setViewType] = useState("table"); // 'table' or 'card'

  // Fetch confirmed payments
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["PaymentHistory", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`payments?user=${user.email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Payment History</h2>
        <button
          onClick={() => setViewType(viewType === "table" ? "card" : "table")}
          className="flex items-center gap-2 px-4 py-2 mb-4 text-sm font-semibold transition-all duration-300 border rounded-full shadow hover:shadow-md hover:bg-primary hover:text-white border-gray-300 cursor-pointer"
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
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No confirmed payments yet</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <span className="font-semibold">Paid:</span> ${payment.amount}
              </p>

              <p className="flex items-center gap-2">
                <FaReceipt className="text-primary" />
                <span className="font-semibold">Transaction ID:</span>{" "}
                {payment.transactionId}
              </p>

              <p className="flex items-center gap-2">
                <FaTag className="text-primary" />
                <span className="font-semibold">Coupon Used:</span>{" "}
                {payment.couponCode || "Not used"}
              </p>

              <p className="flex items-center gap-2">
                <FaGift className="text-primary" />
                <span className="font-semibold">Discount:</span>{" "}
                {payment.discountAmount
                  ? `$${payment.discountAmount}`
                  : "No Discount"}
              </p>

              <p className="flex items-center gap-2">
                <FaCalendarAlt className="text-primary" />
                <span className="font-semibold">Date:</span>{" "}
                {new Date(payment.pay_at_string).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
