import {createBrowserRouter} from "react-router"
import Login from './features/auth/pages/login'
import Register from './features/auth/pages/Register'
import Protected from "./features/auth/components/protected"
import Home from "./features/interview/pages/home.jsx"
import InterView from "./features/interview/pages/interView.jsx"

export const router = createBrowserRouter([
  {
    path: "/login", 
    element: <Login/>
  },
  {
    path: "/register",
    element: <Register/>
  },
  {
    path: "/",
    element:<Protected><Home/></Protected>
  },
  {
    path: "/interview/:interviewId",
    element: <Protected><InterView /></Protected>
  }
])