
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button, Table } from "react-bootstrap";
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
import ListExample from "../Navbar";

export default function Categories() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { adminLoginData } = useSelector((state) => state.adminLogin);
  const settingstate = useSelector((state) => state.settings);

  const [showTypeModal, setShowTypeModal] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

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

  const openTypeModal = (categoryId) => {
    setCurrentCategoryId(categoryId);
    setShowTypeModal(true);
  };

  const closeTypeModal = () => {
    setShowTypeModal(false);
  };

  const handleCategorySubmit = async () => {
    if (!settingstate.categoryName) {
      alert("Please enter a category name");
      return;
    }
   
    try {
      const categoryData = {
        categoryName: settingstate.categoryName,
        uid: adminLoginData.uid,
      };
      const categoryRef = await addDoc(collection(db, "category"), categoryData);
      const categoryId = categoryRef.id;
      await updateDoc(doc(db, "category", categoryId), {
        categoryId: categoryId,
      });

      dispatch(
        setCategories([
          ...settingstate.categories,
          { id: categoryId, categoryName: settingstate.categoryName, uid: adminLoginData.uid },
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
    if (!currentCategoryId || !settingstate.categoryType) {
      alert("Please select a category and enter a category type");
      return;
    }

    try {
      const typeData = {
        type: settingstate.categoryType,
        categoryId: currentCategoryId,
        uid: adminLoginData.uid,
      };

      const typeRef = await addDoc(collection(db, "type"), typeData);
      const typeId = typeRef.id;

      dispatch(setTypes([...settingstate.types, { id: typeId, ...typeData }]));
      dispatch(setCategoryType(""));
      closeTypeModal();
      alert("Category Type added successfully!");
      fetchTypes(); // Refresh types list after adding a new type
    } catch (error) {
      console.error("Error adding category type: ", error);
      alert("Failed to add category type. Please try again.");
    }
  };

  const generatePreview = () => {
    if (!settingstate.selectedCategory || !settingstate.categoryType) {
      alert("Please select a category and enter a category type");
      return;
    }

    const createEmail = `please give a "${getCategoryNameById(
      settingstate.selectedCategory
    )}",related "${settingstate.categoryType}" Email!`;
    dispatch(setPreviewContent(createEmail));
  };

  const getCategoryNameById = (categoryId) => {
    const selectedCategory = settingstate.categories.find(
      (category) => category.id === categoryId
    );
    return selectedCategory ? selectedCategory.categoryName : "";
  };

  const handleDeleteType = async (typeId) => {
    try {
      await deleteDoc(doc(db, "type", typeId));
      dispatch(setTypes(settingstate.types.filter((type) => type.id !== typeId)));
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
     <header>
      <ListExample/>
     </header>
      <div className="form">
        <center>
          <h1>Create Categories</h1>
          <button type="button" onClick={openModal}>
            Add New Category
          </button>
          {/* <select
            value={settingstate.selectedCategory}
            onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
          >
            <option value="">Select a Category</option>
            {settingstate.categories
              .filter((e) => e.uid === uid)
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
          </select> */}
        </center>
        <Modal show={settingstate.showModal} onHide={closeModal}>
          <center>
            <Modal.Header closeButton>
              <Modal.Title>
                <h2>Enter Category Name</h2>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                type="text"
                value={settingstate.categoryName}
                onChange={(e) => dispatch(setCategoryName(e.target.value))}
                placeholder="Category Name"
              />
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={handleCategorySubmit}>Submit</Button>
            </Modal.Footer>
          </center>
        </Modal>
      </div>
      {settingstate.categories.length > 0 && (
        <div className="table-responsive-sm">
          <div className="container-sm">
            <h2>Categories List:</h2>
            <Table bordered>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {settingstate.categories
                  .filter((e) => e.uid === uid)
                  .map((category, i) => (
                    <tr key={category.id}>
                      <td>{i + 1}</td>
                      <td>{category.categoryName}</td>
                      <td>
                        <button onClick={() => openTypeModal(category.id)}>
                          Add Type
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}
      <Modal show={showTypeModal} onHide={closeTypeModal}>
        <center>
          <Modal.Header closeButton>
            <Modal.Title>
              <h2>Enter Category Type</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              value={settingstate.categoryType}
              onChange={(e) => dispatch(setCategoryType(e.target.value))}
              placeholder="Category Type"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleAddCategoryType}>Submit</Button>
          </Modal.Footer>
        </center>
      </Modal>
      {settingstate.types.length > 0 && (
        <div className="table-responsive-sm">
          <div className="container-sm">
            <h2>Types List:</h2>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type Name</th>
                  <th>Category Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {settingstate.types
                  .filter((e) => e.uid === uid)
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
            </Table>
          </div>
        </div>
      )}
    </>
  );
}
