import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button, Table, Navbar } from "react-bootstrap";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import {
  setCategories,
  setTypes,
  setCategoryName,
  setCategoryType,
  setSelectedCategory,
  setShowModal,
  setPreviewContent,
} from "../../Routes/Slices/settingsLogin";
import "./index.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Navbar/index.css";
import NavComponent from "../Navbar";



export default function Categories() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const settingstate = useSelector((state) => state.settings);

  const [showTypeModal, setShowTypeModal] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  const token = localStorage.getItem("token")
  const currentLoginUserId = localStorage.getItem("userId")
  console.log("token",token);
  const headers = {'Authorization':`Bearer ${token}`}

  const fetchCategories = async () => {
    try {
      const categoriesSnapshot = await axios.get(`https://virundhavarshini.pythonanywhere.com/dataBaseCategory/${currentLoginUserId}`,{headers});
      dispatch(setCategories(categoriesSnapshot.data));
      console.log("categoriesSnapshot", categoriesSnapshot.data);
    } catch (error) {
      console.error("Error fetching categories: ", error);
      // alert("Failed to fetch categories. Please try again.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchTypes = async (categoryId) => {
    if (!categoryId) return;
    try {
      const typesSnapshot = await axios.get(`https://virundhavarshini.pythonanywhere.com/settingGetType/${categoryId}`,{headers});
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
      formData.append('userId',currentLoginUserId)
      
      const categoryRef = await axios.post("https://virundhavarshini.pythonanywhere.com/postCategory",formData,{headers});
      fetchCategories();
    
      const newCategory = {
        categoryId: categoryRef.data.categoryId,
        categoryName: settingstate.categoryName,
        userId:categoryRef.data.userId
      };
      console.log('neC',newCategory)
      dispatch(setCategories([...settingstate.categories, newCategory]));
      dispatch(setCategoryName(""));
      closeModal();
      alert("Category added successfully!");
      navigate('/user/setting')
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
    console.log('cc',currentCategoryId)
    console.log('ct',settingstate.categoryType)
    if (!currentCategoryId || !settingstate.categoryType) {
      alert("Please select a category and enter a category type");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("typeName", settingstate.categoryType);
      formData.append("categoryId", currentCategoryId);
      formData.append('userId',currentLoginUserId)
      await axios.post("https://virundhavarshini.pythonanywhere.com/postType",formData,{headers});
      console.log("test",formData);
      const typeNewData = await axios.get(`https://virundhavarshini.pythonanywhere.com/dataBaseType/${currentLoginUserId}`,{headers});
      fetchCategories();
      
      const latestType = typeNewData.data.find(
        (type) => type.typeName === settingstate.categoryType && type.categoryId === currentCategoryId
      );

      if (!latestType) {
        alert("New type not found in response");
      }

      const newType = {
        typeId: latestType.typeId,
        typeName: latestType.typeName,
        categoryId: latestType.categoryId,
      };
      dispatch(setTypes([...settingstate.types, newType]));
      dispatch(setCategoryType(""));
      closeTypeModal();
      alert("Category Type added successfully!");
    } catch (error) {
      console.error("Error adding category type:", error);
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
      await axios.delete(`https://virundhavarshini.pythonanywhere.com/deleteList/${typeId}`,{headers});
      dispatch(setTypes(settingstate.types.filter((type) => type.typeId !== typeId)));
      alert("Type deleted successfully!");
    } catch (error) {
      console.error("Error deleting type: ", error);
      alert("Failed to delete type. Please try again.");
    }
  };

  

  return (
    <>
    <center>
      <div className="settingsPageContianer">
     <header>
              <NavComponent/>
      </header>
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
              <h6 className="mt-3 mb-2 ms-3 ">Create Email Recipients</h6>
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
      </div>
      </center>
    </>
  );
}
