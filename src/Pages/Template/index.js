import React, { useEffect, useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import { db } from "../Firebase/firebase";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { collection, getDocs } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import {
  setFbCategory,
  setFbType,
  setSelectedCategory,
  setCategoryAndTypes,
  setFbGeneratedDatas,
  setCategoryWithTypesWithTemplates,
  setSelectTemplate,
} from "../../Routes/Slices/templateSlice";
import "./index.css";
import { useNavigate } from "react-router-dom";
import ListExample from "../Navbar/index";
import axios from "axios";

const Template = () => {
  const token = localStorage.getItem("token")
  const currentLoginUserId = localStorage.getItem("uid")
  const headers = {'Authorization':`Bearer ${token}`}
  const adminSlice = useSelector((state) => state.adminLogin);
  
  console.log("singleUserDetails",adminSlice.adminLoginData)
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    fbCategory,
    fbType,
    selectedCategory,
    categoryAndTypes,
    fbGeneratedDatas,
    categoryWithTypesWithTemplates,
    selectTemplate,
  } = useSelector((state) => state.template);
  const [selectType, setSelectType] = useState([]);
  const [regen, setRegen] = useState(false);
  

  const fetchCategory = async () => {
    const dbCategory = await axios.get(
      `https://pavithrakrish95.pythonanywhere.com/setGetList/${currentLoginUserId}`
    );
    dispatch(setFbCategory(dbCategory.data));
    // console.log('data base category',dbCategory.data)
  };

  const fetchTypes = async () => {
    const dbType = await axios.get(
      `https://pavithrakrish95.pythonanywhere.com/setGetAllType/${currentLoginUserId}`
    );
    dispatch(setFbType(dbType.data));
    // console.log('data base type',dbType.data)
  };

  const fetchTemplate = async () => {
    const dbTemplate = await axios.get(
      `https://pavithrakrish95.pythonanywhere.com/dataBaseGetGeneratedDatas/${currentLoginUserId}`
    );
    dispatch(setFbGeneratedDatas(dbTemplate.data));
     console.log('dbTemplate.data',dbTemplate.data)
  };

 

  const templateInsideTypes = () => {
    const cat = fbCategory.map((category) => {
      const typesForCategory = fbType
        .filter((type) => type.categoryId === category.categoryId)
        .map((doc) => {
          const templatesForType = fbGeneratedDatas.filter(
            (data) => data.typeId === doc.typeId
          );
          return {
            type: doc.typeName,
            templates: templatesForType.map((template) => ({
              template: template.templates,
              datas: template.datas,
              id:template.generatedDataId
            })),
          };
        });
      return { category, types: typesForCategory };
    });
    const newCat = cat;
    console.log("new", newCat);
    dispatch(setCategoryWithTypesWithTemplates(newCat));
  };

  useEffect(() => {
    fetchCategory();
    fetchTypes();
    fetchTemplate();
  }, []);
  useEffect(() => {
    if (selectType) {
      templateInsideTypes();
    }
  }, [selectType]);


  const handleCategoryClick = async (eachCategory) => {
    dispatch(setSelectedCategory(eachCategory));
    console.log("selectCata", selectedCategory);
  };

  const handleTypeClick = (clickType) => {
    const selectedTemplates = [];

    categoryWithTypesWithTemplates.forEach((user) => {
      user.types.forEach((type) => {
        if (type.type === clickType) {
          selectedTemplates.push({ type });
        }
      });
    });

    setSelectType(selectedTemplates);
    console.log("selected temp", selectedTemplates);
  };

  const handleTemplateSelected = (temp, datas,id) => {
    dispatch(setSelectTemplate({ temp, datas,id }));
    setRegen(true);
    // console.log('gnid',selectTemplate)
  };


  const handleRegenerateToDashboard = () => navigate("/dashboard");
  const handleContentEdit = (e) => {
    dispatch(setSelectTemplate(e.target.value));
  };

  const handleSubmit = (e) => {
    
    console.log("datas", categoryWithTypesWithTemplates);
    console.log("select template", selectTemplate);
    navigate(`/finalPage/${selectTemplate.id}/${currentLoginUserId}`);
  };
  
  return (
    <>
      <header>
        <ListExample />
      </header>
      <div>
        <h2>Welcome to the template page</h2>
        <h5>Select Category</h5>
        {/* categoryAndTypes.length */}
        <div>
          {categoryAndTypes
            // .filter((e) => e.category.uid === parsedUid)
            .map((category, i) => (
              <Card
                className="cardss"
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
            <h5>Select Email Type</h5>
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
        {selectType.length > 0 && (
          <div>
            {selectType.map((doc, i) => (
              <div key={i}>
                <h5>Select Template for {doc.type.type}</h5>
                {doc.type.templates.map((temp, j) => (
                  <Card
                    key={j}
                    className="cardss"
                    id="card"
                    style={{ width: "30rem", marginBottom: "10px" }}
                    onClick={() =>
                      handleTemplateSelected(temp.template, temp.datas,temp.id)
                    }
                  >
                    <Card.Body>
                      <div>{temp.template}</div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        )}

        <Modal
          show={regen}
          onHide={() => setRegen(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          dialogClassName="modal-90w"
        >
          <Modal.Header closeButton>
            <Modal.Title>Email Preview! You can edit your email!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <textarea
              value={selectTemplate.temp}
              onChange={handleContentEdit}
              style={{
                width: "100%",
                height: "60vh",
                border: "none",
                padding: "10px",
                fontFamily: "Arial, sans-serif",
                fontSize: "16px",
                backgroundColor: "#f9f9f9",
                resize: "none",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                boxSizing: "border-box",
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" variant="primary" onClick={handleSubmit}>
              Choose Template
            </Button>

            <Button variant="info" onClick={handleRegenerateToDashboard}>
              Re-Generate
            </Button>
            <Button variant="danger" onClick={() => setRegen(false)}>
              Close
            </Button>
          </Modal.Footer>

          {/* </center> */}
        </Modal>
      </div>
    </>
  );
};

export default Template;
