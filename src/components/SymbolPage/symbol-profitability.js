import React from "react";
import {SymbolCardGroup} from "./symbol-cardgroup";

export function SymbolProfitability (props) {

    return (
        <SymbolCardGroup title="Profitability & Management"
                         symbol={props.symbol}
                         cardData={[
                             {
                                 title: 'Profitability',
                                 data: [
                                     {title: "Profit Margin", value: 'result.financialData.profitMargins.fmt'},
                                     {title: "Operating Margin (ttm)", value: 'result.financialData.operatingMargins.fmt'},
                                 ]
                             },{
                                 title: 'Management Effectiveness',
                                 data: [
                                     {title: "Return on Assets (ttm)", value: 'result.financialData.returnOnAssets.fmt'},
                                     {title: "Return on Equity (ttm)", value: 'result.financialData.returnOnEquity.fmt'},
                                 ]
                             },{
                                 title: 'Cash Flow Statement',
                                 data: [
                                     {title: "Operating Cash Flow (ttm)", value: 'result.financialData.operatingCashflow.fmt'},
                                     {title: "Free Cash Flow (ttm)", value: 'result.financialData.freeCashflow.fmt'},
                                 ]
                             }
                         ]}
        />
    );

}
