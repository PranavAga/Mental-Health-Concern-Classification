import React, { useContext, useState } from 'react';
import noteContext from '../context/notes/noteContext';

const AddNote = (props) => {
  const context = useContext(noteContext);
  const { addNote } = context;
  const {showAlert} = props;

  const [note, setNote] = useState({ title: '', description: '', dueDate: '' });
  

  const handleclick = async (e) => {
    e.preventDefault();
    const result = await addNote(note.title, note.description, note.dueDate);
    console.log('Note added:', result);
    if (result.success) {
      showAlert('Note added successfully', 'success');
      setNote({
        title: '',
        description: '',
        dueDate: '',
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
        <label htmlFor="dueDate" className="block text-lg font-medium">
          Due Date
        </label>
        <textarea
          className="mt-1 p-2 text-black w-full border rounded-md"
          value={note.dueDate}
          id="dueDate"
          name="dueDate"
          placeholder="Task due date.."
          rows="1"
          onChange={onChange}
        ></textarea>
      </div>
      <button type="button" className=" max-w-sm bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-600 focus:outline-none text-white text-md uppercase font-bold shadow-md rounded-lg mx-auto px-4 py-2" onClick={handleclick}>
        Add note
      </button>
    </div>
    </div>
  );
};

export default AddNote;