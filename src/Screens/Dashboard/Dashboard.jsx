import React from 'react'
import './Dashboard.css'

const Dashboard = ({setHeadTitle}) => {

  setHeadTitle('Dashboard');

  return (
    <div className='dashboard'>
      <h1>Dashboard</h1>
      <div className='dash'>

      </div>
    </div>
  )
}

export default Dashboard