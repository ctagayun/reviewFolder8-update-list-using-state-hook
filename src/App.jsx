/*
  Task:
    Incorporate bootstrap 

  Setup: 
    npm install bootstrap
    Once the installation is complete, we can include it in our app’s 
    entry file in main.jsx :
    --  Bootstrap CSS
    import "bootstrap/dist/css/bootstrap.min.css";
    -- Bootstrap Bundle JS
    import "bootstrap/dist/js/bootstrap.bundle.min";

    Now since we created the project with Vite, we can rely 
    on Vite's plugins to integrate ESLint properly. Run the 
    following command
       npm install vite-plugin-eslint --save-dev

    install uuid node package 
       npm install uuid

   ToRead:
      https://www.robinwieruch.de/conditional-rendering-react/
       
    */

import * as React from "react";
import Search from "./search.jsx";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

import RenderListUsingArrowFunction from "./renderListUsingArrowFunction.jsx";

const initialList = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
    isComplete: false,
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
    isComplete: true,
  },
];

//Create a custom hook called "useStorageState". We will use two hooks
//to create it:
//    1. useState
//    2. useEffect

//The purpose of this custom hook is to save and fetch from the localtorage
//the values that were inputted in the search box.
//The actual return value of our custom hook will be displayed in the
//search box.

const useStorageState = (searchKeyParam, deafaultStateParam) => {
  const [theState, stateSetter] = React.useState(
    localStorage.getItem(searchKeyParam) || deafaultStateParam //provides an initial value to the hook.
  );

  //https://react.dev/reference/react/useEffect#useeffect
  //Since the key comes from outside, the custom hook assumes that it could change,
  //so it needs to be included in the dependency array of the useEffect hook as well.
  React.useEffect(() => {
    localStorage.setItem(searchKeyParam, theState);
  }, [theState, stateSetter]);

  //Custom hooks return values are returned as an array
  return [theState, stateSetter];
}; //EOF create custom hook

//Declaration of App component
function App() {
  const welcome = {
    greeting: "Demo",
    title:
      "Update Item in a Complex Object using useState Hook with Enable/Disable. The change is the Done to Undo and Vice Versa",
  };

  let searchKey = "search";
  let defaultState = "React";

  //now call our custom hook useLocalStorage to initialize our state
  //called "searchTerm". The actual return value of our custom hook is:
  //return [theState, stateSetter]. But we can rename it. In this case
  //searchTerm, setSearchTerm respectively
  const [searchTerm, setSearchTerm] = useStorageState(searchKey, defaultState);

  //We start off with a complex state object which has the list as one of its properties.
  //Wherever we want to use the list (or the boolean flag), we need to access the
  //property from the object first: Example:
  //       updatedList.list
  //       updatedList.isShowList
  //       updateList.isDisable
  const [updatedList, updateInitialList] = React.useState({
    list: initialList,
    isShowlist: true,
    isDisable: true,
  });

  function handleToggleComplete(id) {
    console.log(`Handle toggle is executing`);
    const newList = updatedList.list.map((item) => {
      if (item.objectID === id) {
        const updatedItem = {
          ...item,
          isComplete: !item.isComplete,
        };

        return updatedItem;
      }

      return item;
    });

    //spread operator  (...) to spread all key/value pairs from the state object into
    //the new state object, while overriding the list property with the new list.
    updateInitialList({ ...updatedList, list: newList });
  }

  //Before we can add an item, we need to track the "input field's" state,
  //because without the value from the input field, we don't have any text
  //to give the item which we want to add to our list. So let's add some
  //state management to this first:
  const [title, setTitle] = React.useState("");

  //Function to delete a a record from the initialList list
  //we need to access the property from the object (e.g. updatedList.list) first.
  //updatedList is the useState state variable
  //list: is the property name of the complex object
  const handleDeleteRecord = (item) => {
    console.log(`Item being deleted =  ${item.objectID} ${item.author}`);
    const newList = updatedList.list.filter(
      (story) => item.objectID !== story.objectID
    );
    //spread operator  (...) to spread all key/value pairs from the state object into
    //the new state object, while overriding the list property with the new list.
    updateInitialList({ ...updatedList, list: newList });
  };

  //Function to handle add a record
  //Next, whenever someone clicks the Add button in renderListUsingArrowFunction.jsx ,
  //we can add the title entered into the input field as a new item to the list:

  const handleAddRecord = () => {
    //Wherever we want to use the list (or the boolean flag),
    //we need to access the property from the object first in this case "updatedList.list".
    const newList = updatedList.list.concat({
      title,
      objectID: uuidv4(),
    });

    //we need to access the property from the object first.
    //updatedList is the useState state variable
    //list: is the property name of the complex object. we need to
    //use list: newList because "newList" was derived from "list"

    //We could set both, the new list and the boolean flag -- which didn't change
    // -- explicitly, but in this case we are using JavaScript's spread
    //operator  (...) to spread all key/value pairs from the state object into
    //the new state object, while overriding the list property with the new list.
    updateInitialList({ ...updatedList, list: newList });

    setTitle(""); //reset the input box to null
  };

  //Track changes to the input text box
  //we are using JavaScript's spread
  //operator  (...) to spread all key/value pairs from the state object into
  //the new state object, while overriding the isShowList and isDisable properties
  //with the new values. Note we are not overriding "list" property
  const handleChange = (event) => {
    console.log(`Value of title input field: ${event.target.value} `);
    setTitle(event.target.value);

    if (!event.target.value.length) {
      // textbox is empty
      updateInitialList({ ...updatedList, isDisable: true });
    } else {
      updateInitialList({ ...updatedList, isShowList: true, isDisable: false });
    }
  };

  const searchedList = updatedList.list.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value); //update state hook variable in this case "searchTerm"
  };

  return (
    <div>
      <h1>
        {welcome.greeting} {welcome.title}
      </h1>

      {/* searchTerm is the return value from useStorageState custom hook. */}
      <Search
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </Search>

      <hr />
      <div>
        <input type="text" value={title} onChange={handleChange} />
        <button
          type="button"
          disabled={updatedList.isDisable}
          className="btn btn-primary"
          onClick={handleAddRecord}
        >
          Add
        </button>
      </div>

      {/*We have made the input field "title" a controlled element, because 
         it receives its internal value from React's state now. 
         cheat sheet on conditional rendering: https://www.robinwieruch.de/conditional-rendering-react/
              updatedList = is a state
              isShowlist = boolean flag to either show or hide the list
                           with conditional rendering
        */}

      {updatedList.isShowlist && (
        <RenderListUsingArrowFunction
          list={searchedList}
          onRemoveItem={handleDeleteRecord}
          onToggle={handleToggleComplete}
          title={title}
        />
      )}
    </div>
  );
}

export default App;
