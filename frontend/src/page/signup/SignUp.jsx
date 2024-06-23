import GenderCheckbox from "./GenderCheckbox"
import { Link } from "react-router-dom"
import SignupHook from "../../hook/signupHook"
function SignUp() {
  const [
    handleSubmit,
    inputs,
    setInputs,
    selectedGender,
    onCheckboxChange,
    loading,
  ] = SignupHook()
  return (
    <div className="flex flex-col items-center justify-center w-[80%] sm:w-[50%] lg:w-[40%] mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md  bg-gray-900 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-1">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          Sign Up <span className="text-blue-500"> ChatApp</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="label p-2">
              <span className="text-base label-text  text-gray-500">
                Full Name
              </span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full input input-bordered  h-10"
              value={inputs.fullName}
              onChange={(e) =>
                setInputs({ ...inputs, fullName: e.target.value })
              }
            />
          </div>

          <div>
            <label className="label p-2 ">
              <span className="text-base label-text  text-gray-500">
                Username
              </span>
            </label>
            <input
              type="text"
              placeholder="johndoe"
              className="w-full input input-bordered h-10"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
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
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
            />
          </div>

          <div>
            <label className="label">
              <span className="text-base label-text  text-gray-500">
                Confirm Password
              </span>
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full input input-bordered h-10"
              value={inputs.confirm}
              onChange={(e) =>
                setInputs({ ...inputs, confirm: e.target.value })
              }
            />
          </div>

          <GenderCheckbox
            selectedGender={selectedGender}
            onCheckboxChange={onCheckboxChange}
          />

          <Link
            to={"/login"}
            className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block  text-gray-500"
            href="#"
          >
            Already have an account?
          </Link>

          <div>
            <button
              className="btn btn-block btn-sm mt-2 border border-slate-700"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp
