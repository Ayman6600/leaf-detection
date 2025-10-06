import React from "react";
import { useNavigate } from "react-router-dom";

const NavTest = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
      <h2>Navigation Test</h2>
      <ul>
        <li>
          <button
            className="btn btn-link"
            onClick={() => handleNavigation("/")}
          >
            Home
          </button>
        </li>
        <li>
          <button
            className="btn btn-link"
            onClick={() => handleNavigation("/about")}
          >
            About
          </button>
        </li>
        <li>
          <button
            className="btn btn-link"
            onClick={() => handleNavigation("/test")}
          >
            Test
          </button>
        </li>
      </ul>
    </div>
  );
};

export default NavTest;
