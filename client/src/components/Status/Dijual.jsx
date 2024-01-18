import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

const Dijual = () => {
  const [products, setProducts] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const q = query(collection(db, "produkSold"), where("penjualId", "==", currentUser.uid));

        const productsSnapshot = await getDocs(q);

        const productsData = [];
        productsSnapshot.forEach((doc) => {
          const data = doc.data();
          productsData.push({
            id: doc.id,
            namaBarang: data.namaBarang,
            harga: data.harga,
            berat: data.berat,
            status: data.status,
            imageUrl: data.imageUrl,
            namaPenjual: data.namaPenjual,
            kota: data.kota,
            domisili: data.domisili,
          });
        });

        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching product data: ", error);
      }
    };

    fetchProductsData();
  }, [currentUser.uid]);

  const handleUpdateStatus = async (productId, newStatus) => {
    try {
      const productRef = doc(db, "produkSold", productId);
      await updateDoc(productRef, { status: newStatus });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Status berhasil diubah.",
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Error updating product status: ", error);
    }
  };

  return (
    <div className="md:py-[120px] py-[50px] sm:px-10 px-2">
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product.id}>
            <img src={product.imageUrl} alt={product.namaBarang} className="h-full" />
            <p>nama barang: {product.namaBarang}</p>
            <p>nama penjual: {product.namaPenjual}</p>
            <p>berat barang : {product.berat} kg</p>
            <p>status: {product.status ? product.status : "sedang menunggu konfirmasi"}</p>
            <button
              className="bg-maingreen text-white px-4 py-2 mr-4"
              onClick={() => {
                const nextStatus = getNextStatus(product.status);
                handleUpdateStatus(product.id, nextStatus);
              }}
            >
              {getNextStatusLabel(product.status)}
            </button>
          </div>
        ))
      ) : (
        <div>Tidak ada barang yang sedang dalam transaksi!</div>
      )}
    </div>
  );
};

const getNextStatus = (currentStatus) => {
  const statuses = ["barang dikonfirmasi", "barang sedang dikemas", "barang sedang diantar", "barang sudah sampai ditujuan"];
  const currentIndex = statuses.indexOf(currentStatus);
  const nextIndex = currentIndex < statuses.length - 1 ? currentIndex + 1 : currentIndex;
  return statuses[nextIndex];
};

const getNextStatusLabel = (currentStatus) => {
  const statusLabels = {
    "barang dikonfirmasi": "Kemas",
    "barang sedang dikemas": "Antar",
    "barang sedang diantar": "Sampai",
    "barang sudah sampai ditujuan": "Selesai",
  };
  return statusLabels[currentStatus] || "Konfirmasi";
};

export default Dijual;
