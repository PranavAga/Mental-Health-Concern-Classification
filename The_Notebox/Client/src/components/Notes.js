import React, { useContext, useEffect, useRef, useState } from 'react';
import noteContext from '../context/notes/noteContext';
import { useNavigate } from 'react-router-dom';
import { Chrono } from "react-chrono";

function convertToRecentDate(date) {
  let title;
  const now = new Date();
  const dueDate = new Date(date);
  const daysDifference = Math.floor((dueDate - now) / (1000 * 60 * 60 * 24));

  // // Format using relative time for recent dates
  // if (Math.abs(daysDifference) <= 30) {
  //   const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  //   title = rtf.format(daysDifference, 'day'); // e.g., "5 days ago" or "in 3 days"
  // } else {
  //   // For dates older than 30 days, use a full date format
  //   title = dueDate.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
  // }

  title = dueDate.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
  return title;
}

const Notes = () => {
  const context = useContext(noteContext);
  const { notes, getNotes, editNote, deleteNote } = context;
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getNotes();
    } else {
      navigate('/login');
    }
    //eslint-disable-next-line
  }, []);

  const ref = useRef(null);
  const [note, setNote] = useState({ id: '', etitle: '', edescription: '', edueDate: '' });

  const updateNote = (currentNote) => {
    setNote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      edueDate: currentNote.dueDate,
    });
    ref.current.classList.remove('hidden');
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleclick = (e) => {
    editNote(note.id, note.etitle, note.edescription, note.edueDate);
    ref.current.classList.add('hidden');
  };

  const items = notes.map(note => ({
    // title: note.dueDate || "No Date",
    title: note.dueDate ? convertToRecentDate(note.dueDate) : "No Date",
    date: note.dueDate,
    cardTitle: note.title,
    cardSubtitle: note.description,
    cardDetailedText: `Details: ${note.description}`,
  }))

  // setCustomContent(notes.map(note => {
  const customContent = notes.map(note => {
    return <div className="w-full">
      {/* cardDetailedText */}
      <div className="text-gray-800 text-left">
        <p>{note.description}</p>
      </div>
      <div className="text-right mt-4">
        <i
          className="fas fa-trash text-gray-800 cursor-pointer mr-4"
          onClick={() => { deleteNote(note._id) }}
        ></i>
        <i
          className="fas fa-edit text-gray-800 cursor-pointer"
          onClick={() => updateNote(note)}
        ></i>
      </div>
    </div>
  });

  return (
    <>
      <button
       type="button"
        className="bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-600 focus:outline-none text-white text-md uppercase font-bold shadow-md rounded-lg px-4 py-2"
        onClick={() => navigate('/addnote')}
      >
        Add a Note
      </button>
      <h2 className='text-2xl mt-8 font-bold gradient-text'>Your Notes Timeline</h2>
      {/* fullwidth */}
      <div className="mt-6 y-6 w-full">
        {items.length > 0 ? (
          <Chrono items={items} mode="VERTICAL" useReadMore={true}
            allowDynamicUpdate={true} hideControls={true}
          >{customContent}</Chrono>
        ) : (
          <p className="mx-1">No notes found</p>
        )}
      </div>

      {/* Tailwind CSS Modal */}
      <div className="fixed z-10 inset-0 overflow-y-auto hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true" ref={ref}>
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
                onClick={() => ref.current.classList.add('hidden')}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notes;
