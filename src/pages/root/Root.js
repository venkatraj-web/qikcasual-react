import React, { useEffect } from 'react'
import { Outlet, useLoaderData, useSubmit } from 'react-router-dom';
import MainNavigation from '../../components/navbar/MainNavigation';
import MainFooter from '../../components/footer/MainFooter';
import '../../App.css';
import { getTokenDuration } from '../../utils/auth';

const RootLayout = () => {
  const token = useLoaderData();
  const submit = useSubmit();

  // console.log(token);
  // console.log("token");
  
  useEffect(() => {
    if(!token){
      return;
    }

    if(token === "EXPIRED"){
      submit(null, { action:"/admin/logout", method: "POST"});
      return;
    }

    const tokenDuration = getTokenDuration();
    // console.log(tokenDuration);
    // console.log("tokenDuration");

    setTimeout(() => {
      submit(null, { action: "/admin/logout", method: 'POST'});
    }, tokenDuration);
  }, [token, submit]);
  return (
    <>
        <MainNavigation />
        <main>
            <Outlet />
        </main>
        <MainFooter />
    </>
  )
}

export default RootLayout;