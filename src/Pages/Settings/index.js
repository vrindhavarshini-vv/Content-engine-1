
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
  query,
  where
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
    } catch (error) {
      console.error("Error fetching categories: ", error);
      alert("Failed to fetch categories. Please try again.");
    }
  };

  const fetchTypes = async (categoryId) => {
    if (!categoryId) return;  
      try {
        const typesQuery = query(
          collection(db, "type"),
          where("uid", "==", adminLoginData.uid), // Filter by uid
          where("categoryId", "==", categoryId) // Filter by categoryId
        );
      const typesSnapshot = await getDocs(typesQuery);
      const typesList = typesSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().type,
        categoryId: doc.data().categoryId,
        uid: doc.data().uid,
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

  const openTypeModal = (categoryId) => {
    setCurrentCategoryId(categoryId);
    dispatch(setSelectedCategory(categoryId));
    setShowTypeModal(true);
    fetchTypes(categoryId); 
    // generatePreview(categoryId, settingstate.categoryType);
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
    generatePreview(currentCategoryId, e.target.value);
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
      fetchTypes(currentCategoryId); // Refresh types list after adding a new type

    } catch (error) {
      console.error("Error adding category type: ", error);
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

  const uid = localStorage.getItem("uid");

  return (
    <>
      <center>
        <header>
          <ListExample />
        </header>
        <div className="form" style={{ textAlign: 'center' }}>
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
                {settingstate.categories
                  .filter((e) => e.uid === uid)
                  .map((category, i) => (
                    <tr key={category.id}>
                      <td>{i + 1}</td>
                      <td>{category.categoryName}</td>
                      <td>
                        <button onClick={() => openTypeModal(category.id)}>
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
                {settingstate.types
                  .filter((e) => e.uid === uid)
                  .map((type, i) => (
                    <tr key={type.id}>
                      <td>{i + 1}</td>
                      <td>{type.name}</td>
                      <td>{getCategoryNameById(type.categoryId)}</td>
                      <td>
                        <button onClick={() => handleDeleteType(type.id)}>Delete</button>
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
