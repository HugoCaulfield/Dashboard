import React, { useState, useEffect } from 'react'
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { IconContext } from 'react-icons';
import { Link } from 'react-router-dom';
import { SidebarData } from './sideBarData';
import { myCookies } from '../App';
import { AddServiceM } from './addServiceModal';

export const Navbar = props => {
  const [sidebar, setSidebar] = useState(false);
  const [username, setUsername] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/user/getUsername", {
      method: "GET",
      headers : { 
        'Accept': 'application/json',
        'jwt': myCookies.cookies.get('jwt')
      },
    }).then((res) => {
        res.json().then((data) => {
          setUsername(username => data.username);
        })
    }).catch((err) => console.error(err));
  }, []);

  return (
    <>
      <IconContext.Provider value={{ className: "burger" }}>
        <div className='navbar'>
          <Link to='#' className='menu-bars'>
            <FaIcons.FaBars onClick={() => setSidebar(true)} />
          </Link>
          <h2>MY BOARD</h2>
          <p>{username} <i className="fas fa-user-circle"></i></p>
          
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={() => setSidebar(false)}>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            <li className="nav-text">
              <Link to="/home">
                <AiIcons.AiFillHome />
                <span>Dashboard</span>
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              if (props.subServices === false) return null;
              if (props.subServices.includes(item.title)) {
                return (
                  <li key={index} className="nav-text">
                    <Link to={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              } else {
                return null;
              }
            })}
            <li className='nav-text'>
              <button className="subs" onClick={() => setModalShow(true)}>
                <AiIcons.AiOutlineFolderAdd />
                <span>Services List</span>
              </button>
              <AddServiceM setsubservices={props.setSubServices} subservices={props.subServices} show={modalShow} onHide={() => setModalShow(false)} />
            </li>
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
};
