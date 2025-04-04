import React, { Children, createContext, useContext, useState } from "react";

const SaveButtonContext = createContext();

export const SaveButtonProvider = ({ children }) => {
    const [button, setButton] = useState("");
    const [editButtoniD, seteditButtoniD] = useState("");
    const [editButtons, setEditButtons] = useState(false);
    const [newButtons, setNewButtons] = useState(false);

    const editButton = () => setButton("edit");
    const newButton = () => setButton("create");
    const emptyButton = () => setButton("");
    const editiD = (id) => seteditButtoniD(id);
    const trueEditButton = () => setEditButtons(true);
    const trueNewButton = () => setNewButtons(true);
    const falseEditButton = () => setEditButtons(false);
    const falseNewButton = () => setNewButtons(false);

    return (
        <SaveButtonContext.Provider value={{ button, editButton, newButton, editButtoniD, editiD, emptyButton, trueEditButton, trueNewButton, falseEditButton, falseNewButton, editButtons, newButtons }}>
            {children}
        </SaveButtonContext.Provider>
    )

}
export const useButton = () => {
    return useContext(SaveButtonContext)
}