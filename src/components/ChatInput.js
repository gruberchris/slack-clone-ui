import React, {useState} from "react";
import styled from "styled-components";
import {Button} from '@material-ui/core';
import {auth, db} from '../firebase';
import firebase from 'firebase';
import {useAuthState} from 'react-firebase-hooks/auth';

const ChatInput = ({ chatRef, channelName, channelId }) => {
  const [message, setMessage] = useState("");
  const [user] = useAuthState((auth));

  const sendMessage = async e => {
    e.preventDefault();

    if (!channelId) {
      return false;
    }

    try {
      await db.collection('rooms').doc(channelId).collection("messages").add({
        message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        user: user?.displayName,
        userImage: user?.photoURL
      });
    } catch(error) {
      console.log(error);
    }

    chatRef.current.scrollIntoView({ behavior: "smooth" });

    setMessage("");
  }

  return (
    <ChatInputContainer>
      <form>
        <input
          placeholder={`Message #${channelName}`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button hidden type="submit" onClick={sendMessage}>SEND</Button>
      </form>
    </ChatInputContainer>
  )
}

export default ChatInput;

const ChatInputContainer = styled.div`
  border-radius: 20px;
  
  > form {
    position: relative;
    display: flex;
    justify-content: center;
  }
  
  > form > input {
    position: fixed;
    bottom: 30px;
    width: 73%;
    border: 1px solid gray;
    border-radius: 3px;
    padding: 20px;
    outline: none;
  }
  
  > form > Button {
    display: none !important;
  }
`;