import React, { useState, useEffect } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import { auth, db } from '../Firebase/firebase';
import { addDoc, collection,getDocs} from 'firebase/firestore';
import { setCategoryList,setTypesList,setSelectedCategory,setIsPopUp,setIsCategorySelected,setSelectedType,setIsTypeSelected,setCategoryAndTypes,setAnswer,setSelectedCategoryName,setSelectedTypeName,setShow,setIsApiResponseReceived} from "../../Routes/Slices/dashBoardSlice"
import { useDispatch,useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Dashboard.css"
import axios from "axios";
import { Modal } from 'react-bootstrap';


function Dashboard() {
  const {categoryList,typesList,selectedCategory,isCategorySelected,selectedType,isTypeSelected,isPopUp,categoryAndTypes,answer,selectedCategoryName,selectedTypeName,show,isApiResponseReceived} = useSelector(state => state.dashboardslice)
  const dispatch = useDispatch()
  const [pairs,setPairs] = useState([{key:'',value:''}])
  const [generatedData,setGeneratedData] = useState([])
  const navigate = useNavigate()
  let parsedUid = localStorage.getItem("uid")
 
  
  //Key Value Pairs************************
  let keyValuePair = []
  for (let each of pairs){
    keyValuePair.push(each.key +":"+ each.value)
  }
  let stringedPairs = JSON.stringify(keyValuePair)
  // const GeneratedDatas = generatedData.map((e) => e.datas)
  // let getGeneratedDatas = []
  // for (let each of GeneratedDatas){
  //   getGeneratedDatas.push(JSON.parse(each))
  // }
  //  console.log("getGenratedDatas",getGeneratedDatas);
  
   const handleNavClose = () => dispatch(setShow(false));
  const handleNavShow = () => dispatch(setShow(true));

  const handleNavigateToSettings = () => navigate("/user/setting");
  const handleNavigateToTemplates = () => navigate("/template");
 
  const handleLogout =  (event) => {
    event.preventDefault();
    localStorage.removeItem("uid")
    navigate("/")

  };

  const handleKeyChange = (i, event) => {
    const newPair = [...pairs];
    newPair[i].key = event.target.value;
    setPairs(newPair)
  };

  const handleRemoveInputBox = (i) => {
      const newArray = [...pairs];
      newArray.splice(i, 1);
      setPairs(newArray);
    };
  

  const handleValueChange = (i, event) => {
    const newPair = [...pairs];
    newPair[i].value = event.target.value;
    setPairs(newPair)
  };

  const handleAddPair = () => {
   setPairs([...pairs, { key: '', value: '' }])
    
  };

  const handleGenerate =  (event) => {
    event.preventDefault();
    dispatch(setIsPopUp(true))
  };

  
  const handleSave = () =>{
     {isApiResponseReceived && 
        addDoc(collection(db,"generatedDatas"),{datas:stringedPairs,category:selectedCategory,typeId:selectedType,templates:answer})
        dispatch(setIsPopUp(false));
     }
    
  };
  
  const handleClose = ()=>{
    dispatch(setIsPopUp(false))
  };
       
  const getCategory = async () => {
      const querySnapshot = await getDocs(collection(db, 'category'));
      const category = [];
      querySnapshot.forEach((doc) => {
          category.push(doc.data());
        });
        dispatch(setCategoryList(category))
  };
  

  const getTypes = async () => {
      const querySnapshot = await getDocs(collection(db, 'type'));
      const type = [];
      const typeId = querySnapshot.docs.map((doc) => (
        type.push(doc.data()),
        {
            id : doc.id,
            ...doc.data()
        }
       ))
      dispatch(setTypesList(typeId))
  };

  const fetchCategoryWithType = () => {
    const categoryTypes = categoryList.map((category) => {
      const typesForCategory = typesList.filter((type) => type.categoryId === category.categoryId).map((doc) => doc.type);
      return { category, types: typesForCategory };
    });
    dispatch(setCategoryAndTypes(categoryTypes))
  };
//console.log("catWithTypesingenerate",categoryAndTypes);

const getGenerateDatas = async () => {
    const querySnapshot = await getDocs(collection(db, 'generatedDatas'));
    const generatedDatas = [];
    querySnapshot.forEach((doc) => {
        generatedDatas.push(doc.data());
      });
      setGeneratedData(generatedDatas)
};

  useEffect(() => {
        getCategory();
        getTypes();
        fetchCategoryWithType();
        getGenerateDatas();
    }, []);   

  useEffect(() => {
    for (let each of categoryList){
      if (each.categoryId == selectedCategory){
        dispatch(setSelectedCategoryName(each.categoryName))
      }
    }
  }, [selectedCategory]); 
  
  useEffect(() => {
    for (let each of typesList){
      if (each.id == selectedType){
        dispatch(setSelectedTypeName(each.type))
      }
    }
  }, [selectedType]); 

async function generateAnswer(){
      dispatch(setAnswer("Loading..."))
      const response = await axios({
        url:"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCdGe2K1tWu6hUcBGr5L-RbJ65Rd3L0iS0",
        method: "post",
        data: {contents:[{parts:[{text: `Please give a "${selectedTypeName}" send to  "${selectedCategoryName}" with these given datas ${keyValuePair}` }]}]}
      })
      dispatch(setAnswer(response["data"]["candidates"][0]["content"]["parts"][0]["text"]))
      dispatch(setIsApiResponseReceived(true))
     }



return (
     <>
    
    <center>
        <h1>Generate Page</h1>
        <br/>
        <div>
          <br/>
          <br/>
          <select value={selectedCategory} onChange={(e) => {dispatch(setSelectedCategory(e.target.value)); dispatch(setIsCategorySelected(true))}}>
            <option value="">Select a Category</option>
            {categoryAndTypes.filter((e)=> e.category.uid === parsedUid).map((category) => (
              <option key={category.category.categoryId} value={category.category.categoryId}>
                {category.category.categoryName}
              </option>
            ))}
          </select>
          <br/>
          <br/>
          {isCategorySelected ? 
            <select value={selectedType} onChange={(e) => {dispatch(setSelectedType(e.target.value)); dispatch(setIsTypeSelected(true))}}>
              <option value="">Select a Type</option>
              {typesList.filter((e)=> e.uid==parsedUid).map((types) => (
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
            {pairs.map((pair, i) => (
              <>
              <div key={i}>
                <label> Key:</label>
                <input type="text" placeholder='eg. Name' value={pair.key} onChange={(event) => handleKeyChange(i, event)}/>
                <label>Value:</label>
                <input type="text" placeholder="eg. Varshini"  value={pair.value} onChange={(event) => handleValueChange(i, event)}/>
                <button type='button'  onClick={() => handleRemoveInputBox(i)}>Delete</button>
                
                </div>
              <br/>
             
              </>
            ))}
             <button type="button" className='btn btn-primary' onClick={handleAddPair}>Add Another Data</button>
            <br/>
            <br/>
            <button type="submit" className='btn btn-success' onClick={generateAnswer}>Generate Template</button>
          </form> : null
        }
    
        <Modal show={isPopUp} onHide={handleClose}>
          <center>
            <Modal.Header closeButton>
              <Modal.Title> {selectedTypeName} to {selectedCategoryName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {answer}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary"  onClick={handleClose}>
                Regenerate
              </Button>
              <Button  className='saveButton' onClick={handleSave}>
                Save
              </Button>
              
             </Modal.Footer>
          </center>
        </Modal>
        </center>
      </>
    );
    
}
export default Dashboard;
