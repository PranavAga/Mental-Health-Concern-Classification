import React, { useContext, useEffect, useState } from 'react';
import noteContext from '../context/notes/noteContext';
import { useNavigate } from 'react-router-dom';
import { Chrono } from "react-chrono";
import EditNode from './EditNote';

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
  const { notes, getNotes, deleteNote } = context;
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getNotes();
    } else {
      navigate('/login');
    }
    //eslint-disable-next-line
  }, []);

  const [note, setNote] = useState({ id: '', etitle: '', edescription: '', edueDate: '' });
  const [showEditNote, setShowEditNote] = useState(false);

  const updateNote = (currentNote) => {
    setNote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      edueDate: currentNote.dueDate,
    });
    setShowEditNote(true);
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
    return <div className="w-full" key={note._id}>
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
            contentDetailsHeight={50}
          >{customContent}</Chrono>
        ) : (
          <p className="mx-1">No notes found</p>
        )}
      </div>
      {showEditNote &&
        <EditNode note={note} setShowEditNote={setShowEditNote} setNote={setNote} />}
    </>
  );
};

export default Notes;
