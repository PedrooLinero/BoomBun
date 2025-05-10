import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home";
import HomeContent from "./components/HomeContent";
import PaginaError from "./pages/PaginaError";
import Carta from "./components/Carta";
import Login from "./components/Login";
import AñadirProducto from "./components/AñadirProducto";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <PaginaError />,
    children: [
      {
        path: "/",
        element: <HomeContent />,
      },
      {
        path: "/carta",
        element: <Carta />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/añadirProducto",
        element: <AñadirProducto />,
      },
      // Añade esta ruta si implementas registro
      // {
      //   path: "/register",
      //   element: <Register />, // Crea este componente si lo necesitas
      // }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);