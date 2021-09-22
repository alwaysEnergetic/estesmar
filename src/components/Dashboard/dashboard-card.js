import React from "react";
import {Box, Card, CardContent, CardHeader, makeStyles} from "@material-ui/core";
import Portfolio from "../Portfolio/portfolio";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '400px',
    },
}));

export const DashboardCard = props => {

    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardHeader titleTypographyProps={{variant: 'h6'}} title={props.title}/>
            <CardContent style={{overflow: 'hidden', flexGrow: 1}}>
                <Box height={'100%'} style={{overflowY: 'auto'}} mb={1}>
                    {props.children}
                </Box>
            </CardContent>
        </Card>
    );
}
