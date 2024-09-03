import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";
import { format } from "timeago.js";
import { deleteMessage } from "../../lib/firebase";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

function randomID(len = 5) {
  let result = '';
  var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length;
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

const Chat = ({ infoprop, onBack }) => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });
  const [cameraOpen, setCameraOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const { currentUser } = useUserStore();
  const { showDeleteButtons } = useChatStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleDelete = async (message) => {
    try {
      await deleteMessage(chatId, message);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSend = async () => {
    if (text === "" && !img.file && !audioBlob) return;

    let imgUrl = null;
    let audioUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      if (audioBlob) {
        const audioFile = new File([audioBlob], "audio.mp3", {
          type: "audio/mpeg",
        });
        audioUrl = await upload(audioFile);
        setAudioBlob(null);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          text,
          img: imgUrl,
          audio: audioUrl,
          senderId: currentUser.id,
          createdAt: new Date(),
        }),
      });

      setText("");
      setImg({ file: null, url: "" });
      setAudioBlob(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCameraOpen = async () => {
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing camera: ", err);
    }
  };

  const handleCapture = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    canvasRef.current.toBlob(async (blob) => {
      const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
      const imgUrl = URL.createObjectURL(file);
      setImg({ file, url: imgUrl });
      setCameraOpen(false);
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    });
  };

  const handleMicClick = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      const audioChunks = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      setIsRecording(true);
    }
  };

  useEffect(() => {
    if (!isRecording) return;
    const handle = setTimeout(() => setIsRecording(false), 10000); // Stop recording after 10 seconds
    return () => clearTimeout(handle);
  }, [isRecording]);

  // Function to handle video call button click
  const handleVideoCall = () => {
    const roomID = randomID(5); // Generate a room ID
    const videoCallURL = `${window.location.origin}/videocall?roomID=${roomID}`;

    window.open(videoCallURL, "_blank", "width=800,height=600");
  };

  // Function to handle chatbot button click
  const handleChatbot = () => {
    // Implement your chatbot functionality here
    // This could open a chatbot interface or send a predefined message
    alert("Chatbot button clicked!");
  };

  return (
    <div className="chat">
      <div className="top">
        <img onClick={onBack} className="back-button" src="./back.png" alt="Back" />
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>{user?.description}</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" onClick={handleVideoCall} /> {/* Start video call */}
          <img
            src="./info.png"
            onClick={() => {
              infoprop();
            }}
            alt=""
          />
        </div>
      </div>

      <div className="center">
        {chat?.messages?.map((message, index) => (
          <div
            className={
              message.senderId === currentUser?.id ? "message own" : "message"
            }
            key={index}
          >
            <div className="texts">
              {message.img && <img src={message.img} alt="" />}
              {message.audio && <audio controls src={message.audio}></audio>}
              {message.text && <p>{message.text}</p>}
              <span>{format(message.createdAt.toDate())}</span>
              {showDeleteButtons && message.senderId === currentUser?.id && (
                <button className="del-button" onClick={() => handleDelete(message)}>Delete</button>
              )}
            </div>
          </div>
        ))}
        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
        {audioBlob && (
          <div className="message own">
            <div className="texts">
              <audio controls src={URL.createObjectURL(audioBlob)}></audio>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>
          <div className="emoji">
            <img
              src="./emoji.png"
              alt=""
              onClick={() => setOpen((prev) => !prev)}
            />
            <div className="picker">
              <EmojiPicker open={open} onEmojiClick={handleEmoji} />
            </div>
          </div>
          <img
            src={isRecording ? "./micRec.png" : "./mic.png"}
            alt="Mic"
            onClick={handleMicClick}
          />
          <img
            src={cameraOpen ? "./close.png" : "./camera.png"}
            alt="Camera"
            onClick={handleCameraOpen}
          />
          <img
            src="./chatbot.png" // Add a suitable icon for the chatbot
            alt="Chatbot"
            onClick={handleChatbot}
          />
        </div>
        {cameraOpen && (
          <div className="camera">
            <video ref={videoRef} autoPlay></video>
            <canvas
              ref={canvasRef}
              style={{ display: "none" }}
              width="480"
              height="320"
            ></canvas>
            <button onClick={handleCapture}>Capture</button>
          </div>
        )}
        <input
          type="text"
          placeholder="Aa"
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <button onClick={handleSend}>Send</button>
        <input
          onChange={handleImg}
          type="file"
          style={{ display: "none" }}
          id="file"
        />
      </div>
    </div>
  );
};

export default Chat;
