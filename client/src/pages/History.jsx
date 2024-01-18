import React, { useState } from "react";
import Penjualan from "../components/History/Pembelian";
import Pembelian from "../components/History/Penjualan";

const History = () => {
  const [jenisStatus, setJenisStatus] = useState(true);

  return (
    <div className="md:py-[120px] py-[50px] sm:px-10 px-2">
      <div className="flex justify-center gap-6">
        <p onClick={() => setJenisStatus(true)} className="cursor-pointer">
          Penjualan
        </p>
        <p onClick={() => setJenisStatus(false)} className="cursor-pointer">
          Pembelian
        </p>
      </div>
      {jenisStatus ? <Pembelian /> : <Penjualan />}
    </div>
  );
};

export default History;
