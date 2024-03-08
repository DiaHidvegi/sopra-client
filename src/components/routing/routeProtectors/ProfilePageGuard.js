import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import PropTypes from "prop-types";

export const ProfilePageGuard = () => {
  if (localStorage.getItem("token")) {
    
    return <Outlet />;
  }
  
  return <Navigate to="/profile" replace />;
};

GameGuard.propTypes = {
  children: PropTypes.node
};