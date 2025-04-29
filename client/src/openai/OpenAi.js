import { useEffect, useState } from "react";

import { AUTH_URL } from "../../src/api/index";
import axios from "axios";
import encryptionofdata from "../encryption/page";
import decryptionofData from "../decryption/decryption";
import { useChatContext } from "../context/ChatContext";

const useOpenAI = () => {
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [record, setRecord] = useState("");
  const [patientname, setPatientname] = useState("");
  const [currentText, setCurrentText] = useState();
  const [userId, setUserId] = useState('');
  const { selectedOutputLanguage, setSelectedOutputLanguage } = useChatContext();


  const fetchDataFromAPI = async () => {
    try {
      // Make an API call to fetch the user's data
      const token = localStorage.getItem("token");
      const encrypt = await axios.get(`${AUTH_URL}api/user/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await decryptionofData(encrypt.data);
      setUserId(response.user._id)


    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };
  useEffect(() => {
    fetchDataFromAPI();
  }, []);

  const fetchData = async (prompt) => {
    setIsLoading(true);
    setError(null);

    try {
      const api_Obj = {
        sprompt: `You are a physician that provides answers ready to be put in an electronic medical records system using the best practices in the medical field.
        Be concise, no editorial commands are needed, limit your answer to what is asked of you. Do not refer to external inputs from other physicians.
        Any answer should be provided as it would be entered in an EMR system by a physician.You are strictly prohibited from providing any kind of value from your end.Dont give any kind of value from your end. Patient Name come should like -Patient Name : [Patient Name], Date of Birth like -Date of Birth : [DOB] and MRN like -MRN : [MRN].
        You are given an existing text template ${currentText}. If ${currentText} contains any values, you must retain them and merge them into the new results without modifying or overwriting them.
        If a field in ${currentText} has a value, use that value. Do not generate dummy or placeholder data for that field. If a field is missing or empty, generate a new value for it.
       ⚠️ Important: Translate all content — including field labels, values, and placeholder text — into the language specified in this variable: ${selectedOutputLanguage}. The output must be entirely in this language.
       Respond **only** in ${selectedOutputLanguage}. Do not use English if another language is selected.Return All your headings in bold.
        `,
        uprompt: prompt,
        temperature: 0,
        userId
      };
      // const encrypted_payload = encryptionofdata(api_Obj);

      const messageContent = await axios.post(
        `${AUTH_URL}api/user/search`,
        api_Obj
        // { encrypted_payload: encrypted_payload }
      );

      // const decrypted_data = await decryptionofData(messageContent.data.encrypted_response);
      setData(messageContent.data.res_data.encrypted_response);
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
      const api_Obj = {
        sprompt: `You are acting like a name completion alogrithm. I will provide you text in which you have to find Patient name and set this value ${patientname} for patient's name. Don't change any other value in text there. Just update patient's name.`,
        uprompt: prompt,
        temperature: 0.5,
        userId
      };
      // const encrypted_payload = encryptionofdata(api_Obj);
      const messageContent = await axios.post(
        `${AUTH_URL}api/user/search`,
        api_Obj
        // { encrypted_payload: encrypted_payload }
      )

      console.log("messageContent", messageContent.data);

      // const decrypted_res = await decryptionofData(messageContent.data.encrypted_response);
      setData(messageContent.data.res_data.encrypted_response);
      const datarecord = await fetchRecord(messageContent.data.res_data.encrypted_response);
      return { record: datarecord, content: messageContent.data.res_data.encrypted_response };
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
      const api_Obj = {
        sprompt: `Extract patient details from the provided text and return **only a valid JSON object**.
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
      **Never return me data with starting and ending with backticks and writted json in the string.**
      I want you to ignore this method of output returning **json{"Patient_Name": null, "DOB": null, "MRN": null}**
      Just give me response in JSON format without adding any backticks and written JSON in it.
      `,
        uprompt: prompt,
        temperature: 0,
        userId
      };

      // const encrypted_payload = encryptionofdata(api_Obj);

      var messageContent = await axios.post(
        `${AUTH_URL}api/user/search`,
        api_Obj
        // { encrypted_payload: encrypted_payload }
      )
      // const decrypted_res = await decryptionofData(messageContent.data.encrypted_response);
      const recordedContent = messageContent.data.res_data.encrypted_response;

      if (!recordedContent.startsWith("{")) {
        recordedContent = recordedContent.replace(/```json|```/g, "").trim();
      }

      const parsedContent = JSON.parse(recordedContent);
      // setRecord(parsedContent);
      return parsedContent;
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  return { data, record, isLoading, error, fetchData, fetchRecord, setRecord, setPatientname, setPatient, patientname, currentText, setCurrentText };
};

export default useOpenAI;
