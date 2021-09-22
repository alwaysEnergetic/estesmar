import React, {useEffect, useState} from "react";
import {Ticker} from "react-flip-ticker";
import {Typography} from "@material-ui/core";
import {timer} from "rxjs";
import {finalize, flatMap, map, take} from "rxjs/operators";

export function DashboardTicker (props) {

    const [value, setValue] = useState(0);

    const getArtificialTicker$ = () => {
        let target = props.value;
        let totalDigits = target.toString().length;

        return timer(100,100).pipe(
            map(i => i < totalDigits ? target.toString().substring(0, i) + '0'.repeat(totalDigits - i) : target),
            take(totalDigits+1),
        );

    }

    useEffect(() => {
        getArtificialTicker$().subscribe(value1 => {
            setValue(value1);
        })
    }, []);

    return (
        <Ticker textClassName={'MuiTypography-h5'}>
            {value}
        </Ticker>
    );

}
