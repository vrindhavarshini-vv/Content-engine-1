import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { db } from "../Firebase/firebase";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { collection, getDocs } from "firebase/firestore";
import "./index.css";
import { useSelector, useDispatch } from "react-redux";
import {
  setFbCategory,
  setFbType,
  setSelectedCategory,
} from "../../Routes/Slices/templateSlice";

const Template = () => {
  const dispatch = useDispatch();
  const { fbCategory, fbType, selectedCategory } = useSelector(
    (state) => state.template
  );
  const [categoryAndTypes, setCategoryAndTypes] = useState([]);

  const fetchCategory = async () => {
    const querySnapshot = await getDocs(collection(db, "category"));
    const categories = querySnapshot.docs.map((doc) => ({
      ...doc.data()
    }));
    dispatch(setFbCategory(categories));
  };
  // console.log(fbCategory)
  const fetchTypes = async () => {
    const querySnapShot = await getDocs(collection(db, "type"));
    const types = querySnapShot.docs.map((doc) => ({
      ...doc.data()
    }));
    dispatch(setFbType(types));
  };

  const fetchCategoryWithType = () => {
    const categoryTypes = fbCategory.map((category) => {
      const typesForCategory = fbType
        .filter((type) => type.categoryId === category.categoryId)
        .map((doc) => doc.type);
      return { category, types: typesForCategory };
    });
    setCategoryAndTypes(categoryTypes);
    // console.log(categoryAndTypes)
  };
  console.log(categoryAndTypes);


  useEffect(() => {
    fetchCategory();
    fetchTypes();
    fetchCategoryWithType();
  },[]);


  const handleCategoryClick = async (eachCategory) => {
    dispatch(setSelectedCategory(eachCategory));
    console.log('selectedCategory:', eachCategory);
  };



  return (
    <>
      <h2>Welcome to the template page</h2>

      <h5>Select Category</h5>

      <div typeof="button">
        {categoryAndTypes.map((category, i) => (
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
              <Card.Title>{category.category.categoryName}</Card.Title>
            </Card.Body>
          </Card>
        ))}
      </div>

      {selectedCategory && (
  <div>
    <h5>Types for {selectedCategory.category.categoryName}</h5>
    {selectedCategory.types.map((type, i) => (
      <Card
        className="cardss"
        key={i}
        data-index={i}
        style={{ width: "20rem" }}
      >
        <Card.Body>
          <Card.Subtitle className="mb-2 text-muted">
            Select Type
          </Card.Subtitle>
          <Card.Title>{type}</Card.Title>
        </Card.Body>
      </Card>
    ))}
  </div>
)}

      {/* <h5>{JSON.stringify(categoryAndTypes)}</h5> */}
    </>
  );
};

export default Template;
