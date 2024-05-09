import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setCategories,
  setTypes,
  setCategoryName,
  setShowModal,
  setSelectedCategory,
  setCategoryType,
  setPreviewContent,
} from "../../Routes/Slices/settingsLogin";
import { db } from "../../Pages/Firebase/firebase";
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
    previewContent,
  } = useSelector((state) => state.settings);

  useEffect(() => {
    fetchCategories();
    fetchTypes();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesSnapshot = await getDocs(collection(db, "category"));
      const categoriesList = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        categoryName: doc.data().categoryName,
      }));
      dispatch(setCategories(categoriesList));
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

  const handleCategorySubmit = async () => {
    if (!categoryName) {
      alert("Please enter a category name");
      return;
    }

    try {
      const categoryData = {
        categoryName: categoryName,
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

      dispatch(
        setCategories([
          ...categories,
          { categoryId: categoryId, categoryName: categoryName },
        ])
      );

      dispatch(setSelectedCategory(categoryId));
      dispatch(setCategoryName(""));
      closeModal();

      alert("Category added successfully!");
    } catch (error) {
      console.error("Error adding category: ", error);
      alert("Failed to add category. Please try again.");
    }
  };

  const handleCategoryTypeChange = (e) => {
    dispatch(setCategoryType(e.target.value));
  };

  const handleAddCategoryType = async () => {
    if (!selectedCategory || !categoryType) {
      alert("Please select a category and enter a category type");
      return;
    }

    try {
      const typeData = {
        type: categoryType,
        categoryId: selectedCategory,
        uid: adminLoginData.uid,
      };

      await addDoc(collection(db, "type"), typeData);

      dispatch(setCategoryType(""));
      alert("Category Type added successfully!");

      fetchTypes(); // Refresh types list after adding a new type
    } catch (error) {
      console.error("Error adding category type: ", error);
      alert("Failed to add category type. Please try again.");
    }
  };

  const generatePreview = () => {
    if (!selectedCategory || !categoryType) {
      alert("Please select a category and enter a category type");
      return;
    }

    const createEmail = `Dear "${getCategoryNameById(
      selectedCategory
    )}",\n\nWe are pleased to welcome you as our new" ${categoryType}"!`;
    dispatch(setPreviewContent(createEmail));
  };
  const getCategoryNameById = (categoryId) => {
    const selectedCategory = categories.find(
      (category) => category.id === categoryId
    );
    return selectedCategory ? selectedCategory.categoryName : "";
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
            {category.categoryName}
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

      {types.length > 0 && (
        <div>
          <h2>Types List:</h2>
          <table border={1}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Type Name</th>
                <th>Category Name</th>
              </tr>
            </thead>
            <tbody>
              {types.map((type, i) => (
                <tr key={type.id}>
                  <td>{i + 1}</td>
                  <td>{type.name}</td>
                  <td>{getCategoryNameById(type.categoryId)}</td>
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
            onKeyUp={generatePreview}
            placeholder="Enter category type"
          />
          <button onClick={handleAddCategoryType}>Add Category & Type</button>
        </div>
      )}

      {previewContent && (
        <div className="preview-container">
          <h2>Email Preview:</h2>
          <p>{previewContent}</p>
        </div>
      )}
    </div>
  );
}
