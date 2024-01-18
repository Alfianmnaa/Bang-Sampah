import React, { useEffect, useState, useContext } from "react";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { FaTrash, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { MdOutlineArrowOutward } from "react-icons/md";

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [userItems, setUserItems] = useState([]);

  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        const q = query(collection(db, "userSales"), where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);

        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });

        setUserItems(items);
      } catch (error) {
        console.error("Error fetching user items:", error);
      }
    };

    if (currentUser) {
      fetchUserItems();
    }
  }, [currentUser]);

  const handleDelete = async (itemId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await deleteDoc(doc(db, "userSales", itemId));
        // Remove the deleted item from the state
        setUserItems((prevItems) => prevItems.filter((item) => item.id !== itemId));

        Swal.fire("Deleted!", "Your item has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      Swal.fire("Error!", "An error occurred while deleting the item.", "error");
    }
  };

  const handleEdit = () => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "fitur sedang dalam pengembangan!",
    });
  };

  return (
    <div className="sm:px-10 px-4 p-2 py-[120px]  ">
      <h1 className="text-3xl font-bold text-center">Your Dashboard</h1>
      <div className="flex justify-center">
        <div>
          {userItems.length == 0 ? (
            <div className="text-center mt-6 mb-24">
              <p className="text-subtitle">Tidak ada barang yang dijual.</p>
              <div className="mt-12 flex flex-col sm:flex-row">
                <Link to="/jual-sampah" type="submit" className="hover:brightness-90 flex justify-center duration-150 cursor-pointer sm:w-[400px] w-full h-[77px] p-6 ml-0 sm:ml-6 rounded-[40px] border bg-green-700">
                  <div className="text-white text-2xl font-bold font-['Figtree']">Jual Disini</div>
                  <MdOutlineArrowOutward className="ml-2 text-white text-[28px] font-bold" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap md:justify-start justify-center gap-6">
              {userItems.map((item) => (
                <div key={item.id} className="w-48 bg-white p-4 rounded-lg shadow-md mb-4">
                  <img src={item.imageUrl} alt="" className="w-full h-auto mb-4" />
                  <ul>
                    <li>
                      <p className="font-semibold">Title: {item.judul}</p>
                      <p>Weight: {item.berat} Kg</p>
                      <p>Price: Rp {item.harga}</p>
                    </li>
                  </ul>
                  <div className="flex justify-end mt-4">
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 mr-4">
                      <FaTrash />
                    </button>
                    <button onClick={() => handleEdit()}>
                      <FaEdit />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-center mb-3">
        <Link to="/status" type="submit" className="hover:brightness-90 flex justify-center duration-150 cursor-pointer sm:w-[400px] w-full h-[77px] p-6 ml-0 sm:ml-6 rounded-[40px] border border-green-700 bg-white">
          <div className="text-[#666] text-2xl font-bold font-['Figtree']">Cek Transaksi</div>
          <MdOutlineArrowOutward className="ml-2 text-white text-[28px] font-bold" />
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row justify-center">
        <Link to="/history" type="submit" className="hover:brightness-90 flex justify-center duration-150 cursor-pointer sm:w-[400px] w-full h-[77px] p-6 ml-0 sm:ml-6 rounded-[40px] border bg-green-700">
          <div className="text-white text-2xl font-bold font-['Figtree']">Cekk History</div>
          <MdOutlineArrowOutward className="ml-2 text-white text-[28px] font-bold" />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
