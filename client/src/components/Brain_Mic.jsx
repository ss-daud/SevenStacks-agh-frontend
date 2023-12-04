import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import MicrophoneStream from "microphone-stream";
import {
  TranscribeStreamingClient,
  StartMedicalStreamTranscriptionCommand,
} from "@aws-sdk/client-transcribe-streaming";
import { Buffer } from "buffer";

import "./Mike/mike.css";
import img1 from "../assets/imgs/brain8.png";

let microphoneStream = "";
const Brain_Mic = ({
  value,
  gptFunction,
  getBrainInput,
  isLoading,
  isMicrophoneOn,
  isBrainEngaged,
  onBrainEngage,
  onBrainDisengage,
  handleBrain,
}) => {
  const [recording, setRecording] = useState(false);

  // ENV VARIABLES
  const language = "en-US";
  const SAMPLE_RATE = 44100;
  const AWS_REGION = "us-east-1";
  const AWS_ACCESS_KEY_ID = "AKIA6DCXGOM6LYBLPJME";
  const AWS_SECRET_ACCESS_KEY = "bpr/Tjk6lwZ937ljVMjGJrr8//Grfd/DkSqdP0KX";

  // MICROPHONE STREAM CREATION
  const createMicrophoneStream = async () => {
    microphoneStream = new MicrophoneStream();
    microphoneStream.setStream(
      await window.navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      })
    );
  };

  // GET AUDIO STREAM
  const encodePCMChunk = (chunk) => {
    const input = MicrophoneStream.toRaw(chunk);
    let offset = 0;
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return Buffer.from(buffer);
  };

  const getAudioStream = async function* () {
    for await (const chunk of microphoneStream) {
      if (chunk.length <= SAMPLE_RATE / 4) {
        yield {
          AudioEvent: {
            AudioChunk: encodePCMChunk(chunk),
          },
        };
      }
    }
  };

  // const handleVoiceInput = (voiceInput) => {
  //   getBrainInput(voiceInput);
  // };

  // START STREAMING
  const startStreaming = async () => {
    const __transcribeClient = new TranscribeStreamingClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    const command = new StartMedicalStreamTranscriptionCommand({
      LanguageCode: language,
      MediaEncoding: "pcm",
      MediaSampleRateHertz: SAMPLE_RATE,
      AudioStream: getAudioStream(),
      Specialty: "PRIMARYCARE",
      Type: "DICTATION",
    });

    const data = await __transcribeClient.send(command);
    let accumulatedTranscriptions = [];
    for await (const event of data.TranscriptResultStream) {
      const results = event.TranscriptEvent.Transcript.Results;
      if (results.length && !results[0]?.IsPartial) {
        const newTranscript = results[0].Alternatives[0].Transcript;
        accumulatedTranscriptions.push(newTranscript);
        console.log(accumulatedTranscriptions);
        getBrainInput(accumulatedTranscriptions);
      }
    }
  };

  const startRecording = async () => {
    if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      alert("Set AWS env variables first.");
      return false;
    }
    setRecording(true);
    await createMicrophoneStream();
    await startStreaming();
  };

  const stopRecording = function () {
    if (microphoneStream) {
      microphoneStream.stop();
      microphoneStream.destroy();
      microphoneStream = undefined;
      setRecording(false);
      handleBrain();
    }
  };
  const handleClick = () => {
    if (recording) {
      stopRecording();
      onBrainDisengage(); // Call the disengage function
      return;
    }
    if (value === "") {
      startRecording();
      onBrainEngage(); // Call the engage function
    } else if (!recording) {
      gptFunction(value);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
      }}
    >
      {recording && (
        <div className="pulse-ring2" style={{ top: 5, left: 14 }}></div>
      )}

      <Button
        onClick={handleClick}
        sx={{ cursor: "pointer" }}
        disabled={isLoading || isMicrophoneOn}
      >
        <img src={img1} alt="Brain" />
      </Button>
    </div>
  );
};

export default Brain_Mic;
