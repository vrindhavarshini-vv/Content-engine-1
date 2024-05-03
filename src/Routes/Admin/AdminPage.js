import { useState } from "react";
import { createElement } from "react";

export default function Admin() {
    // const [createCategory, setCreateCategory] = useState({
    //     category: '',
    //     type: ''
    // });
    
    // const [dropDown, setDropDown] = useState([]);

    // const create = () => {
    //     setDropDown(prevState => [...prevState, createCategory]);
    //     setCreateCategory({ category: '', type: '' });
    // };

    const addMore = () => {
        
    }
    return (
        // <>
        //     <div>
        //         <h1>Welcome to Admin page</h1>
        //         <p>Here you are create a category and category's type for the company through content engine</p>
        //     </div>
        //     <h3>{JSON.stringify(createCategory)}</h3>
        //     <div>
        //         <label>Create Category:</label>
        //         <input type="text" placeholder="Enter category" value={createCategory.category} onKeyUp={(e) => setCreateCategory({...createCategory, category: e.target.value})} />
        //     </div>
        //     <div>
        //         <label>Create Type:</label>
        //         <input type="text" placeholder="Enter type" value={createCategory.type} onKeyUp={(e) => setCreateCategory({...createCategory, type: e.target.value})} />
        //     </div>
        //     <div>
        //         <button onClick={create}>Create</button>
        //     </div>

        //     <p>If you created earlier, you can select from here</p>

        //     <select>
        //         {dropDown.map((each, index) => (
        //             <option key={index}>{each.category}</option>
        //         ))}
        //     </select>
        //     <select>
        //         {dropDown.map((each, index) => (
        //             <option key={index}>{each.type}</option>
        //         ))}
        //     </select>
        // </>
        <>
            <p>Please fill also this</p>
            <div>
                <input placeholder="Enter" type="text"/>
                <select>
                    <option>
                        String
                    </option>
                    <option>
                        Date
                    </option>
                    <option>
                        Number
                    </option>

                </select>
                <button onClick={addMore}>Add More</button>
            </div>
        </>
        
    );
}
