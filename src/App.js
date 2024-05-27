import "./App.css";
import Header from "./Components/Header/Header";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Screens/Dashboard/Dashboard";
import Sidebar from "./Components/Sidebar/Sidebar";
import { useRef, useState } from "react";
import CreateBlog from "./Components/CreateBlog/CreateBlog";
import SearchBar from "./Components/SearchBar/SearchBar";
import HeadTitle from "./Components/HeadTitle/HeadTitle";

function App() {
  const sidebar = useRef(null);
  const [isOpen, setIsOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [headTitle, setHeadTitle] = useState("Dashboard");

  return (
    <div className="App">
      <Header sidebar={sidebar} isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="hero">
        <div>
          <HeadTitle headTitle={headTitle} />
          {/* <SearchBar query={query} setQuery={setQuery}/> */}
        </div>
        <div>
          <Sidebar sidebar={sidebar} />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/createblog" element={<CreateBlog />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
