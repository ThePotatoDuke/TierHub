import { createContext, useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";

const BoardPageContext = createContext({ isBoardPage: false, boardName: "" });

export const useBoardPage = () => useContext(BoardPageContext);

const MainLayout = () => {
  const location = useLocation();
  const { tierListId } = useParams();
  const [boardName, setBoardName] = useState("");

  const isBoardPage = location.pathname.startsWith("/tier-list");

  useEffect(() => {
    if (isBoardPage) {
      const fetchBoardName = async () => {
        try {
          const response = await fetch(
            `http://localhost:8090/api/tier_lists/${tierListId}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setBoardName(data.name);
        } catch (error) {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
        }
      };

      fetchBoardName();
    }
  }, [isBoardPage, tierListId]);

  return (
    <BoardPageContext.Provider value={{ isBoardPage, boardName }}>
      <NavBar />
      <Outlet />
    </BoardPageContext.Provider>
  );
};

export default MainLayout;
