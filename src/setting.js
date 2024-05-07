// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// // import { NavLink, useNavigate } from "react-router-dom";
// import { db } from "./Pages/Firebase/firebase";
// import {
//   addDoc,
//   collection,
//   getDocs,
//   where,
//   query,
//   doc,
//   updateDoc
// } from "firebase/firestore";
// import { useSelector } from "react-redux";

// export default function Categories() {
//   const { adminLoginData } = useSelector((state) => state.adminLogin);
//   const [categories, setCategories] = useState([]);
//   const [categoryType, setCategoryType] = useState("");
// //   const [categoriesType, setCategoriesType] = useState([]);
//   const [categoryName, setCategoryName] = useState("");
//   const [categoryTypeName, setCategoryTypeName] = useState("")
//   const navigate = useNavigate();
//   const documentData={name:"",

// }
//   const handleCategoryNameChange = (e) => {
//     setCategoryName(e.target.value);
//   };
//   const handleCategoryTypeChange = (e) => {
//     setCategoryType(e.target.value);
//   };

//   const createCategory = async () => {
// 	if (!categoryName || !categoryType) {
//       alert("Please enter a category name");
//       return;
//     }
//     try {
//       const docRef = await addDoc(collection(db, "category",documentData), {
//         category: categoryName,
// 	      uid: adminLoginData.uid,
//         // id: categoryId,
//       });
//       const documentId = docRef.id;
//       await updateDoc(doc(db, collectionName, documentId), { id: documentId });
//       console.log(documentId)
//       // const categoriesSnapshot = await getDocs(collection(db, "category"));
//     //   const updatedCategories = categoriesSnapshot.docs.map((doc) => ({
//     //     id: doc.id,
//     //     category: doc.data().category,
// 		// type:doc.data().type
//     //   }));
     
//       addDocumentWithIdField("catagory",documentData)
//       setCategories(Categories);
//       setCategoryName("");
// 	  setCategoryType("")
// 	  // Clear input field after adding category
//       alert("Category added successfully!");
//       } 
// 	catch (error) {
//       console.error("Error adding category: ", error);
//       alert("Failed to add category. Please try again.");
//     }
//   };

//   return (
//     <div className="form">
//       <h1>Create Categories</h1>
//       <div>
//         <label>Category Name:</label>
//         <input
//           type="text"
//           value={categoryName}
//           onChange={handleCategoryNameChange}
//           placeholder="Enter category name"
//         />
		 
//       </div>
// 	  <div>
//         <label>Category Type:</label>
//         <input
//           type="text"
//           value={categoryType}
//           onChange={handleCategoryTypeChange}
//           placeholder="Enter category type"
//         />
//         <button type="button" onClick={createCategory}>
//           Add Category
//         </button>
//       </div>

//       {categories.length > 0 && (
//         <div>
//           <h2>Category List:</h2>
//           <table border={1}>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Category Name</th>
//               </tr>
//             </thead>
//             <tbody>
//               {categories.map((cat) => (
//                 <tr key={cat.id}>
//                   <td>{cat.id}</td>
//                   <td>{cat.category}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
// 		  <table border={1}>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Category Type</th>
//               </tr>
//             </thead>
//             <tbody>
//               {categories.map((cat) => (
//                 <tr key={cat.id}>
//                   <td>{cat.id}</td>
//                   <td>{cat.type}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }




// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { db } from "./Pages/Firebase/firebase";
// import {
//   addDoc,
//   collection,
//   getDocs,
//   updateDoc,
//   doc,
// } from "firebase/firestore";
// import { useSelector } from "react-redux";

// export default function Categories() {
//   const { adminLoginData } = useSelector((state) => state.adminLogin);
//   const [categories, setCategories] = useState([]);
//   const [categoryName, setCategoryName] = useState("");
//   const [categoryType, setCategoryType] = useState("");
//   const navigate = useNavigate();

//   const handleCategoryNameChange = (e) => {
//     setCategoryName(e.target.value);
//   };

//   const handleCategoryTypeChange = (e) => {
//     setCategoryType(e.target.value);
//   };

//   const createCategory = async () => {
//     if (!categoryName || !categoryType) {
//       alert("Please enter both category name and type");
//       return;
//     }

