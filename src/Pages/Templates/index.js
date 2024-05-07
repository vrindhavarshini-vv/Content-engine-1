// import React, { useEffect, useState } from "react";
// import { Card } from "react-bootstrap";
// import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
// import { db } from "../Firebase/firebase";
// import { collection, doc, getDoc, getDocs } from "firebase/firestore";
// import "./index.css";
// import { Link } from "react-router-dom";
// import { type } from "@testing-library/user-event/dist/type";

// const Template = () => {
//   const [fbCatogory, setFbCatogory] = useState([]);
//   const [showType, setShowType] = useState(false);
//   const [fbType, setFbType] = useState([]);
  

//   const getCategory = async () => {
//     const querySnapShot = await getDocs(collection(db, "category"));
//     let categoryDate = [];
//     querySnapShot.forEach((doc) => {
//       categoryDate.push(doc.data());
//     });
//     setFbCatogory(categoryDate);
//   };
//   const getType = async () => {
//     const colRef = await getDocs(collection(db, "type"));
//     let types = [];
//     colRef.forEach((doc) => {
//       types.push(doc.data());
//     });
//     setFbType(types);
//   };
//   const selecCategory = (selectedCategory) => {
//     getType()
//     const filteredTypes = fbType.filter(type => type.categoryId === selectedCategory.categoryId);
//     setFbType(filteredTypes);
//     setShowType(true);
//     console.log(fbType)
//   };

//   useEffect(() => {
//     getCategory();
//   }, []);

//   useEffect(() => {
//     if (!showType) {
//       // Clear fbType when a new category is selected
//       setFbType([]);
//     }
//   }, [showType]);
//   return (
//     <>
//       <h2>Welcome to template page</h2>

//       <h5>Selece Category</h5>

//       <div typeof="button">
//         {fbCatogory.map((each, i) => (
//           <Card
//             className="cards"
//             onClick={() => selecCategory(each)}
//             key={i}
//             style={{ width: "10rem" }}
//           >
//             <Card.Body>
//               <Card.Subtitle className="mb-2 text-muted">
//                 Category
//               </Card.Subtitle>
//               <Card.Title>{each.category}</Card.Title>
//             </Card.Body>
//           </Card>
//         ))}
//       </div>
//         {showType && fbType.map((each, i) => (
//         <Card
//           className="cardss"
//           key={i}
//           data-index={i}
//           style={{ width: "10rem" }}
//         >
//           <Card.Body className="wid">
//             <Card.Subtitle className="mb-2 text-muted">
//               Select Type
//             </Card.Subtitle>
//             <Card.Title>{each.type}</Card.Title>
//           </Card.Body>
//         </Card>
//       ))}
//     </>
//   );
// };
// export default Template;


import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { db } from "../Firebase/firebase";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { collection, getDocs } from "firebase/firestore";
import "./index.css";

const Template = () => {
  const [fbCategory, setFbCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fbType, setFbType] = useState([]);
  
  const fetchCategory = async () => {
    const querySnapshot = await getDocs(collection(db, "category"));
    const categories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setFbCategory(categories);
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    const querySnapshot = await getDocs(collection(db, "type"));
    const types = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).filter(type => type.categoryId === category.id);
    setFbType(types);
  };

  return (
    <>
      <h2>Welcome to the template page</h2>

      <h5>Select Category</h5>

      <div typeof="button">
        {fbCategory.map((category, i) => (
          <Card
            className="cards"
            onClick={() => handleCategoryClick(category)}
            key={i}
            style={{ width: "10rem", cursor: "pointer" }}
          >
            <Card.Body>
              <Card.Subtitle className="mb-2 text-muted">
                Category
              </Card.Subtitle>
              <Card.Title>{category.category}</Card.Title>
            </Card.Body>
          </Card>
        ))}
      </div>

      {selectedCategory && (
        <div>
          <h5>Types for {selectedCategory.category}</h5>
          {fbType.map((type, i) => (
            <Card
              className="cardss"
              key={i}
              data-index={i}
              style={{ width: "10rem" }}
            >
              <Card.Body className="wid">
                <Card.Subtitle className="mb-2 text-muted">
                  Select Type
                </Card.Subtitle>
                <Card.Title>{type.type}</Card.Title>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default Template;
