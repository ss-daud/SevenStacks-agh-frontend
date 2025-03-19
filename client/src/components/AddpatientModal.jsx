import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useStyles } from "../pages/styles/Styles";

export default function AddpatientModal({ open, onClose, setPatientname, fetchRecord, response, handleSubmit, handlepatientsubmit, patientname }) {
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 500,
        height: 250,
        bgcolor: "background.paper",
        border: "2px solid #FFFFFF",
        borderRadius: 5,
        boxShadow: 24,
        pad: 4,
    };
    const classes = useStyles();

    const handleClose = async () => {
        onClose();
        handlepatientsubmit();
    }

    return (
        <Modal
            keepMounted
            open={open}
            onClose={onClose}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
        >
            <Box sx={style}>
                <Typography
                    sx={{
                        font: "Inter",
                        fontWeight: 500,
                        marginTop: 5,
                        marginLeft: 5,
                        fontSize: "25px",
                        lineHeight: "16px",
                        color: "#023246",
                    }}
                >
                    Add Patient Name
                </Typography>

                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        marginLeft: 5,
                        marginY: 4
                    }}
                >
                    <TextField variant="outlined" label="Patient name" sx={{
                        width: '80%'
                    }}
                    value={patientname}
                        onChange={(e) => setPatientname(e.target.value)}
                    />
                </Box>

                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center"
                    }}
                >
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        className={classes.signUpButton}
                        style={{ backgroundColor: "#023246" }}
                    >
                        <Typography>Save</Typography>
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}