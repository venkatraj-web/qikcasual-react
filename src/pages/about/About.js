import React from 'react'
import Meta from '../../utils/Meta'
import { useRouteLoaderData } from 'react-router-dom'

const About = () => {

  const token = useRouteLoaderData('root');
  return (
    <>
        <Meta title={"About"} />
        <div className="container">
            <div>About</div>
            {token && <h2>LoggedIn</h2>}
        </div>
    </>
  )
}

export default About