//     try {
//       const docRef = await addDoc(collection(db, "category"), {
//         name: categoryName,
//         type: categoryType,
//         uid: adminLoginData.uid,
//       });

//       const documentId = docRef.id;
//       await updateDoc(doc(db, "category", documentId), { id: documentId });

//       setCategoryName("");
//       setCategoryType("");

//       // Fetch updated categories after adding a new one
//       const categoriesSnapshot = await getDocs(collection(db, "category"));
//       const updatedCategories = categoriesSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         name: doc.data().name,
//         type: doc.data().type,
//       }));

//       setCategories(updatedCategories);
//       alert("Category added successfully!");
//     } catch (error) {
//       console.error("Error adding category: ", error);
//       alert("Failed to add category. Please try again.");
//     }
//   };

//   return (
//     <div className="form">
//       <h1>Create Categories</h1>
//       <div>
//         <label>Category Name:</label>
//         <input
//           type="text"
//           value={categoryName}
//           onChange={handleCategoryNameChange}
//           placeholder="Enter category name"
//         />
//       </div>
//       <div>
//         <label>Category Type:</label>
//         <input
//           type="text"
//           value={categoryType}
//           onChange={handleCategoryTypeChange}
//           placeholder="Enter category type"
//         />
//         <button type="button" onClick={createCategory}>
//           Add Category
//         </button>
//       </div>

//       {categories.length > 0 && (
//         <div>
//           <h2>Category List:</h2>
//           <table border={1}>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Category Name</th>
//                 <th>Category Type</th>
//               </tr>
//             </thead>
//             <tbody>
//               {categories.map((cat) => (
//                 <tr key={cat.id}>
//                   <td>{cat.id}</td>
//                   <td>{cat.name}</td>
//                   <td>{cat.type}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { db } from "./Pages/Firebase/firebase";
// import {
//   addDoc,
//   collection,
//   getDocs,
//   updateDoc,
//   doc
// } from "firebase/firestore";
// import { useSelector } from "react-redux";

// export default function Categories() {
//   const { adminLoginData } = useSelector((state) => state.adminLogin);
//   const [categories, setCategories] = useState([]);
//   const [types, setTypes] = useState([]);
//   const [categoryName, setCategoryName] = useState("");
//   const [categoryType, setCategoryType] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCategories();
//     fetchTypes();
//   }, []);

//   const fetchCategories = async () => {
//     const categoriesSnapshot = await getDocs(collection(db, "category"));
//     const categoriesList = categoriesSnapshot.docs.map((doc) => ({
//       id: doc.id,
//       name: doc.data().name,
//     }));
//     setCategories(categoriesList);
//   };

//   const fetchTypes = async () => {
//     const typesSnapshot = await getDocs(collection(db, "type"));
//     const typesList = typesSnapshot.docs.map((doc) => ({
//       id: doc.id,
//       name: doc.data().name,
//       categoryId: doc.data().categoryId,
//     //   uid: doc.data().uid, // Assuming uid is stored in Firestore
//     }));
//     setTypes(typesList);
  
 
// }
// const fetchTypesId=async()=>{
// const typeid=await addDoc(collection(db,"type"))
// const typeId=typeid.docs.map((doc)=>({
//   uid: doc.data().uid
// }))
// }

//   const handleCategoryNameChange = (e) => {
//     setCategoryName(e.target.value);
//   };

//   const handleCategoryTypeChange = (e) => {
//     setCategoryType(e.target.value);
//   };

//   const createCategory = async () => {
//     if (!categoryName) {
//       alert("Please enter a category name");
//       return;
//     }

//     try {
//       const categoryData = {
//         name: categoryName,
//         uid: adminLoginData.uid, // Set uid to current user's uid
//       };

//       const categoryRef = await addDoc(collection(db, "category"), categoryData,categoryData.id);
//       const categoryDocId = categoryRef.id;
//       setCategoryName(""); // Clear category name input
//       await updateDoc(doc(db,"category",categoryDocId),
//       {
//         id:categoryDocId}
//     )

//       const typeData = {
//         name: categoryType,
//         categoryId: categoryDocId,
//         uid: adminLoginData.uid, // Set uid to current user's uid
//       };

