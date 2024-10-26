import React, { useState } from "react";
import useInterval from "@use-it/interval";
import { motion } from "framer-motion";

const messages = [
  { text: "How do I get better at React?" },
  { text: "Just build something!" },
  { text: "OK! What should I build?" },
  { text: "I dunno. Just Google it?" },
  { text: "Oh! This course looks cool!" },
  { text: "Send me the link?!" },
  { text: "reactjs.org" },
];

function Message({ message }) {
  return (
    <motion.div
      className="message"
      initial={{ rotate: -5, scale: 0.2 }}
      animate={{ rotate: 0, scale: 1 }}
    // transition={{ duration: 0.5 }}
    >
      <div className="avatar">🐶</div>
      <div className="text">{message.text}</div>
      <div className="avatar">🐱</div>
    </motion.div>
  );
}

function Typing({ even }) {
  return (
    <motion.div
      className={`typing ${even ? "is-right" : "is-left"}`}
      initial={{ rotate: 10, scale: 0 }}
      animate={{ rotate: 0, scale: 1 }}
    >
      <div className="dots">
        <div />
        <div />
        <div />
      </div>
    </motion.div>
  );
}

const ChatBox = () => {
  const [messageToshow, setMessageToShow] = useState(0);

  useInterval(() => {
    setMessageToShow((messageToshow) => messageToshow + 1);
  }, 2000);

  return (
    <div className="ChatBox">
      <div className="walkthrough">
        {messages.map((message, index) => {
          // logic goes here
          const even = index % 2 === 0;

          // are we supposed to show a typing indicator?
          if (messageToshow + 1 === index) {
            return <Typing key={index} even={even} />;
          }

          // are we supposed to show this message?
          if (index > messageToshow) return <div key={index} />;

          return <Message key={index} message={message} />;
        })}
      </div>
    </div>
  );

};

export default ChatBox;







