import React from "react";
import Chip from "@material-ui/core/Chip";
import {Avatar, makeStyles, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    chip: {
        margin: theme.spacing(0.5),
    },
}));

function LinkTypographyChip (props) {
    return (
        <Typography variant={"h6"} component={Link} {...props}/>
    );
}

export function SectorChip (props) {

    const classes = useStyles();

    const getAvatarText = (str) => {
        return str.split(' ').map(value => value.charAt(0) != '&' ? value.charAt(0) : '').join('').substring(0,2).toUpperCase();
    }

    return (
        <Chip component={LinkTypographyChip} to={`/sectors/${props.value}`} clickable variant="outlined"
              avatar={<Avatar>{getAvatarText(props.value)}</Avatar>}
              label={props.value}
              className={classes.chip}  />
    )
}
