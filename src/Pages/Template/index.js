
import React, { useEffect, useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import axios from "axios";
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
import { useNavigate } from "react-router-dom";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const Template = () => {
  const token = localStorage.getItem("token");
  const currentLoginUserId = localStorage.getItem("userId");
  const headers = { 'Authorization': `Bearer ${token}` };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    fbCategory = [],
    fbType = [],
    selectedCategory = [],
    categoryAndTypes = [],
    fbGeneratedDatas = [],
    categoryWithTypesWithTemplates = [],
    selectTemplate = {},
  } = useSelector((state) => state.template);

  const [selectType, setSelectType] = useState([]);
  const [regen, setRegen] = useState(false);

  const fetchCategory = async () => {
    try {
      const dbCategory = await axios.get(
        `https://pavithrakrish95.pythonanywhere.com/settingGetList/${currentLoginUserId}`
      );
      dispatch(setFbCategory(dbCategory.data));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTypes = async () => {
    try {
      const dbType = await axios.get(
        `https://pavithrakrish95.pythonanywhere.com/settingGetAllType/${currentLoginUserId}`
      );
      dispatch(setFbType(dbType.data));
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const fetchTemplate = async () => {
    try {
      const dbTemplate = await axios.get(
        `https://pavithrakrish95.pythonanywhere.com/dataBaseGetGeneratedDatas/${currentLoginUserId}`
      );
      dispatch(setFbGeneratedDatas(dbTemplate.data));
      console.log('te',dbTemplate.data)
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
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
              id: template.generatedDataId,
            })),
          };
        });
      return { category, types: typesForCategory };
    });
    dispatch(setCategoryWithTypesWithTemplates(cat));
  };

  useEffect(() => {
    fetchCategory();
    fetchTypes();
    fetchTemplate();
  }, []);

  useEffect(() => {
    if (selectType.length > 0) {
      templateInsideTypes();
    }
  }, [selectType, fbCategory, fbType, fbGeneratedDatas]);

  const handleCategoryClick = (categoryId, categoryName) => {
    const types = fbType.filter((type) => type.categoryId === categoryId);
    dispatch(setSelectedCategory(types));
  };

  const handleTypeClick = (typeId) => {
    const selectedTemplates = fbGeneratedDatas.filter(
      (data) => data.typeId === typeId
    );
    setSelectType(selectedTemplates);
  };

  const handleTemplateSelected = (temp, datas, id) => {
    dispatch(setSelectTemplate({ temp, datas, id }));
    setRegen(true);
  };
  console.log('t',selectTemplate)

  const handleRegenerateToDashboard = () => navigate("/dashboard");
  const handleContentEdit = (e) => {
    const editedTemplate = { ...selectTemplate, temp: e.target.value };
    dispatch(setSelectTemplate(editedTemplate));
  };

  const handleSubmit = () => {
    navigate(`/finalPage/${selectTemplate.id}/${currentLoginUserId}`);
  };

  return (
    <>
      <h2 style={{ color: 'white' }} className="fs-2 text-center">Welcome to the template page</h2>
      <h5 style={{ color: 'white' }} className="fs-3 mt-4">Select Category</h5>

      <div className="row mt-5">
        {fbCategory.map((cat, i) => (
          <div className="col-md-3" key={i}>
            <div className="card">
              <div className="card-body text-center">
                <p className="card-text cat">{cat.categoryName}</p>
                <button
                  className="btn bg-gradient-success mb-0 mx-auto"
                  onClick={() => handleCategoryClick(cat.categoryId, cat.categoryName)}
                  style={{ width: "10rem", cursor: "pointer" }}
                >
                  Choose
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCategory && (
        <div className="row mt-5">
          <h5 style={{ color: 'white' }} className="fs-3">Select Email Type</h5>
          {selectedCategory.map((typ, i) => (
            <div className="col-md-3" key={i}>
              <div className="card">
                <div className="card-body text-center">
                  <p className="card-text cat">{typ.typeName}</p>
                  <button
                    className="btn bg-gradient-success mb-0 mx-auto"
                    onClick={() => handleTypeClick(typ.typeId)}
                    style={{ width: "10rem", cursor: "pointer" }}
                  >
                    Choose
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectType && (
        <div className="row mt-5">
          <h5 style={{ color: 'white' }} className="fs-3">Select Template</h5>
          {selectType.map((temp, i) => (
            <div className="col-md-5" key={i}>
              <div className="card">
                <div className="card-body text-start">
                  <p className="card-text">{temp.templates}</p>
                  <button
                    className="btn bg-gradient-success mb-0 mx-auto text-center"
                    onClick={() => handleTemplateSelected(temp.templates, temp.datas, temp.generatedDataId)}
                    style={{ width: "10rem", cursor: "pointer" }}
                  >
                    Choose
                  </button>
                </div>
              </div>
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
            value={selectTemplate.temp || ""}
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
      </Modal>
    </>
  );
};

export default Template;
