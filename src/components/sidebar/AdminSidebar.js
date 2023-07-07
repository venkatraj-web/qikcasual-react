import React from 'react'
import { Link, Form, NavLink } from 'react-router-dom'
import { VscDashboard } from 'react-icons/vsc'
import { FiLogOut } from 'react-icons/fi'
import {CgWebsite} from 'react-icons/cg'
import { useSelector } from 'react-redux'
import { getNavigations } from '../../utils/navigations'

const AdminSidebar = () => {
    const adminStyleState = useSelector((state) => state.adminStyle);
    const adminAuthState = useSelector((state) => state.adminAuth);
    const role = adminAuthState.user.private_user ? adminAuthState.user.private_user?.role : adminAuthState.user.manager?.role
    const mainNavigations = getNavigations(role);
    // console.log(mainNavigations);

  return (
    <>
        <div>
            <nav className={`admin-sidebar ${adminStyleState.navClose}`}>
                <div className="logo-name">
                    <div className="logo-image">
                        <img src="/images/stratonik-large.png" alt="logo" className='img-fluid' />
                    </div>
                    <span className='logo_name'>Qikcasual</span>
                </div>

                <div className="menu-items">
                    <ul className="nav-links">
                        {/* <li>
                            <NavLink to="casuals" className={({isActive}) => isActive ? "active" : undefined}>
                                <FaUsers />
                                <span className="link-name">Casuals</span>
                            </NavLink>
                        </li> */}
                        <li>
                            <NavLink to="" end>
                                <VscDashboard />
                                <span className="link-name">Dashboard</span>
                            </NavLink>
                        </li>
                        {
                            mainNavigations && mainNavigations.map((navData) => {
                                return <li key={navData.path}>
                                    <NavLink to={navData.path}>
                                        {navData.icon}
                                        <span className='link-name'>{navData.name}</span>
                                    </NavLink>
                                </li>
                            })
                        }
                        <li>
                            <Link to="/">
                                <CgWebsite />
                                <span className="link-name">Website</span>
                            </Link>
                        </li>
                    </ul>

                    <ul className="logout-mode pb-4">
                        <li>
                            <Form action='/admin/logout' method='post'>    
                                <FiLogOut />
                                <button className="link-name">Logout</button>
                            </Form>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    </>
  )
}

export default AdminSidebar