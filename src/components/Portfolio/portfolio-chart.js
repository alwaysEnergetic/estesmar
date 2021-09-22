import {useTheme} from "@material-ui/core";
import React, {useEffect} from "react";
//import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
import ReactApexChart from "react-apexcharts";
import Loader from "../Elements/Loader";


export function PortfolioChart (props) {

    const data = [
        {name: 'Cash', value: parseFloat(props.cash).toFixed(0)},
        {name: 'Stocks', value: props.stocks.toFixed(0)}
    ];

    const theme = useTheme();

    const COLORS = [theme.palette.primary.main, theme.palette.secondary.main];

    return (
        props.cash ? <ReactApexChart type="donut"
                        series={data.map(item => Number(item.value))}
                        height={250}
                        width={250}
                        options={{
                            chart: {
                                id: 'portfolio',
                                type: 'donut',
                            },
                            legend: {
                                position: 'bottom'
                            },
                            labels: data.map(item => item.name),
                            colors: COLORS,
                            dataLabels: {
                                enabled: false
                            },
                            theme: {
                                mode: theme.palette.type
                            }
                        }}
        />: <Loader/>


    );
}
