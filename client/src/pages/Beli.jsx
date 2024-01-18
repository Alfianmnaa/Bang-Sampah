import React, { useEffect, useState, useContext } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { IoMdSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import beliHeroImage from "../assets/beliHero.png";
import "./skeleton.css";
import BeliSearchBar from "../components/Beli/BeliSearchBar";
import BeliHero from "../components/Beli/BeliHero";
import BeliCategories from "../components/Beli/BeliCategories";
import BeliItemList from "../components/Beli/BeliItemList";

const Beli = () => {
  const { currentUser } = useContext(AuthContext);
  const [userItems, setUserItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        setIsLoading(true);
        const q = query(collection(db, "userSales"));
        const querySnapshot = await getDocs(q);

        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });

        setUserItems(items);
      } catch (error) {
        console.error("Error fetching user items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserItems();
  }, [currentUser]);

  const handleTypesClick = (type) => {
    setSelectedType(type);
  };

  const filteredItems = userItems.filter((item) => {
    const isCategoryMatch = item.judul.toLowerCase().includes(searchQuery.toLowerCase()) && (!selectedType || item.type.toLowerCase() === selectedType.toLowerCase());

    // Check if "SEMUA KATEGORI" is selected
    if (selectedType === "SEMUA KATEGORI") {
      return item.judul.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return isCategoryMatch;
  });

  const categories = ["KERTAS", "PLASTIK", "LOGAM", "KACA", "TEKSTIL", "ELEKTRONIK", "KARET", "LAINNYA", "SEMUA KATEGORI"];

  return (
    <div className="sm:p-10 px-4 p-2 md:py-[120px] py-[50px]">
      <BeliSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <BeliHero />
      <BeliCategories categories={categories} selectedType={selectedType} handleTypesClick={handleTypesClick} />
      <BeliItemList isLoading={isLoading} filteredItems={filteredItems} selectedType={selectedType} />
    </div>
  );
};

export default Beli;
