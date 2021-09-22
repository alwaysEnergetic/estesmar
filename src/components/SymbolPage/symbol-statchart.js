import {Typography, useTheme} from "@material-ui/core";
import React, {useContext, useState} from "react";
import {ApiContext} from "../../services/rapidapi";
import BoxPaper from "../Elements/BoxPaper";
import ReactApexChart from "react-apexcharts";


const moduleDic = {
    incomeStatementHistory: 'incomeStatementHistory',
    balanceSheetHistory: 'balanceSheetStatements',
}

export function SymbolStatchart (props) {

    const ac = useContext(ApiContext);

    const theme = useTheme();

    const [chartData, setChartData] = useState([]);

    const {data, status, error} = ac.api.useQuoteSummaryQuery(props.symbol)();

    if(chartData.length == 0 && data) {
        let result = data.result[0];

        let f = (y, key) => {
            let ret = 0;
            if(y){
                let s = key.split(',');
                if(s.length > 1){
                    /*ret = s.reduce((previousValue, currentValue) => {
                        let p = y[previousValue] ? y[previousValue].raw : 0;
                        let c = y[currentValue] ? y[currentValue].raw : 0;
                        return p + c;
                    });*/
                    ret = s[1].raw + s[0].raw;
                } else {
                    ret = y[key].raw;
                }
            }
            return ret/1000000000;
        }

        let makeDataItem = (module, name, key) => {
            let history = result[module][moduleDic[module]];
            let cy = history[0];
            let py = history[1];

            return {
                name: name,
                cy: f(cy, key),
                py: f(py, key),
            }
        }

        setChartData([
            makeDataItem('incomeStatementHistory', 'Revenue', 'totalRevenue'),
            makeDataItem('incomeStatementHistory', 'Gross Profit', 'grossProfit'),
            makeDataItem('incomeStatementHistory', 'EBIT', 'ebit'),

            makeDataItem('balanceSheetHistory', 'Cash', 'cash'),
            makeDataItem('incomeStatementHistory', "Net income to stackholders", 'netIncomeApplicableToCommonShares'),
            //makeDataItem('balanceSheetHistory', 'Debt', 'longTermDebt,shortLongTermDebt'),
        ]);
    }


    return (
        <ReactApexChart type="bar"
                        height={400}
                        series={[
                                {name: '2020', data: chartData.map(value => value.cy ? value.cy.toFixed(2): 0)},
                                {name: '2019', data: chartData.map(value => value.py ? value.py.toFixed(2): 0)},
                            ]}
                        options={{
                            chart: {
                                type: 'bar',
                                height: 400
                            },
                            plotOptions: {
                                bar: {
                                    horizontal: false,
                                    columnWidth: '55%',
                                    endingShape: 'rounded'
                                },
                            },
                            colors: [theme.palette.primary.main, theme.palette.secondary.main],
                            dataLabels: {
                                enabled: false
                            },
                            grid:{
                                show: false
                            },
                            xaxis: {
                                categories: chartData.map(value => value.name),
                            },
                            yaxis: {
                                title: {
                                    text: 'SAR (billions)'
                                }
                            },
                            tooltip: {
                                y: {
                                    formatter: function (val) {
                                        return "SAR " + val + " billions"
                                    }
                                }
                            },
                            theme: {
                                mode: theme.palette.type
                            }
                        }}
        />
    );
}
/*
<React.Fragment>
    <Typography variant="h6">History</Typography>
    <BoxPaper transparent={true}>
        <ResponsiveContainer minWidth={400} width="100%" height={400}>
            <BarChart data={chartData}>
                <XAxis dataKey="name" stroke={theme.palette.text.primary}/>
                <YAxis stroke={theme.palette.text.secondary} />
                <Tooltip contentStyle={{'background-color':'#333333'}}/>
                <Legend />
                <Bar name="2020" dataKey="cy" fill={theme.palette.primary.main} />
                <Bar name="2019" dataKey="py" fill={theme.palette.secondary.main} />
            </BarChart>
        </ResponsiveContainer>
    </BoxPaper>
</React.Fragment>*/
