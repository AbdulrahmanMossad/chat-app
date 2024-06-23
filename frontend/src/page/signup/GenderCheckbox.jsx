// import { useState } from "react";

const GenderCheckbox = ({ selectedGender, onCheckboxChange }) => {
  return (
    <div className="flex mt-2 flex-wrap">
      <div className="form-control">
        <label
          className={`label gap-2 cursor-pointer ${
            selectedGender === "male" ? "selected" : ""
          } `}
        >
          <span className="label-text  text-gray-500">Male</span>
          <input
            type="checkbox"
            className="checkbox border-gray-300"
            checked={selectedGender === "male"}
            onChange={() => onCheckboxChange("male")}
          />
        </label>
      </div>
      <div className="form-control">
        <label
          className={`label gap-2 cursor-pointer  ${
            selectedGender === "female" ? "selected" : ""
          }`}
        >
          <span className="label-text  text-gray-500">Female</span>
          <input
            type="checkbox"
            className="checkbox border-gray-300"
            checked={selectedGender === "female"}
            onChange={() => onCheckboxChange("female")}
          />
        </label>
      </div>
    </div>
  )
}
export default GenderCheckbox
