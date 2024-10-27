import React, { useContext, useEffect, useState } from 'react';
import noteContext from '../context/notes/noteContext';
import { useNavigate } from 'react-router-dom';
import { Chrono } from "react-chrono";
import EditNote from './EditNote';

import mockResults from './mockResults.json';

import AnxietyIcon  from './svg/anxiety.svg';
import DepressionIcon  from './svg/depression.svg';
import StressIcon  from './svg/stress.svg';
import CareerConfusionIcon  from './svg/career_confusion.svg';
import EatingDisorderIcon  from './svg/eating_disorder.svg';
import InsomniaIcon  from './svg/insomnia.svg';
import PositiveOutlookIcon  from './svg/positive_outlook.svg';
import HealthAnxietyIcon  from './svg/health_anxiety.svg';

function getSVG(category) {
  let svg
  switch (category) {
    case "Anxiety":
      svg = AnxietyIcon 
      break;
    case "Depression":
      svg = DepressionIcon 
      break;
    case "Stress":
      svg = StressIcon 
      break;
    case "Career Confusion":
      svg = CareerConfusionIcon 
      break;
    case "Eating Disorder":
      svg = EatingDisorderIcon 
      break;
    case "Insomnia":
      svg = InsomniaIcon 
      break;
    case "Positive Outlook":
      svg = PositiveOutlookIcon 
      break;
    case "Health Anxiety":
      svg = HealthAnxietyIcon 
      break;
    default:
      svg = AnxietyIcon
  }

  // resize it
  return <img src={svg} alt={category} className="w-6 h-6" />
}

function convertToRecentDate(date) {
  let title;
  const now = new Date();
  const time = new Date(date);
  const daysDifference = Math.floor((time - now) / (1000 * 60 * 60 * 24));

  // // Format using relative time for recent dates
  // if (Math.abs(daysDifference) <= 30) {
  //   const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  //   title = rtf.format(daysDifference, 'day'); // e.g., "5 days ago" or "in 3 days"
  // } else {
  //   // For dates older than 30 days, use a full date format
  //   title = time.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
  // }

  title = time.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
  return title;
}

async function fetchReport(userInput) {
  console.log(userInput);
  const response = await fetch('http://localhost:8000/pipeline', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.getItem('token')
    },
    body: JSON.stringify(userInput)
  });

  const data = await response.json();
  // const data = {
  //   "results": [
  //     {
  //       "polarity": "Negative",
  //       "concerns": [
  //         {
  //           "concern": "feel very low",
  //           "category": "Depression",
  //           "intensity": 9
  //         },
  //         {
  //           "concern": "feel very low ",
  //           "category": "Depression",
  //           "intensity": 9
  //         }
  //       ],
  //       "progression": "Negativefeel very low"
  //     },
  //     {
  //       "polarity": "Negative",
  //       "concerns": [
  //         {
  //           "concern": "feel very low",
  //           "category": "Depression",
  //           "intensity": 9
  //         },
  //         {
  //           "concern": "feel very low ",
  //           "category": "Depression",
  //           "intensity": 9
  //         }
  //       ],
  //       "progression": "Negativefeel very low"
  //     }
  //   ]
  // }

  return data.results;
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

  const [note, setNote] = useState({ id: '', title: '', description: '', time: '' });
  const [showEditNote, setShowEditNote] = useState(false);

  const [results, setResults] = useState([]);
  const [showResultsLoader, setShowResultsLoader] = useState(false);

  const updateNote = (currentNote) => {
    setNote({
      id: currentNote.id,
      title: currentNote.title,
      description: currentNote.description,
      time: currentNote.time,
    });
    setShowEditNote(true);
  };

  const items = notes.map(note => ({
    // title: note.time || "No Date",
    title: note.time ? convertToRecentDate(note.time) : "No Date",
    date: note.time,
    cardTitle: note.title,
    // cardSubtitle: note.description,
    // cardDetailedText: `Details: ${note.description}`,
  }))

  const customContent = notes.map((note, index) => {

    const polarityColor = results[index] ? results[index].polarity === "Positive" ? "green" : results[index].polarity === "Negative" ? "red" : "gray" : "gray";

    return <div className="w-full" key={note.id}>
      {/* cardDetailedText */}
      <div className="text-gray-800 text-left">
        <p>{note.description}</p>
      </div>
      {/* {getSVG("Anxiety")} */}
      {/* results of the report */}
      {(index < results.length) && (
        <div className="text-left">
          <p style={{ color: polarityColor }}>{results[index].polarity}</p>
          <p>{results[index].progression}</p>
          <ul>
            {results[index].concerns.map((concern, i) => (
              <li key={i}>{concern.concern} - {concern.category} - {concern.intensity}</li>
            ))}
          </ul>
          {getSVG(results[index].concerns[0].category)}
        </div>
      )}

      <div className="text-right mt-4">
        <i
          className="fas fa-trash text-gray-800 cursor-pointer mr-4"
          onClick={() => deleteNote(note.id)}
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
      <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row">
        <button
          type="button"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white hover:bg-red-300 bg-red-500 border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          onClick={() => navigate('/addnote')}
        >
          Add a Note
        </button>
        <button
          type="button"
          className="mx-4 max-w-sm bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-600 focus:outline-none text-white text-md font-bold shadow-md rounded-lg px-4 py-2"
          onClick={() => {
            setShowResultsLoader(true);
            fetchReport({ "inputs": notes.map(note => note.title + "\n" + note.description) })
              .then(data => setResults(data))
              .catch(error => {
                console.error("Error fetching report:", error);
                alert("Server error. Please try again later.");
                setResults(mockResults);
              })
              .finally(() => setShowResultsLoader(false));
          }
          }
        >
          Generate Report
        </button>
        {/* loader */}
        {showResultsLoader &&
          <div className="loader">

            <div role="status">
              <svg className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        }

      </div>

      <h2 className='text-2xl mt-8 font-bold gradient-text'>Your Notes Timeline</h2>
      {/* fullwidth */}
      <div className="mt-6 y-6 w-full">
        {items.length > 0 ? (
          <Chrono items={items} mode="VERTICAL" useReadMore={true}
            allowDynamicUpdate={true} hideControls={true}
            // contentDetailsHeight={50}
            // Tue Oct 01 2024
            titleDateFormat="ddd MMM DD YYYY"
          >{customContent}</Chrono>
        ) : (
          <p className="mx-1">No notes found</p>
        )}
      </div>
      {showEditNote &&
        <EditNote note={note} setShowEditNote={setShowEditNote} setNote={setNote} />}
    </>
  );
};

export default Notes;
