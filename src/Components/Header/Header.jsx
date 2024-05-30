import React, { useEffect, useRef } from 'react'
import './Header.css'

const Header = ( { sidebar, isOpen, setIsOpen, removeSidebar } ) => {

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
  }

  useEffect(() => {
    toggleHandler();
  }, [isOpen])
  


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
      <a href='/'><h1>Aistear Unica Admin </h1></a>
      <button className='logout'>
        <div></div>
        <p>Log Out</p>
      </button>
      <button onClick={removeSidebar} className='toggle' ref={toggle}>
        <div></div>
        <div></div>
        <div></div>
      </button>
    </div>
  )
}

export default Header