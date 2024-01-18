import React from "react";

const BeliCategories = ({ categories, selectedType, handleTypesClick }) => {
  return (
    <div className="mx-auto flex justify-center mt-12 sm:w-[610px] md:w-[720px] lg:w-[1024px] xl:w-[1125px] mb-12  ">
      <div className="w-full h-[60px] pt-[40px] flex flex-wrap justify-between ">
        <div className="text-neutral-500 font-bold font-['Figtree'] capitalize leading-tight mb-2 ">Pilihan kategori</div>
        <ul className="flex flex-wrap gap-2 font-medium lg:space-x-8 ">
          {categories.map((type) => (
            <li key={type}>
              <div
                onClick={() => {
                  handleTypesClick(type);
                }}
                className={`cursor-pointer text-base font-medium font-['Figtree'] uppercase leading-tight tracking-tight text-[12px] sm:text-[16px]  md:mr-0 mr-2 sm:p-0 p-1 ${
                  selectedType === type ? "text-maingreen border-b border-[#318335]" : "text-neutral-600 "
                }`}
              >
                {type}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BeliCategories;
