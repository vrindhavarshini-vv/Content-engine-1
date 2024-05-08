import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setCategories,
  setTypes,
  setCategoryName,
  setShowModal,
  setSelectedCategory,
  setCategoryType,
} from "./Routes/Slices/settingsLogin";
import { db } from "./Pages/Firebase/firebase";
import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function Categories() {
  const dispatch = useDispatch();
  const { adminLoginData } = useSelector((state) => state.adminLogin);
  const {
    categories,
    types,
    selectedCategory,
    categoryName,
    categoryType,
    showModal,
  } = useSelector((state) => state.settings);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchTypes();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesSnapshot = await getDocs(collection(db, "category"));
      const categoriesList = categoriesSnapshot.docs.map((doc) => ({
        id: doc.categoryId,
        // 
        
      }));
      dispatch(setCategories(categoriesList));

      // console.log(dispatch(setCategories(categoriesList)))
    } catch (error) {
      console.error("Error fetching categories: ", error);
      alert("Failed to fetch categories. Please try again.");
    }
  };

  const fetchTypes = async () => {
    try {
      const typesSnapshot = await getDocs(collection(db, "type"));
      const typesList = typesSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().type,
        categoryId: doc.data().categoryId,
      }));
      dispatch(setTypes(typesList));
    } catch (error) {
      console.error("Error fetching types: ", error);
      alert("Failed to fetch types. Please try again.");
    }
  };

  const openModal = () => {
    dispatch(setShowModal(true));
  };

  const closeModal = () => {
    dispatch(setShowModal(false));
  };

  const handleCategorySubmit = () => {
    if (categoryName === "") {
      alert("Please enter a category name");
      return;
    }

    const newCategory = { category: categoryName };
    dispatch(setCategories([...categories, newCategory]));
    dispatch(setSelectedCategory(categoryName));
    dispatch(setCategoryName(""));
    closeModal();
  };

  const handleCategoryTypeChange = (e) => {
    dispatch(setCategoryType(e.target.value));
  };

  const createCategory = async () => {
    if (!selectedCategory) {
      alert("Please select a category");
      return;
    }

    try {
      const categoryData = {
        category: categoryName,
        uid: adminLoginData.uid,
      };

      const categoryRef = await addDoc(
        collection(db, "category"),
        categoryData
      );
      const categoryId = categoryRef.id;

      await updateDoc(doc(db, "category", categoryId), {
        categoryId: categoryId,
      });

      const typeData = {
        type: categoryType,
        categoryId: categoryId,
        uid: adminLoginData.uid,
      };

      await addDoc(collection(db, "type"), typeData);

      dispatch(setCategoryName(""));
      dispatch(setCategoryType(""));
      alert("Category and Type added successfully!");

      fetchTypes(); // Refresh types list after adding a new type
    } catch (error) {
      console.error("Error adding category and type: ", error);
      alert("Failed to add category and type. Please try again.");
    }
  };

  return (
    <div className="form">
      <h1>Create Categories</h1>

      <button onClick={openModal}>Add New Category</button>

      <select
        value={selectedCategory}
        onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
      >
        <option value="">Select a Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.category}
          </option>
        ))}
      </select>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>Enter Category Name</h2>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => dispatch(setCategoryName(e.target.value))}
              placeholder="Category Name"
            />
            <button onClick={handleCategorySubmit}>Submit</button>
          </div>
        </div>
      )}

      {categories.length > 0 && (
        <div>
          <h2>Categories List:</h2>
          <table border={1}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Category Name</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr key={cat.id}>
                  {/* {console.log(key)} */}
                  <td>{i + 1}</td>
                  <td>{cat.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {types.length > 0 && (
        <div>
          <h2>Types List:</h2>
          <table border={1}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Type Name</th>
                <th>Category ID</th>
              </tr>
            </thead>
            <tbody>
              {types.map((type, i) => (
                <tr key={type.id}>
                  <td>{i + 1}</td>
                  <td>{type.name}</td>
                  <td>{type.categoryId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedCategory && (
        <div className="category-type-container">
          <label htmlFor="categoryType">Category Type:</label>
          <input
            type="text"
            id="categoryType"
            value={categoryType}
            onChange={(e) => handleCategoryTypeChange(e)}
            placeholder="Enter category type"
          />
          <button onClick={createCategory}>Add Category & Type</button>
        </div>
      )}
    </div>
  );
}
