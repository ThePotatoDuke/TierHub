import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { useBoardPage } from "../layouts/MainLayout";

const NavBar = () => {
  const { isBoardPage, boardName } = useBoardPage();
  return (
    <nav className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 p-2 text-white sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link className="" to="/">
          <img
            src={logo}
            alt="Logo"
            className="max-w-xs max-h-10 object-contain"
          />
        </Link>

        {isBoardPage && (
          <div className="flex-initial text-lg font-bold">{boardName}</div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
