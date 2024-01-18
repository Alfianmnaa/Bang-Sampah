import React from "react";
import { IoMdSearch } from "react-icons/io";

const BeliSearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className=" mx-auto flex sm:w-[610px] md:w-[720px] lg:w-[1024px] xl:w-[1125px] p-3 rounded-lg md:translate-y-0 translate-y-[4rem] border border-zinc-400">
      <IoMdSearch className="w-6 h-6 mr-2" />
      <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" className="w-full outline-none text-[16px]" placeholder="Cari sampah berkualitas disini" />
    </div>
  );
};

export default BeliSearchBar;
