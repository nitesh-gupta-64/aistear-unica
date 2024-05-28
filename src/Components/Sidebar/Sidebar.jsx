import React from 'react'
import './Sidebar.css'
import { Link } from 'react-router-dom'
//images
import author from '../../assets/images/author.png'
import blog from '../../assets/images/blog.png'
import help from '../../assets/images/help.png'
import login from '../../assets/images/login.png'
import logout from '../../assets/images/logout.png'
import order from '../../assets/images/order.png'
import partner from '../../assets/images/partner.png'
import tag from '../../assets/images/tag.png'
import vendor from '../../assets/images/vendor.png'
import wallet from '../../assets/images/wallet.png'

const Sidebar = ({sidebar, removeSidebar}) => {

  return (
    <div onClick={removeSidebar} ref={sidebar} className='sidebar side'>
      <div>
        <h2>Admin Layout</h2>
        <div>
          <img src={order}/>
          <Link>Order</Link>
        </div>
        <div>
          <img src={vendor}/>
          <Link>Vendor</Link>
        </div>
        <div>
          <img src={partner}/>
          <Link>Partners</Link>
        </div>
      </div>
      <div>
        <h2>Auth Layout</h2>
        <div>
          <img src={login}/>
          <Link>Log in</Link>
        </div>
        <div>
          <img src={login}/>
          <Link>Sign in</Link>
        </div>
      </div>
      <div>
        <h2>Documentation</h2>
        <div>
          <img src={wallet}/>
          <Link>Wallet</Link>
        </div>
        <div>
          <img src={help}/>
          <Link>Help Desk</Link>
        </div>
      </div>
      <div>
        <h2>Blogs</h2>
        <div>
          <img src={blog}/>
          <Link to='/showblog'>Show Blogs</Link>
        </div>
        <div>
          <img src={blog}/>
          <Link to='/createblog'>Create Blogs</Link>
        </div>
        <div>
          <img src={tag}/>
          <Link>Tags</Link>
        </div>
        <div>
          <img src={tag}/>
          <Link>Category</Link>
        </div>
        <div>
          <img src={author}/>
          <Link>Author</Link>
        </div>
      </div>
      <button>
        <img src={logout}/>
        <Link>LOG OUT</Link>
      </button>

    </div>
  )
}

export default Sidebar