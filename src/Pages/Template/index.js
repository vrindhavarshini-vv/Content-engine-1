import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import {
  setFbCategory,
  setFbType,
  setSelectedCategory,
  setFbGeneratedDatas,
  setSelectTemplate,
} from "../../Routes/Slices/templateSlice";
import "./index.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../Navbar/index";
const Template = () => {
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


  
  const token=localStorage.getItem("__token")
  // console.log(token)
  const user_Id= localStorage.getItem("user_Id")


  const fetchCategory = async () => {
    const headers = { 'Authorization':`Bearer ${token}`};
    const dbCategory = await axios.get( 
       `https://balaramesh8265.pythonanywhere.com/settingGetcategory/${user_Id}`,{ headers }
    );
    dispatch(setFbCategory(dbCategory.data));
    // console.log('data base category',dbCategory.data)
  };

  const fetchTypes = async () => {
    const headers = { 'Authorization':`Bearer ${token}`};
    const dbType = await axios.get(  
      `https://balaramesh8265.pythonanywhere.com/getParticularType/${user_Id}`,{ headers }
    );
    dispatch(setFbType(dbType.data));
    console.log('data base type',dbType.data)
  };

  const fetchTemplate = async () => {
    const headers = { 'Authorization':`Bearer ${token}`};
    const dbTemplate = await axios.get(
    
     `https://balaramesh8265.pythonanywhere.com/getParticulartUsetTemplate/${user_Id}`,{ headers }
    );
    dispatch(setFbGeneratedDatas(dbTemplate.data));
    console.log('database',dbTemplate.data)
  };

  // const fetchCategoryWithType = () => {
  //   const categoryTypes = fbCategory.map((category) => {
  //     const typesForCategory = fbType
  //       .filter((type) => type.categoryId === category.categoryId)
  //       .map((doc) => doc.typeName);
  //     return { category, types: typesForCategory };
  //   });
  //   const selectCat = categoryTypes;
  //   // console.log('selectCat',selectCat)
  //   dispatch(setCategoryAndTypes(selectCat));
  //   // console.log('select cat',selectCat)
  // };

  // const templateInsideTypes = () => {
  //   const cat = fbCategory.map((category) => {
  //     const typesForCategory = fbType
  //       .filter((type) => type.categoryId === category.categoryId)
  //       .map((doc) => {
  //         const templatesForType = fbGeneratedDatas.filter(
  //           (data) => data.typeId === doc.typeId
  //         );
  //         return {
  //           type: doc.typeName,
  //           templates: templatesForType.map((template) => ({
  //             template: template.template,
  //             datas: template.datas,
  //             id:template.generatedDataId
  //           })),
  //         };
  //       });
  //     return { category, types: typesForCategory };
  //   });
  //   const newCat = cat;
  //   console.log("new", newCat);
  //   dispatch(setCategoryWithTypesWithTemplates(newCat));
  // };

  useEffect(() => {
    fetchCategory();
    fetchTypes();
    fetchTemplate();
  }, []);



const handleCategoryClick = async (id, cat) => {
    const filteredTypes = fbType
      .filter((type) => type.categoryId === id)
      .map((type) => ({
        ...type,
        categoryName: cat,
      }));

    return dispatch(setSelectedCategory(filteredTypes));
  };

  console.log("set cat", selectedCategory);

  const handleTypeClick = (id) => {
    const selectedTemplates = fbGeneratedDatas.filter(
      (temp) => temp.typeId === id
    );
    setSelectType(selectedTemplates);
    console.log("selected temp", selectedTemplates);
  };


  const handleTemplateSelected = (temp, datas, id) => {
    dispatch(setSelectTemplate({ temp, datas, id }));
    setRegen(true);
  };
  console.log("gnid", selectTemplate);


  const handleRegenerateToDashboard = () => navigate("/dashboard");
  const handleContentEdit = (e) => {
    dispatch(setSelectTemplate(e.target.value));
  };

  const handleSubmit = (e) => {
    // e.preventDefault();
    // setRegen(false);
    // const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=''&body=${encodeURIComponent(
    //   selectTemplate
    // )}`;
    // window.open(gmailLink, "_blank");
    console.log("datas", categoryWithTypesWithTemplates);
    console.log("select template", selectTemplate);
    console.log("mmmmmmmmmmmmmmmmmmmmm",selectedCategory)
    console.log("oooooooooooooooooooooooo",selectType)
    navigate(`/finalPage/${selectTemplate.id}/${user_Id}`);
  };
  // console.log("ss", selectTemplate);


  return (
    <>
  <center>
  <header>
    <NavBar />
  </header>

  <div>
    {/* <h2 style={{color:'white'}} className="fs-2 text-center">Welcome to the template page</h2> */}
    <h5 style={{ color: 'black', fontFamily: 'Arial, sans-serif' }} className="fs-3 mt-4">Select Email Recipient</h5>

    <div className="row mt-5">
      {fbCategory.map((cat, i) => (
        <div className="col-md-2 mb-4" key={i}>
          <div className="card">
            <div className="card-body text-center">
              <p className="card-text cat">
                <i className="fas fa-user me-1"></i>{cat.categoryName}
              </p>
              <button
                className="btn-class-name"
                onClick={() => handleCategoryClick(cat.categoryId, cat.categoryName)}
                style={{ width: "50%", cursor: "pointer" }}
              >
                <span className="back"></span>
                <span className="front">click</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>

    {selectedCategory && (
  <div className="row mt-5" style={{ position: 'sticky', top: '0', background: 'linear-gradient(89.5deg, rgba(131,204,255,1) 0.4%, rgba(66,144,251,1) 100.3%)' }}>
    <h5 style={{ color: 'black', fontFamily: 'Arial, sans-serif' }} className="fs-3">Select Email Type</h5>
    {selectedCategory.map((typ, i) => (
      <div className="col-md-2 mb-4" key={i}>
        <div className="card">
          <div className="card-body text-center">
            <p className="card-text cat">
              <i className="fas fa-envelope"></i> {typ.typeName}
            </p>
            <button
              className="btn btn-sm bg-gradient-success mb-0 mx-auto"
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

    {selectType.length > 0 && (
      <div className="row mt-5 justify-content-center">
        <h5 style={{ color: 'black', fontFamily: 'Arial, sans-serif' }}  className="fs-3">Select Template</h5>
        <div className="col-md-6">
          <div id="templateCarousel" className="carousel slide" data-bs-ride="carousel">
            
              {selectType.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  data-bs-target="#templateCarousel"
                  data-bs-slide-to={index}
                  className={index === 0 ? 'active' : ''}
                  aria-current={index === 0 ? 'true' : 'false'}
                  aria-label={`Slide ${index + 1}`}
                ></button>
              ))}
           
            <div className="carousel-inner">
              {selectType.map((temp, index) => (
                <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                  <div className="card">
                    <div
                      className="card-body text-start"
                      style={{
                        padding: '20px',
                        borderRadius: '10px',
                        background: 'linear-gradient(89.5deg, rgba(131,204,255,1) 0.4%, rgba(66,144,251,1) 100.3%)'
                      }}
                    >
                      <p className="card-text">{temp.templates}</p>
                      <br />
                      <center>
                        <button
                          className="btn bg-gradient-primary mb-0 mx-auto text-center"
                          onClick={() => handleTemplateSelected(temp.templates, temp.datas, temp.generatedDataId)}
                          style={{ width: '10rem', cursor: 'pointer' }}
                        >
                          Choose
                        </button>
                      </center>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#templateCarousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#templateCarousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
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
  </div>

  <br />
  <br />
  <br />
</center>
</>
  );
};
export default Template;
