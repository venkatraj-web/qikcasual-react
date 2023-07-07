import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../../components/sidebar/AdminSidebar'
import MainContent from '../../components/main_content/MainContent'
import '../../Admin.css'

const AdminRootLayout = () => {
  return (
    <>
        <AdminSidebar />
        <MainContent>
          <Outlet />
        </MainContent>
    </>
  )
}

export default AdminRootLayout