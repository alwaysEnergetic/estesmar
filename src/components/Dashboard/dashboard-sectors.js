import React, {useContext, useEffect, useState} from "react";
import {SymbolCacheContext} from "../../services/symbol-cache";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Fade,
    FormControlLabel,
    makeStyles,
    Switch,
    Typography
} from "@material-ui/core";
import {SectorChip} from "../SectorPage/sector-chip";
import Loader from "../Elements/Loader";
import BoxPaper from "../Elements/BoxPaper";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
    },
    paper: {
        backgroundColor: "transparent",
    },
}));


export function DashboardSectors (props) {

    const classes = useStyles();
    const sc = useContext(SymbolCacheContext);

    const [cacheLoaded, setCacheLoaded] = useState(false);

    const getChips = (f) => (
        sc.cache.getSectors().filter(f).map(value => {
            return (
                <li key={value}>
                    <SectorChip value={value}/>
                </li>
            )
        })
    );

    useEffect(() => {
        sc.cache.loaded.subscribe(value => {
            setCacheLoaded(true);
        });
    }, []);


    return (
        <>
        <Typography variant={"h6"}>Popular lists</Typography>

        {sc.cache.getSectors().length > 0 ?
                <Accordion className={classes.paper}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box component="ul" className={classes.root}>
                            {getChips((value, i) => i < 10)}
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box component="ul" className={classes.root}>
                            {getChips((value, i) => i >= 10)}
                        </Box>
                    </AccordionDetails>
                </Accordion>

        : <Loader/>}

        </>
    );
}
/*<FormControlLabel
                control={<Switch checked={checked} onChange={handleChange} />}
                label="Show more"
            />
            <Box component="ul" className={classes.root}>
                {getChips((value, i) => i < 10)}
            </Box>
            <Fade in={checked}>
                <Box component="ul" className={classes.root}>
                    {getChips((value, i) => i >= 10)}
                </Box>
            </Fade>*/
