import React from "react";
import {SymbolCardGroup} from "./symbol-cardgroup";

export function SymbolEarnings (props) {

    return (
        <SymbolCardGroup title="Earnings and Debt"
                         symbol={props.symbol}
                         cardData={[
                         {
                             title: 'Earnings',
                             data: [
                                 {title: "Revenue Per Share (ttm)", value: 'result.financialData.revenuePerShare.fmt'},
                                 {title: "Revenue Growth (yoy)", value: 'result.financialData.revenueGrowth.fmt'},
                                 {title: "Trailing EPS (ttm)", value: 'result.defaultKeyStatistics.trailingEps.fmt'},
                                 {title: "Earnings Growth (yoy)", value: 'result.financialData.earningsGrowth.fmt'},
                                 {title: "Dividend & Yield", value: 'result.summaryDetail.dividendYield.fmt'}
                             ]
                         },{
                             title: 'Debt',
                             data: [
                                 {title: "Total Debt/Equity (mrq)", value: 'result.financialData.debtToEquity.fmt'},
                                 {title: "Current Ratio (mrq)", value: 'result.financialData.currentRatio.fmt'},
                                 {title: "Book Value (mrq)", value: 'result.defaultKeyStatistics.bookValue.fmt'},
                             ]
                         }
                         ]}

        />
    );

}
