import "../src/index.css"
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-dark-cyan/theme.css";
import Dashboard from "./components/Dashboard"
import  { createBrowserRouter, RouterProvider } from "react-router-dom"
import RegisterPage from "./components/RegisterPage"
import LoginPage from "./components/LoginPage";
function App() {

const router = createBrowserRouter([
   {
    path: "/",
    element:<Dashboard/>
  },
  {
    path: "/register",
    element:<RegisterPage/>
  },
  {
    path: "/login",
    element:<LoginPage/>
  },
 
]
)
  return (
       <PrimeReactProvider>
    <div className="main-page">
    <RouterProvider router={router}/>
    </div>
    </PrimeReactProvider>
  )
}

export default App
