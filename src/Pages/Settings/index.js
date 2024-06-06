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
// import { db } from "../../Pages/Firebase/firebase";
// import {
//   addDoc,
//   collection,
//   getDocs,
//   updateDoc,
//   doc,
//   deleteDoc,
//   query,
//   where,
// } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ListExample from "../Navbar";
import axios from "axios";

export default function Categories() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { adminLoginData } = useSelector((state) => state.adminLogin);
  const settingstate = useSelector((state) => state.settings);

  const [showTypeModal, setShowTypeModal] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  const fetchCategories = async () => {
    try {
      const categoriesSnapshot = await axios.get(
        "https://pavithrakrish95.pythonanywhere.com/settingGetList"
      );
      dispatch(setCategories(categoriesSnapshot.data));
      console.log("categoriesSnapshot", categoriesSnapshot.data);
    } catch (error) {
      console.error("Error fetching categories: ", error);
      alert("Failed to fetch categories. Please try again.");
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchTypes = async (categoryId) => {
    if (!categoryId) {
      return;
    }
    try {
      const typesSnapshot = await axios.get(
        `https://pavithrakrish95.pythonanywhere.com/settingGetType/${categoryId}`)
        dispatch(setTypes(typesSnapshot.data));
        console.log(typesSnapshot.data, "typesSnapshot")
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
    // console.log(categoryId,"cat")
    setCurrentCategoryId(categoryId);
    dispatch(setSelectedCategory(categoryId));
    setShowTypeModal(true);
    fetchTypes(categoryId);
    generatePreview(categoryId, settingstate.categoryType);
  };

  const closeTypeModal = () => {
    setShowTypeModal(false);
  };

  const handleCategorySubmit = async () => {
    if (!settingstate.categoryName) {
      alert("Please enter a category name");
      return;
    }
    const formData = new FormData();
    formData.append("categoryName", settingstate.categoryName);
    const categoryRef = await axios.post(
      "https://pavithrakrish95.pythonanywhere.com/categoryList",
      formData
    );
    const newCategory = {
      categoryId: categoryRef.data.categoryId,
      categoryName: settingstate.categoryName,
    };
    console.log(newCategory, "newCategory");

    dispatch(setCategories([...settingstate.categories, newCategory]));
    // dispatch(setSelectedCategory(newCategory.categoryId));
    dispatch(setCategoryName(""));
    closeModal();
    alert("Category added successfully!");
  };

  const handleCategoryTypeChange = (e) => {
    dispatch(setCategoryType(e.target.value));
    generatePreview(currentCategoryId, e.target.value);
  };

  const handleAddCategoryType = async () => {
    if (!currentCategoryId || !settingstate.categoryType) {
      alert("Please select a category and enter a category type");
      return;
    }

    try {
    const formData = new FormData();
    formData.append("categoryType", settingstate.categoryType);
    formData.append("categoryId", currentCategoryId);
    
      const typeRef = await axios.post(
        "https://pavithrakrish95.pythonanywhere.com/typeList",
        formData
      );
      const typeNewData = await axios.get(
        "https://pavithrakrish95.pythonanywhere.com/settingGetAllType"
      );
      const latestType = typeNewData.data[typeNewData.data.length - 1];

      const newType = {
        id: latestType.id,
        categoryType: latestType.categoryType,
        categoryId: latestType.categoryId,
      };
    // console.log("itypeNewDatad",typeNewData)
    const newData=  dispatch(setTypes([...settingstate.types, newType]));
    console.log("newData",newData);
      dispatch(setCategoryType(""));
      closeTypeModal();
      alert("Category Type added successfully!");
      // fetchTypes(currentCategoryId); // Refresh types list after adding a new type
    } catch (error) {
      console.error("Error adding category type:", error);
      alert("Failed to add category type. Please try again.");
    }
  };

  const generatePreview = (categoryId, categoryType) => {
    if (!categoryId || !categoryType) {
      return;
    }

    const createEmail = `Please give a "${getCategoryNameById(
      categoryId
    )}" related "${categoryType}" email!`;
    dispatch(setPreviewContent(createEmail));
  };

  const getCategoryNameById = (categoryId) => {
    const selectedCategory = settingstate.categories.find(
      (category) => category.categoryId === categoryId
    );
    return selectedCategory ? selectedCategory.categoryName : "";
    console.log("selected category", selectedCategory);
  };

  const handleDeleteType = async (id) => {
    try {
      const deleteData = await axios.delete(
        `https://pavithrakrish95.pythonanywhere.com/deleteList/${id}`
      );
      dispatch(setTypes(settingstate.types.filter((type) => type.id !== id)));
      console.log(deleteData, "deleteData");
      alert("Type deleted successfully!");
    } catch (error) {
      console.error("Error deleting type: ", error);
      alert("Failed to delete type. Please try again.");
    }
  };

  const handleNavigateGeneratePage = () => {
    navigate("/dashboard");
  };

  // const uid = localStorage.getItem("uid");

  return (
    <>
      <center>
        <header>
          <ListExample />
        </header>
        <div className="form" style={{ textAlign: "center" }}>
          <h1>Create Email Recipients</h1>
          <button type="button" onClick={openModal}>
            Add New Recipients
          </button>
        </div>
      </center>

      <Modal show={settingstate.showModal} onHide={closeModal}>
        <center>
          <Modal.Header closeButton>
            <Modal.Title>
              <h2>Enter Recipients Name</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              value={settingstate.categoryName}
              onChange={(e) => dispatch(setCategoryName(e.target.value))}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleCategorySubmit}>Submit</Button>
          </Modal.Footer>
        </center>
      </Modal>

      {settingstate.categories.length > 0 && (
        <div className="table-responsive-sm">
          <div className="container-sm">
            <h2>Recipients List:</h2>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email Recipients</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {settingstate.categories.map((category, i) => (
                  <tr key={category.categoryId}>
                    <td>{i + 1}</td>
                    <td>{category.categoryName}</td>
                    <td>
                      <button
                        onClick={() => openTypeModal(category.categoryId)}
                      >
                        Add Email Type
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
              <h2>Enter Recipients Type</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              value={settingstate.categoryType}
              onChange={handleCategoryTypeChange}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleAddCategoryType}>Submit</Button>
          </Modal.Footer>
        </center>
      </Modal>
      {settingstate.previewContent && (
        <div className="preview">
          <h3>Preview:</h3>
          <p>{settingstate.previewContent}</p>
        </div>
      )}

      {settingstate.types.length > 0 && (
        <div className="table-responsive-sm">
          <div className="container-sm">
            <h2>Recipients Email Types List:</h2>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Recipients Email Types</th>
                  <th>Email Recipients</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {settingstate.types.map((type, i) => (
                  <tr key={type.id}>
                    <td>{i + 1}</td>
                    <td>{type.categoryType}</td>
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
//