import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../Firebase/firebase';
import { addDoc, collection,getDocs} from 'firebase/firestore';
import { setCategoryList,setTypesList,setSelectedCategory,setIsPopUp,setIsCategorySelected,setSelectedType,setIsTypeSelected,setSelectedOption,setCategoryAndTypes,setAnswer,setSelectedCategoryName,setSelectedTypeName,addTemplates } from "../../Routes/Slices/dashBoardSlice"
import { useDispatch,useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
 import './Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";



function Dashboard() {
  const {categoryList,typesList,selectedCategory,isCategorySelected,selectedType,isTypeSelected,selectedOption,isPopUp,categoryAndTypes,answer,selectedCategoryName,selectedTypeName,addTemplates} = useSelector(state => state.dashboardslice)
  const dispatch = useDispatch()
  const [pairs,setPairs] = useState([{key:'',value:''}])
  const [generatedData,setGeneratedData] = useState([])
  let stringedPairs = JSON.stringify(pairs)
  // console.log("categoryAndTypes",categoryAndTypes)
  
  
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

  const handleSave = (event) =>{
     let stringifyData = JSON.stringify(pairs)
     console.log("stringifyData",stringifyData)
    const docRef=addDoc(collection(db,"generatedDatas"),{datas:stringifyData,category:selectedCategory,typeId:selectedType,templates:answer});
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
      const typesForCategory = typesList
        .filter((type) => type.categoryId === category.categoryId)
        .map((doc) => doc.type);
      return { category, types: typesForCategory };
    });
    dispatch(setCategoryAndTypes(categoryTypes))
    // console.log("categoryTypes",categoryAndTypes)
  };


  const getGenerateDatas = async () => {
    const querySnapshot = await getDocs(collection(db, 'generatedDatas'));
    const generatedDatas = [];
    querySnapshot.forEach((doc) => {
      console.log("doc",doc.data())
        generatedDatas.push(doc.data());
      });
      setGeneratedData(generatedDatas)
    
  };
console.log("generatedData",generatedData)

// generatedData.map((data,i)=>{
//   console.log("data",data.typeId)
// })

let genrate_data = generatedData.filter((data)=>{
  
        if (data.typeId == selectedType ){
          console.log("dataTemplates",data.templates)
          return true;
         
        } })
console.log("hello",genrate_data)



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
  }, [isCategorySelected]); 
  
  useEffect(() => {
    for (let each of typesList){
      if (each.id == selectedType){
        dispatch(setSelectedTypeName(each.type))
      }
    }
  }, [isTypeSelected]); 

  
  async function generateAnswer(){
      dispatch(setAnswer("Loading..."))
      const response = await axios({
        url:"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCdGe2K1tWu6hUcBGr5L-RbJ65Rd3L0iS0",
        method: "post",
        data: {contents:[{parts:[{text: `write a "${selectedTypeName}" for ${stringedPairs}}` }]}]}
      })
      dispatch(setAnswer(response["data"]["candidates"][0]["content"]["parts"][0]["text"]))
    }


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





 {/* <table>
          <thead>
              <th>Key : </th>
              <th>value</th>
          </thead>
          <tbody>
          {
          pairs.map((pair,i)=>{
                       
                       return(
                           <>
                           <tr key={i}>
                              <td>{pair.key} : </td>
                              <td>{pair.value}</td>
                              
                           </tr>
                           
                           </>

                       )
                   })
            }
             </tbody>
            </table> */}