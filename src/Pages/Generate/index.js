import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCategoryList, setTypesList, setSelectedCategory, setIsPopUp,
  setIsCategorySelected, setSelectedType, setIsTypeSelected,
  setAnswer, setSelectedCategoryName, setSelectedTypeName,
  setIsApiResponseReceived
} from "../../Routes/Slices/dashBoardSlice";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListExample from '../Navbar';
import emailjs from '@emailjs/browser';
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import axios from 'axios';

import "../Navbar/index.css";
import "./index.css";

function Dashboard() {
  const token = localStorage.getItem("token");
  const currentLoginUserId = localStorage.getItem("userId");

  const slice = useSelector(state => state.dashboardslice);
  const templateSlice = useSelector((state) => state.template);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const headers = { 'Authorization': `Bearer ${token}` };

  const [toEmail, setToEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [pairs, setPairs] = useState([{ key: '', value: '' }]);
  const [updatedContent, setUpdatedContent] = useState("");

  const handleKeyChange = (i, event) => {
    const newPair = [...pairs];
    newPair[i].key = event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1);
    setPairs(newPair);
  };

  const handleValueChange = (i, event) => {
    const newPair = [...pairs];
    newPair[i].value = event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1);
    setPairs(newPair);
  };

  const handleRemoveInputBox = (i) => {
    const newArray = [...pairs];
    newArray.splice(i, 1);
    setPairs(newArray);
  };

  const handleAddPair = () => {
    setPairs([...pairs, { key: '', value: '' }]);
  };

  const handleGenerate = (event) => {
    event.preventDefault();
    dispatch(setIsPopUp(true));
    generateAnswer(); // Call generateAnswer function when Generate Template button is clicked
  };

  const formData = new FormData();

  const handleSave = async () => {
    if (slice.isApiResponseReceived) {
      formData.append("categoryId", slice.selectedCategory);
      formData.append("typeId", slice.selectedType);
      formData.append("datas", JSON.stringify(pairs));
      formData.append("templates", updatedContent);
      formData.append("userId", currentLoginUserId);

      try {
        const res = await axios.post('https://pavithrakrish95.pythonanywhere.com/dataBasePostGeneratedDatas', formData);
        console.log("res", res);
        dispatch(setIsPopUp(false));
      } catch (error) {
        console.error("Error saving template:", error);
      }
    }
  };

  const handleClose = () => {
    dispatch(setIsPopUp(false));
    dispatch(setIsApiResponseReceived(false));
    dispatch(setIsTypeSelected(false));
    dispatch(setIsCategorySelected(false));
  };

  const getCategory = async () => {
    try {
      const res = await axios.get(`https://pavithrakrish95.pythonanywhere.com/settingGetList/${currentLoginUserId}`);
      dispatch(setCategoryList(res.data));
      console.log('cat',res.data)
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getTypes = async () => {
    try {
      const response = await axios.get(`https://pavithrakrish95.pythonanywhere.com/settingGetAllType/${currentLoginUserId}`);
      dispatch(setTypesList(response.data));
      console.log('tys',response.data)
      console.log(currentLoginUserId, "getTypes");
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  useEffect(() => {
    getCategory();
    getTypes()
  }, []);

  useEffect(() => {
    if (slice.isCategorySelected) {
      getTypes();
    }
  }, [slice.selectedCategory]);

  useEffect(() => {
    const selectedCategory = slice.categoryList.find(category => category.categoryId === slice.selectedCategory);
    if (selectedCategory) {
      dispatch(setSelectedCategoryName(selectedCategory.categoryName));
    }
  }, [slice.selectedCategory]);

  useEffect(() => {
    const selectedType = slice.typesList.find(type => type.typeId === slice.selectedType);
    if (selectedType) {
      dispatch(setSelectedTypeName(selectedType.typeName));
    }
  }, [slice.selectedType]);

  const generateAnswer = async () => {
    dispatch(setAnswer("Loading..."));
    const keyValuePair = pairs.map(each => `${each.key}:${each.value}`);
    const stringedPairs = JSON.stringify(keyValuePair);

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCdGe2K1tWu6hUcBGr5L-RbJ65Rd3L0iS0",
        { contents: [{ parts: [{ text: `Please give a ${slice.selectedTypeName} to ${slice.selectedCategoryName} with these given datas only ${stringedPairs} in an email format without subject and don't give empty placeholders.` }] }] }
      );

      const generatedText = response.data.candidates[0].content.parts[0].text;
      dispatch(setAnswer(generatedText));
      dispatch(setIsApiResponseReceived(true));

      const valueArray = pairs.map(pair => pair.value);
      const keyArray = pairs.map(pair => pair.key);

      let newParagraph = generatedText;

      valueArray.forEach((value, index) => {
        if (newParagraph.includes(value)) {
          newParagraph = newParagraph.replace(new RegExp(value, 'g'), `[Enter ${keyArray[index]}]`);
        }
      });

      setUpdatedContent(newParagraph);
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };

  const handleContentEdit = (e) => {
    dispatch(setAnswer(e.target.value));
  };

  const handleSendEmail = () => {
    const data = {
      to_email: toEmail,
      message: slice.answer,
      subject: subject
    };

    emailjs.send('service_nfhpy6b', 'template_qtyoyvw', data, 'Z7BAUgnHnm_Ez8KjM')
      .then(
        (result) => {
          console.log('SUCCESS!', result.text);
          alert('Email sent successfully ✔️');
        },
        (error) => {
          console.log('FAILED...', error.text);
          alert('Email send failed ❌');
        }
      );
  };

  return (
    <>
      <div className='generatePageContainer'>
        <center>
          <header>
            <ListExample />
          </header>
          <h1>Generate Page</h1>
          <br />
          <div>
            <br />
            <br />
            <select onChange={(e) => { dispatch(setSelectedCategory(e.target.value)); dispatch(setIsCategorySelected(true)) }}>
              <option value={templateSlice.isNavigateFromTemplates ? templateSlice.selectedCategory : slice.selectedCategory}>Select a Category</option>
              {slice.categoryList.map((categories) => (
                <option key={categories.categoryId} value={categories.categoryId}>
                  {categories.categoryName}
                </option>
              ))}
            </select>
            <br />
            <br />
            {/* {JSON.stringify(slice.typesList)} */}
            {slice.isCategorySelected ? (
              <select value={slice.selectedType} onChange={(e) => { dispatch(setSelectedType(e.target.value)); dispatch(setIsTypeSelected(true)) }}>
                <option value="">Select a Type</option>

                {slice.typesList.map((types) => (
                  slice.selectedCategory == types.categoryId &&
                  <option key={types.typeId} value={types.typeId}>
                    {types.typeName}
                  </option>
                ))}
              </select>
            ):null}
            <br />
            <br />
          </div>

          {slice.isTypeSelected &&
            <form onSubmit={handleGenerate}>
              {pairs.map((pair, i) => (
                <div key={i}>
                  <label>Key:</label>
                  <input type="text" placeholder='eg. Name' value={pair.key} onChange={(event) => handleKeyChange(i, event)} />
                  <label>Value:</label>
                  <input type="text" placeholder="eg. Varshini" value={pair.value} onChange={(event) => handleValueChange(i, event)} />
                  <button type='button' onClick={() => handleRemoveInputBox(i)}>Delete</button>
                </div>
              ))}
              <button type="button" className='btn btn-primary' onClick={handleAddPair}>Add Another Data</button>
              <br />
              <br />
              <button type="submit" className='btn btn-success'>Generate Template</button>
            </form>
          }

          <Modal show={slice.isPopUp} onHide={handleClose} size='lg'>
            <center>
              <Modal.Header closeButton>
                <Modal.Title>{slice.selectedTypeName} to {slice.selectedCategoryName}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <FloatingLabel label='Enter Recipients email' className="mb-3">
                  <Form.Control
                    placeholder='Enter Recipients email'
                    value={toEmail}
                    onChange={(e) => setToEmail(e.target.value)}
                  />
                </FloatingLabel>
                <FloatingLabel label='Enter Subject' className="mb-3">
                  <Form.Control
                    placeholder='Enter Subject'
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </FloatingLabel>
                <textarea
                  value={slice.answer}
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
                <Button variant="secondary" onClick={handleClose}>
                  Regenerate
                </Button>
                {slice.isApiResponseReceived && (
                  <>
                    <Button className='saveButton' onClick={handleSave}>
                      Save Template
                    </Button>
                    <Button type="button" variant="primary" onClick={handleSendEmail}>
                      Send E-Mail
                    </Button>
                  </>
                )}
              </Modal.Footer>
            </center>
          </Modal>
        </center>
      </div>
    </>
  );
}

export default Dashboard;
