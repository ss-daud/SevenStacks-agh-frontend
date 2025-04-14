import CryptoJS from "crypto-js";

export default function decryptionofData(ciphertext) {
  
  if (!ciphertext) {
    throw new Error("Encrypted data is empty or undefined!");
  }
  
  try {
    // Restore the original base64 format by replacing URL-safe characters
    // and adding back padding if needed
    let standardBase64 = ciphertext
      .replace(/-/g, '+')
      .replace(/_/g, '/');
      
    // Add padding if necessary
    while (standardBase64.length % 4) {
      standardBase64 += '=';
    }
    
    // Decrypt the data
    const bytes = CryptoJS.AES.decrypt(standardBase64, import.meta.env.VITE_DECRYPTION_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    console.error("Decryption Error:", error.message);
    throw new Error("Failed to decrypt data: " + error.message);
  }
}