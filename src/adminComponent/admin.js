import React from "react";
import { Link } from "react-router-dom";

class Admin extends React.Component{
    render(){
        return(
        <div>
            <h1>
                Administrator
            </h1>
            <Link to="/src/loginComponent/login.js"></Link>
        </div>)
    }
}

export default(Admin)