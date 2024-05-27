import "./App.css";
import Header from "./Components/Header/Header";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Screens/Dashboard/Dashboard";
import Sidebar from "./Components/Sidebar/Sidebar";
import { useRef, useState } from "react";
import CreateBlog from "./Screens/CreateBlog/CreateBlog";
import SearchBar from "./Components/SearchBar/SearchBar";
import HeadTitle from "./Components/HeadTitle/HeadTitle";
import ShowBlogs from "./Screens/ShowBlogs/ShowBlogs";
import BlogDetails from "./Screens/BlogDetails/BlogDetails";

function App() {
  const sidebar = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [headTitle, setHeadTitle] = useState("Dashboard");

  return (
    <div className="App">
      <Header sidebar={sidebar} isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="hero">
        <div>
          <HeadTitle headTitle={headTitle} />
        </div>
        <div>
          <Sidebar sidebar={sidebar} />
          <Routes>
            <Route path="/" element={<Dashboard setHeadTitle = {setHeadTitle} />} />
            <Route path="/createblog" element={<CreateBlog setHeadTitle = {setHeadTitle} />} />
            <Route path="/showblog" element={<ShowBlogs setHeadTitle = {setHeadTitle} query={query} setQuery={setQuery}/>} />
            <Route path="/blog/:id" element={<BlogDetails setHeadTitle = {setHeadTitle}/>}/>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