//       const typeRef = await addDoc(collection(db, "type"), typeData);
//     //   const typeId = typeRef.id;
//       setCategoryType(""); // Clear category type input

//       alert("Category and Type added successfully!");
//       fetchCategories(); // Refresh categories list
//       fetchTypes(); // Refresh types list
//     } catch (error) {
//       console.error("Error adding category and type: ", error);
//       alert("Failed to add category and type. Please try again.");
//     }
//   };

//   return (
//     <div className="form">
//       <h1>Create Categories</h1>
//       <div>
//         <label>Category Name:</label>
//         <input
//           type="text"
//           value={categoryName}
//           onChange={handleCategoryNameChange}
//           placeholder="Enter category name"
//         />
        
//       </div>
//       <div>
//         <label>Category Type:</label>
//         <input
//           type="text"
//           value={categoryType}
//           onChange={handleCategoryTypeChange}
//           placeholder="Enter category type"
//         />
//         <button type="button" onClick={createCategory}>
//           Add Category & Type
//         </button>
//       </div>

//       {categories.length > 0 && (
//         <div>
//           <h2>Categories List:</h2>
//           <table border={1}>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Category Name</th>
//               </tr>
//             </thead>
//             <tbody>
//               {categories.map((cat,i) => (
//                 <tr key={i}>
//                   <td>{i+1}</td>
//                   <td>{cat.name}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {types.length > 0 && (
//         <div>
//           <h2>Types List:</h2>
//           <table border={1}>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Type Name</th>
//                 <th>Category ID</th>
                
//               </tr>
//             </thead>
//             <tbody>
//               {types.map((type,i) => (
//                 <tr key={i}>
//                   <td>{i+1}</td>
//                   <td>{type.name}</td>
//                   <td>{type.categoryId}</td>
                  
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// import React from "react";
// import { useEffect,useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { db } from "./Pages/Firebase/firebase";
// import { addDoc, collection, getDocs, updateDoc, doc } from "firebase/firestore";
// import { useSelector } from "react-redux";
// const [categoryName, setCategoryName] = useState('');
// const [showModal, setShowModal] = useState(false);

// export default function Categories() {
//   const { adminLoginData } = useSelector((state) => state.adminLogin);
//   const [categories, setCategories] = useState([]);
//   const [types, setTypes] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(""); // State to store selected category
//   const [categoryType, setCategoryType] = useState("");
//   const openModal = () => {
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//   };
//   const handleCategorySubmit = () => {
//     if (categoryName.trim() !== '') {
//       setCategories([...categories, categoryName.trim()]);
//       setSelectedCategory(categoryName.trim());
//       setCategoryName('');
//       closeModal();
//     }
//   };
  
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCategories();
//     fetchTypes();
//   }, []);

//   const fetchCategories = async () => {
//     const categoriesSnapshot = await getDocs(collection(db, "category"));
//     const categoriesList = categoriesSnapshot.docs.map((doc) => ({
//       id: doc.id,
//       name: doc.data().name,
//     }));
//     setCategories(categoriesList);
//   };

//   const fetchTypes = async () => {
//     const typesSnapshot = await getDocs(collection(db, "type"));
//     const typesList = typesSnapshot.docs.map((doc) => ({
//       id: doc.id,
//       name: doc.data().name,
//       categoryId: doc.data().categoryId,
//     }));
//     setTypes(typesList);
//   };

//   const handleCategoryChange = (e) => {
//     const selectedCategoryId = e.target.value;
//     setSelectedCategory(selectedCategoryId);
//   };
  

//   const handleCategoryTypeChange = (e) => {
//     setCategoryType(e.target.value);
//   };

//   const createCategory = async () => {
//     if (!selectedCategory) {
//       alert("Please select a category");
//       return;
//     }

//     try {
//       const categoryData = {
//         categoryId: selectedCategory,
//         name: categories.find((cat) => cat.id === selectedCategory)?.name,
//         uid: adminLoginData.uid,
//       };

//       const typeData = {
//         name: categoryType,
//         categoryId: selectedCategory,
//         uid: adminLoginData.uid,
//       };

//       await addDoc(collection(db, "type"), typeData);

//       setCategoryType(""); // Clear category type input

