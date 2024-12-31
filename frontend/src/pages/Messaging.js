import React, { useEffect, useState } from 'react';
import socket from './socket';
import '../css/chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.emit('new-user-joined');

    socket.on('receive', (data) => {
      console.log('Received message from server:', data);

      setMessages((prev) => [
        ...prev,
        { name: data.name, message: data.message, position: 'left' },
      ]);
    });

    socket.on('left', (data) => {
      if (data.name) {
        setMessages((prev) => [
          ...prev,
          { name: data.name, message: '', position: 'center' },
        ]);
      }
    });

    return () => {
      socket.off('receive');
      socket.off('left');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();

    socket.emit('send', { message });

    setMessages((prev) => [
      ...prev,
      { name: 'You', message, position: 'right' },
    ]);
    setMessage('');
  };

  return (
    <div className="chat-container">
      <h1 className="chat-header">Chatbot</h1>
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${
              msg.position === 'center'
                ? 'message-center'
                : msg.position === 'right'
                ? 'message-right'
                : 'message-left'
            }`}
          >
            {msg.position !== 'center' && <strong>{msg.name}: </strong>}
            {msg.message}
          </div>
        ))}
      </div>
      <form className="chat-form" onSubmit={sendMessage}>
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="chat-button" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
