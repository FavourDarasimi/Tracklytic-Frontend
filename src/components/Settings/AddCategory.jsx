import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoAddOutline } from "react-icons/io5";

const AddCategory = ({ setShowCategory, onSubmit }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("Expense");
  const [color, setColor] = useState("#44bca2");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit?.({ name: name.trim(), type: type.toLowerCase(), color });
  };

  return (
    <div className="fixed z-10 inset-0 bg-black/30 grid place-items-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center">
          <h1 className="text-[19px] font-semibold">Add Category</h1>
          <RxCross2
            size={20}
            onClick={() => setShowCategory(false)}
            className="cursor-pointer"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div>
            <label className="font-medium pb-1 text-[15px]">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-md p-2 w-full h-[43px] border border-gray-200 outline-none mt-1"
              placeholder="Category name"
              required
            />
          </div>
          <div>
            <label className="font-medium pb-1 text-[15px]">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-md p-2 w-full h-[43px] border border-gray-200 outline-none mt-1"
            >
              <option>Income</option>
              <option>Expense</option>
            </select>
          </div>

          <div>
            <label className="font-medium pb-1 text-[15px]">
              Color Tag
            </label>
            <div className="flex gap-3 mt-1 items-center">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="rounded-full w-10 h-10 cursor-pointer"
              />
              <div className="text-[14px] text-gray-500">{color}</div>
              <div
                className="w-6 h-6 rounded-full shadow"
                style={{ backgroundColor: color }}
              ></div>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 text-center bg-green-600 outline-none flex items-center gap-x-1 border-2 cursor-pointer text-white py-[8px] px-[14px] rounded-xl text-[15px] hover:bg-white hover:border-2 hover:border-green-600 hover:text-green-600 transition-colors duration-500"
          >
            <IoAddOutline size={20} /> Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
