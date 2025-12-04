import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <footer>heloo</footer>
    </>
  );
}

export default Layout;
