import React, { Children, createContext, useContext, useState } from "react";

const SaveButtonContext = createContext();

export const SaveButtonProvider = ({ children }) => {
    const [button, setButton] = useState("");
    const [editButtoniD, seteditButtoniD] = useState("");

    const editButton = () => setButton("edit");
    const newButton = () => setButton("create");
    const editiD = (id) => seteditButtoniD(id);
    return (
        <SaveButtonContext.Provider value={{ button, editButton, newButton, editButtoniD, editiD }}>
            {children}
        </SaveButtonContext.Provider>
    )

}
export const useButton = () => {
    return useContext(SaveButtonContext)
}