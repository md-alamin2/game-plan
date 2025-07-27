import React, { useState } from "react";
import CourtCard from "./CourtCard";
import useAxios from "../../Hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../Components/Sheared/Loading";
import { FaSearch } from "react-icons/fa";
import EmptyState from "../../Components/Sheared/EmptyState";
import { motion } from "framer-motion";

const Courts = () => {
  const axiosInstance = useAxios();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const itemsPerPage = 6;

  const { data, isLoading } = useQuery({
    queryKey: ["courts", currentPage, searchTerm],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/courts/pagination?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchTerm(searchInput);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="w-11/12 lg:w-11/12 lg:container mx-auto">
      <div className="text-center py-12">
        <h2 className="text-5xl font-bold">Our Premium Courts</h2>
        <p className="text-lg mt-4 max-w-2xl mx-auto">
          Book world-class sports courts designed for peak performance.
        </p>
        {/* search bar */}
      <div className="max-w-5xl mx-auto mt-10 bg-base-200 py-6 rounded-2xl">
        <form
          onSubmit={handleSearch}
          className="w-full flex flex-col md:flex-row items-center gap-8 px-6"
        >
          {/* search */}
          <fieldset className="fieldset flex items-center gap-3 md:w-[90%]">
            <input
              type="text"
              value={searchInput}
              className="input rounded-2xl w-full"
              name="search"
              placeholder="Search by court name....."
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button className="btn btn-primary text-white">
              <FaSearch size={16} /> Search
            </button>

            {searchTerm && (
            <button
              type="button"
              onClick={() => {setSearchTerm(""); setSearchInput("")}}
              className="btn btn-secondary text-white"
            >
              Clear
            </button>
          )}
          </fieldset>
        </form>
      </div>

        {isLoading && <Loading></Loading>}

        {/* Courts Grid */}
        <div
          className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {data.courts.length > 0 ? (
            data.courts.map((court, i) => (
              <motion.div
                key={court._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <CourtCard court={court} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-3">
              <EmptyState
                title={
                  searchTerm
                    ? "No court match your search"
                    : "There is no available court"
                }
                message={
                  searchTerm
                    ? "There is no court by this name"
                    : "No court is available"
                }
                iconType={searchTerm ? "search" : "add"}
              />
            </div>
          )}
        </div>

        {/* Pagination */}
        {data.totalPages > 1 && (
          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-2 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <button
              className="btn btn-sm btn-outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              « Prev
            </button>

            {Array.from({ length: data.totalPages }).map((_, index) => (
              <button
                key={index}
                className={`btn btn-sm ${
                  currentPage === index + 1 ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="btn btn-sm btn-outline"
              disabled={currentPage === data.totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, data.totalPages))
              }
            >
              Next »
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Courts;
