import React from "react";
import { FaLocationDot, FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";

const BeliItemList = ({ isLoading, filteredItems, selectedType }) => {
  return (
    <div className="flex justify-center translate-y-16 sm:translate-y-0 ">
      <div className="w-[1128px] ">
        <div className=" text-neutral-800 text-2xl font-bold font-['Figtree'] leading-[28.80px]">Pilihan Untukmu</div>
        {isLoading && (
          <div className="skeleton-container sm:justify-start justify-center sm:gap-6">
            {/* Skeleton items to be shown while loading */}
            {[...Array(6)].map((_, index) => (
              <div key={index} className="skeleton-item"></div>
            ))}
          </div>
        )}
        {!isLoading && filteredItems.length === 0 && (
          <div className="sm:mt-4 mt-4 text-neutral-800 text-lg font-bold font-['Figtree'] h-[307px]">{selectedType ? `Tidak ada barang dengan kategori ${selectedType}` : "Barang tidak ditemukan"}</div>
        )}
        {!isLoading && filteredItems.length > 0 && (
          <>
            <div className="flex flex-wrap sm:justify-start justify-center sm:gap-6 ">
              {filteredItems.map((item) => (
                <Link to={`/detail/${item.id}`} key={item.id} className="sm:w-[168px] w-[300px] h-[307px] mt-[21px] relative hover:brightness-95 duration-150">
                  <div className="sm:w-[168px] w-[300px] h-[327px] left-0 top-0 absolute bg-white rounded-2xl shadow"></div>
                  <div className="sm:w-[141px] w-full left-[10px] top-[178px] absolute text-neutral-800 text-base font-normal font-['Figtree'] leading-tight">{item.judul}</div>
                  <div className="w-[141px] left-[10px] sm:top-[226px] top-[210px] absolute text-neutral-800 text-sm font-bold font-['Figtree'] leading-[18.20px]">Rp{item.harga}</div>
                  <div className="left-[32px] top-[251px] absolute text-stone-500 text-sm font-normal font-['Figtree'] leading-[18.20px]">Kota {item.kota}</div>
                  <div className="left-[32px] sm:top-[300px] top-[275px]  absolute text-stone-500 text-sm font-normal font-['Figtree'] leading-[18.20px]">5,0 • Terjual 500+</div>
                  <img className="object-cover w-full h-[168px] left-0 top-0 absolute rounded-tl-2xl rounded-tr-2xl" src={item.imageUrl} alt={item.judul} />
                  <div className="w-5 h-5 left-[8px] top-[250px] absolute">
                    <FaLocationDot />
                  </div>
                  <div className="w-5 h-5 left-[8px] sm:top-[300px] top-[275px] absolute">
                    <FaStar className="text-yellow-400" />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BeliItemList;
