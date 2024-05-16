import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal,Button } from "react-bootstrap";
import {
  setCategories,
  setTypes,
  setCategoryName,
  setCategoryType,
  setSelectedCategory,
  setShowModal,
  setPreviewContent,
} from "../../Routes/Slices/settingsLogin";
import { db } from "../../Pages/Firebase/firebase";
import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Categories() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { adminLoginData } = useSelector((state) => state.adminLogin);
  const {
    categories,
    types,
    categoryName,
    categoryType,
    selectedCategory,
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
        uid: doc.data().uid,
      }));
      dispatch(setCategories(categoriesList));
      console.log("categoryList", categoriesList);
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
        uid: doc.data().uid,
      }));
      dispatch(setTypes(typesList));
      console.log("typelist", typesList);
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
  const categoryRef = await addDoc(collection(db, "category"),categoryData);
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

      const typeRef = await addDoc(collection(db, "type"), typeData);
      const typeId = typeRef.id;

      dispatch(setTypes([...types, { id: typeId, ...typeData }]));
      console.log("uid:", adminLoginData.uid);
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

    const createEmail = `please give a "${getCategoryNameById(
      selectedCategory
    )}",related "${categoryType}" Email!`;
    dispatch(setPreviewContent(createEmail));
    // console.log("createmail",createEmail)
  };

  const getCategoryNameById = (categoryId) => {
    const selectedCategory = categories.find(
      (category) => category.id === categoryId
    );
    return selectedCategory ? selectedCategory.categoryName : "";
  };

  const handleDeleteType = async (typeId) => {
    try {
      // Delete the type document from Firestore
      await deleteDoc(doc(db, "type", typeId));

      // Update Redux state to remove the deleted type
      dispatch(setTypes(types.filter((type) => type.id !== typeId)));

      alert("Type deleted successfully!");
    } catch (error) {
      console.error("Error deleting type: ", error);
      alert("Failed to delete type. Please try again.");
    }
  };
  const handleNavigateGeneratePage = () => {
    navigate("/dashboard");
  };
  let uid = localStorage.getItem("uid");
  console.log(uid);

  return (
    <>
      <button type="button" onClick={handleNavigateGeneratePage}>
        Generate Page
      </button>
      <div className="form">
        <h1>Create Categories</h1>

        <button type="button" onClick={openModal}>
          Add New Category
        </button>

        <select
          value={selectedCategory}
          onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
        >
          {console.log("selcat", selectedCategory)}
          <option value="">Select a Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.categoryName}
            </option>
          ))}
        </select>

        <Modal show={showModal} onHide={closeModal}>
          <center>
            <Modal.Header closeButton>
              <Modal.Title>
                {" "}
                <h2>Enter Category Name</h2>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => dispatch(setCategoryName(e.target.value))}
                placeholder="Category Name"
              />
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={handleCategorySubmit}>Submit</Button>
            </Modal.Footer>
          </center>
        </Modal>

        {console.log("types", types)}
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
                {types
                  .filter((e) => e.uid == uid)
                  .map((type, i) => (
                    <tr key={type.id}>
                      <td>{i + 1}</td>
                      <td>{type.name}</td>
                      <td>{getCategoryNameById(type.categoryId)}</td>
                      <td>
                        <button onClick={() => handleDeleteType(type.id)}>
                          Delete
                        </button>
                      </td>
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
            {console.log("handletychg", categoryType)}
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
    </>
  );
}
