import React, { useRef } from 'react'
import './Header.css'
import { Link } from 'react-router-dom'

const Header = ( { sidebar, isOpen, setIsOpen } ) => {

  const toggle = useRef(null)

  const toggleHandler = () => {
      
    if (isOpen) {
      toggle.current.classList.add('toggle')
      toggle.current.classList.remove('cross')
      sidebar.current.classList.add('side');
      sidebar.current.classList.remove('sideblur')
    }
    else {
      toggle.current.classList.add('cross')
      toggle.current.classList.remove('toggle')
      sidebar.current.classList.remove('side');
      sidebar.current.classList.add('sideblur')
    }
    setIsOpen(!isOpen)
  }


  // const toggleHandler = () => {
  //   const sidebar = document.querySelector('.sidebar');
  //   if (sidebar.classList.contains('side')) {
  //     sidebar.classList.remove('side');
  //     sidebar.classList.add('sideblur')
  //   }
  //   else {
  //     sidebar.classList.add('side');
  //     sidebar.classList.remove('sideblur')
  //   }

  //   const toggle = document.querySelector('.tog')
  //   if (toggle.classList.contains('cross')) {
  //     toggle.classList.add('toggle')
  //     toggle.classList.remove('cross')
  //   }
  //   else {
  //     toggle.classList.add('cross')
  //     toggle.classList.remove('toggle')
  //   }
  // }

  return (
    <div className='header'>
      <Link to='/'><h1>Aistear Unica Admin </h1></Link>
      <button className='logout'>
        <div></div>
        <p>Log Out</p>
      </button>
      <button onClick={toggleHandler} className='toggle' ref={toggle}>
        <div></div>
        <div></div>
        <div></div>
      </button>
    </div>
  )
}

export default Header