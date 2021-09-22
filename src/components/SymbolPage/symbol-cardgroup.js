import React, {useContext, useState} from "react";
import {ApiContext} from "../../services/rapidapi";
import {Grid, Typography} from "@material-ui/core";
import {StatCard} from "./statcard";

export function SymbolCardGroup (props) {

    const ac = useContext(ApiContext);

    const [cardData, setCardData] = useState([]);

    if(!props.prefetched){
        const {data, status, error} = ac.api.useQuoteSummaryQuery(props.symbol)();

        if(cardData.length == 0 && data) {
            let result = data.result[0];
            let newData = [];
            props.cardData.forEach((card) => {
                newData.push(card.data.map(line => {return {
                    title: line.title,
                    value: typeof line.value == "string" ?  line.value.split('.').reduce((previousValue, currentValue, i) => {
                        return i == 1 ? result[currentValue] : previousValue[currentValue];
                    }) : 0
                }}))
            });
            setCardData(newData);
        }
    }else{
        if(cardData.length==0) setCardData(props.cardData.map(i => i.data));
    }
    return (
        <React.Fragment>
            <Typography variant="h6">{props.title}</Typography>
            <Grid container alignItems="stretch" spacing={1}>
                {cardData.map((items, i) => (
                    <Grid item md xs={12}>
                        <StatCard title={props.cardData[i].title} items={items} />
                    </Grid>
                ))}
            </Grid>
        </React.Fragment>
    );

}
