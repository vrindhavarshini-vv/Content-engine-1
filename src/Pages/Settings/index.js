
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
import { useNavigate } from "react-router-dom";
import ListExample from "../Navbar";
import axios from "axios";

export default function Categories() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const settingstate = useSelector((state) => state.settings);

  const [showTypeModal, setShowTypeModal] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const parsedData = localStorage.getItem("token");
  const currentLoginUserId = localStorage.getItem("uid")
  const headers = { 'Authorization': `Bearer ${parsedData}` };

  const fetchCategories = async () => {
    try {
      const categoriesSnapshot = await axios.get(`https://pavithrakrish95.pythonanywhere.com/settingGetList/${currentLoginUserId}`);
      dispatch(setCategories(categoriesSnapshot.data));
      console.log("categoriesSnapshot", categoriesSnapshot.data);
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchTypes = async (categoryId) => {
    if (!categoryId) return;
    try {
      const typesSnapshot = await axios.get(`https://pavithrakrish95.pythonanywhere.com/settingGetType/${categoryId}`);
      dispatch(setTypes(typesSnapshot.data));
      console.log("typesSnapshot", typesSnapshot.data);
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

    try {
      const formData = new FormData();
      formData.append("categoryName", settingstate.categoryName);
      formData.append("uid", settingstate.loggedUserData.uid);
      const categoryRef = await axios.post("https://pavithrakrish95.pythonanywhere.com/categoryList", formData);
      const newCategory = {
        categoryId: categoryRef.data.categoryId,
        categoryName: settingstate.categoryName,
      };
      dispatch(setCategories([...settingstate.categories, newCategory]));
      dispatch(setCategoryName(""));
      closeModal();
      alert("Category added successfully!");
    } catch (error) {
      console.error("Error adding category:", error);
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
      const formData = new FormData();
      formData.append("typeName", settingstate.categoryType);
      formData.append("categoryId", currentCategoryId);
      formData.append("uid", currentLoginUserId);
  
      const response = await axios.post("https://pavithrakrish95.pythonanywhere.com/typeList", formData);
      console.log("Response:", response.data);
  
      const typeNewData = await axios.get("https://pavithrakrish95.pythonanywhere.com/settingGetAllType");
      const latestType = typeNewData.data.find(
        (type) => type.typeName === settingstate.categoryType && type.categoryId === currentCategoryId
      );
  
      if (!latestType) {
        alert("New type not found in response");
        return;
      }
  
      const newType = {
        typeId: latestType.typeId,
        typeName: latestType.typeName,
        categoryId: latestType.categoryId,
      };
      console.log("newType",newType)
      dispatch(setTypes([...settingstate.types, newType]));
      dispatch(setCategoryType(""));
      closeTypeModal();
      alert("Category Type added successfully!");
    } catch (error) {
      console.error("Error adding category type:", error);
      alert("Failed to add category type. Please try again.");
    }
  };
  const generatePreview = (categoryId, categoryType) => {
    if (!categoryId || !categoryType) {
      return;
    }

    const createEmail = `Please give a "${getCategoryNameById(categoryId)}" related "${categoryType}" email!`;
    dispatch(setPreviewContent(createEmail));
  };

  

  const getCategoryNameById = (categoryId) => {
    const selectedCategory = settingstate.categories.find((category) => category.categoryId === categoryId);
    return selectedCategory ? selectedCategory.categoryName : "";
  };

  const handleDeleteType = async (typeId) => {
    try {
      await axios.delete(`https://pavithrakrish95.pythonanywhere.com/deleteList/${typeId}`);
      dispatch(setTypes(settingstate.types.filter((type) => type.typeId !== typeId)));
      alert("Type deleted successfully!");
    } catch (error) {
      console.error("Error deleting type: ", error);
      alert("Failed to delete type. Please try again.");
    }
  };

  const handleNavigateGeneratePage = () => {
    navigate("/dashboard");
  };

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
                      <button onClick={() => openTypeModal(category.categoryId)}>Add Email Type</button>
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
            <input type="text" value={settingstate.categoryType} onChange={handleCategoryTypeChange} />
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
                {settingstate.types.filter((type) => type.categoryId === currentCategoryId).map((type, i) => {
                  const categoryName = getCategoryNameById(type.categoryId);
                  console.log('Category ID:', type.categoryId); // Log the categoryId
                  console.log('Category Name:', categoryName); // Log the result of the function
                  return (
                    <tr key={type.typeId}>
                      <td>{i + 1}</td>
                      <td>{type.typeName}</td>
                      <td>{categoryName}</td>
                      <td>
                        <button onClick={() => handleDeleteType(type.typeId)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
}