//       alert("Category and Type added successfully!");
//       fetchTypes(); // Refresh types list
//     } catch (error) {
//       console.error("Error adding category and type: ", error);
//       alert("Failed to add category and type. Please try again.");
//     }
//   };

//   return (
//     <div className="form">
//      <h1>Create Categories</h1>

//       <button onClick={openModal}>Add New Category</button>

//       <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
//         <option value="">Select a Category</option>
//         {categories.map((category) => (
//           <option key={category} value={category}>
//             {category}
//           </option>
//         ))}
//       </select>

//       {/* Modal for entering new category name */}
//       {showModal && (
//         <div className="modal">
//           <div className="modal-content">
//             <span className="close" onClick={closeModal}>&times;</span>
//             <h2>Enter Category Name</h2>
//             <input
//               type="text"
//               value={categoryName}
//               onChange={(e) => setCategoryName(e.target.value)}
//               placeholder="Category Name"
//             />
//             <button onClick={handleCategorySubmit}>Submit</button>
//           </div>
//         </div>
//       )}

//       {/* Render category type input and button */}
//       {selectedCategory && (
//         <div className="category-type-container">
//           <label htmlFor="categoryType">Category Type:</label>
//           <input
//             type="text"
//             id="categoryType"
//             value={categoryType}
//             onChange={handleCategoryTypeChange}
//             placeholder="Enter category type"
//           />
//           <button onClick={createCategory}>Add Category & Type</button>
//         </div>
//       )}
//     </div>
//     )
//   }
  

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCategories,setTypes,setCategoryName,setShowModal,setSelectedCategory ,setCategoryType} from "./Routes/Slices/settingsLogin";
import { db } from "./Pages/Firebase/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";

export default function Categories() {
  const dispatch = useDispatch();
  const { adminLoginData } = useSelector((state) => state.adminLogin);
  const { categories, types, selectedCategory, categoryName, categoryType, showModal } = useSelector((state) => state.settings);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchTypes();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesSnapshot = await getDocs(collection(db, "category"));
      const categoriesList = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      dispatch(setCategories(categoriesList));
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  const fetchTypes = async () => {
    try {
      const typesSnapshot = await getDocs(collection(db, "type"));
      const typesList = typesSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        categoryId: doc.data().categoryId,
      }));
      dispatch(setTypes(typesList));
    } catch (error) {
      console.error("Error fetching types: ", error);
    }
  };

  const openModal = () => {
    dispatch(setShowModal(true));
  };

  const closeModal = () => {
    dispatch(setShowModal(false));
  };

  const handleCategorySubmit = () => {
    if (categoryName.trim() === '') {
      alert("Please enter a category name");
      return;
    }

    // Dispatch action to update categories in Redux store
    dispatch(setCategories([...categories, { id: categoryName, name: categoryName }]));
    dispatch(setSelectedCategory(categoryName));
    dispatch(setCategoryName('')); // Clear category name input
    closeModal(); // Close the modal
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
      const typeData = {
        name: categoryType,
        categoryId: selectedCategory,
        uid: adminLoginData.uid,
      };

      await addDoc(collection(db, "type"), typeData);

      dispatch(setCategoryType("")); // Clear category type input

      alert("Category and Type added successfully!");
      fetchTypes(); // Refresh types list
    } catch (error) {
      console.error("Error adding category and type: ", error);
      alert("Failed to add category and type. Please try again.");
    }
  };

  return (
    <div className="form">
      <h1>Create Categories</h1>

      <button onClick={openModal}>Add New Category</button>

      <select value={selectedCategory} onChange={(e) => dispatch(setSelectedCategory(e.target.value))}>
        <option value="">Select a Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
          {console.log("cat.Id",category.id)}
            {category.name}
          </option>
        ))}
      </select>

      {/* Modal for entering new category name */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
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

      {/* Display categories list */}
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
              {categories.map((cat, index) => (
                <tr key={cat.id}>
                  <td>{index + 1}</td>
                  <td>{cat.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Display types list */}
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
              {types.map((type, index) => (
                <tr key={type.id}>
                  <td>{index + 1}</td>
                  <td>{type.name}</td>
                  <td>{type.categoryId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Render category type input and button */}
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
