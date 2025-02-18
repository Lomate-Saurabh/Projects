import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "../Components/Layout";
import App from "../App";
import { Signup } from "../Components/Signup.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<App />} />
      <Route path="signup" element={<Signup />} />
    </Route>
  )
);

export default router;
