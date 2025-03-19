import { useEffect, useState } from "react";

import { API_KEY } from "../../src/api/index";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true,
});

const useOpenAI = () => {
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [record, setRecord] = useState("");
  const [patientname, setPatientname] = useState("");

  const fetchData = async (prompt) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: [
          {
            role: "system",
            content:
              `You are a physician that provides answers ready to be put in an electronic medical records system using the best practices in the medical field.
              Be concise, no editorial commands are needed, limit your answer to what is asked of you. Do not refer to external inputs from other physicians.
              Any answer should be provided as it would be entered in an EMR system by a physician.You are strictly prohibited from providing any kind of value from your end.Dont give any kind of value from your end. Patient Name come should like -Patient Name : [Patient Name], Date of Birth like -Date of Birth : [DOB] and MRN like -MRN : [MRN].`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0,
      });

      const messageContent = response.choices[0]?.message?.content;

      setData(messageContent);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const setPatient = async (prompt) => {
    setIsLoading(true);
    setError(null);
    try {
      const recordresponse = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: [
          {
            role: "system",
            content: `You are acting like a name completion alogrithm. I will provide you text in which you have to find Patient name and set this value ${patientname} for patient's name. Don't change any other value in text there. Just update patient's name.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
      });

      const recordContent = recordresponse.choices[0]?.message?.content;
      setData(recordContent);
      const datarecord = await fetchRecord(recordContent);
      return { record: datarecord, content: recordContent };
    } catch (error) {
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRecord = async (prompt) => {
    setIsLoading(true);
    setError(null);

    try {

      const recordresponse = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: [
          {
            role: "user",
            content: `Extract patient details from the provided text and return **only a valid JSON object**.  
- Do **not** include extra text, explanations, or markdown.  
- Date format should be **YYYY-MM-DD**.  
- JSON keys should be: **"Patient_Name"**, **"DOB"**, and **"MRN"**.  
- **Do not return null values or placeholders untill you dont find any value.Make sure If you didnot find any value for "DOB" and "MRN" return null for that value.If you didnot find "Patient_Name" return a string "Patient Name". If you find this - Patient Name: [Patient's Full Name] this means patient name is not available so in this case return null**

**Example Input:**  
"
 Patient Name: Major tester
 Date of Birth: 11-01-2002
 MRN: 972346
"

**Expected Output:**  
{"Patient_Name": "Daud Mir", "DOB": "1985-03-15", "MRN": "123456"}
**Above output is just dummy to make you understand the thing.**
`
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0,
      });
      var recordContent = recordresponse.choices[0]?.message?.content;

      if (!recordContent.startsWith("{")) {
        recordContent = recordContent.replace(/```json|```/g, "").trim();
      }

      const parsedContent = JSON.parse(recordContent)
      // setRecord(parsedContent);
      return parsedContent;
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }

  }

  return { data, record, isLoading, error, fetchData, fetchRecord, setRecord, setPatientname, setPatient, patientname };
};

export default useOpenAI;
