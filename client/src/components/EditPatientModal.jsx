import * as React from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useStyles } from "../pages/styles/Styles";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { AUTH_URL } from "../api";
import { useChatContext } from "../context/ChatContext";
import { TextField } from "@mui/material";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    // height: 250,
    paddingY: 2,
    bgcolor: "background.paper",
    borderRadius: 5,
    boxShadow: 24,
    pad: 4,
};

export default function EditPatientModal({ open, onClose, ids, setiDs, setCheckedItems, text, id }) {
    const [isLoading, setIsLoading] = useState(false);
    const [newName, setNewName] = useState('');


    const token = localStorage.getItem("token");
    const handleUpdateName = async () => {
        try {
            setIsLoading(true);
            const data = {
                Patient_Name: newName,
            };

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.put(
                `${AUTH_URL}api/topic/UpdateTopicPatient/${id}`,
                data,
                config
            );
            if (response.data.success) {
                onClose();
                location.reload(true);
            }
            setIsLoading(false);
            
            console.log("Response_Coming", response.data);
        } catch (error) {
            setIsLoading(false);
            console.error("Error updating record:", error);
        }
    };


    return (
        <div>
            <Modal
                keepMounted
                open={open}
                onClose={onClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{
                        fontWeight: 500,
                        marginLeft: 2
                    }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '20px' }} >Change Name for {text}</Typography>
                    </Box>
                    <TextField label="Name" sx={{ marginLeft: 2, marginTop: 2, width: '90%' }} value={newName} onChange={(e) => setNewName(e.target.value)} />
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button sx={{ backgroundColor: '#76bfea', color: 'white', marginTop: 2, width: "80%", paddingY: 1.3, borderRadius: '5px', "&:hover": { backgroundColor: "#46b0ef" } }} disabled={isLoading || newName.length === 0} onClick={handleUpdateName}>
                            {isLoading ? <CircularProgress size={23} /> : "Change"}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
