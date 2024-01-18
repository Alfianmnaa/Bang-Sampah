import React from "react";
import { MdOutlineArrowOutward } from "react-icons/md";
import { Link } from "react-router-dom";
import jual from "../assets/Jual.png";
import beli from "../assets/Beli.png";

const Layanan = () => {
  return (
    <div className="containe sm:px-10 px-2 md:py-[120px] py-[50px] mx-auto box-sizing">
      <div className="lg:flex sm:block items-center justify-center mb-40">
        <div className="p-10">
          <h1 className="md:text-[4rem] text-[2.7rem] mb-6 font-bold">
            Ubah Sampah
            <br />
            Jadi <span className="text-[#318335]">Rupiah</span>
          </h1>
          <div className="text-lg font-medium text-[#666] sm:w-80 w-72 mb-10">
            <p>Deskripsi singkat tentang bang sampah dan tujuan utama dari bang sampah</p>
          </div>
          <Link to="/jual-sampah">
            <button className="flex items-center py-4 px-6 font-semibold bg-[#318335] text-white rounded-[1.875rem]">
              <span>Jual sampah</span>
              <MdOutlineArrowOutward className="ml-2 text-subtitle font-bold" />
            </button>
          </Link>
        </div>
        <div className="p-10">
          <img src={jual} className="h-[386px] sm:w-[552px]  object-cover" />
        </div>
      </div>

      <div className="lg:flex sm:block justify-center items-center">
        <div className="p-10">
          <img src={beli} className="h-[280px] sm:w-[384px]  object-cover" />
        </div>
        <div className="p-10">
          <h1 className="md:text-[4rem] text-[2.7rem] mb-4 font-bold">
            Beli Sampah, <br />
            Wujudkan Kreativitas
          </h1>
          <div className="text-lg font-medium text-[#666] sm:w-80 w-72 mb-10">
            <p>Temukan barang bekas yang menjadi bahan baku istimewa bagi kreasi Anda</p>
          </div>
          <Link to="/beli-sampah">
            <button className="flex py-4 px-6 font-semibold bg-[#318335] text-white rounded-[1.875rem]">
              <span>Beli sampah</span>
              <MdOutlineArrowOutward className="ml-2 text-subtitle font-bold" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Layanan;
