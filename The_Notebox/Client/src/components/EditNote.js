import React, { useContext } from 'react';
import noteContext from '../context/notes/noteContext';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditNote = ({ note, setShowEditNote, setNote }) => {
  const context = useContext(noteContext);
  const { editNote } = context;

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleclick = (e) => {
    editNote(note.id, note.title, note.description, note.time);
    setShowEditNote(false);
  };

  return (
    <>
      {/* Tailwind CSS Modal */}
      <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="bg-[#28231D] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="container">
                <div className="mb-3">
                  <label htmlFor="title" className="block text-lg font-medium text-[#ECEE81]">
                    Title
                  </label>
                  <input
                    type="text"
                    value={note.title}
                    className="mt-1 p-2 text-black w-full border rounded-md"
                    id="title"
                    name="title"
                    placeholder="Add a title.."
                    onChange={onChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="block text-lg font-medium text-[#82A0D8]">
                    Description
                  </label>
                  <textarea
                    className="mt-1 p-2 w-full text-black border rounded-md"
                    value={note.description}
                    id="description"
                    name="description"
                    rows="1"
                    onChange={onChange}
                  ></textarea>
                </div>
                {/* <div className="mb-3">
                  <label htmlFor="time" className="block text-lg font-medium text-[#EDB7ED]">
                    Date
                  </label>
                  <textarea
                    className="mt-1 p-2 text-black w-full border rounded-md"
                    value={note.time}
                    id="time"
                    name="time"
                    rows="1"
                    onChange={onChange}
                  ></textarea>
                </div> */}
                <div className="mb-3">
                  <label htmlFor="time" className="block text-lg font-medium text-[#EDB7ED]">
                    Date
                  </label>
                  <DatePicker
                    selected={new Date(note.time)}
                    onChange={(date) => setNote({ ...note, time: date })}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="mt-1 p-2 text-black w-full border rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="bg-[#28231D] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="mx-4 max-w-sm px-4 py-2 text-sm font-medium text-white hover:bg-red-300 bg-red-500 border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                onClick={handleclick}
              >
                Update note
              </button>
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white hover:bg-red-300 bg-red-500 border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                onClick={() => setShowEditNote(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditNote;