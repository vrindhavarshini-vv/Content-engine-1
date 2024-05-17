import React, { useState, useEffect } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import { auth, db } from '../Firebase/firebase';
import { addDoc, collection,getDocs} from 'firebase/firestore';
import { setCategoryList,setTypesList,setSelectedCategory,setIsPopUp,setIsCategorySelected,setSelectedType,setIsTypeSelected,setCategoryAndTypes,setAnswer,setSelectedCategoryName,setSelectedTypeName,setShow,setIsApiResponseReceived} from "../../Routes/Slices/dashBoardSlice"
import { useDispatch,useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { IoMdMenu } from "react-icons/io";
import "./Dashboard.css"
import axios from "axios";


function Dashboard() {
  const {categoryList,typesList,selectedCategory,isCategorySelected,selectedType,isTypeSelected,isPopUp,categoryAndTypes,answer,selectedCategoryName,selectedTypeName,show,isApiResponseReceived} = useSelector(state => state.dashboardslice)
  const dispatch = useDispatch()
  const [pairs,setPairs] = useState([{key:'',value:''}])
  const [generatedData,setGeneratedData] = useState([])
  let stringedPairs = JSON.stringify(pairs)

 
  
  const navigate = useNavigate()
  let parsedUid = localStorage.getItem("uid")
  

 
  const handleNavClose = () => dispatch(setShow(false));
  const handleNavShow = () => dispatch(setShow(true));

  const handleNavigateToSettings = () => navigate("/user/setting");
  const handleNavigateToTemplates = () => navigate("/template");
 
  const handleLogout =  (event) => {
    event.preventDefault();
    localStorage.removeItem("uid")
    navigate("/")

  };

  const handleKeyChange = (index, event) => {
    console.log("event",event.target.value)
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

  const handleSave = (event) =>{
     let stringifyData = JSON.stringify(pairs)
    const docRef=addDoc(collection(db,"generatedDatas"),{datas:stringifyData,category:selectedCategory,typeId:selectedType,templates:answer});
    dispatch(setIsPopUp(false));
  };
  
  const handleClose = ()=>{
    dispatch(setIsPopUp(false))
  };
       
  const getCategory = async () => {
      const querySnapshot = await getDocs(collection(db, 'category'));
      console.log("query",querySnapshot)
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
//  console.log("catWithTypesingenerate",categoryAndTypes);

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
        data: {contents:[{parts:[{text: `Please give a "${selectedCategoryName}" related "${selectedTypeName}" for these datas ${stringedPairs}}  without any blank filling space` }]}]}
      })
      dispatch(setAnswer(response["data"]["candidates"][0]["content"]["parts"][0]["text"]))
      dispatch(setIsApiResponseReceived(true))
    }

return (
     <>
      <IoMdMenu className='menu'   onClick={handleNavShow}/>
      <Offcanvas show={show} className="" onHide={handleNavClose} >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className='sideNav'>
          <div>
            <button className='buttonInsideNav'   onClick={handleNavigateToSettings}>Settings</button>
          </div>
          <div>
            <button className='buttonInsideNav'  onClick={handleNavigateToTemplates}>Template</button>
          </div>
          <div>
            <button className='buttonInsideNav'  onClick={handleLogout}>Logout</button>
          </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    
    <center>
        <h1>Generate Page</h1>
        <br/>
        <div>
          <br/>
          <br/>
          <select value={selectedCategory} onChange={(e) => {dispatch(setSelectedCategory(e.target.value)); dispatch(setIsCategorySelected(true))}}>
            <option value="">Select a Category</option>
            {categoryList.filter((e)=> e.uid==parsedUid).map((category) => (
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
            {pairs.map((pair, index) => (
              <>
              <div key={index}>
                <label> Key:</label>
                <input type="text" value={pair.key} onChange={(event) => handleKeyChange(index, event)}/>
                <label>Value:</label>
                <input type="text" value={pair.value} onChange={(event) => handleValueChange(index, event)}/>
                <Button type='button' >Delete</Button>
                
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
