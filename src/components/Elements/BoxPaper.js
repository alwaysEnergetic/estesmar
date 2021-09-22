import React from "react";
import {Box, makeStyles, Paper} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    paper: {
        backgroundColor: "transparent",
    },
}));

const BoxPaper = (props) => {

    const classes = useStyles();

    return (
        <Paper className={props.transparent ? classes.paper : null}>
            <Box p={props.p !== undefined ? props.p : 2}>
                {props.children}
            </Box>
        </Paper>
    );
};

export default BoxPaper;
