import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav className="h-100 w-100 bg-blue-200 mb-5">
      <ul className="flex justify-start items-center gap-4 text-xl ml-5">
        <Link to="/">
          <li>Results</li>
        </Link>
        <Link to="/new">
          <li>Add new</li>
        </Link>
        <Link to="/leaderboard">
          <li>Leaderboard</li>
        </Link>
      </ul>
    </nav>
  );
};

export default Header;
