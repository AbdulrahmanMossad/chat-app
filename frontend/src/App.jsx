// import SignUp from './page/signup/SignUp';
import Home from "./page/home/Home"
import SignUp from "./page/signup/SignUp"
import Login from "./page/login/Login"
import MessagesPage from "./page/chat/MessagesPage"
import { Toaster } from "react-hot-toast"
import { AuthUseContext } from "./context/AuthContext"

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
function App() {
  const { authUser, conversationWith } = AuthUseContext()
  return (
    <div className="flex justify-center items-center y-4 h-screen ">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={authUser ? <Home /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/signup"
            element={authUser ? <Navigate to="/" /> : <SignUp />}
          />
          <Route
            path="/login"
            element={authUser ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/messages/:id"
            element={
              authUser && conversationWith ? (
                <MessagesPage />
              ) : (
                <Navigate to={"/login"} />
              )
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  )
}

export default App
