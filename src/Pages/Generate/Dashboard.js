import React, { useState, useEffect } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { auth, db } from "../Firebase/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
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
  setSelectedTypeName,
  addTemplates,
} from "../../Routes/Slices/dashBoardSlice";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function Dashboard() {
  const {
    categoryList,
    typesList,
    selectedCategory,
    isCategorySelected,
    selectedType,
    isTypeSelected,
    selectedOption,
    isPopUp,
    categoryAndTypes,
    answer,
    selectedCategoryName,
    selectedTypeName,
    addTemplates,
  } = useSelector((state) => state.dashboardslice);
  const dispatch = useDispatch();
  const [pairs, setPairs] = useState([{ key: "", value: "" }]);
  const [generatedData, setGeneratedData] = useState([]);
  let stringedPairs = JSON.stringify(pairs);
  const navigate = useNavigate();

  const handleOptionChange = (event) => {
    dispatch(setSelectedOption(event.target.value));
  };

  const handleKeyChange = (index, event) => {
    const newPair = [...pairs];
    newPair[index].key = event.target.value;
    setPairs(newPair);
  };

  const handleValueChange = (index, event) => {
    const newPair = [...pairs];
    newPair[index].value = event.target.value;
    setPairs(newPair);
  };

  const handleAddPair = () => {
    setPairs([...pairs, { key: "", value: "" }]);
  };

  const handleGenerate = (event) => {
    event.preventDefault();
    dispatch(setIsPopUp(true));
  };

  const handleNavigateToSettings = (event) => {
    event.preventDefault();
    navigate("/user/setting");
  };

  const handleNavigateToTemplates = (event) => {
    event.preventDefault();
    navigate("/template");
  };

  const handleSave = (event) => {
    let stringifyData = JSON.stringify(pairs);
    console.log("stringifyData", stringifyData);
    const docRef = addDoc(collection(db, "generatedDatas"), {
      datas: stringifyData,
      category: selectedCategory,
      typeId: selectedType,
      templates: answer,
    });
    dispatch(setIsPopUp(false));
  };

  const handleClose = () => {
    dispatch(setIsPopUp(false));
  };

  const getCategory = async () => {
    const querySnapshot = await getDocs(collection(db, "category"));
    const category = [];
    querySnapshot.forEach((doc) => {
      category.push(doc.data());
    });
    dispatch(setCategoryList(category));
  };

  const getTypes = async () => {
    const querySnapshot = await getDocs(collection(db, "type"));
    const type = [];
    const typeId = querySnapshot.docs.map(
      (doc) => (
        type.push(doc.data()),
        {
          id: doc.id,
          ...doc.data(),
        }
      )
    );
    dispatch(setTypesList(typeId));
  };

  const fetchCategoryWithType = () => {
    const categoryTypes = categoryList.map((category) => {
      const typesForCategory = typesList
        .filter((type) => type.categoryId === category.categoryId)
        .map((doc) => doc.type);
      return { category, types: typesForCategory };
    });
    dispatch(setCategoryAndTypes(categoryTypes));
  };
  console.log("catWithTypesingenerate", categoryAndTypes);
  //  console.log("categoryList",categoryList);
  //  console.log("typesList",typesList);

  const getGenerateDatas = async () => {
    const querySnapshot = await getDocs(collection(db, "generatedDatas"));
    const generatedDatas = [];
    querySnapshot.forEach((doc) => {
      generatedDatas.push(doc.data());
    });
    setGeneratedData(generatedDatas);
  };

  let genrate_data = generatedData.filter((data) => {
    if (data.typeId == selectedType) {
      //console.log("dataTemplates",data.templates)
      return true;
    }
  });

  useEffect(() => {
    getCategory();
    getTypes();
    fetchCategoryWithType();
    getGenerateDatas();
  }, []);

  useEffect(() => {
    for (let each of categoryList) {
      if (each.categoryId == selectedCategory) {
        dispatch(setSelectedCategoryName(each.categoryName));
      }
    }
  }, [isCategorySelected]);

  useEffect(() => {
    for (let each of typesList) {
      if (each.id == selectedType) {
        dispatch(setSelectedTypeName(each.type));
      }
    }
  }, [isTypeSelected]);

  async function generateAnswer() {
    dispatch(setAnswer("Loading..."));
    const response = await axios({
      url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCdGe2K1tWu6hUcBGr5L-RbJ65Rd3L0iS0",
      method: "post",
      data: {
        contents: [
          {
            parts: [
              { text: `write a "${selectedTypeName}" for ${stringedPairs}}` },
            ],
          },
        ],
      },
    });
    dispatch(
      setAnswer(
        response["data"]["candidates"][0]["content"]["parts"][0]["text"]
      )
    );
  }

  return (
    <>
      <button onClick={handleNavigateToSettings}>Setting</button>
      <button onClick={handleNavigateToTemplates}>Template</button>
      <center>
        <h1>Generate Page</h1>
        <br />
        <div>
          <br />
          <br />
          <select
            value={selectedCategory}
            onChange={(e) => {
              dispatch(setSelectedCategory(e.target.value));
              dispatch(setIsCategorySelected(true));
            }}
          >
            <option value="">Select a Category</option>
            {categoryList.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </select>
          <br />
          <br />
          {isCategorySelected ? (
            <select
              value={selectedType}
              onChange={(e) => {
                dispatch(setSelectedType(e.target.value));
                dispatch(setIsTypeSelected(true));
              }}
            >
              <option value="">Select a Type</option>
              {typesList.map(
                (types) =>
                  selectedCategory === types.categoryId && (
                    <option key={types.id} value={types.id}>
                      {types.type}
                    </option>
                  )
              )}
            </select>
          ) : null}
          <br />
          <br />
        </div>

        {isTypeSelected ? (
          <form onSubmit={handleGenerate}>
            {pairs.map((pair, index) => (
              <div key={index}>
                <label> Key:</label>
                <input
                  type="text"
                  value={pair.key}
                  onChange={(event) => handleKeyChange(index, event)}
                />

                <label>Value:</label>
                <input
                  type="text"
                  value={pair.value}
                  onChange={(event) => handleValueChange(index, event)}
                />

                <button type="button" onClick={handleAddPair}>
                  Add
                </button>
              </div>
            ))}

            <br />
            <br />
            <button type="submit" onClick={generateAnswer}>
              Generate
            </button>
          </form>
        ) : null}

        <Modal show={isPopUp} onHide={handleClose}>
          <center>
            <Modal.Header closeButton>
              <Modal.Title>
                {selectedTypeName} to {selectedCategoryName}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>{answer}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Regenerate
              </Button>
              <Button className="saveButton" onClick={handleSave}>
                Save
              </Button>
              <Link to={"/template"}>Go to templates ➡️</Link>
            </Modal.Footer>
          </center>
        </Modal>
      </center>
    </>
  );
}
export default Dashboard;
