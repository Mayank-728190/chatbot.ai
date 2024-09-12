import React, { useEffect, useState } from 'react';
import { FaArrowUp, FaMicrophone, FaCamera, FaImage, FaVolumeUp } from "react-icons/fa";
import styles from '@/styles/Prompt.module.css';

const Prompt = ({ chat, setChat, chatRef, prompt, setPrompt }) => {
  const [disabled, setDisabled] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    setDisabled(prompt === '' && !uploadedImage);
  }, [prompt, uploadedImage]);

  useEffect(() => {
    if (generating) {
      setDisabled(true);
    }
  }, [generating, disabled]);

  // Handle voice recognition
  const handleVoiceRecognition = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    recognition.onstart = () => setRecognizing(true);
    recognition.onend = () => setRecognizing(false);

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setPrompt(speechText);
    };
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  // Handle capturing image from camera
  const handleCaptureFromCamera = async () => {
    const video = document.createElement('video');
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.play();

    const canvas = document.createElement('canvas');
    video.addEventListener('canplay', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageUrl = canvas.toDataURL();
      setUploadedImage(imageUrl);
      stream.getTracks().forEach(track => track.stop());
    });
  };

  // Handle text-to-speech
  const handleTextToSpeech = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  // Handle the prompt submit
  const enterPrompt = async (e) => {
    e.preventDefault();
    setChat((prevChat) => [...prevChat, prompt, '...']);
    setPrompt('');
    setDisabled(true);
    setGenerating(true);

    // Post request to your server
    try {
      fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,
          memory: chat.slice(-10).filter((e, i) => i % 2 === 0)
        })
      })
        .then((res) => res.json())
        .then((data) => {
          setChat((prevChat) => [...prevChat.slice(0, -1), data.data.response]);
          setGenerating(false);
        });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div style={{
        background: "var(--bg-color)",
        display: "flex",
        justifyContent: "center",
        width: "100%",
        paddingBottom: "18px",
        paddingTop: "20px"
      }}>
        <div style={{
          width: "98%",
          background: "var(--prompt-color)",
          borderRadius: "500px",
          padding: "0px",
          overflow: "hidden",
          position: "relative",
          paddingRight: "4px",
        }}>
          <form onSubmit={enterPrompt} style={{
            display: "flex",
            alignItems: "center"
          }}>
            <input
              type="text"
              className={styles.input}
              style={{
                color: "var(--input-color)", outline: "none", border: "none", background: "transparent", fontSize: "1em", padding: "14px 20px", border: "none", width: "100%"
              }}
              placeholder="Enter the message"
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
            />

            {/* Mic Icon for voice recognition */}
            <button type="button" onClick={handleVoiceRecognition}
              style={{
                width: "45px", height: "40px", borderRadius: "50%", outline: "none", border: "none", background: recognizing ? "red" : "var(--button-enable)", color: "var(--button-color)", marginRight: "10px"
              }}>
              <FaMicrophone />
            </button>

            {/* Image upload from device */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
              id="file-upload"
            />
            <label htmlFor="file-upload" style={{
              width: "45px", height: "40px", borderRadius: "50%", outline: "none", border: "none", background: "var(--button-enable)", color: "var(--button-color)", marginRight: "10px", display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <FaImage />
            </label>

            {/* Camera Icon for capturing image */}
            <button type="button" onClick={handleCaptureFromCamera}
              style={{
                width: "45px", height: "40px", borderRadius: "50%", outline: "none", border: "none", background: "var(--button-enable)", color: "var(--button-color)", marginRight: "10px"
              }}>
              <FaCamera />
            </button>

            {/* Send prompt button */}
            <button type="submit" disabled={disabled}
              style={{
                width: "45px", height: "40px", borderRadius: "50%", marginRight: "10px", outline: "none", border: "none", background: disabled ? "var(--button-disable)" : "var(--button-enable)", color: "var(--button-color)", fontSize: "1.2em", fontWeight: "900", display: "flex", alignItems: "center", textAlign: "center", justifyContent: "center"
              }}>
              <FaArrowUp />
            </button>
          </form>
        </div>
      </div>

      {/* Display uploaded image */}
      {uploadedImage && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <img src={uploadedImage} alt="Uploaded" style={{ maxWidth: "300px", maxHeight: "300px" }} />
        </div>
      )}

      {/* Text-to-speech button */}
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <button onClick={() => handleTextToSpeech(prompt)} style={{
          background: "var(--button-enable)", color: "var(--button-color)", borderRadius: "20px", padding: "10px 20px"
        }}>
          <FaVolumeUp /> Speak
        </button>
      </div>
    </div>
  );
};

export default Prompt;
