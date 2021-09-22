import React from "react";
import {Typography} from "@material-ui/core";
import BoxPaper from "../Elements/BoxPaper";


export function SymbolKeyinfo (props) {

    return (
        <BoxPaper transparent={true}>
            <Typography>{props.longBusinessSummary}</Typography>
        </BoxPaper>
    );
}
