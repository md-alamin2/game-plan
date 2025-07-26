import React from "react";
import CourtCard from "./CourtCard";
import useAxios from "../../Hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../Components/Sheared/Loading";

const Courts = () => {
  const axiosInstance = useAxios();

  const { data: courts = [], isLoading } = useQuery({
    queryKey: ["courts"],
    queryFn: async () => {
      const res = await axiosInstance.get("courts");
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div className="w-11/12 lg:w-11/12 lg:container mx-auto">
      <div className="text-center py-12">
        <h2 className="text-5xl font-bold">Our Premium Courts</h2>
        <p className="text-lg mt-4 max-w-2xl mx-auto">
          Book world-class sports courts designed for peak performance. Choose
          from tennis, badminton, squash, and multi-purpose courts.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-15">
          {courts.map((court) => (
            <CourtCard key={court._id} court={court} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courts;
