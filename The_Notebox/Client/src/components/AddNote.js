import React, { useContext, useState } from 'react';
import noteContext from '../context/notes/noteContext';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddNote = (props) => {
  const context = useContext(noteContext);
  const { addNote } = context;
  const {showAlert} = props;

  const [note, setNote] = useState({ title: '', description: '', 
    // in ISO 8601 format
      time: new Date().toISOString()
  });
  

  const handleclick = async (e) => {
    e.preventDefault();
    const result = await addNote(note.title, note.description, note.time);
    if (result.success) {
      console.log('Note added:', result);
      showAlert('Note added successfully', 'success');
      setNote({
        title: '',
        description: '',
        time: '',
      });
    }else{
      showAlert('Note not added', 'danger');
    }
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <div className='lg:mx-20 mx-8'>
    <div className="my-1 lg:my-3">
     <h1 className="text-2xl font-bold gradient-text">Add a Note</h1>
      <div className="my-4">
        <label htmlFor="title" className="block text-lg font-medium">
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
        <label htmlFor="description" className="block text-lg font-medium">
          Description
        </label>
        <textarea
          className="mt-1 p-2 w-full text-black border rounded-md"
          value={note.description}
          id="description"
          name="description"
          placeholder="Describe your task.."
          rows="3"
          onChange={onChange}
        ></textarea>
      </div>
      <div className="mb-3">
        <label htmlFor="time" className="block text-lg font-medium">
          Date
        </label>
        {/* <textarea
          className="mt-1 p-2 text-black w-full border rounded-md"
          value={note.time}
          id="time"
          name="time"
          placeholder="Date"
          rows="1"
          onChange={onChange}
        ></textarea> */}
        <DatePicker
        className='mt-1 p-2 text-black w-full border rounded-md'
          selected={note.time? new Date(note.time): new Date()}
          onChange={(date) => {
            setNote({
            ...note,
            time: date.toISOString(),
          })
        }}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMM d, yyyy h:mm aa"
        />
      </div>
      <button type="button" className=" max-w-sm bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-600 focus:outline-none text-white text-md uppercase font-bold shadow-md rounded-lg mx-auto px-4 py-2" onClick={handleclick}>
        Add note
      </button>
    </div>
    </div>
  );
};

export default AddNote;