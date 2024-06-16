import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {Landing} from "./Landing.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />
  },
  {
    path: "app",
    element: <App />
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/*<App />*/}
  </React.StrictMode>,
)
