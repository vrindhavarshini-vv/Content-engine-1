import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { db } from "../Firebase/firebase";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { collection, doc, getDocs } from "firebase/firestore";
import "./index.css";
import { useSelector, useDispatch } from "react-redux";
import {
  setFbCategory,
  setFbType,
  setSelectedCategory,
  setCategoryAndTypes,
  setFbGeneratedDatas
} from "../../Routes/Slices/templateSlice";
import ContentEditable from "react-contenteditable";

const Template = () => {
  const dispatch = useDispatch();
  const { fbCategory, fbType, selectedCategory,categoryAndTypes,fbGeneratedDatas } = useSelector(
    (state) => state.template
  );
  const [selectType, setSelectType] = useState();
  const [newData, setNewData] = useState([]);
  const [content,setContent] = useState('')

  const fetchCategory = async () => {
    const querySnapshot = await getDocs(collection(db, "category"));
    const categories = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
    dispatch(setFbCategory(categories));
  };
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
    dispatch(setFbGeneratedDatas(template));
  };

  const fetchCategoryWithType = () => {
    const categoryTypes = fbCategory.map((category) => {
      const typesForCategory = fbType
        .filter((type) => type.categoryId === category.categoryId)
        .map((doc) => doc.type);
      return { category, types: typesForCategory };
    });
    const selectCat = categoryTypes.slice()
    dispatch(setCategoryAndTypes(selectCat));
  };
  console.log(categoryAndTypes);

  const templateInsideTypes = () => {
    const cat = fbCategory.map((category) => {
      const typesForCategory = fbType
        .filter((type) => type.categoryId === category.categoryId)
        .map((type) => {
          const templatesForType = fbGeneratedDatas.filter(
            (data) => data.typeId === type.typeId
          );
          return {
            type: type.type,
            templates: templatesForType.map((template) => ({
              template: template.templates,
            })),
          };
        });
      return { category, types: typesForCategory };
    });
    setNewData(cat);
  };

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
  const handleTypeClick = (clickType) => {
    const selectedTemplates = [];
  
    newData.forEach((user) => {
      user.types.forEach((type) => {
        if (type.type === clickType) {
          selectedTemplates.push({ type });
        }
      });
    });
  
    setSelectType(selectedTemplates);
  };
  
  const handleTemplateBlur = (e)=>{
    setContent(e.target)
  }
  // console.log(content)

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
              onClick={() => handleTypeClick(type)}
              data-index={i}
              style={{ width: "20.8rem" }}
            >
              <Card.Body>
                <Card.Subtitle className="mb-2 text-muted">
                  <h6>Type for {selectedCategory.category.categoryName}</h6>
                </Card.Subtitle>
                <Card.Title>{type}</Card.Title>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* {selectType && (
        <div>
          <h5>Select Template for {selectType.map(doc=>doc.type.type)}</h5>
          <Card
              className="cardss"
              // key={i}
              // onClick={() => handleTypeClick(type)}
              // data-index={i}
              style={{ width: "30rem" }}
            >
              <Card.Body>
                  {selectType.map(doc=>doc.type.templates.map(temp=>temp.template))}
                
              </Card.Body>
            </Card>
          
        </div>
      )} */}
      {selectType && (
  <div>
    {/* <h5>Select Template for {selectType.map(doc => doc.type.type)}</h5> */}
    {selectType && (
  <div>
    {selectType.map((doc, i) => (
      <div key={i}>
        <h5>Select Template for {doc.type.type}</h5>
        {doc.type.templates.map((temp, j) => (
          <Card
            key={j}
            className="cardss"
            style={{ width: "30rem", marginBottom: "10px" }}
          >
            <Card.Body>
              <ContentEditable
                html={temp.template} // Set the initial HTML content for the ContentEditable
                tagName="div" // Specify the HTML tag to use for the editable content
                onBlur={(e) => handleTemplateBlur(e, i, j)} // Handle blur event to save changes
              />
            </Card.Body>
          </Card>
        ))}
      </div>
    ))}
  </div>
)}

  </div>
)}

    </>
  );
};

export default Template;