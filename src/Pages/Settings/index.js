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
import axios from "axios";
import ListExample from "../Navbar";


export default function Categories() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const settingstate = useSelector((state) => state.settings);
  // const adminSlice = useSelector((state) => state.adminLogin);

  const [showTypeModal, setShowTypeModal] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  const token=localStorage.getItem("__token")
  // console.log(token)
  const user_Id= localStorage.getItem("user_Id")

  useEffect(() => {
    fetchCategories();
    fetchTypes()
  }, []);
  
  const fetchCategories = async () => {
    try {
      const headers = { 'Authorization':`Bearer ${token}`};
      const categoriesSnapshot = await axios.get( `https://balaramesh8265.pythonanywhere.com/settingGetcategory/${user_Id}`,{ headers });
      dispatch(setCategories(categoriesSnapshot.data));
      // alert(categoriesSnapshot.data)
      console.log("categoriesSnapshot", categoriesSnapshot.data);
    } catch (error) {
      console.error("Error fetching categories: ", error);
      // alert("Failed to fetch categories. Please try again.");
    }
  };


  const fetchTypes = async (categoryId) => {
  if (!categoryId) return;
  try {
    const headers = { 'Authorization': `Bearer ${token}` };
    const typesSnapshot = await axios.get(`https://balaramesh8265.pythonanywhere.com/settingGetType/${categoryId}`, { headers });
    dispatch(setTypes(typesSnapshot.data));
    console.log("typesSnapshot", typesSnapshot.data);
    // alert("Success fetching types.");
  } catch (error) {
      console.error("Error message:", error.message);
      alert(`Error: ${error.message}`);
    }
  }



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
      formData.append("user_Id", user_Id);
      const headers = { 'Authorization':`Bearer ${token}`};
      const categoryRef = await axios.post("https://balaramesh8265.pythonanywhere.com/addcategory", formData,{ headers });
      const newCategory = {
        categoryId: categoryRef.data.categoryId,
        categoryName: settingstate.categoryName,
      };
      dispatch(setCategories([...settingstate.categories, newCategory]));
      dispatch(setCategoryName(""));
      alert("Category added successfully!");
      closeModal();
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category. Please try again.");
    }
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
      formData.append("typeName", settingstate.categoryType);
      formData.append("categoryId", currentCategoryId);
      formData.append("user_Id", user_Id);
      // Debugging: log formData
    
      const headers = { 'Authorization':`Bearer ${token}`};
      await axios.post("https://balaramesh8265.pythonanywhere.com/addtypeList", formData,{ headers });

      console.log("form data",formData)
      console.log("Form Data:", formData.get("typeName"), formData.get("categoryId"));

      const typeNewData = await axios.get('https://balaramesh8265.pythonanywhere.com/settingGettypeList',{ headers });
  
      // Debugging: log the response from settingGetAllType
      console.log("Type New Data:", typeNewData.data);
  
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
  
      // Dispatch actions to update state
      dispatch(setTypes([...settingstate.types, newType]));
      dispatch(setCategoryType(""));
      closeTypeModal();
  
      // Debugging: log before alert
      // console.log("About to alert success message");
  
      alert("Category Type added successfully!");
    } catch (error) {
      // Detailed error logging
      console.error("Error adding category type:", error);
  
      // Provide user feedback
      alert("Failed to add category type. Please try again.");
    }
  };
  
  
  const generatePreview = (categoryId, typeName) => {
    if (!categoryId || !typeName) return;
    const createEmail = `Please give a "${getCategoryNameById(categoryId)}" related "${typeName}" email!`;
    dispatch(setPreviewContent(createEmail));
  };

  const getCategoryNameById = (categoryId) => {
    const selectedCategory = settingstate.categories.find((category) => category.categoryId === categoryId);
    return selectedCategory ? selectedCategory.categoryName : "";
  };

  

  const handleDeleteType = async (typeId) => {
    try {
      const headers = { 'Authorization':`Bearer ${token}`};
      await axios.delete(`https://balaramesh8265.pythonanywhere.com/deleteList/${typeId}`,{headers});
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
       

    <ListExample/>
    
       <div className="row mt-5">
        <div className="col-lg-6 col-12 d-flex ms-auto">
          <div className="dropleft ms-auto">
            <button className="btn bg-gradient-dark" type="button" onClick={openModal}>
              ADD
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12 position-relative z-index-2">
          <div className="card mb-4 ">
            <div className="d-flex">
              <div className="icon icon-shape icon-lg bg-gradient-success shadow text-center border-radius-xl mt-n3 ms-4">
                <i className="material-icons opacity-10" aria-hidden="true">language</i>
              </div>
              <h6 className="mt-3 mb-2 ms-3 "> Email Recipients</h6>
            </div>
            <div className="card-body p-3">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="table-responsive">
                     <table className="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th className="text-uppercase text-xxs font-weight-bolder opacity-7 text-center fs-6">ID</th>
                    <th className="text-uppercase text-xxs font-weight-bolder opacity-7 ps-2 text-center fs-6">Email Recipients</th>
                    <th className="text-uppercase text-xxs font-weight-bolder opacity-7 ps-2 text-center fs-6">Email Recipients</th>
                  </tr>
                </thead>
                <tbody>

                {settingstate.categories.map((category, i) => (
                  <tr key={category.categoryId}>
                    <td className="text-sm text-center"> <p className="mb-0 font-weight-normal text-sm">{i + 1}</p></td>
                    <td className="text-sm text-center"><p className="mb-0 font-weight-normal text-sm">{category.categoryName}</p></td>
                    <td className="text-sm text-center">
                      <button className="btn btn-secondary btn-sm fs-6" onClick={() => openTypeModal(category.categoryId)}>Add Email Type</button>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <center>
        <div className="form" style={{ textAlign: "center" }}>
          <h1>Create Email Recipients</h1>
          <button type="button" onClick={openModal}>
            Add New Recipients
          </button>
        </div>
      </center> */}

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

      {/* {settingstate.categories.length > 0 && (
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
      )} */}

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
                {settingstate.types.map((type, i) => (
                  <tr key={type.typeId}>
                    <td>{i + 1}</td>
                    <td>{type.typeName}</td>
                    <td>{getCategoryNameById(type.categoryId)}</td>
                    <td>
                      <button onClick={() => handleDeleteType(type.typeId)}>Delete</button>
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
