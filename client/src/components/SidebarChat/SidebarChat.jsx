import { Box, Checkbox, Collapse, Container, ListItem, Select, Typography } from "@mui/material";
import EllipsisText from "../text/EllipsiText";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useChatContext } from "../../context/ChatContext";
import { useState } from "react";
import { useButton } from "../../context/SaveButtonContext";
import EditPatientModal from "../EditPatientModal";

export default function ({ text, color, res, id, patient, handleCheckChange, checked, setChecked, ids, setiDs, dob }) {
    const { setResponse } = useChatContext();
    const [isOpen, setisOpen] = useState(false);
    const { button, editButton, newButton, editButtoniD, editiD, trueEditButton } = useButton();
    const [isModalOpen, setIsModalOpen]= useState(false);

    const handleClick = (id, data) => {
        setResponse(data)
        trueEditButton();
        editiD(id)
    }


    return (
        <Box>
            <Container sx={{
                margin: 3,
                width: 247,
                height: 49,
                display: "flex",
                borderRadius: "10px",
                alignItems: 'center',
                backgroundColor: isOpen ? '#cbdde7' : 'white',
                border: "1px solid black",
                cursor: "pointer",
                transition: "background-color 0.3s ease-in-out",
                "&:hover": { backgroundColor: `${color}40` },
            }}
                onDoubleClick={() => {
                    setIsModalOpen(true)
                }}
            >
                <Box sx={{ flex: 1 }}>
                    <Checkbox
                        checked={checked?.[id] || false}
                        onChange={(e) => handleCheckChange(id, e.target)}
                    />
                </Box>
                <Box sx={{
                    width: 247,
                    height: 49,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease-in-out",
                    "&:hover": { backgroundColor: `${color}40` },
                    flex: 2
                }}
                    onClick={() => setisOpen(!isOpen)}
                    style={{ cursor: "pointer" }}>

                    <Box
                    >
                        <EllipsisText text={text} dob={dob} />
                    </Box>

                    <KeyboardArrowDownIcon
                        sx={{
                            transform: isOpen ? "rotate(0deg)" : "rotate(-180deg)",
                            transition: "transform 0.3s ease-in-out",
                        }}

                    />
                </Box>
            </Container>

            <Collapse in={isOpen} timeout={400}>
                <Box
                    sx={{
                        transition: "opacity 0.5s ease-in-out",
                        opacity: isOpen ? 1 : 0,
                        marginLeft: 3,
                        marginRight: 3,
                        padding: 2,
                        width: 247,
                        display: "flex",
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        gap: 2
                    }}
                >
                    {
                        patient?.map((items, i) => (

                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                                key={i}
                            >
                                <Checkbox
                                    checked={checked?.[items._id] || false}
                                    onChange={(e) => handleCheckChange(items._id, e.target)}
                                />
                                <ListItem sx={{
                                    display: "flex", justifyContent: 'center', cursor: 'pointer'
                                }}
                                    onClick={() => handleClick(id, items.Data)}
                                >{items.DATE}</ListItem>
                            </Box>
                        )
                        )
                    }
                </Box>
            </Collapse>
            <EditPatientModal open={isModalOpen} onClose={() => setIsModalOpen(false)} text={text} id={id}/>
        </Box>
    )
}