import React from 'react';

const About = () => {
  return (
    <div className="mx-28">
      <h2 className="text-2xl font-bold my-2 gradient-text">About NoteBox</h2>
      <p className="mb-4 text-lg">
      Meet <b>MindPeers Journal</b> — a smarter way to capture and understand your daily thoughts, emotions, and growth. This innovative journaling app combines note-taking with mental health analytics. With features like mood tracking, sentiment analysis, and a personalized dashboard, MindPeers Journal empowers users to visualize emotional patterns, set personal goals, and stay consistent on their self-reflective journey. Designed for both simplicity and insight, MindPeers Journal is your digital companion for building mindfulness and self-awareness, one entry at a time.
      </p>
      <p className="text-2xl my-2 font-bold gradient-text">
        Key Features
      </p>
      <ul className="list-disc text-lg list-inside mb-4">
        <li>Create new notes and jot down your thoughts.</li>
        <li>Edit notes to keep your information up-to-date.</li>
        <li>Delete notes you no longer need.</li>
        <li>Your notes are securely analyzed in the cloud, to provide you with insights on your mental health.</li>
        <li>View your notes in a timeline format.</li>
      </ul>
      <p className='text-xl font-bold'>
        Get started today and experience the power of journaling with MindPeers Journal!
      </p>
    </div>
  );
};

export default About;
