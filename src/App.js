import {RouterProvider, createBrowserRouter} from 'react-router-dom';

import Home from './pages/home/Home';
import RootLayout from './pages/root/Root';
import About from './pages/about/About';
import Contact from './pages/contact/Contact';
import AdminRootLayout from './pages/admin_root/AdminRoot';
import Dashboard from './pages/admin/dashboard/Dashboard';
import PrivateUser from './pages/admin/private_user/PrivateUser';
import Casuals from './pages/admin/casuals/Casuals';
import City from './pages/admin/city/City';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import AdminLogin from './pages/auth/AdminLogin';
import { action as adminLogoutAction } from './pages/auth/AdminLogout'
import { checkAuthLoader, loader as tokenLoader } from './utils/auth'
import AdminProfile from './pages/admin/profile/AdminProfile';
import EditCity from './pages/admin/city/EditCity';
import AddCity from './pages/admin/city/AddCity';
import AddPrivateUser from './pages/admin/private_user/AddPrivateUser';
import EditPrivateUser from './pages/admin/private_user/EditPrivateUser';
import AddCasual from './pages/admin/casuals/AddCasual';
import EditCasual from './pages/admin/casuals/EditCasual';
import Client from './pages/admin/clients/Client';
import AddClient from './pages/admin/clients/AddClient';
import EditClient from './pages/admin/clients/EditClient';
import ClientType from './pages/admin/clients/client_types/ClientType';
import AddClientType from './pages/admin/clients/client_types/AddClientType';
import EditClientType from './pages/admin/clients/client_types/EditClientType';
import PropertyType from './pages/admin/properties/property_type/PropertyType';
import AddPropertyType from './pages/admin/properties/property_type/AddPropertyType';
import EditPropertyType from './pages/admin/properties/property_type/EditPropertyType';
import PropertyGrade from './pages/admin/properties/property_grade/PropertyGrade';
import AddPropertyGrade from './pages/admin/properties/property_grade/AddPropertyGrade';
import EditPropertyGrade from './pages/admin/properties/property_grade/EditPropertyGrade';
import JobType from './pages/admin/casualJob/jobType/JobType';
import AddJobType from './pages/admin/casualJob/jobType/AddJobType';
import EditJobType from './pages/admin/casualJob/jobType/EditJobType';
import Property from './pages/admin/properties/Property';
import AddProperty from './pages/admin/properties/AddProperty';
import EditProperty from './pages/admin/properties/EditProperty';
import Manager from './pages/admin/managers/Manager';
import AddManager from './pages/admin/managers/AddManager';
import EditManager from './pages/admin/managers/EditManager';
import CasualJob from './pages/admin/casualJob/CasualJob';
import AddCasualJob from './pages/admin/casualJob/AddCasualJob';
import EditCasualJob from './pages/admin/casualJob/EditCasualJob';
import { useSelector } from 'react-redux';
import EditProfile from './pages/admin/profile/EditProfile';
import ForgotPassword from './pages/auth/ForgotPassword';

  const AdminRole = (props) => PrivateRoutes({ roleAccess: ['super-admin', 'admin'], Children: props});
  const StaffRole = (props) => PrivateRoutes({ roleAccess: ['super-admin', 'admin', 'sales'], Children: props});
  const ClientAdminRole = (props) => PrivateRoutes({ roleAccess: ['super-admin', 'admin', 'sales', 'client-admin'], Children: props});
  const ManagerRole = (props) => PrivateRoutes({ roleAccess: ['super-admin', 'admin', 'sales', 'client-admin', 'manager'], Children: props});

function App() {

  const router = createBrowserRouter([
    { path: "/", 
      element: <RootLayout />,
      errorElement: <h1>404 Found</h1>,
      loader: tokenLoader,
      id: "root",
      children : [
        { index: true, element: <Home />,  },
        { path: "/about", element: <About />, loader: checkAuthLoader },
        { path: "/contact", element: <Contact /> },
      ]
    },
    {
      path: "/admin",
      element: <AdminRootLayout />,
      loader: checkAuthLoader,
      children: [
        { index: true, element: <Dashboard />},
        { path: 'profile', loader: checkAuthLoader, children: [
          { index: true, element: <AdminProfile />},
          {path: 'edit', element: <EditProfile />}
        ]},
        { path: "private-users", children: [
          { index: true, element: <PrivateUser />},
          { path: 'new', element: <AddPrivateUser />},
          { path: 'edit/:id', element: <EditPrivateUser />}
        ]},
        { path: "casuals", children: [
          { index: true, element: AdminRole(<Casuals />)},
          { path: 'new', element: AdminRole(<AddCasual />)},
          { path: 'edit/:id', element: AdminRole(<EditCasual />)}
        ]},
        { path: "city", children: [
          { index: true, element: AdminRole(<City />)},
          { path: "edit/:id",  element: AdminRole(<EditCity />)},
          { path: "add", element: AdminRole(<AddCity />)}
        ]},
        { path: "clients", children: [
          { index: true, element: StaffRole(<Client />)},
          { path: "new", element: StaffRole(<AddClient />)},
          { path: "edit/:id", element: StaffRole(<EditClient />)},
        ]},
        { path: "client-types", children: [
          { index: true, element: AdminRole(<ClientType />)},
          { path: "new", element: AdminRole(<AddClientType />)},
          { path: "edit/:id", element: AdminRole(<EditClientType />)},
        ]},
        { path: "properties", children: [
          { index: true, element: ClientAdminRole(<Property />)},
          { path: "new", element: ClientAdminRole(<AddProperty />)},
          { path: "edit/:id", element: ClientAdminRole(<EditProperty />)},
        ]},
        { path: "property-types", children: [
          { index: true, element: AdminRole(<PropertyType />)},
          { path: "new", element: AdminRole(<AddPropertyType />)},
          { path: "edit/:id", element: AdminRole(<EditPropertyType />)},
        ]},
        { path: "property-grades", children: [
          { index: true, element: AdminRole(<PropertyGrade />)},
          { path: "new", element: AdminRole(<AddPropertyGrade />)},
          { path: "edit/:id", element: AdminRole(<EditPropertyGrade />)},
        ]},
        { path: "managers", children: [
          { index: true, element: ClientAdminRole(<Manager />)},
          { path: "new", element: ClientAdminRole(<AddManager />)},
          { path: "edit/:id", element: ClientAdminRole(<EditManager />)},
        ]},
        { path: "job-types", children: [
          { index: true, element: StaffRole(<JobType />)},
          { path: "new", element: StaffRole(<AddJobType />)},
          { path: "edit/:id", element: StaffRole(<EditJobType />)},
        ]},
        { path: "casual-jobs", children: [
          { index: true, element: ManagerRole(<CasualJob />)},
          { path: "new", element: ManagerRole(<AddCasualJob />)},
          { path: "edit/:id", element: ManagerRole(<EditCasualJob />)},
        ]},
        { path: "logout", action: adminLogoutAction}
      ]
    },
    { path: "/admin/login", element: <AdminLogin />, loader: tokenLoader, id: "admin"},
    { path: "/admin/forgot-password", element: <ForgotPassword />}
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="dark"
      />
    </>
  )
}

const PrivateRoutes = ({roleAccess, Children}) => {
  const adminAuthState = useSelector((state) => state.adminAuth.user);
  let role = localStorage.getItem('role');
  if(roleAccess?.includes(adminAuthState?.private_user?.role || role)){
    return Children;
  } else {
    return <h1>You are unauthorized to access this page</h1>;
  }

}

export default App;
