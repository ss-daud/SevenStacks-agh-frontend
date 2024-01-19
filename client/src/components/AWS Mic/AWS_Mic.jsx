import {
  StartMedicalStreamTranscriptionCommand,
  TranscribeStreamingClient,
} from "@aws-sdk/client-transcribe-streaming";
import { Box, Button, useMediaQuery } from "@mui/material";
import { Buffer } from "buffer";
import MicrophoneStream from "microphone-stream";
import React, { useState } from "react";

import img1 from "../../assets/imgs/mic.png";

import {
  REGION,
  LANGUAGE,
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY_ID,
  SAMPLING_RATE,
} from "../../api";
import Mike from "../Mike/Mike";

let microphoneStream = "";
const AWS_Mic = ({
  getVoiceInput,
  isLoading,
  isBrainEngaged,
  onStatusChange,
  previousInput,
  addPreviouseInput,
  getChatInput,
  response,
}) => {
  const [audio, setAudio] = useState([]);
  const [isMicrophoneActive, setIsMicrophoneActive] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width:2000px)");

  // ENV VARIABLES

  const language = LANGUAGE;
  const SAMPLE_RATE = SAMPLING_RATE;
  const AWS_REGION = REGION;
  const AWS_ACCESS_KEY_ID = ACCESS_KEY_ID;
  const AWS_SECRET_ACCESS_KEY = SECRET_ACCESS_KEY_ID;

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

        if (response) {
          getChatInput(accumulatedTranscriptions);
        }
        getVoiceInput(accumulatedTranscriptions);
      }
    }
  };

  const startRecording = async () => {
    if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      alert("Set AWS env variables first.");
      return false;
    }
    onStatusChange(true);
    setIsMicrophoneActive(true);
    await createMicrophoneStream();
    await startStreaming();
  };

  const stopRecording = function () {
    if (microphoneStream) {
      microphoneStream.stop();
      microphoneStream.destroy();
      microphoneStream = undefined;
      setIsMicrophoneActive(false);
      onStatusChange(false);
    }
  };

  return (
    <div>
      <Box style={{ marginBottom: 10 }}>
        {isMicrophoneActive ? (
          <Box onClick={stopRecording}>
            <Mike />
          </Box>
        ) : (
          <Box sx={{ cursor: "pointer" }}>
            <Button
              onClick={startRecording}
              disabled={isLoading || isBrainEngaged}
            >
              <img
                src={img1}
                alt="microphone"
                height={isLargeScreen ? 80 : 45}
                width={isLargeScreen ? 80 : 45}
              />
            </Button>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default AWS_Mic;
