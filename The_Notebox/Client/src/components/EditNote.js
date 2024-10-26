import React, { useContext } from 'react';
import noteContext from '../context/notes/noteContext';

const EditNode = ({ note, setShowEditNote, setNote }) => {
  const context = useContext(noteContext);
  const { editNote } = context;

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleclick = (e) => {
    editNote(note.id, note.etitle, note.edescription, note.edueDate);
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
                  <label htmlFor="etitle" className="block text-lg font-medium text-[#ECEE81]">
                    Title
                  </label>
                  <input
                    type="text"
                    value={note.etitle}
                    className="mt-1 p-2 text-black w-full border rounded-md"
                    id="etitle"
                    name="etitle"
                    placeholder="Add a title.."
                    onChange={onChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="edescription" className="block text-lg font-medium text-[#82A0D8]">
                    Description
                  </label>
                  <textarea
                    className="mt-1 p-2 w-full text-black border rounded-md"
                    value={note.edescription}
                    id="edescription"
                    name="edescription"
                    rows="1"
                    onChange={onChange}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="edueDate" className="block text-lg font-medium text-[#EDB7ED]">
                    Due Date
                  </label>
                  <textarea
                    className="mt-1 p-2 text-black w-full border rounded-md"
                    value={note.edueDate}
                    id="edueDate"
                    name="edueDate"
                    rows="1"
                    onChange={onChange}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="bg-[#28231D] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="mx-4 max-w-sm bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-600 focus:outline-none text-white text-md uppercase font-bold shadow-md rounded-lg px-4 py-2"
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

export default EditNode;