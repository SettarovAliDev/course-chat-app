import { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData = {
        room,
        author: username,
        message: currentMessage,
        time: new Date().getHours() + ':' + new Date().getMinutes(),
      };

      await socket.emit('send_message', messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage('');
    }
  };

  useEffect(() => {
    socket.on('recieve_message', (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">Live chat</div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageData, index) => (
            <div
              className="message"
              id={username === messageData.author ? 'you' : 'other'}
              key={index}
            >
              <div>
                <div className="message-content">
                  <p>{messageData.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{messageData.time}</p>
                  <p id="author">{messageData.author}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          type="text"
          placeholder="Hey..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
