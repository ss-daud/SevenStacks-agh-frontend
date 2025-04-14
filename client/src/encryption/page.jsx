import CryptoJS from "crypto-js";

export default function encryptionofdata(data) {

    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), import.meta.env.VITE_DECRYPTION_KEY).toString();

    // Make the encrypted string URL-safe by encoding it with Base64 URL-safe format
    // Replace '+' with '-', '/' with '_', and remove '=' padding
    const urlSafeCiphertext = ciphertext
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

    return urlSafeCiphertext;
}