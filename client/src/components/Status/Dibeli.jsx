import { collection, query, where, getDocs, doc, getDoc, deleteDoc, setDoc, serverTimestamp } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Dibeli = () => {
  const [products, setProducts] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  //   const konversiWaktuFirestoreKeFormat = (timestamp) => {
  //     const dateObject = timestamp.toDate();

  //     const hariArray = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  //     const bulanArray = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  //     const hari = hariArray[dateObject.getDay()];
  //     const tanggal = dateObject.getDate();
  //     const bulan = bulanArray[dateObject.getMonth()];
  //     const tahun = dateObject.getFullYear();
  //     const jam = dateObject.getHours();
  //     const menit = dateObject.getMinutes();

  //     // Format tanggal sesuai dengan keinginan
  //     const formattedDate = `${hari}, ${tanggal} ${bulan} ${tahun}, ${jam}.${menit}`;

  //     return formattedDate;
  //   };
  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        // Create a query with the condition pembeliId == currentUser.uid
        const q = query(collection(db, "produkSold"), where("pembeliId", "==", currentUser.uid));

        const productsSnapshot = await getDocs(q);

        const productsData = [];
        productsSnapshot.forEach((doc) => {
          const data = doc.data();
          productsData.push({
            id: doc.id,
            barangId: data.barangId,
            imageUrl: data.imageUrl,
            penjualId: data.penjualId,
            pembeliId: data.pembeliId,
            namaBarang: data.namaBarang,
            berat: data.berat,
            harga: data.harga,
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

  const handleUpdateStatus = async (productId) => {
    try {
      // Dapatkan data produk yang diperbarui
      const productRef = doc(db, "produkSold", productId);
      const productSnapshot = await getDoc(productRef);
      const productData = productSnapshot.data();

      // Hapus data produk dari koleksi produkSold
      await deleteDoc(productRef);

      // Tambahkan data produk ke koleksi userHistory
      const userHistoryRef = collection(db, "userHistory");
      await setDoc(doc(userHistoryRef, productId), {
        penjualId: productData.penjualId,
        pembeliId: productData.pembeliId,
        namaBarang: productData.namaBarang,
        harga: productData.harga,
        berat: productData.berat,
        status: productData.status,
        imageUrl: productData.imageUrl,
        namaPenjual: productData.namaPenjual,
        kota: productData.kota,
        domisili: productData.domisili,
      });

      // Optional: Anda juga bisa mengupdate state jika diperlukan
      const updatedProducts = products.filter((p) => p.id !== productId);
      setProducts(updatedProducts);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Status berhasil diubah.",
      }).then(() => {
        navigate("/history");
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
            <p>harga barang : Rp{product.harga}</p>
            <p>berat barang : {product.berat} kg</p>
            <p>status: {product.status ? product.status : "sedang menunggu konfirmasi"}</p>
            {product.status == "barang sudah sampai ditujuan" ? (
              <button className="bg-maingreen text-white px-4 py-2 mr-4" onClick={() => handleUpdateStatus(product.id)}>
                Selesaikan Pesanan
              </button>
            ) : (
              ""
            )}
          </div>
        ))
      ) : (
        <div>Tidak ada produk yang sedang dibeli</div>
      )}
    </div>
  );
};

export default Dibeli;
