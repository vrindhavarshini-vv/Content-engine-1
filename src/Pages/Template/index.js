import React, { useEffect, useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import { db } from "../Firebase/firebase";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import "./index.css";
import { useSelector, useDispatch } from "react-redux";
import {
  setFbCategory,
  setFbType,
  setSelectedCategory,
  setCategoryAndTypes,
  setFbGeneratedDatas,
} from "../../Routes/Slices/templateSlice";
import Dashboard from "../Generate/Dashboard";
import axios from "axios";

const Template = () => {
  const dispatch = useDispatch();
  const {
    fbCategory,
    fbType,
    selectedCategory,
    categoryAndTypes,
    fbGeneratedDatas,
  } = useSelector((state) => state.template);
  const [selectType, setSelectType] = useState();
  const [newData, setNewData] = useState([]);
  const [content, setContent] = useState("");
  const [selectTemplate, setSelectTemplate] = useState([]);
  const [regen, setRegen] = useState(false);

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
      id: doc.id,
      ...doc.data(),
    }));
    dispatch(setFbGeneratedDatas(template));
  };
  // console.log(fbGeneratedDatas)

  const fetchCategoryWithType = () => {
    const categoryTypes = fbCategory.map((category) => {
      const typesForCategory = fbType
        .filter((type) => type.categoryId === category.categoryId)
        .map((doc) => doc.type);
      return { category, types: typesForCategory };
    });
    const selectCat = categoryTypes.slice();
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
              id: template.id,
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
    console.log("selectedCategory:", selectedCategory);
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
  console.log(selectType);

  const handleTemplateBlur = (e) => {
    setContent(e.target);
  };

  const updateTemplate = async (temp) => {
    setSelectTemplate(temp);
    console.log(temp);
  };
  const reGenerate = () => {
    setRegen(true);
  };
  console.log(selectType);
  return (
    <div>
      <h2>Welcome to the template page</h2>
      <h5>Select Category</h5>
      <div>
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
                    <div>
                      <div
                        contentEditable
                        onBlur={(e) => handleTemplateBlur(e, i, j)}
                      >
                        {temp.template}
                      </div>
                      <div>
                        <Button
                          variant="success"
                          onClick={() => updateTemplate(temp)}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          ))}
          <button type="button" onClick={reGenerate}>
            Re-generate
          </button>
        </div>
      )}

      <Modal show={regen} onHide={() => setRegen(false)}>
        <center>
          <Modal.Header closeButton>
            <Modal.Title>You can Regenerate your template!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Dashboard />
            {selectedCategory && (
              <select>
                <option selected>
                  {selectedCategory.category.categoryName}
                </option>
              </select>
            )}
            {selectType && (
              <select>
                {selectType.map((doc, i) => (
                  <option key={i} selected>
                    {doc.type.type}
                  </option>
                ))}
              </select>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setRegen(false)}>
              Close
            </Button>
          </Modal.Footer>
        </center>
      </Modal>
    </div>
  );
};

export default Template;
