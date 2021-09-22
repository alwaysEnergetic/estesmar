import {Typography, useTheme} from "@material-ui/core";
import React, {useContext, useEffect, useState} from "react";
import {PositionContext, usePosition} from "../../services/position-history";
import BoxPaper from "../Elements/BoxPaper";
import ReactApexChart from "react-apexcharts";
import {Ticker} from "react-flip-ticker";
import {timer} from "rxjs";
import {take} from "rxjs/operators";
import {DashboardTicker} from "./dashboard-ticker";


export function DashboardChart (props) {

    const pos = useContext(PositionContext);

    const theme = useTheme();

    const [data, setData] = useState([]);
    const [currValue, setCurrValue] = useState([]);

    const normalize = (data) => {
        return data.filter((v,i)=> i>data.length-50);
    }

    useEffect(() => {
        pos.position.loadHistory$().subscribe(value => {
            let newData = value.docs.map(doc => {
                return {
                    date: doc.data().timestamp.toDate(),
                    value: parseFloat(doc.data().value).toFixed(0),
                }
            }).sort((a, b) => a.date - b.date);
            setData(normalize(newData));
        });

        pos.position.getTotalValue$().subscribe(value => {
            setCurrValue([{date: new Date(), value: parseFloat(value.sumWithFunds).toFixed(0)}]);
        });

        },[]);

    const getDelta = () => {
        let curr = currValue[0].value;
        let prev = data[data.length-1].value;
        let d = curr - prev;
        return [d, (d) / (prev/100)]
    }

    return (
        <>
        <Typography variant={'h5'} style={{display: 'flex'}}>
            SAR&nbsp;
            {currValue.length > 0 ? <DashboardTicker value={currValue[0].value}/> : 0}
        </Typography>

        <Typography variant={"body1"}>
            &nbsp;{(currValue.length > 0 && data.length >0) && <>
                SAR {getDelta()[0]} (
                <span style={{color: getDelta()[0] >= 0 ? theme.palette.success.main : theme.palette.error.main}}>
                    {getDelta()[1].toFixed(2)}%
                </span>
                )
            </>}
        </Typography>
        <BoxPaper>
            <ReactApexChart type="area"
                            height={350}
                            series={[{name: 'Portfolio Value', data: data.concat(currValue).map(i=>{return {x: i.date, y: i.value}})}]}
                            options={{
                                chart: {
                                    type: 'area',
                                    height: 350,
                                    zoom: {
                                        enabled: false
                                    },
                                },
                                grid:{
                                    show: false
                                },
                                colors: ['#21CE99'],
                                dataLabels: {
                                    enabled: false
                                },
                                xaxis: {
                                    type: 'datetime'
                                },
                                theme: {
                                    mode: theme.palette.type
                                }
                            }}
            />
        </BoxPaper>
        </>
    );
}
