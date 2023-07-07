import React from 'react'

const Container = (props) => {
  return (
    <div className={props.class1}>
        <div className="container">
            {props.children}
        </div>
    </div>
  )
}

export default Container