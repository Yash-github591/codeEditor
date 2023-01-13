import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  function createNewRoom(event) {
    event.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success("Created New Room");
  }

  function joinRoom() {
    if (!roomId || !username) {
      toast.error("Either Room Id or username is missing !");
      return;
    }

    // redirect
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  }

  function handleInputEnter(event) {
    if (event.code == "Enter") {
      joinRoom();
    }
  }

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img
          className="homePageLogo"
          src="/logo.png"
          alt="logo"
          height="80px"
          margin-bottom="30px"
        />
        <h4>Paste invitation ROOM Id</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="ROOM ID"
            onChange={(event) => setRoomId(event.target.value)}
            value={roomId}
            onKeyUp={handleInputEnter}
          />
          <input
            type="text"
            className="inputBox"
            placeholder="USERNAME"
            onChange={(event) => setUsername(event.target.value)}
            value={username}
            onKeyUp={handleInputEnter}
          />
          <button className="btn joinBtn" onClick={joinRoom}>
            Join
          </button>
          <span className="createInfo">
            If you don't have an invite then create &nbsp;
            <a onClick={createNewRoom} href="" className="createNewBtn">
              New Room
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Home;
