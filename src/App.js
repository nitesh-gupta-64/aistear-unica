
import './App.css';
import Header from './Components/Header/Header';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './Screens/Dashboard/Dashboard';
import Sidebar from './Components/Sidebar/Sidebar';
import { useRef, useState } from 'react';
import CreateBlog from './Components/CreateBlog/CreateBlog';
import HeadSearch from './Components/HeadSearch/HeadSearch';

function App() {

  const sidebar = useRef(null)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="App">
      <Header sidebar = {sidebar} isOpen={isOpen} setIsOpen={setIsOpen} />
      {/* <HeadSearch/> */}
      <div className='hero'>
        <Sidebar sidebar = {sidebar} />
          <Routes>
            <Route path='/' element={<Dashboard/>}/>
            <Route path='/createblog' element={<CreateBlog/>} />
          </Routes>
      </div>
    </div>
  );
}

export default App;
