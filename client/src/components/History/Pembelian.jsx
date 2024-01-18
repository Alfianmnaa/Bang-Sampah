import { collection, query, where, getDocs, doc, getDoc, deleteDoc, setDoc, serverTimestamp } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";

const Penjualan = () => {
  const [products, setProducts] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        // Create a query with the condition pembeliId == currentUser.uid
        const q = query(collection(db, "userHistory"), where("pembeliId", "==", currentUser.uid));

        const productsSnapshot = await getDocs(q);

        const productsData = [];
        productsSnapshot.forEach((doc) => {
          const data = doc.data();
          productsData.push({
            id: doc.id,
            barangId: data.barangId,
            penjualId: data.penjualId,
            pembeliId: data.pembeliId,
            namaBarang: data.namaBarang,
            harga: data.harga,
            berat: data.berat,
            status: data.status,
            namaPenjual: data.namaPenjual,
            kota: data.kota,
            domisili: data.domisili,
            waktuSelesai: data.waktuSelesai,
          });
        });

        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching product data: ", error);
      }
    };

    fetchProductsData();
  }, [currentUser.uid]);

  return (
    <div className="md:py-[120px] py-[50px] sm:px-10 px-2">
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product.id}>
            <p>nama barang: {product.namaBarang}</p>
            <p>dibeli dari: {product.namaPenjual}</p>
            <p>harga : {product.harga}</p>
            <p>berat : {product.berat}</p>
            <p>waktu selesai transaksi : {product.waktuSelesai}</p>
          </div>
        ))
      ) : (
        <div>Belum ada riwwayan pembelian di BangSampah</div>
      )}
    </div>
  );
};

export default Penjualan;
