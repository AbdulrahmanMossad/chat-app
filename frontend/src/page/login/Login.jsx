// import React from 'react'
// import { useState } from 'react';
import { Link } from "react-router-dom"
import LoginHook from "../../hook/loginHook"
function login() {
  const [username, setUsername, password, setPassword, loading, handleSubmit] =
    LoginHook()
  return (
    <div className="flex flex-col items-center justify-center w-[80%] sm:w-[50%] lg:w-[40%] mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md  bg-gray-900 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-1">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          Login
          <span className="text-blue-500"> ChatApp</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="label p-2">
              <span className="text-base label-text  text-gray-500">
                Username
              </span>
            </label>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full input input-bordered h-10"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="label">
              <span className="text-base label-text  text-gray-500">
                Password
              </span>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full input input-bordered h-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Link
            to="/signup"
            className="text-sm  hover:underline hover:text-blue-600 mt-2 inline-block  text-gray-500"
          >
            {"Don't"} have an account?
          </Link>

          <div>
            <button className="btn btn-block btn-sm mt-2" disabled={loading}>
              {loading ? (
                <span className="loading loading-spinner "></span>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default login
