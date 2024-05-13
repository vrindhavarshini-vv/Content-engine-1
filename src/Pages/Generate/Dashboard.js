import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { auth, db } from '../Firebase/firebase';
import { addDoc, collection,getDocs} from 'firebase/firestore';
import { setCategoryList,setTypesList,setSelectedCategory,setIsPopUp,setIsCategorySelected,setSelectedType,setIsTypeSelected,setSelectedOption,setCategoryAndTypes,setAnswer,setSelectedCategoryName,setSelectedTypeName,addTemplates } from "../../Routes/Slices/dashBoardSlice"
import { useDispatch,useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";


import {
  setCategoryList,
  setTypesList,
  setSelectedCategory,
  setIsPopUp,
  setIsCategorySelected,
  setSelectedType,
  setIsTypeSelected,
  setSelectedOption,
  setCategoryAndTypes,
  setAnswer,
  setSelectedCategoryName,
  setSelectedTypeName
} from "../../Routes/Slices/dashBoardSlice";

function Dashboard() {
  const {categoryList,typesList,selectedCategory,isCategorySelected,selectedType,isTypeSelected,selectedOption,isPopUp,categoryAndTypes,answer,selectedCategoryName,selectedTypeName,addTemplates} = useSelector(state => state.dashboardslice)
  const dispatch = useDispatch()
  const [pairs,setPairs] = useState([{key:'',value:''}])
  const [generatedData,setGeneratedData] = useState([])
  let stringedPairs = JSON.stringify(pairs)
  const navigate = useNavigate()
 

  const handleOptionChange = (event) => {
      dispatch(setSelectedOption(event.target.value));
   };
 

  const handleKeyChange = (index, event) => {
    const newPair = [...pairs];
    newPair[index].key = event.target.value;
    setPairs(newPair)
  };

  const handleValueChange = (index, event) => {
    const newPair = [...pairs];
    newPair[index].value = event.target.value;
    setPairs(newPair)
  };

  const handleAddPair = () => {
    setPairs([...pairs, { key: '', value: '' }])
  };

  const handleGenerate =  (event) => {
    event.preventDefault();
    dispatch(setIsPopUp(true))
  };

  const handleNavigateToSettings =  (event) => {
    event.preventDefault();
    navigate("/user/setting")
  };

  const handleNavigateToTemplates =  (event) => {
    event.preventDefault();
    navigate("/template")
  
  };



  const handleSave = (event) =>{
     let stringifyData = JSON.stringify(pairs)
     console.log("stringifyData",stringifyData)
    const docRef=addDoc(collection(db,"generatedDatas"),{datas:stringifyData,category:selectedCategory,typeId:selectedType,templates:answer});
    dispatch(setIsPopUp(false));
  };

  const generateAnswer = async () => {
    dispatch(setAnswer("Loading..."));
    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY",
        {
          contents: [
            {
              parts: [{ text: `write a "${selectedTypeName}" for ${JSON.stringify(pairs)}` }]
            }
          ]
        }
      );
      dispatch(setAnswer(response.data.candidates[0].content.parts[0].text));
    } catch (error) {
      console.error("Error generating answer:", error);
      dispatch(setAnswer("Error generating content"));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categorySnapshot = await getDocs(collection(db, "category"));
        const categories = categorySnapshot.docs.map((doc) => doc.data());
        dispatch(setCategoryList(categories));

        const typeSnapshot = await getDocs(collection(db, "type"));
        const types = typeSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        dispatch(setTypesList(types));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

    return (
      <center>
        <h1>Generate Page</h1>
        <br/>
        <div>
          <br/>
          <br/>
          <select value={selectedCategory} onChange={(e) => {dispatch(setSelectedCategory(e.target.value)); dispatch(setIsCategorySelected(true))}}>
            <option value="">Select a Category</option>
            {categoryList.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </select>
          <br/>
          <br/>
          {isCategorySelected ? 
            <select value={selectedType} onChange={(e) => {dispatch(setSelectedType(e.target.value)); dispatch(setIsTypeSelected(true))}}>
              <option value="">Select a Type</option>
              {typesList.map((types) => (
                selectedCategory === types.categoryId &&
                  <option key={types.id} value={types.id}>
                    {types.type}
                  </option>
              ))}
            </select> : null}
          <br/>
          <br/>
        </div>
    
        {isTypeSelected ?
          <form onSubmit={handleGenerate}>
            {pairs.map((pair, index) => (
              <div key={index}>
                <label> Key:</label>
                <input type="text" value={pair.key} onChange={(event) => handleKeyChange(index, event)}/>
                
                <label>Value:</label>
                <input type="text" value={pair.value} onChange={(event) => handleValueChange(index, event)}/>
                
                <button type="button" onClick={handleAddPair}>Add</button>
              </div>
            ))}
            
            <br/>
            <br/>
            <button type="submit" onClick={generateAnswer}>Generate</button>
          </form> : null
        }
    
        <Modal show={isPopUp} onHide={handleClose}>
          <center>
            <Modal.Header closeButton>
              <Modal.Title>{selectedTypeName} to {selectedCategoryName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {answer}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Regenerate
              </Button>
              <Button className='btn btn-success' onClick={handleSave}>
                Save
              </Button>
            </Modal.Footer>
          </center>
        </Modal>
    
      </center>
    );
    
}

export default Dashboard;
