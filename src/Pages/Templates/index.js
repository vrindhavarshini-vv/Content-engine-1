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
  const [fbGeneratedDatas, setFbGeneratedDatas] = useState([]);
  const [selectTemplate, setSelectedTemplate] = useState([]);
  const [newData,setNewData] = useState([])

  const fetchCategory = async () => {
    const querySnapshot = await getDocs(collection(db, "category"));
    const categories = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
    dispatch(setFbCategory(categories));
  };
  // console.log(fbCategory)
  const fetchTypes = async () => {
    const querySnapShot = await getDocs(collection(db, "type"));
    const types = querySnapShot.docs.map((doc) => ({
      typeId: doc.id,
      ...doc.data(),
    }));
    dispatch(setFbType(types));
  };

  const fetchTemplate = async () => {
    const querySnapShot = await getDocs(collection(db, "generatedDatas"));
    const template = querySnapShot.docs.map((doc) => ({
      ...doc.data(),
    }));
    setFbGeneratedDatas(template);
  };
  // console.log("generatedDatas", fbGeneratedDatas);

  const fetchCategoryWithType = () => {
    const categoryTypes = fbCategory.map((category) => {
      const typesForCategory = fbType
        .filter((type) => type.categoryId === category.categoryId)
        .map((doc) => doc.type);
      return { category, types: typesForCategory };
    });
    setCategoryAndTypes(categoryTypes);
    console.log(categoryAndTypes)
  };
  // console.log(categoryAndTypes);

  const templateInsideTypes = ()=>{
    const cat = fbCategory.map(category=>{
      const typ = fbType.find(type=>type.categoryId === category.categoryId)
      const temp = fbGeneratedDatas.find(data=>data.typeId === typ.typeId)
      return{
        category,
        types:{type: typ?.type,
          template: temp ? temp.templates : []}
      }
    })
    setNewData(cat)
  }
  console.log('category with type with templates',newData)
  // const output = a.map(itemA => {
  //   // Find the matching element in array 'b'
  //   const matchB = b.find(itemB => itemB.name === itemA.name);
  //   // Find the matching element in array 'c'
  //   const matchC = c.find(itemC => itemC.type === matchB.type);

  //   return {
  //     name: itemA.name,
  //     type: { typeName: matchC.type, temp: matchC.temp }
  //   };
  // });

  useEffect(() => {
    fetchCategory();
    fetchTypes();
    fetchCategoryWithType();
    fetchTemplate();
    templateInsideTypes();
  }, []);

  const handleCategoryClick = async (eachCategory) => {
    dispatch(setSelectedCategory(eachCategory));
    console.log("selectedCategory:", eachCategory);
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
    </>
  );
};

export default Template;
