import React from "react";
import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "https://notebox-backend.vercel.app";

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
      const data = await response.json()
      console.log(data)
      setNotes(
        data.map((obj, index) => {
          return {
              ...obj,             // Spread the existing properties
              title: `Note ${index + 1}`  // Add the new Note property
          };
        })
      )
      // const data = await response.json();
      // console.log(data)
      // setNotes(data.notes);
      // setNotes([
      //   {
      //     _id: "1",
      //     title: "Note 1",
      //     description: "Description 1",
      //     dueDate: "2023-10-30T18:30:00.000Z",
      //   },
      //   {
      //     _id: "2",
      //     title: "Note 2",
      //     description: "Description 2",
      //     dueDate: "2023-10-30T18:30:00.000Z",
      //   },
      //   {
      //     _id: "3",
      //     title: "Note 3",
      //     description: "Description 3",
      //     dueDate: "2023-10-30T18:30:00.000Z",
      //   },
      // ]);

    } catch (error) {
      console.error("Error fetching notes:", error);
    } 
  };

  // Add a note function 
  const addNote = async (title, description, dueDate) => {
    try {
      const note = description
      const response = await fetch(`http://localhost:8000/notes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ note }),
      });
      if (response.ok) {
        const newNote = await response.json();
        setNotes([...notes, newNote]);
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
  const editNote = async (id, title, description, dueDate) => {
    try {
      // const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "auth-token": localStorage.getItem("token")
      //   },
      //   body: JSON.stringify({ title, description, dueDate }),
      // });

      // TODO: currently mock
      const response = { ok: true };
      if (response.ok) {
        const updatedNotes = notes.map((note) =>
          note._id === id ? { ...note, title, description, dueDate } : note
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
