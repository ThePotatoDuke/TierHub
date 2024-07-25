import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Board from "./components/Board";
import "./index.css";
import MainLayout from "./layouts/MainLayout";
import ListsPage from "./components/ListsPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<ListsPage />} />
      <Route path="/tier-list/:tierListId" element={<Board />} />
    </Route>
  )
);
const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
