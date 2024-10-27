import React from "react";
import { useState } from "react";
import NoteContext from "./noteContext";

import mockNotes from "./notes.json"

const NoteState = (props) => {
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  // Get all notes 
  const getNotes = async () => {
    try {
      const response = await fetch('http://localhost:8000/notes/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
      });
      let allNotes
      if (!response.ok) {
        allNotes = mockNotes
        console.log("fetching notes from mock", allNotes)
      }else{
        const data = await response.json()
        console.log("fetching notes", data)
        allNotes = data
      }

      // sort notes by time
      allNotes.sort((a, b) => new Date(b.time) - new Date(a.time));

      setNotes(allNotes);

    } catch (error) {
      console.error("Error fetching notes:", error);
    } 
  };

  // Add a note function 
  const addNote = async (title, description, time) => {
    try {
      // try to fill fields
      if (!time){
        time = new Date().toISOString()
      }
      if (!title){
        title = new Date(time).toDateString()
      }

      const response = await fetch(`http://localhost:8000/add_note/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ title, description, time }),
      });
      if (response.ok) {
        const newNote = await response.json();
        setNotes([...notes, newNote]);
      } else {
        throw new Error("Failed to add note");
      }

      return { success: true };
    } catch (error) {
      console.error("Error adding note:", error);
      return { success: false }
    }
  };
  // const json = await response.json();
  // console.log(json);

  // TODO: Delete a note 
  const deleteNote = async (id) => {
    console.log("deleting",id)
    const response = await fetch(`http://localhost:8000/notes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = response.json();

    console.log(json);
    //
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
  };

  // Edit a note
  const editNote = async (id, title, description, time) => {
    try {
      const response = await fetch(`http://localhost:8000/edit_note/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token")
        },
        body: JSON.stringify({ title, description, time }),
      });

      if (response.ok) {
        const json = await response.json();
        console.log(json);
        
        const updatedNotes = notes.map((note) =>
          note._id === id ? { ...note, title, description, time } : note
        );
        setNotes(updatedNotes);
      }
    } catch (error) {
      console.error("Error editing note:", error);
    }
  };

  return (
    <NoteContext.Provider
      value={{ notes, getNotes, addNote, deleteNote, editNote }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
