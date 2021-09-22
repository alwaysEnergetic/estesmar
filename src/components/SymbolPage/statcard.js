import React from "react";
import {Card, CardContent, CardHeader, Divider, List, ListItem, makeStyles} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
    card: {
        backgroundColor: "transparent",
        height: '100%'
    },
}));

export function StatCard (props) {

    const classes = useStyles();

    return (
        <Card className={classes.card}>
            {props.title && <CardHeader titleTypographyProps={{variant: 'h6'}} title={props.title}/>}
            <CardContent>
                <List>
                    <Divider/>
                    {props.items.map((item) => (
                        <React.Fragment>
                            <ListItem style={{display: 'flex', justifyContent: 'space-between'}}>
                                <span>{item.title}</span><span>{item.value}</span>
                            </ListItem>
                            <Divider/>
                        </React.Fragment>
                    ))}
                </List>
            </CardContent>
        </Card>
    );

}
