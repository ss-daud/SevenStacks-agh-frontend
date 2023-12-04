import React, { useState } from "react";
import { Typography, Button, Box } from "@mui/material";
import "./verifyemail.css";
import {
  TranscribeStreamingClient,
  StartStreamTranscriptionCommand,
} from "@aws-sdk/client-transcribe-streaming";
import MicrophoneStream from "microphone-stream";
import { Buffer } from "buffer";

export default function Mic() {
  let microphoneStream = "";
  const language = "en-US";
  const SAMPLE_RATE = 44100;
  const AWS_REGION = "us-east-1";
  const AWS_ACCESS_KEY_ID = "AKIA6DCXGOM6LYBLPJME";
  const AWS_SECRET_ACCESS_KEY = "bpr/Tjk6lwZ937ljVMjGJrr8//Grfd/DkSqdP0KX";

  const [isMicrophoneActive, setIsMicrophoneActive] = useState(false);

  const handleMic = () => {
    if (!isMicrophoneActive) {
      startRecording();
      setIsMicrophoneActive(true);
    } else {
      stopRecording();
      setIsMicrophoneActive(false);
    }
  };

  const createMicrophoneStream = async () => {
    microphoneStream = new MicrophoneStream();
    microphoneStream.setStream(
      await window.navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      })
    );
  };

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
      if (chunk.length <= SAMPLE_RATE) {
        yield {
          AudioEvent: {
            AudioChunk: encodePCMChunk(chunk),
          },
        };
      }
    }
  };

  const startStreaming = async () => {
    const __transcribeClient = new TranscribeStreamingClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    const command = new StartStreamTranscriptionCommand({
      LanguageCode: language,
      MediaEncoding: "pcm",
      MediaSampleRateHertz: SAMPLE_RATE,
      AudioStream: getAudioStream(),
    });
    const data = await __transcribeClient.send(command);
    for await (const event of data.TranscriptResultStream) {
      const results = event.TranscriptEvent.Transcript.Results;
      if (results.length && !results[0]?.IsPartial) {
        const newTranscript = results[0].Alternatives[0].Transcript;
        console.log("newTranscript :", newTranscript);
      }
    }
  };

  const startRecording = async () => {
    if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      alert("Set AWS env variables first.");
      return false;
    }

    await createMicrophoneStream();
    await startStreaming();
  };

  const stopRecording = function () {
    if (microphoneStream) {
      microphoneStream.stop();
      microphoneStream.destroy();
      microphoneStream = undefined;
    }
  };

  return (
    <>
      <div className="form-container-verify">
        <div
          style={{
            width: 454,
            padding: "80px 0",
            border: "1px solid #D9D9D9",
            borderRadius: "20px",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontWeight: 600,
                fontSize: "32px",
                lineHeight: "28px",
                color: "#023246",
              }}
            >
              Congratulations
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          ></Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: 4,
            }}
          ></Box>
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
            <Button
              variant="contained"
              onClick={handleMic} // Call the API when the button is clicked
              style={{
                marginBottom: 20,
                backgroundColor: "#023246",
                color: "white",
                width: 361,
                height: 48,
                borderRadius: 8,
              }}
            >
              {isMicrophoneActive ? "Stop" : "Start"}
            </Button>
          </Box>
        </div>
      </div>
    </>
  );
}
