import React, { useState, useEffect } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import { auth, db } from '../Firebase/firebase';
import { addDoc, collection,getDocs,query, where } from 'firebase/firestore';
import { setCategoryList,setTypesList,setSelectedCategory,setIsPopUp,setIsCategorySelected,setSelectedType,setIsTypeSelected,setAnswer,setSelectedCategoryName,setSelectedTypeName,setShow,setIsApiResponseReceived} from "../../Routes/Slices/dashBoardSlice"
import { useDispatch,useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../Navbar/index.css"
import "./index.css"
import axios from "axios";
import ListExample from '../Navbar';




function Dashboard() {
  const slice = useSelector(state => state.dashboardslice)

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
     {slice.isApiResponseReceived && 
        addDoc(collection(db,"generatedDatas"),{datas:stringedPairs,category:slice.selectedCategory,typeId:slice.selectedType,templates:slice.answer})
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
  console.log("categoryList",slice.categoryList.map((e) => e.categoryId))
  console.log("typeList",slice.typesList.map((e) => e.categoryId))

 const getTypes = async () => {
    const querySnapshot = await getDocs(query(collection(db, 'type'), where("categoryId", "==", slice.selectedCategory)));
      const typeId = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      dispatch(setTypesList(typeId));
    }
  
useEffect(() => {
    if (slice.isCategorySelected) {
      getTypes();
    }
  }, [slice.selectedCategory])

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
        getGenerateDatas();
    }, []);   


  useEffect(() => {
    for (let each of slice.categoryList){
      if (each.categoryId == slice.selectedCategory){
        dispatch(setSelectedCategoryName(each.categoryName))
      }
    }
  }, [slice.selectedCategory]); 
  
  useEffect(() => {
    for (let each of slice.typesList){
      if (each.id == slice.selectedType){
        dispatch(setSelectedTypeName(each.type))
      }
    }
  }, [slice.selectedType]); 

async function generateAnswer(){
      dispatch(setAnswer("Loading..."))
      const response = await axios({
        url:"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCdGe2K1tWu6hUcBGr5L-RbJ65Rd3L0iS0",
        method: "post",
        data: {contents:[{parts:[{text: `Please give a "${slice.selectedTypeName}" send to  "${slice.selectedCategoryName}" with these given datas ${keyValuePair}` }]}]}
      })
      dispatch(setAnswer(response["data"]["candidates"][0]["content"]["parts"][0]["text"]))
      dispatch(setIsApiResponseReceived(true))
     }



// return (
//      <>
    
//           <div className='sideNav'>
//           <div>
//             <button className='buttonInsideNav'   onClick={handleNavigateToSettings}>Settings</button>
//           </div>
//           <div>
//             <button className='buttonInsideNav'  onClick={handleNavigateToTemplates}>Template</button>
//           </div>
//           <div>
//             <button className='buttonInsideNav'  onClick={handleLogout}>Logout</button>
//           </div>
//           </div>
       
    
//     <center>
//         <h1>Generate Page</h1>
//         <br/>
//         <div>
//           <br/>
//           <br/>
return (
     <>
     <div className='generatePageContainer'>
      <center>
      <header>
          <ListExample/>
      </header>
      <h1>Generate Page</h1>
        <br/>
        <div>
          <br/>
          <br/>
          
          <select value={slice.selectedCategory} onChange={(e) => {dispatch(setSelectedCategory(e.target.value)); dispatch(setIsCategorySelected(true))}}>
            <option value="">Select a Category</option>
            {(slice.categoryList.filter((e)=> (e.uid) === (parsedUid))).map((categories) => (
              <option key={categories.categoryId} value={categories.categoryId}>
                {categories.categoryName}
              </option>
            ))}
          </select>
          <br/>
          <br/>
          
          {slice.isCategorySelected ? 
            <select value={slice.selectedType} onChange={(e) => {dispatch(setSelectedType(e.target.value)); dispatch(setIsTypeSelected(true))}}>
              <option value="">Select a Type</option>
              {slice.typesList.filter((e)=> e.uid==parsedUid).map((types) => (
                slice.selectedCategory === types.categoryId &&
                  <option key={types.id} value={types.id}>
                    {types.type}
                  </option>
              ))}
            </select> : null}
          <br/>
           <br/>
         </div>
    
         {slice.isTypeSelected ?
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
    
        <Modal show={slice.isPopUp} onHide={handleClose}>
          <center>
            <Modal.Header closeButton>
              <Modal.Title> {slice.selectedTypeName} to {slice.selectedCategoryName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {slice.answer}
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
        </div>
      </>
    );
}
    

export default Dashboard;























