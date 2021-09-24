import {fromPromise} from "rxjs/internal-compatibility";

import React, {useContext} from 'react';
import {map, mergeMap} from "rxjs/operators";
import {of} from "rxjs";
import {InfiniteQueryObserver, QueryObserver, useInfiniteQuery, useQuery} from "react-query";



const { createContext } = React;


export const ApiContext = createContext(null);

export const ApiProvider = (props) => {
    let useMock = false;

    let ret = useMock ? new MockApi() : new RapidApi();
    ret.qc = props.queryClient;

    const value = {
        api: ret,
    };

    return (
        <ApiContext.Provider value={value}>
            {props.children}
        </ApiContext.Provider>
    );
};

export class RapidApi {

    // apiKey = process.env["REACT_APP_X_RAPIDAPI_KEY"];
    // apiHost = process.env["REACT_APP_X_RAPIDAPI_HOST"];
    apiKey = "4e8db14840msha329a58a3e7b8a5p19284ajsn6b6e8578bafb";
    apiHost = "apidojo-yahoo-finance-v1.p.rapidapi.com";

    rqOptions = {retry: true };

    qc = null;

    _pipe$(o, mapVar){
        return o.pipe(
            map(value => value[mapVar])
        );
    }

    _fetch(url, headers){
        return fetch(url, {
            "method": "GET",
            "headers": {...{
                "x-rapidapi-key": this.apiKey,
                "x-rapidapi-host": this.apiHost
            }, ...headers}
        })
    }

    _get$(url, headers){
        return fromPromise(this._fetch(url, headers)).pipe(mergeMap(value => value.json()));
    }

    getChart$(symbol, interval, range){
        return this._pipe$(this._get$(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-charts?symbol=${symbol}&interval=${interval}&range=${range}&region=US`), 'chart');
    }

    getQuoteSummary$(symbol){
        return this._pipe$(this._get$(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-summary?region=US`), 'quoteSummary');
    }

    getBulkQuotes$(symbols){
        return this._pipe$(this._get$(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes?symbols=${symbols.join(',')}`), 'quoteResponse');
    }

    getNews$(query, freshness, count){
        return this._get$(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/news/v2/get-details`, {
            "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
            "x-rapidapi-key": "4e8db14840msha329a58a3e7b8a5p19284ajsn6b6e8578bafb"
        });
    }

    getArticles$(marketId){
        return this._get$(`https://argaam-data-apis-free.p.rapidapi.com/api/v1/json/articles/get-popular-articles?lang=ar&marketID=${marketId}`, {
            "x-rapidapi-host": "argaam-data-apis-free.p.rapidapi.com"
        });
    }

    useFetchBulkQuotesQuery(symbols, options, queryKey){
        return () => useInfiniteQuery(queryKey ? queryKey : 'bulk_quotes', () => this.getBulkQuotes$(symbols).toPromise(), {...this.rqOptions, ...options});
    }

    getFetchBulkQuotesQuery$(symbols, options, queryKey){
        return new InfiniteQueryObserver(this.qc, {...this.rqOptions, ...options,
                queryKey: queryKey ? queryKey : ['bulk_quotes', symbols],
                queryFn: (context) => this.getBulkQuotes$(context.pageParam ? context.pageParam: symbols).toPromise()
            }
        );
    }

    useQuoteSummaryQuery(symbol){
        return () => useQuery('quote_summary', () => this.getQuoteSummary$(symbol).toPromise(), this.rqOptions);
    }

    getQuoteSummaryQuery$(symbol){
        return new QueryObserver(this.qc, {...this.rqOptions,
            queryKey: ['quote_summary', symbol],
            queryFn: () => this.getQuoteSummary$(symbol).toPromise()
        });
    }

    getChartQuery$(symbol, interval, range){
        return new QueryObserver(this.qc, {...this.rqOptions,
            queryKey: ['chart', [symbol, range]],
            queryFn: () => this.getChart$(symbol, interval, range).toPromise()
        });
    }



}


const mockSummary = {
    "quoteSummary": {
        "result": [
            {
                "assetProfile": {
                    "address1": "PO Box 5000",
                    "city": "Dhahran",
                    "zip": "31311",
                    "country": "Saudi Arabia",
                    "phone": "80 12 2027 2675",
                    "website": "http://www.aramco.com",
                    "industry": "Oil & Gas Integrated",
                    "sector": "Energy",
                    "longBusinessSummary": "Saudi Arabian Oil Company operates as an integrated oil and gas company in the Kingdom of Saudi Arabia and internationally. The company operates through two segments, Upstream and Downstream. The Upstream segment explores, develops, produces, and sells crude oil, condensate, natural gas, and natural gas liquids (NGLs). As of December 31, 2019, its reserves included 258.6 billion barrels of oil equivalent, including 201.9 billion barrels of crude oil and condensate; 25.7 billion barrels of NGLs; and 190.6 trillion standard cubic feet of natural gas, as well as 510 reservoirs within 138 fields distributed throughout the Kingdom and its territorial waters. The Downstream segment produces various chemicals, including ethylene, ethylene glycol, ethylene oxide, methanol, methyl tertiary butyl ether, polyethylene and engineering plastics and their derivatives, and other products; and base oils, as well as in the refining and retail operations. It also supplies oil products; and trades in refined petroleum and liquid chemical products, and polymers. The company also develops, manufactures, and markets high-performance rubber; and provides crude oil storage, financial, and marine management and transportation services. Saudi Arabian Oil Company was founded in 1933 and is headquartered in Dhahran, the Kingdom of Saudi Arabia.",
                    "companyOfficers": [
                        {
                            "maxAge": 1,
                            "name": "Mr. Amin H. Nasser",
                            "age": 61,
                            "title": "CEO, Pres & Director",
                            "yearBorn": 1959,
                            "exercisedValue": {
                                "raw": 0,
                                "fmt": null,
                                "longFmt": "0"
                            },
                            "unexercisedValue": {
                                "raw": 0,
                                "fmt": null,
                                "longFmt": "0"
                            }
                        },
                        {
                            "maxAge": 1,
                            "name": "Mr. Khalid H. Al-Dabbagh",
                            "age": 58,
                            "title": "Sr. VP of Fin., Strategy & Devel.",
                            "yearBorn": 1962,
                            "exercisedValue": {
                                "raw": 0,
                                "fmt": null,
                                "longFmt": "0"
                            },
                            "unexercisedValue": {
                                "raw": 0,
                                "fmt": null,
                                "longFmt": "0"
                            }
                        },
                        {
                            "maxAge": 1,
                            "name": "Mr. Nabeel A. Al-Jama",
                            "title": "Acting Head of Operations & Bus. Services",
                            "exercisedValue": {
                                "raw": 0,
                                "fmt": null,
                                "longFmt": "0"
                            },
                            "unexercisedValue": {
                                "raw": 0,
                                "fmt": null,
                                "longFmt": "0"
                            }
                        },
                        {
                            "maxAge": 1,
                            "name": "Mr. Ahmad O. Al Khowaiter",
                            "age": 53,
                            "title": "Chief Technology Officer",
                            "yearBorn": 1967,
                            "exercisedValue": {
                                "raw": 0,
                                "fmt": null,
                                "longFmt": "0"
                            },
                            "unexercisedValue": {
                                "raw": 0,
                                "fmt": null,
                                "longFmt": "0"
                            }
                        },
                        {
                            "maxAge": 1,
                            "name": "Mr. Fergus  MacLeod",
                            "title": "Head of Investor Relations",
                            "exercisedValue": {
                                "raw": 0,
                                "fmt": null,
                                "longFmt": "0"
                            },
                            "unexercisedValue": {
                                "raw": 0,
                                "fmt": null,
                                "longFmt": "0"
                            }
                        },
                        {
                            "maxAge": 1,
                            "name": "Mr. Nabeel A. Al Mansour",
                            "age": 52,
                            "title": "Gen. Counsel and Corp. Sec.",
                            "yearBorn": 1968,
                            "exercisedValue": {
                                "raw": 0,
                                "fmt": null,
                                "longFmt": "0"
                            },
                            "unexercisedValue": {
                                "raw": 0,
                                "fmt": null,
                                "longFmt": "0"
                            }
                        },
                        {
                            "maxAge": 1,
                            "name": "Mr. Abdulaziz M. Al-Gudaimi",
                            "age": 57,
                            "title": "Sr. vice president of Corp. Devel.",
                            "yearBorn": 1963,
                            "exercisedValue": {
                                "raw": 0,
                                "fmt": null,
                                "longFmt": "0"
                            },
                            "unexercisedValue": {
                                "raw": 0,
                                "fmt": null,
                                "longFmt": "0"
                            }
                        },
                        {
                            "maxAge": 1,
                            "name": "Ms. Huda M. Al-Ghoson",
                            "title": "Exec. Director of Human Resource",
                            "exercisedValue": {
                                "raw": 0,
                                "fmt": null,
                                "longFmt": "0"
                            },
                            "unexercisedValue": {
                                "raw": 0,
                                "fmt": null,
                                "longFmt": "0"
                            }
                        },
                        {
                            "maxAge": 1,
                            "name": "Mr. Ahmad A. Al-Sa'adi",
                            "age": 61,
                            "title": "Sr. VP of Technical Services",
                            "yearBorn": 1959,
                            "exercisedValue": {
                                "raw": 0,
                                "fmt": null,
                                "longFmt": "0"
                            },
                            "unexercisedValue": {
                                "raw": 0,
                                "fmt": null,
                                "longFmt": "0"
                            }
                        },
                        {
                            "maxAge": 1,
                            "name": "Mr. Nasir K. Al-Naimi",
                            "title": "Acting Head of Upstream Unit",
                            "exercisedValue": {
                                "raw": 0,
                                "fmt": null,
                                "longFmt": "0"
                            },
                            "unexercisedValue": {
                                "raw": 0,
                                "fmt": null,
                                "longFmt": "0"
                            }
                        }
                    ],
                    "maxAge": 86400
                },
                "summaryDetail": {
                    "maxAge": 1,
                    "priceHint": {
                        "raw": 2,
                        "fmt": "2",
                        "longFmt": "2"
                    },
                    "previousClose": {
                        "raw": 35.45,
                        "fmt": "35.45"
                    },
                    "open": {
                        "raw": 35.45,
                        "fmt": "35.45"
                    },
                    "dayLow": {
                        "raw": 35.4,
                        "fmt": "35.40"
                    },
                    "dayHigh": {
                        "raw": 35.6,
                        "fmt": "35.60"
                    },
                    "regularMarketPreviousClose": {
                        "raw": 35.45,
                        "fmt": "35.45"
                    },
                    "regularMarketOpen": {
                        "raw": 35.45,
                        "fmt": "35.45"
                    },
                    "regularMarketDayLow": {
                        "raw": 35.4,
                        "fmt": "35.40"
                    },
                    "regularMarketDayHigh": {
                        "raw": 35.6,
                        "fmt": "35.60"
                    },
                    "dividendRate": {
                        "raw": 1.41,
                        "fmt": "1.41"
                    },
                    "dividendYield": {
                        "raw": 0.0397,
                        "fmt": "3.97%"
                    },
                    "exDividendDate": {
                        "raw": 1616457600,
                        "fmt": "2021-03-23"
                    },
                    "payoutRatio": {
                        "raw": 1.1726,
                        "fmt": "117.26%"
                    },
                    "fiveYearAvgDividendYield": {},
                    "beta": {},
                    "trailingPE": {
                        "raw": 38.486485,
                        "fmt": "38.49"
                    },
                    "forwardPE": {},
                    "volume": {
                        "raw": 4443784,
                        "fmt": "4.44M",
                        "longFmt": "4,443,784"
                    },
                    "regularMarketVolume": {
                        "raw": 4443784,
                        "fmt": "4.44M",
                        "longFmt": "4,443,784"
                    },
                    "averageVolume": {
                        "raw": 3938417,
                        "fmt": "3.94M",
                        "longFmt": "3,938,417"
                    },
                    "averageVolume10days": {
                        "raw": 4917129,
                        "fmt": "4.92M",
                        "longFmt": "4,917,129"
                    },
                    "averageDailyVolume10Day": {
                        "raw": 4917129,
                        "fmt": "4.92M",
                        "longFmt": "4,917,129"
                    },
                    "bid": {
                        "raw": 35.55,
                        "fmt": "35.55"
                    },
                    "ask": {
                        "raw": 35.6,
                        "fmt": "35.60"
                    },
                    "bidSize": {},
                    "askSize": {},
                    "marketCap": {
                        "raw": 7115834392576,
                        "fmt": "7.12T",
                        "longFmt": "7,115,834,392,576"
                    },
                    "yield": {},
                    "ytdReturn": {},
                    "totalAssets": {},
                    "expireDate": {},
                    "strikePrice": {},
                    "openInterest": {},
                    "fiftyTwoWeekLow": {
                        "raw": 26.31818,
                        "fmt": "26.32"
                    },
                    "fiftyTwoWeekHigh": {
                        "raw": 37.15,
                        "fmt": "37.15"
                    },
                    "priceToSalesTrailing12Months": {
                        "raw": 8.254157,
                        "fmt": "8.25"
                    },
                    "fiftyDayAverage": {
                        "raw": 35.208332,
                        "fmt": "35.21"
                    },
                    "twoHundredDayAverage": {
                        "raw": 35.221527,
                        "fmt": "35.22"
                    },
                    "trailingAnnualDividendRate": {
                        "raw": 1.407,
                        "fmt": "1.41"
                    },
                    "trailingAnnualDividendYield": {
                        "raw": 0.0396897,
                        "fmt": "3.97%"
                    },
                    "navPrice": {},
                    "currency": "SAR",
                    "fromCurrency": null,
                    "toCurrency": null,
                    "lastMarket": null,
                    "volume24Hr": {},
                    "volumeAllCurrencies": {},
                    "circulatingSupply": {},
                    "algorithm": null,
                    "maxSupply": {},
                    "startDate": {},
                    "tradeable": false
                },
                "price": {
                    "maxAge": 1,
                    "preMarketChange": {},
                    "preMarketPrice": {},
                    "postMarketChange": {},
                    "postMarketPrice": {},
                    "regularMarketChangePercent": {
                        "raw": 0.004231247,
                        "fmt": "0.42%"
                    },
                    "regularMarketChange": {
                        "raw": 0.14999771,
                        "fmt": "0.15"
                    },
                    "regularMarketTime": 1617884254,
                    "priceHint": {
                        "raw": 2,
                        "fmt": "2",
                        "longFmt": "2"
                    },
                    "regularMarketPrice": {
                        "raw": 35.6,
                        "fmt": "35.60"
                    },
                    "regularMarketDayHigh": {
                        "raw": 35.6,
                        "fmt": "35.60"
                    },
                    "regularMarketDayLow": {
                        "raw": 35.4,
                        "fmt": "35.40"
                    },
                    "regularMarketVolume": {
                        "raw": 4443784,
                        "fmt": "4.44M",
                        "longFmt": "4,443,784.00"
                    },
                    "averageDailyVolume10Day": {
                        "raw": 4917129,
                        "fmt": "4.92M",
                        "longFmt": "4,917,129"
                    },
                    "averageDailyVolume3Month": {
                        "raw": 3938417,
                        "fmt": "3.94M",
                        "longFmt": "3,938,417"
                    },
                    "regularMarketPreviousClose": {
                        "raw": 35.45,
                        "fmt": "35.45"
                    },
                    "regularMarketSource": "DELAYED",
                    "regularMarketOpen": {
                        "raw": 35.45,
                        "fmt": "35.45"
                    },
                    "strikePrice": {},
                    "openInterest": {},
                    "exchange": "SAU",
                    "exchangeName": "Saudi",
                    "exchangeDataDelayedBy": 0,
                    "marketState": "POSTPOST",
                    "quoteType": "EQUITY",
                    "symbol": "2222.SR",
                    "underlyingSymbol": null,
                    "shortName": "Saudi Arabian Oil Co.",
                    "longName": "Saudi Arabian Oil Company",
                    "currency": "SAR",
                    "currencySymbol": "ر.س.‏",
                    "fromCurrency": null,
                    "toCurrency": null,
                    "lastMarket": null,
                    "volume24Hr": {},
                    "volumeAllCurrencies": {},
                    "circulatingSupply": {},
                    "marketCap": {
                        "raw": 7115834392576,
                        "fmt": "7.12T",
                        "longFmt": "7,115,834,392,576.00"
                    }
                },
                "balanceSheetHistory": {
                    "balanceSheetStatements": [
                        {
                            "maxAge": 1,
                            "endDate": {
                                "raw": 1609372800,
                                "fmt": "2020-12-31"
                            },
                            "cash": {
                                "raw": 207232000000,
                                "fmt": "207.23B",
                                "longFmt": "207,232,000,000"
                            },
                            "shortTermInvestments": {
                                "raw": 6801000000,
                                "fmt": "6.8B",
                                "longFmt": "6,801,000,000"
                            },
                            "netReceivables": {
                                "raw": 124194000000,
                                "fmt": "124.19B",
                                "longFmt": "124,194,000,000"
                            },
                            "inventory": {
                                "raw": 51999000000,
                                "fmt": "52B",
                                "longFmt": "51,999,000,000"
                            },
                            "otherCurrentAssets": {
                                "raw": 4273000000,
                                "fmt": "4.27B",
                                "longFmt": "4,273,000,000"
                            },
                            "totalCurrentAssets": {
                                "raw": 398879000000,
                                "fmt": "398.88B",
                                "longFmt": "398,879,000,000"
                            },
                            "longTermInvestments": {
                                "raw": 88837000000,
                                "fmt": "88.84B",
                                "longFmt": "88,837,000,000"
                            },
                            "propertyPlantEquipment": {
                                "raw": 1209460000000,
                                "fmt": "1.21T",
                                "longFmt": "1,209,460,000,000"
                            },
                            "goodWill": {
                                "raw": 100204000000,
                                "fmt": "100.2B",
                                "longFmt": "100,204,000,000"
                            },
                            "intangibleAssets": {
                                "raw": 64343000000,
                                "fmt": "64.34B",
                                "longFmt": "64,343,000,000"
                            },
                            "otherAssets": {
                                "raw": 52538000000,
                                "fmt": "52.54B",
                                "longFmt": "52,538,000,000"
                            },
                            "deferredLongTermAssetCharges": {
                                "raw": 15280000000,
                                "fmt": "15.28B",
                                "longFmt": "15,280,000,000"
                            },
                            "totalAssets": {
                                "raw": 1914261000000,
                                "fmt": "1.91T",
                                "longFmt": "1,914,261,000,000"
                            },
                            "accountsPayable": {
                                "raw": 46135000000,
                                "fmt": "46.13B",
                                "longFmt": "46,135,000,000"
                            },
                            "shortLongTermDebt": {
                                "raw": 29064000000,
                                "fmt": "29.06B",
                                "longFmt": "29,064,000,000"
                            },
                            "otherCurrentLiab": {
                                "raw": 42059000000,
                                "fmt": "42.06B",
                                "longFmt": "42,059,000,000"
                            },
                            "longTermDebt": {
                                "raw": 393353000000,
                                "fmt": "393.35B",
                                "longFmt": "393,353,000,000"
                            },
                            "otherLiab": {
                                "raw": 133036000000,
                                "fmt": "133.04B",
                                "longFmt": "133,036,000,000"
                            },
                            "minorityInterest": {
                                "raw": 110246000000,
                                "fmt": "110.25B",
                                "longFmt": "110,246,000,000"
                            },
                            "totalCurrentLiabilities": {
                                "raw": 243211000000,
                                "fmt": "243.21B",
                                "longFmt": "243,211,000,000"
                            },
                            "totalLiab": {
                                "raw": 813167000000,
                                "fmt": "813.17B",
                                "longFmt": "813,167,000,000"
                            },
                            "commonStock": {
                                "raw": 60000000000,
                                "fmt": "60B",
                                "longFmt": "60,000,000,000"
                            },
                            "retainedEarnings": {
                                "raw": 901273000000,
                                "fmt": "901.27B",
                                "longFmt": "901,273,000,000"
                            },
                            "treasuryStock": {
                                "raw": 2594000000,
                                "fmt": "2.59B",
                                "longFmt": "2,594,000,000"
                            },
                            "capitalSurplus": {
                                "raw": 26981000000,
                                "fmt": "26.98B",
                                "longFmt": "26,981,000,000"
                            },
                            "otherStockholderEquity": {
                                "raw": 5858000000,
                                "fmt": "5.86B",
                                "longFmt": "5,858,000,000"
                            },
                            "totalStockholderEquity": {
                                "raw": 990848000000,
                                "fmt": "990.85B",
                                "longFmt": "990,848,000,000"
                            },
                            "netTangibleAssets": {
                                "raw": 826301000000,
                                "fmt": "826.3B",
                                "longFmt": "826,301,000,000"
                            }
                        },
                        {
                            "maxAge": 1,
                            "endDate": {
                                "raw": 1577750400,
                                "fmt": "2019-12-31"
                            },
                            "cash": {
                                "raw": 177706000000,
                                "fmt": "177.71B",
                                "longFmt": "177,706,000,000"
                            },
                            "shortTermInvestments": {
                                "raw": 45467000000,
                                "fmt": "45.47B",
                                "longFmt": "45,467,000,000"
                            },
                            "netReceivables": {
                                "raw": 132892000000,
                                "fmt": "132.89B",
                                "longFmt": "132,892,000,000"
                            },
                            "inventory": {
                                "raw": 42607000000,
                                "fmt": "42.61B",
                                "longFmt": "42,607,000,000"
                            },
                            "otherCurrentAssets": {
                                "raw": 7588000000,
                                "fmt": "7.59B",
                                "longFmt": "7,588,000,000"
                            },
                            "totalCurrentAssets": {
                                "raw": 408196000000,
                                "fmt": "408.2B",
                                "longFmt": "408,196,000,000"
                            },
                            "longTermInvestments": {
                                "raw": 39694000000,
                                "fmt": "39.69B",
                                "longFmt": "39,694,000,000"
                            },
                            "propertyPlantEquipment": {
                                "raw": 982014000000,
                                "fmt": "982.01B",
                                "longFmt": "982,014,000,000"
                            },
                            "goodWill": {
                                "raw": 1077000000,
                                "fmt": "1.08B",
                                "longFmt": "1,077,000,000"
                            },
                            "intangibleAssets": {
                                "raw": 29045000000,
                                "fmt": "29.05B",
                                "longFmt": "29,045,000,000"
                            },
                            "otherAssets": {
                                "raw": 34100000000,
                                "fmt": "34.1B",
                                "longFmt": "34,100,000,000"
                            },
                            "deferredLongTermAssetCharges": {
                                "raw": 12728000000,
                                "fmt": "12.73B",
                                "longFmt": "12,728,000,000"
                            },
                            "totalAssets": {
                                "raw": 1494126000000,
                                "fmt": "1.49T",
                                "longFmt": "1,494,126,000,000"
                            },
                            "accountsPayable": {
                                "raw": 46216000000,
                                "fmt": "46.22B",
                                "longFmt": "46,216,000,000"
                            },
                            "shortLongTermDebt": {
                                "raw": 5132000000,
                                "fmt": "5.13B",
                                "longFmt": "5,132,000,000"
                            },
                            "otherCurrentLiab": {
                                "raw": 97718000000,
                                "fmt": "97.72B",
                                "longFmt": "97,718,000,000"
                            },
                            "longTermDebt": {
                                "raw": 116859000000,
                                "fmt": "116.86B",
                                "longFmt": "116,859,000,000"
                            },
                            "otherLiab": {
                                "raw": 81630000000,
                                "fmt": "81.63B",
                                "longFmt": "81,630,000,000"
                            },
                            "minorityInterest": {
                                "raw": 11170000000,
                                "fmt": "11.17B",
                                "longFmt": "11,170,000,000"
                            },
                            "totalCurrentLiabilities": {
                                "raw": 215571000000,
                                "fmt": "215.57B",
                                "longFmt": "215,571,000,000"
                            },
                            "totalLiab": {
                                "raw": 447891000000,
                                "fmt": "447.89B",
                                "longFmt": "447,891,000,000"
                            },
                            "commonStock": {
                                "raw": 60000000000,
                                "fmt": "60B",
                                "longFmt": "60,000,000,000"
                            },
                            "retainedEarnings": {
                                "raw": 949758000000,
                                "fmt": "949.76B",
                                "longFmt": "949,758,000,000"
                            },
                            "treasuryStock": {
                                "raw": -1674000000,
                                "fmt": "-1.67B",
                                "longFmt": "-1,674,000,000"
                            },
                            "capitalSurplus": {
                                "raw": 26981000000,
                                "fmt": "26.98B",
                                "longFmt": "26,981,000,000"
                            },
                            "otherStockholderEquity": {
                                "raw": 2076000000,
                                "fmt": "2.08B",
                                "longFmt": "2,076,000,000"
                            },
                            "totalStockholderEquity": {
                                "raw": 1035065000000,
                                "fmt": "1.04T",
                                "longFmt": "1,035,065,000,000"
                            },
                            "netTangibleAssets": {
                                "raw": 1004943000000,
                                "fmt": "1T",
                                "longFmt": "1,004,943,000,000"
                            }
                        },
                        {
                            "maxAge": 1,
                            "endDate": {
                                "raw": 1546214400,
                                "fmt": "2018-12-31"
                            },
                            "cash": {
                                "raw": 183152000000,
                                "fmt": "183.15B",
                                "longFmt": "183,152,000,000"
                            },
                            "shortTermInvestments": {
                                "raw": 194000000,
                                "fmt": "194M",
                                "longFmt": "194,000,000"
                            },
                            "netReceivables": {
                                "raw": 136954000000,
                                "fmt": "136.95B",
                                "longFmt": "136,954,000,000"
                            },
                            "inventory": {
                                "raw": 43580000000,
                                "fmt": "43.58B",
                                "longFmt": "43,580,000,000"
                            },
                            "otherCurrentAssets": {
                                "raw": 15563000000,
                                "fmt": "15.56B",
                                "longFmt": "15,563,000,000"
                            },
                            "totalCurrentAssets": {
                                "raw": 383383000000,
                                "fmt": "383.38B",
                                "longFmt": "383,383,000,000"
                            },
                            "longTermInvestments": {
                                "raw": 39984000000,
                                "fmt": "39.98B",
                                "longFmt": "39,984,000,000"
                            },
                            "propertyPlantEquipment": {
                                "raw": 873827000000,
                                "fmt": "873.83B",
                                "longFmt": "873,827,000,000"
                            },
                            "intangibleAssets": {
                                "raw": 26896000000,
                                "fmt": "26.9B",
                                "longFmt": "26,896,000,000"
                            },
                            "otherAssets": {
                                "raw": 22802000000,
                                "fmt": "22.8B",
                                "longFmt": "22,802,000,000"
                            },
                            "deferredLongTermAssetCharges": {
                                "raw": 9866000000,
                                "fmt": "9.87B",
                                "longFmt": "9,866,000,000"
                            },
                            "totalAssets": {
                                "raw": 1346892000000,
                                "fmt": "1.35T",
                                "longFmt": "1,346,892,000,000"
                            },
                            "accountsPayable": {
                                "raw": 39658000000,
                                "fmt": "39.66B",
                                "longFmt": "39,658,000,000"
                            },
                            "shortLongTermDebt": {
                                "raw": 6086000000,
                                "fmt": "6.09B",
                                "longFmt": "6,086,000,000"
                            },
                            "otherCurrentLiab": {
                                "raw": 70299000000,
                                "fmt": "70.3B",
                                "longFmt": "70,299,000,000"
                            },
                            "longTermDebt": {
                                "raw": 59000000000,
                                "fmt": "59B",
                                "longFmt": "59,000,000,000"
                            },
                            "otherLiab": {
                                "raw": 62692000000,
                                "fmt": "62.69B",
                                "longFmt": "62,692,000,000"
                            },
                            "minorityInterest": {
                                "raw": 11653000000,
                                "fmt": "11.65B",
                                "longFmt": "11,653,000,000"
                            },
                            "totalCurrentLiabilities": {
                                "raw": 184436000000,
                                "fmt": "184.44B",
                                "longFmt": "184,436,000,000"
                            },
                            "totalLiab": {
                                "raw": 318457000000,
                                "fmt": "318.46B",
                                "longFmt": "318,457,000,000"
                            },
                            "commonStock": {
                                "raw": 60000000000,
                                "fmt": "60B",
                                "longFmt": "60,000,000,000"
                            },
                            "retainedEarnings": {
                                "raw": 926625000000,
                                "fmt": "926.62B",
                                "longFmt": "926,625,000,000"
                            },
                            "treasuryStock": {
                                "raw": 3176000000,
                                "fmt": "3.18B",
                                "longFmt": "3,176,000,000"
                            },
                            "capitalSurplus": {
                                "raw": 26981000000,
                                "fmt": "26.98B",
                                "longFmt": "26,981,000,000"
                            },
                            "otherStockholderEquity": {
                                "raw": 3176000000,
                                "fmt": "3.18B",
                                "longFmt": "3,176,000,000"
                            },
                            "totalStockholderEquity": {
                                "raw": 1016782000000,
                                "fmt": "1.02T",
                                "longFmt": "1,016,782,000,000"
                            },
                            "netTangibleAssets": {
                                "raw": 989886000000,
                                "fmt": "989.89B",
                                "longFmt": "989,886,000,000"
                            }
                        },
                        {
                            "maxAge": 1,
                            "endDate": {
                                "raw": 1514678400,
                                "fmt": "2017-12-31"
                            },
                            "cash": {
                                "raw": 81242000000,
                                "fmt": "81.24B",
                                "longFmt": "81,242,000,000"
                            },
                            "shortTermInvestments": {
                                "raw": 6454000000,
                                "fmt": "6.45B",
                                "longFmt": "6,454,000,000"
                            },
                            "netReceivables": {
                                "raw": 89992000000,
                                "fmt": "89.99B",
                                "longFmt": "89,992,000,000"
                            },
                            "inventory": {
                                "raw": 34013000000,
                                "fmt": "34.01B",
                                "longFmt": "34,013,000,000"
                            },
                            "otherCurrentAssets": {
                                "raw": 39226000000,
                                "fmt": "39.23B",
                                "longFmt": "39,226,000,000"
                            },
                            "totalCurrentAssets": {
                                "raw": 253203000000,
                                "fmt": "253.2B",
                                "longFmt": "253,203,000,000"
                            },
                            "longTermInvestments": {
                                "raw": 46145000000,
                                "fmt": "46.15B",
                                "longFmt": "46,145,000,000"
                            },
                            "propertyPlantEquipment": {
                                "raw": 751134000000,
                                "fmt": "751.13B",
                                "longFmt": "751,134,000,000"
                            },
                            "intangibleAssets": {
                                "raw": 24346000000,
                                "fmt": "24.35B",
                                "longFmt": "24,346,000,000"
                            },
                            "otherAssets": {
                                "raw": 27725000000,
                                "fmt": "27.73B",
                                "longFmt": "27,725,000,000"
                            },
                            "deferredLongTermAssetCharges": {
                                "raw": 13606000000,
                                "fmt": "13.61B",
                                "longFmt": "13,606,000,000"
                            },
                            "totalAssets": {
                                "raw": 1102553000000,
                                "fmt": "1.1T",
                                "longFmt": "1,102,553,000,000"
                            },
                            "accountsPayable": {
                                "raw": 35629000000,
                                "fmt": "35.63B",
                                "longFmt": "35,629,000,000"
                            },
                            "shortLongTermDebt": {
                                "raw": 3511000000,
                                "fmt": "3.51B",
                                "longFmt": "3,511,000,000"
                            },
                            "otherCurrentLiab": {
                                "raw": 57679000000,
                                "fmt": "57.68B",
                                "longFmt": "57,679,000,000"
                            },
                            "longTermDebt": {
                                "raw": 61534000000,
                                "fmt": "61.53B",
                                "longFmt": "61,534,000,000"
                            },
                            "otherLiab": {
                                "raw": 58497000000,
                                "fmt": "58.5B",
                                "longFmt": "58,497,000,000"
                            },
                            "minorityInterest": {
                                "raw": 12556000000,
                                "fmt": "12.56B",
                                "longFmt": "12,556,000,000"
                            },
                            "totalCurrentLiabilities": {
                                "raw": 149050000000,
                                "fmt": "149.05B",
                                "longFmt": "149,050,000,000"
                            },
                            "totalLiab": {
                                "raw": 276239000000,
                                "fmt": "276.24B",
                                "longFmt": "276,239,000,000"
                            },
                            "commonStock": {
                                "raw": 60000000000,
                                "fmt": "60B",
                                "longFmt": "60,000,000,000"
                            },
                            "retainedEarnings": {
                                "raw": 721107000000,
                                "fmt": "721.11B",
                                "longFmt": "721,107,000,000"
                            },
                            "treasuryStock": {
                                "raw": 5670000000,
                                "fmt": "5.67B",
                                "longFmt": "5,670,000,000"
                            },
                            "capitalSurplus": {
                                "raw": 26981000000,
                                "fmt": "26.98B",
                                "longFmt": "26,981,000,000"
                            },
                            "otherStockholderEquity": {
                                "raw": 5670000000,
                                "fmt": "5.67B",
                                "longFmt": "5,670,000,000"
                            },
                            "totalStockholderEquity": {
                                "raw": 813758000000,
                                "fmt": "813.76B",
                                "longFmt": "813,758,000,000"
                            },
                            "netTangibleAssets": {
                                "raw": 789412000000,
                                "fmt": "789.41B",
                                "longFmt": "789,412,000,000"
                            }
                        }
                    ],
                    "maxAge": 86400
                },
                "incomeStatementHistory": {
                    "incomeStatementHistory": [
                        {
                            "maxAge": 1,
                            "endDate": {
                                "raw": 1609372800,
                                "fmt": "2020-12-31"
                            },
                            "totalRevenue": {
                                "raw": 862091000000,
                                "fmt": "862.09B",
                                "longFmt": "862,091,000,000"
                            },
                            "costOfRevenue": {
                                "raw": 345430000000,
                                "fmt": "345.43B",
                                "longFmt": "345,430,000,000"
                            },
                            "grossProfit": {
                                "raw": 516661000000,
                                "fmt": "516.66B",
                                "longFmt": "516,661,000,000"
                            },
                            "researchDevelopment": {
                                "raw": 2830000000,
                                "fmt": "2.83B",
                                "longFmt": "2,830,000,000"
                            },
                            "sellingGeneralAdministrative": {
                                "raw": 46627000000,
                                "fmt": "46.63B",
                                "longFmt": "46,627,000,000"
                            },
                            "nonRecurring": {},
                            "otherOperatingExpenses": {
                                "raw": 434000000,
                                "fmt": "434M",
                                "longFmt": "434,000,000"
                            },
                            "totalOperatingExpenses": {
                                "raw": 478822000000,
                                "fmt": "478.82B",
                                "longFmt": "478,822,000,000"
                            },
                            "operatingIncome": {
                                "raw": 383269000000,
                                "fmt": "383.27B",
                                "longFmt": "383,269,000,000"
                            },
                            "totalOtherIncomeExpenseNet": {
                                "raw": -10845000000,
                                "fmt": "-10.85B",
                                "longFmt": "-10,845,000,000"
                            },
                            "ebit": {
                                "raw": 383269000000,
                                "fmt": "383.27B",
                                "longFmt": "383,269,000,000"
                            },
                            "interestExpense": {
                                "raw": -9480000000,
                                "fmt": "-9.48B",
                                "longFmt": "-9,480,000,000"
                            },
                            "incomeBeforeTax": {
                                "raw": 372424000000,
                                "fmt": "372.42B",
                                "longFmt": "372,424,000,000"
                            },
                            "incomeTaxExpense": {
                                "raw": 188661000000,
                                "fmt": "188.66B",
                                "longFmt": "188,661,000,000"
                            },
                            "minorityInterest": {
                                "raw": 110246000000,
                                "fmt": "110.25B",
                                "longFmt": "110,246,000,000"
                            },
                            "netIncomeFromContinuingOps": {
                                "raw": 183763000000,
                                "fmt": "183.76B",
                                "longFmt": "183,763,000,000"
                            },
                            "discontinuedOperations": {},
                            "extraordinaryItems": {},
                            "effectOfAccountingCharges": {},
                            "otherItems": {},
                            "netIncome": {
                                "raw": 184926000000,
                                "fmt": "184.93B",
                                "longFmt": "184,926,000,000"
                            },
                            "netIncomeApplicableToCommonShares": {
                                "raw": 184926000000,
                                "fmt": "184.93B",
                                "longFmt": "184,926,000,000"
                            }
                        },
                        {
                            "maxAge": 1,
                            "endDate": {
                                "raw": 1577750400,
                                "fmt": "2019-12-31"
                            },
                            "totalRevenue": {
                                "raw": 1236785000000,
                                "fmt": "1.24T",
                                "longFmt": "1,236,785,000,000"
                            },
                            "costOfRevenue": {
                                "raw": 465560000000,
                                "fmt": "465.56B",
                                "longFmt": "465,560,000,000"
                            },
                            "grossProfit": {
                                "raw": 771225000000,
                                "fmt": "771.23B",
                                "longFmt": "771,225,000,000"
                            },
                            "researchDevelopment": {
                                "raw": 2150000000,
                                "fmt": "2.15B",
                                "longFmt": "2,150,000,000"
                            },
                            "sellingGeneralAdministrative": {
                                "raw": 36632000000,
                                "fmt": "36.63B",
                                "longFmt": "36,632,000,000"
                            },
                            "nonRecurring": {},
                            "otherOperatingExpenses": {
                                "raw": 440000000,
                                "fmt": "440M",
                                "longFmt": "440,000,000"
                            },
                            "totalOperatingExpenses": {
                                "raw": 562339000000,
                                "fmt": "562.34B",
                                "longFmt": "562,339,000,000"
                            },
                            "operatingIncome": {
                                "raw": 674446000000,
                                "fmt": "674.45B",
                                "longFmt": "674,446,000,000"
                            },
                            "totalOtherIncomeExpenseNet": {
                                "raw": -7705000000,
                                "fmt": "-7.71B",
                                "longFmt": "-7,705,000,000"
                            },
                            "ebit": {
                                "raw": 674446000000,
                                "fmt": "674.45B",
                                "longFmt": "674,446,000,000"
                            },
                            "interestExpense": {
                                "raw": -4934000000,
                                "fmt": "-4.93B",
                                "longFmt": "-4,934,000,000"
                            },
                            "incomeBeforeTax": {
                                "raw": 666741000000,
                                "fmt": "666.74B",
                                "longFmt": "666,741,000,000"
                            },
                            "incomeTaxExpense": {
                                "raw": 336048000000,
                                "fmt": "336.05B",
                                "longFmt": "336,048,000,000"
                            },
                            "minorityInterest": {
                                "raw": 11170000000,
                                "fmt": "11.17B",
                                "longFmt": "11,170,000,000"
                            },
                            "netIncomeFromContinuingOps": {
                                "raw": 330693000000,
                                "fmt": "330.69B",
                                "longFmt": "330,693,000,000"
                            },
                            "discontinuedOperations": {},
                            "extraordinaryItems": {},
                            "effectOfAccountingCharges": {},
                            "otherItems": {},
                            "netIncome": {
                                "raw": 330816000000,
                                "fmt": "330.82B",
                                "longFmt": "330,816,000,000"
                            },
                            "netIncomeApplicableToCommonShares": {
                                "raw": 330816000000,
                                "fmt": "330.82B",
                                "longFmt": "330,816,000,000"
                            }
                        },
                        {
                            "maxAge": 1,
                            "endDate": {
                                "raw": 1546214400,
                                "fmt": "2018-12-31"
                            },
                            "totalRevenue": {
                                "raw": 1347017000000,
                                "fmt": "1.35T",
                                "longFmt": "1,347,017,000,000"
                            },
                            "costOfRevenue": {
                                "raw": 465883000000,
                                "fmt": "465.88B",
                                "longFmt": "465,883,000,000"
                            },
                            "grossProfit": {
                                "raw": 881134000000,
                                "fmt": "881.13B",
                                "longFmt": "881,134,000,000"
                            },
                            "researchDevelopment": {
                                "raw": 2217000000,
                                "fmt": "2.22B",
                                "longFmt": "2,217,000,000"
                            },
                            "sellingGeneralAdministrative": {
                                "raw": 31112000000,
                                "fmt": "31.11B",
                                "longFmt": "31,112,000,000"
                            },
                            "nonRecurring": {},
                            "otherOperatingExpenses": {
                                "raw": 310000000,
                                "fmt": "310M",
                                "longFmt": "310,000,000"
                            },
                            "totalOperatingExpenses": {
                                "raw": 548784000000,
                                "fmt": "548.78B",
                                "longFmt": "548,784,000,000"
                            },
                            "operatingIncome": {
                                "raw": 798233000000,
                                "fmt": "798.23B",
                                "longFmt": "798,233,000,000"
                            },
                            "totalOtherIncomeExpenseNet": {
                                "raw": -337000000,
                                "fmt": "-337M",
                                "longFmt": "-337,000,000"
                            },
                            "ebit": {
                                "raw": 798233000000,
                                "fmt": "798.23B",
                                "longFmt": "798,233,000,000"
                            },
                            "interestExpense": {
                                "raw": -2056000000,
                                "fmt": "-2.06B",
                                "longFmt": "-2,056,000,000"
                            },
                            "incomeBeforeTax": {
                                "raw": 797896000000,
                                "fmt": "797.9B",
                                "longFmt": "797,896,000,000"
                            },
                            "incomeTaxExpense": {
                                "raw": 381378000000,
                                "fmt": "381.38B",
                                "longFmt": "381,378,000,000"
                            },
                            "minorityInterest": {
                                "raw": 11653000000,
                                "fmt": "11.65B",
                                "longFmt": "11,653,000,000"
                            },
                            "netIncomeFromContinuingOps": {
                                "raw": 416518000000,
                                "fmt": "416.52B",
                                "longFmt": "416,518,000,000"
                            },
                            "discontinuedOperations": {},
                            "extraordinaryItems": {},
                            "effectOfAccountingCharges": {},
                            "otherItems": {},
                            "netIncome": {
                                "raw": 416196000000,
                                "fmt": "416.2B",
                                "longFmt": "416,196,000,000"
                            },
                            "netIncomeApplicableToCommonShares": {
                                "raw": 416196000000,
                                "fmt": "416.2B",
                                "longFmt": "416,196,000,000"
                            }
                        },
                        {
                            "maxAge": 1,
                            "endDate": {
                                "raw": 1514678400,
                                "fmt": "2017-12-31"
                            },
                            "totalRevenue": {
                                "raw": 986159000000,
                                "fmt": "986.16B",
                                "longFmt": "986,159,000,000"
                            },
                            "costOfRevenue": {
                                "raw": 320836000000,
                                "fmt": "320.84B",
                                "longFmt": "320,836,000,000"
                            },
                            "grossProfit": {
                                "raw": 665323000000,
                                "fmt": "665.32B",
                                "longFmt": "665,323,000,000"
                            },
                            "researchDevelopment": {
                                "raw": 1902000000,
                                "fmt": "1.9B",
                                "longFmt": "1,902,000,000"
                            },
                            "sellingGeneralAdministrative": {
                                "raw": 29591000000,
                                "fmt": "29.59B",
                                "longFmt": "29,591,000,000"
                            },
                            "nonRecurring": {},
                            "otherOperatingExpenses": {
                                "raw": 310000000,
                                "fmt": "310M",
                                "longFmt": "310,000,000"
                            },
                            "totalOperatingExpenses": {
                                "raw": 402948000000,
                                "fmt": "402.95B",
                                "longFmt": "402,948,000,000"
                            },
                            "operatingIncome": {
                                "raw": 583211000000,
                                "fmt": "583.21B",
                                "longFmt": "583,211,000,000"
                            },
                            "totalOtherIncomeExpenseNet": {
                                "raw": -1773000000,
                                "fmt": "-1.77B",
                                "longFmt": "-1,773,000,000"
                            },
                            "ebit": {
                                "raw": 583211000000,
                                "fmt": "583.21B",
                                "longFmt": "583,211,000,000"
                            },
                            "interestExpense": {
                                "raw": -1465000000,
                                "fmt": "-1.47B",
                                "longFmt": "-1,465,000,000"
                            },
                            "incomeBeforeTax": {
                                "raw": 581438000000,
                                "fmt": "581.44B",
                                "longFmt": "581,438,000,000"
                            },
                            "incomeTaxExpense": {
                                "raw": 296819000000,
                                "fmt": "296.82B",
                                "longFmt": "296,819,000,000"
                            },
                            "minorityInterest": {
                                "raw": 12556000000,
                                "fmt": "12.56B",
                                "longFmt": "12,556,000,000"
                            },
                            "netIncomeFromContinuingOps": {
                                "raw": 284619000000,
                                "fmt": "284.62B",
                                "longFmt": "284,619,000,000"
                            },
                            "discontinuedOperations": {},
                            "extraordinaryItems": {},
                            "effectOfAccountingCharges": {},
                            "otherItems": {},
                            "netIncome": {
                                "raw": 283198000000,
                                "fmt": "283.2B",
                                "longFmt": "283,198,000,000"
                            },
                            "netIncomeApplicableToCommonShares": {
                                "raw": 283198000000,
                                "fmt": "283.2B",
                                "longFmt": "283,198,000,000"
                            }
                        }
                    ],
                    "maxAge": 86400
                },
                "financialData": {
                    "maxAge": 86400,
                    "currentPrice": {
                        "raw": 35.6,
                        "fmt": "35.60"
                    },
                    "targetHighPrice": {},
                    "targetLowPrice": {},
                    "targetMeanPrice": {},
                    "targetMedianPrice": {},
                    "recommendationMean": {},
                    "recommendationKey": "none",
                    "numberOfAnalystOpinions": {},
                    "totalCash": {
                        "raw": 214859005952,
                        "fmt": "214.86B",
                        "longFmt": "214,859,005,952"
                    },
                    "totalCashPerShare": {
                        "raw": 1.057,
                        "fmt": "1.06"
                    },
                    "ebitda": {
                        "raw": 447236014080,
                        "fmt": "447.24B",
                        "longFmt": "447,236,014,080"
                    },
                    "totalDebt": {
                        "raw": 536077008896,
                        "fmt": "536.08B",
                        "longFmt": "536,077,008,896"
                    },
                    "quickRatio": {
                        "raw": 1.39,
                        "fmt": "1.39"
                    },
                    "currentRatio": {
                        "raw": 1.64,
                        "fmt": "1.64"
                    },
                    "totalRevenue": {
                        "raw": 862091018240,
                        "fmt": "862.09B",
                        "longFmt": "862,091,018,240"
                    },
                    "debtToEquity": {
                        "raw": 48.686,
                        "fmt": "48.69"
                    },
                    "revenuePerShare": {
                        "raw": 4.313,
                        "fmt": "4.31"
                    },
                    "returnOnAssets": {
                        "raw": 0.14056,
                        "fmt": "14.06%"
                    },
                    "returnOnEquity": {
                        "raw": 0.17115,
                        "fmt": "17.11%"
                    },
                    "grossProfits": {
                        "raw": 516661000000,
                        "fmt": "516.66B",
                        "longFmt": "516,661,000,000"
                    },
                    "freeCashflow": {
                        "raw": 162168127488,
                        "fmt": "162.17B",
                        "longFmt": "162,168,127,488"
                    },
                    "operatingCashflow": {
                        "raw": 285296984064,
                        "fmt": "285.3B",
                        "longFmt": "285,296,984,064"
                    },
                    "earningsGrowth": {
                        "raw": -0.32,
                        "fmt": "-32.00%"
                    },
                    "revenueGrowth": {
                        "raw": -0.219,
                        "fmt": "-21.90%"
                    },
                    "grossMargins": {
                        "raw": 0.59931,
                        "fmt": "59.93%"
                    },
                    "ebitdaMargins": {
                        "raw": 0.51878,
                        "fmt": "51.88%"
                    },
                    "operatingMargins": {
                        "raw": 0.44458,
                        "fmt": "44.46%"
                    },
                    "profitMargins": {
                        "raw": 0.21451001,
                        "fmt": "21.45%"
                    },
                    "financialCurrency": "SAR"
                }
            }
        ],
        "error": null
    }
}

const chart1m = {
    "chart": {
        "result": [
            {
                "meta": {
                    "currency": "SAR",
                    "symbol": "2330.SR",
                    "exchangeName": "SAU",
                    "instrumentType": "EQUITY",
                    "firstTradeDate": 1268640000,
                    "regularMarketTime": 1617711579,
                    "gmtoffset": 10800,
                    "timezone": "AST",
                    "exchangeTimezoneName": "Asia/Riyadh",
                    "regularMarketPrice": 75,
                    "chartPreviousClose": 72,
                    "previousClose": 72,
                    "scale": 3,
                    "priceHint": 2,
                    "currentTradingPeriod": {
                        "pre": {
                            "timezone": "AST",
                            "start": 1617696000,
                            "end": 1617696000,
                            "gmtoffset": 10800
                        },
                        "regular": {
                            "timezone": "AST",
                            "start": 1617696000,
                            "end": 1617712200,
                            "gmtoffset": 10800
                        },
                        "post": {
                            "timezone": "AST",
                            "start": 1617712200,
                            "end": 1617712200,
                            "gmtoffset": 10800
                        }
                    },
                    "tradingPeriods": [
                        [
                            {
                                "timezone": "AST",
                                "start": 1617696000,
                                "end": 1617712200,
                                "gmtoffset": 10800
                            }
                        ]
                    ],
                    "dataGranularity": "1m",
                    "range": "1d",
                    "validRanges": [
                        "1d",
                        "5d",
                        "1mo",
                        "3mo",
                        "6mo",
                        "1y",
                        "2y",
                        "5y",
                        "10y",
                        "ytd",
                        "max"
                    ]
                },
                "timestamp": [
                    1617696000,
                    1617696060,
                    1617696120,
                    1617696180,
                    1617696240,
                    1617696300,
                    1617696360,
                    1617696420,
                    1617696480,
                    1617696540,
                    1617696600,
                    1617696660,
                    1617696720,
                    1617696780,
                    1617696840,
                    1617696900,
                    1617696960,
                    1617697020,
                    1617697080,
                    1617697140,
                    1617697200,
                    1617697260,
                    1617697320,
                    1617697380,
                    1617697440,
                    1617697500,
                    1617697560,
                    1617697620,
                    1617697680,
                    1617697740,
                    1617697800,
                    1617697860,
                    1617697920,
                    1617697980,
                    1617698040,
                    1617698100,
                    1617698160,
                    1617698220,
                    1617698280,
                    1617698340,
                    1617698400,
                    1617698460,
                    1617698520,
                    1617698580,
                    1617698640,
                    1617698700,
                    1617698760,
                    1617698820,
                    1617698880,
                    1617698940,
                    1617699000,
                    1617699060,
                    1617699120,
                    1617699180,
                    1617699240,
                    1617699300,
                    1617699360,
                    1617699420,
                    1617699480,
                    1617699540,
                    1617699600,
                    1617699660,
                    1617699720,
                    1617699780,
                    1617699840,
                    1617699900,
                    1617699960,
                    1617700020,
                    1617700080,
                    1617700140,
                    1617700200,
                    1617700260,
                    1617700320,
                    1617700380,
                    1617700440,
                    1617700500,
                    1617700560,
                    1617700620,
                    1617700680,
                    1617700740,
                    1617700800,
                    1617700860,
                    1617700920,
                    1617700980,
                    1617701040,
                    1617701100,
                    1617701160,
                    1617701220,
                    1617701280,
                    1617701340,
                    1617701400,
                    1617701460,
                    1617701520,
                    1617701580,
                    1617701640,
                    1617701700,
                    1617701760,
                    1617701820,
                    1617701880,
                    1617701940,
                    1617702000,
                    1617702060,
                    1617702120,
                    1617702180,
                    1617702240,
                    1617702300,
                    1617702360,
                    1617702420,
                    1617702480,
                    1617702540,
                    1617702600,
                    1617702660,
                    1617702720,
                    1617702780,
                    1617702840,
                    1617702900,
                    1617702960,
                    1617703020,
                    1617703080,
                    1617703140,
                    1617703200,
                    1617703260,
                    1617703320,
                    1617703380,
                    1617703440,
                    1617703500,
                    1617703560,
                    1617703620,
                    1617703680,
                    1617703740,
                    1617703800,
                    1617703860,
                    1617703920,
                    1617703980,
                    1617704040,
                    1617704100,
                    1617704160,
                    1617704220,
                    1617704280,
                    1617704340,
                    1617704400,
                    1617704460,
                    1617704520,
                    1617704580,
                    1617704640,
                    1617704700,
                    1617704760,
                    1617704820,
                    1617704880,
                    1617704940,
                    1617705000,
                    1617705060,
                    1617705120,
                    1617705180,
                    1617705240,
                    1617705300,
                    1617705360,
                    1617705420,
                    1617705480,
                    1617705540,
                    1617705600,
                    1617705660,
                    1617705720,
                    1617705780,
                    1617705840,
                    1617705900,
                    1617705960,
                    1617706020,
                    1617706080,
                    1617706140,
                    1617706200,
                    1617706260,
                    1617706320,
                    1617706380,
                    1617706440,
                    1617706500,
                    1617706560,
                    1617706620,
                    1617706680,
                    1617706740,
                    1617706800,
                    1617706860,
                    1617706920,
                    1617706980,
                    1617707040,
                    1617707100,
                    1617707160,
                    1617707220,
                    1617707280,
                    1617707340,
                    1617707400,
                    1617707460,
                    1617707520,
                    1617707580,
                    1617707640,
                    1617707700,
                    1617707760,
                    1617707820,
                    1617707880,
                    1617707940,
                    1617708000,
                    1617708060,
                    1617708120,
                    1617708180,
                    1617708240,
                    1617708300,
                    1617708360,
                    1617708420,
                    1617708480,
                    1617708540,
                    1617708600,
                    1617708660,
                    1617708720,
                    1617708780,
                    1617708840,
                    1617708900,
                    1617708960,
                    1617709020,
                    1617709080,
                    1617709140,
                    1617709200,
                    1617709260,
                    1617709320,
                    1617709380,
                    1617709440,
                    1617709500,
                    1617709560,
                    1617709620,
                    1617709680,
                    1617709740,
                    1617709800,
                    1617709860,
                    1617709920,
                    1617709980,
                    1617710040,
                    1617710100,
                    1617710160,
                    1617710220,
                    1617710280,
                    1617710340,
                    1617710400,
                    1617710460,
                    1617710520,
                    1617710580,
                    1617710640,
                    1617710700,
                    1617710760,
                    1617710820,
                    1617710880,
                    1617710940,
                    1617711000,
                    1617711060,
                    1617711120,
                    1617711180,
                    1617711240,
                    1617711300,
                    1617711360,
                    1617711420,
                    1617711480,
                    1617711540,
                    1617711600,
                    1617711660,
                    1617711720,
                    1617711780,
                    1617711840,
                    1617711900,
                    1617711960,
                    1617712020,
                    1617712080,
                    1617712140
                ],
                "indicators": {
                    "quote": [
                        {
                            "open": [
                                75.5,
                                75.5,
                                75.5,
                                75.4000015258789,
                                75.30000305175781,
                                75.19999694824219,
                                75.19999694824219,
                                75.4000015258789,
                                75.19999694824219,
                                75.0999984741211,
                                75.0999984741211,
                                75.19999694824219,
                                null,
                                75.19999694824219,
                                null,
                                75.30000305175781,
                                75.30000305175781,
                                null,
                                75.30000305175781,
                                75.30000305175781,
                                75.19999694824219,
                                75,
                                null,
                                75,
                                75.0999984741211,
                                null,
                                75,
                                74.80000305175781,
                                74.80000305175781,
                                75,
                                null,
                                75,
                                74.9000015258789,
                                null,
                                null,
                                74.80000305175781,
                                null,
                                74.9000015258789,
                                null,
                                null,
                                null,
                                null,
                                null,
                                75,
                                null,
                                null,
                                75,
                                null,
                                null,
                                null,
                                74.9000015258789,
                                74.9000015258789,
                                74.9000015258789,
                                75,
                                null,
                                null,
                                null,
                                75,
                                null,
                                75,
                                null,
                                null,
                                null,
                                74.9000015258789,
                                null,
                                74.9000015258789,
                                74.9000015258789,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                74.9000015258789,
                                null,
                                null,
                                74.9000015258789,
                                null,
                                null,
                                74.9000015258789,
                                75,
                                null,
                                null,
                                74.9000015258789,
                                null,
                                null,
                                null,
                                74.9000015258789,
                                74.9000015258789,
                                null,
                                null,
                                null,
                                null,
                                null,
                                75,
                                74.9000015258789,
                                75,
                                75,
                                75,
                                75,
                                75,
                                74.9000015258789,
                                75.0999984741211,
                                75.19999694824219,
                                null,
                                75.4000015258789,
                                75.5,
                                75.5999984741211,
                                null,
                                75.5,
                                null,
                                75.5999984741211,
                                null,
                                75.69999694824219,
                                null,
                                null,
                                75.69999694824219,
                                75.69999694824219,
                                75.80000305175781,
                                75.9000015258789,
                                76,
                                null,
                                76,
                                null,
                                75.9000015258789,
                                null,
                                null,
                                null,
                                76,
                                null,
                                76,
                                76,
                                76,
                                76,
                                76,
                                75.9000015258789,
                                75.80000305175781,
                                75.9000015258789,
                                75.80000305175781,
                                75.69999694824219,
                                null,
                                null,
                                75.4000015258789,
                                75.30000305175781,
                                75.30000305175781,
                                75.19999694824219,
                                75.19999694824219,
                                75.19999694824219,
                                75.0999984741211,
                                75.0999984741211,
                                75,
                                74.9000015258789,
                                75,
                                74.80000305175781,
                                74.9000015258789,
                                74.80000305175781,
                                null,
                                74.80000305175781,
                                74.80000305175781,
                                null,
                                75.19999694824219,
                                75.19999694824219,
                                75.19999694824219,
                                null,
                                75.0999984741211,
                                75.0999984741211,
                                75,
                                null,
                                null,
                                75.0999984741211,
                                null,
                                null,
                                75.0999984741211,
                                75.0999984741211,
                                null,
                                null,
                                75.0999984741211,
                                75.0999984741211,
                                75,
                                null,
                                75,
                                null,
                                75,
                                null,
                                75,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                75,
                                null,
                                75,
                                null,
                                74.9000015258789,
                                74.9000015258789,
                                75,
                                null,
                                74.9000015258789,
                                74.9000015258789,
                                74.9000015258789,
                                75,
                                74.9000015258789,
                                74.9000015258789,
                                null,
                                null,
                                75,
                                null,
                                75,
                                75,
                                null,
                                null,
                                null,
                                74.9000015258789,
                                74.9000015258789,
                                null,
                                74.9000015258789,
                                null,
                                null,
                                74.9000015258789,
                                null,
                                74.9000015258789,
                                null,
                                74.9000015258789,
                                null,
                                75,
                                75,
                                75,
                                null,
                                74.9000015258789,
                                null,
                                75,
                                74.80000305175781,
                                74.80000305175781,
                                null,
                                74.69999694824219,
                                74.80000305175781,
                                75.0999984741211,
                                75.0999984741211,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                75,
                                null,
                                null,
                                75,
                                75,
                                null,
                                null,
                                null,
                                null,
                                75,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                            ],
                            "low": [
                                75.5,
                                75.5,
                                75.5,
                                75.4000015258789,
                                75.19999694824219,
                                75.19999694824219,
                                75.19999694824219,
                                75.4000015258789,
                                75.19999694824219,
                                75.0999984741211,
                                75.0999984741211,
                                75.19999694824219,
                                null,
                                75.19999694824219,
                                null,
                                75.30000305175781,
                                75.30000305175781,
                                null,
                                75.30000305175781,
                                75.30000305175781,
                                75.0999984741211,
                                75,
                                null,
                                75,
                                75.0999984741211,
                                null,
                                74.9000015258789,
                                74.80000305175781,
                                74.80000305175781,
                                75,
                                null,
                                75,
                                74.9000015258789,
                                null,
                                null,
                                74.80000305175781,
                                null,
                                74.80000305175781,
                                null,
                                null,
                                null,
                                null,
                                null,
                                75,
                                null,
                                null,
                                75,
                                null,
                                null,
                                null,
                                74.9000015258789,
                                74.9000015258789,
                                74.9000015258789,
                                75,
                                null,
                                null,
                                null,
                                75,
                                null,
                                75,
                                null,
                                null,
                                null,
                                74.9000015258789,
                                null,
                                74.9000015258789,
                                74.9000015258789,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                74.9000015258789,
                                null,
                                null,
                                74.9000015258789,
                                null,
                                null,
                                74.9000015258789,
                                75,
                                null,
                                null,
                                74.9000015258789,
                                null,
                                null,
                                null,
                                74.9000015258789,
                                74.9000015258789,
                                null,
                                null,
                                null,
                                null,
                                null,
                                75,
                                74.9000015258789,
                                75,
                                74.9000015258789,
                                75,
                                75,
                                74.9000015258789,
                                74.9000015258789,
                                75.0999984741211,
                                75.19999694824219,
                                null,
                                75.4000015258789,
                                75.5,
                                75.5999984741211,
                                null,
                                75.5,
                                null,
                                75.5999984741211,
                                null,
                                75.69999694824219,
                                null,
                                null,
                                75.69999694824219,
                                75.69999694824219,
                                75.80000305175781,
                                75.9000015258789,
                                76,
                                null,
                                76,
                                null,
                                75.9000015258789,
                                null,
                                null,
                                null,
                                76,
                                null,
                                76,
                                76,
                                76,
                                76,
                                75.80000305175781,
                                75.9000015258789,
                                75.80000305175781,
                                75.9000015258789,
                                75.80000305175781,
                                75.5999984741211,
                                null,
                                null,
                                75.4000015258789,
                                75.30000305175781,
                                75.19999694824219,
                                75.19999694824219,
                                75.19999694824219,
                                75.19999694824219,
                                75.0999984741211,
                                75,
                                74.80000305175781,
                                74.9000015258789,
                                74.9000015258789,
                                74.80000305175781,
                                74.80000305175781,
                                74.80000305175781,
                                null,
                                74.80000305175781,
                                74.80000305175781,
                                null,
                                75.19999694824219,
                                75.19999694824219,
                                75.19999694824219,
                                null,
                                75.0999984741211,
                                75.0999984741211,
                                75,
                                null,
                                null,
                                75.0999984741211,
                                null,
                                null,
                                75.0999984741211,
                                75.0999984741211,
                                null,
                                null,
                                75.0999984741211,
                                75,
                                75,
                                null,
                                75,
                                null,
                                75,
                                null,
                                74.9000015258789,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                75,
                                null,
                                75,
                                null,
                                74.9000015258789,
                                74.9000015258789,
                                75,
                                null,
                                74.9000015258789,
                                74.9000015258789,
                                74.9000015258789,
                                75,
                                74.9000015258789,
                                74.9000015258789,
                                null,
                                null,
                                75,
                                null,
                                75,
                                75,
                                null,
                                null,
                                null,
                                74.9000015258789,
                                74.9000015258789,
                                null,
                                74.9000015258789,
                                null,
                                null,
                                74.9000015258789,
                                null,
                                74.9000015258789,
                                null,
                                74.9000015258789,
                                null,
                                75,
                                75,
                                75,
                                null,
                                74.9000015258789,
                                null,
                                75,
                                74.80000305175781,
                                74.80000305175781,
                                null,
                                74.69999694824219,
                                74.80000305175781,
                                75.0999984741211,
                                75.0999984741211,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                75,
                                null,
                                null,
                                75,
                                75,
                                null,
                                null,
                                null,
                                null,
                                75,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                            ],
                            "high": [
                                75.5,
                                75.5,
                                75.5,
                                75.4000015258789,
                                75.30000305175781,
                                75.30000305175781,
                                75.19999694824219,
                                75.4000015258789,
                                75.19999694824219,
                                75.0999984741211,
                                75.19999694824219,
                                75.19999694824219,
                                null,
                                75.19999694824219,
                                null,
                                75.30000305175781,
                                75.30000305175781,
                                null,
                                75.30000305175781,
                                75.30000305175781,
                                75.19999694824219,
                                75,
                                null,
                                75,
                                75.0999984741211,
                                null,
                                75,
                                74.80000305175781,
                                74.9000015258789,
                                75,
                                null,
                                75,
                                74.9000015258789,
                                null,
                                null,
                                74.9000015258789,
                                null,
                                74.9000015258789,
                                null,
                                null,
                                null,
                                null,
                                null,
                                75.0999984741211,
                                null,
                                null,
                                75,
                                null,
                                null,
                                null,
                                74.9000015258789,
                                75,
                                75,
                                75,
                                null,
                                null,
                                null,
                                75,
                                null,
                                75,
                                null,
                                null,
                                null,
                                74.9000015258789,
                                null,
                                74.9000015258789,
                                74.9000015258789,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                74.9000015258789,
                                null,
                                null,
                                74.9000015258789,
                                null,
                                null,
                                74.9000015258789,
                                75,
                                null,
                                null,
                                74.9000015258789,
                                null,
                                null,
                                null,
                                74.9000015258789,
                                74.9000015258789,
                                null,
                                null,
                                null,
                                null,
                                null,
                                75,
                                74.9000015258789,
                                75,
                                75,
                                75,
                                75,
                                75,
                                75.19999694824219,
                                75.19999694824219,
                                75.19999694824219,
                                null,
                                75.5,
                                75.5,
                                75.5999984741211,
                                null,
                                75.5999984741211,
                                null,
                                75.5999984741211,
                                null,
                                75.69999694824219,
                                null,
                                null,
                                75.69999694824219,
                                75.9000015258789,
                                75.80000305175781,
                                76,
                                76,
                                null,
                                76,
                                null,
                                76,
                                null,
                                null,
                                null,
                                76,
                                null,
                                76,
                                76,
                                76,
                                76,
                                76,
                                75.9000015258789,
                                75.9000015258789,
                                75.9000015258789,
                                75.80000305175781,
                                75.69999694824219,
                                null,
                                null,
                                75.4000015258789,
                                75.30000305175781,
                                75.30000305175781,
                                75.19999694824219,
                                75.19999694824219,
                                75.19999694824219,
                                75.0999984741211,
                                75.0999984741211,
                                75,
                                75,
                                75,
                                74.9000015258789,
                                74.9000015258789,
                                74.80000305175781,
                                null,
                                74.9000015258789,
                                75,
                                null,
                                75.19999694824219,
                                75.19999694824219,
                                75.19999694824219,
                                null,
                                75.0999984741211,
                                75.0999984741211,
                                75,
                                null,
                                null,
                                75.0999984741211,
                                null,
                                null,
                                75.0999984741211,
                                75.0999984741211,
                                null,
                                null,
                                75.0999984741211,
                                75.0999984741211,
                                75,
                                null,
                                75,
                                null,
                                75,
                                null,
                                75,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                75,
                                null,
                                75,
                                null,
                                74.9000015258789,
                                74.9000015258789,
                                75,
                                null,
                                74.9000015258789,
                                74.9000015258789,
                                74.9000015258789,
                                75,
                                74.9000015258789,
                                75,
                                null,
                                null,
                                75,
                                null,
                                75,
                                75,
                                null,
                                null,
                                null,
                                74.9000015258789,
                                74.9000015258789,
                                null,
                                74.9000015258789,
                                null,
                                null,
                                74.9000015258789,
                                null,
                                74.9000015258789,
                                null,
                                75,
                                null,
                                75,
                                75,
                                75,
                                null,
                                75,
                                null,
                                75,
                                74.80000305175781,
                                74.80000305175781,
                                null,
                                74.69999694824219,
                                75.0999984741211,
                                75.0999984741211,
                                75.0999984741211,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                75,
                                null,
                                null,
                                75,
                                75,
                                null,
                                null,
                                null,
                                null,
                                75,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                            ],
                            "volume": [
                                0,
                                4198,
                                1364,
                                2238,
                                2216,
                                3314,
                                3440,
                                851,
                                1657,
                                5590,
                                6385,
                                655,
                                null,
                                660,
                                null,
                                1462,
                                2149,
                                null,
                                495,
                                1173,
                                8075,
                                477,
                                null,
                                1926,
                                1954,
                                null,
                                8093,
                                1304,
                                1334,
                                569,
                                null,
                                720,
                                521,
                                null,
                                null,
                                901,
                                null,
                                6659,
                                null,
                                null,
                                null,
                                null,
                                null,
                                1889,
                                null,
                                null,
                                5386,
                                null,
                                null,
                                null,
                                1125,
                                3052,
                                1416,
                                1700,
                                null,
                                null,
                                null,
                                606,
                                null,
                                138,
                                null,
                                null,
                                null,
                                307,
                                null,
                                828,
                                1027,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                666,
                                null,
                                null,
                                5132,
                                null,
                                null,
                                1483,
                                557,
                                null,
                                null,
                                390,
                                null,
                                null,
                                null,
                                222,
                                506,
                                null,
                                null,
                                null,
                                null,
                                null,
                                4322,
                                550,
                                301,
                                3640,
                                513,
                                928,
                                24787,
                                10628,
                                816,
                                109,
                                null,
                                10203,
                                4194,
                                1440,
                                null,
                                5943,
                                null,
                                1449,
                                null,
                                6595,
                                null,
                                null,
                                3525,
                                17231,
                                225,
                                10173,
                                10988,
                                null,
                                1120,
                                null,
                                2064,
                                null,
                                null,
                                null,
                                825,
                                null,
                                14913,
                                57279,
                                1836,
                                12515,
                                7668,
                                520,
                                3576,
                                1815,
                                11437,
                                2245,
                                null,
                                null,
                                10971,
                                468,
                                4457,
                                920,
                                4356,
                                3883,
                                6307,
                                14919,
                                18665,
                                8638,
                                2479,
                                4343,
                                4120,
                                2158,
                                null,
                                1402,
                                3315,
                                null,
                                1796,
                                1430,
                                1,
                                null,
                                643,
                                882,
                                2418,
                                null,
                                null,
                                721,
                                null,
                                null,
                                501,
                                554,
                                null,
                                null,
                                1618,
                                4479,
                                183,
                                null,
                                2373,
                                null,
                                10025,
                                null,
                                6373,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                270,
                                null,
                                13,
                                null,
                                3090,
                                1809,
                                757,
                                null,
                                547,
                                270,
                                270,
                                680,
                                1487,
                                3588,
                                null,
                                null,
                                0,
                                null,
                                816557,
                                768,
                                null,
                                null,
                                null,
                                786,
                                1200,
                                null,
                                3541,
                                null,
                                null,
                                802,
                                null,
                                560,
                                null,
                                15567,
                                null,
                                501,
                                1263,
                                462,
                                null,
                                712,
                                null,
                                367,
                                6844,
                                796,
                                null,
                                450,
                                7927,
                                0,
                                859862,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                24866,
                                null,
                                null,
                                15,
                                485,
                                null,
                                null,
                                null,
                                null,
                                1033,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                            ],
                            "close": [
                                75.5,
                                75.5,
                                75.5,
                                75.4000015258789,
                                75.19999694824219,
                                75.30000305175781,
                                75.19999694824219,
                                75.4000015258789,
                                75.19999694824219,
                                75.0999984741211,
                                75.19999694824219,
                                75.19999694824219,
                                null,
                                75.19999694824219,
                                null,
                                75.30000305175781,
                                75.30000305175781,
                                null,
                                75.30000305175781,
                                75.30000305175781,
                                75.0999984741211,
                                75,
                                null,
                                75,
                                75.0999984741211,
                                null,
                                74.9000015258789,
                                74.80000305175781,
                                74.9000015258789,
                                75,
                                null,
                                75,
                                74.9000015258789,
                                null,
                                null,
                                74.9000015258789,
                                null,
                                74.80000305175781,
                                null,
                                null,
                                null,
                                null,
                                null,
                                75.0999984741211,
                                null,
                                null,
                                75,
                                null,
                                null,
                                null,
                                74.9000015258789,
                                75,
                                75,
                                75,
                                null,
                                null,
                                null,
                                75,
                                null,
                                75,
                                null,
                                null,
                                null,
                                74.9000015258789,
                                null,
                                74.9000015258789,
                                74.9000015258789,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                74.9000015258789,
                                null,
                                null,
                                74.9000015258789,
                                null,
                                null,
                                74.9000015258789,
                                75,
                                null,
                                null,
                                74.9000015258789,
                                null,
                                null,
                                null,
                                74.9000015258789,
                                74.9000015258789,
                                null,
                                null,
                                null,
                                null,
                                null,
                                75,
                                74.9000015258789,
                                75,
                                74.9000015258789,
                                75,
                                75,
                                75,
                                75.19999694824219,
                                75.19999694824219,
                                75.19999694824219,
                                null,
                                75.5,
                                75.5,
                                75.5999984741211,
                                null,
                                75.5999984741211,
                                null,
                                75.5999984741211,
                                null,
                                75.69999694824219,
                                null,
                                null,
                                75.69999694824219,
                                75.80000305175781,
                                75.80000305175781,
                                75.9000015258789,
                                76,
                                null,
                                76,
                                null,
                                76,
                                null,
                                null,
                                null,
                                76,
                                null,
                                76,
                                76,
                                76,
                                76,
                                75.80000305175781,
                                75.9000015258789,
                                75.9000015258789,
                                75.9000015258789,
                                75.80000305175781,
                                75.5999984741211,
                                null,
                                null,
                                75.4000015258789,
                                75.30000305175781,
                                75.19999694824219,
                                75.19999694824219,
                                75.19999694824219,
                                75.19999694824219,
                                75.0999984741211,
                                75,
                                74.80000305175781,
                                74.9000015258789,
                                74.9000015258789,
                                74.9000015258789,
                                74.80000305175781,
                                74.80000305175781,
                                null,
                                74.9000015258789,
                                75,
                                null,
                                75.19999694824219,
                                75.19999694824219,
                                75.19999694824219,
                                null,
                                75.0999984741211,
                                75.0999984741211,
                                75,
                                null,
                                null,
                                75.0999984741211,
                                null,
                                null,
                                75.0999984741211,
                                75.0999984741211,
                                null,
                                null,
                                75.0999984741211,
                                75,
                                75,
                                null,
                                75,
                                null,
                                75,
                                null,
                                74.9000015258789,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                75,
                                null,
                                75,
                                null,
                                74.9000015258789,
                                74.9000015258789,
                                75,
                                null,
                                74.9000015258789,
                                74.9000015258789,
                                74.9000015258789,
                                75,
                                74.9000015258789,
                                75,
                                null,
                                null,
                                75,
                                null,
                                75,
                                75,
                                null,
                                null,
                                null,
                                74.9000015258789,
                                74.9000015258789,
                                null,
                                74.9000015258789,
                                null,
                                null,
                                74.9000015258789,
                                null,
                                74.9000015258789,
                                null,
                                75,
                                null,
                                75,
                                75,
                                75,
                                null,
                                75,
                                null,
                                75,
                                74.80000305175781,
                                74.80000305175781,
                                null,
                                74.69999694824219,
                                75.0999984741211,
                                75.0999984741211,
                                75.0999984741211,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                75,
                                null,
                                null,
                                75,
                                75,
                                null,
                                null,
                                null,
                                null,
                                75,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                            ]
                        }
                    ]
                }
            }
        ],
        "error": null
    }
}

const quotesBasicMat = {
    "quoteResponse": {
        "result": [
            {
                "language": "en-US",
                "region": "US",
                "quoteType": "EQUITY",
                "triggerable": false,
                "currency": "SAR",
                "exchange": "SAU",
                "shortName": "Advanced Petrochemical Co.",
                "longName": "Advanced Petrochemical Company",
                "messageBoardId": "finmb_29214617",
                "exchangeTimezoneName": "Asia/Riyadh",
                "exchangeTimezoneShortName": "AST",
                "gmtOffSetMilliseconds": 10800000,
                "market": "sr_market",
                "esgPopulated": false,
                "marketState": "PREPRE",
                "firstTradeDateMilliseconds": 1268640000000,
                "regularMarketChange": 3,
                "regularMarketChangePercent": 4.166667,
                "regularMarketTime": 1617781034,
                "regularMarketPrice": 75,
                "regularMarketDayHigh": 76,
                "regularMarketDayRange": "75.2 - 76.0",
                "regularMarketDayLow": 75.2,
                "regularMarketVolume": 35381,
                "regularMarketPreviousClose": 72,
                "bid": 0,
                "ask": 0,
                "bidSize": 0,
                "askSize": 0,
                "fullExchangeName": "Saudi",
                "financialCurrency": "SAR",
                "regularMarketOpen": 75.4,
                "averageDailyVolume3Month": 308108,
                "averageDailyVolume10Day": 401064,
                "fiftyTwoWeekLowChange": 33.7,
                "fiftyTwoWeekLowChangePercent": 0.8159807,
                "fiftyTwoWeekRange": "41.3 - 76.0",
                "fiftyTwoWeekHighChange": -1,
                "priceHint": 2,
                "tradeable": false,
                "fiftyTwoWeekHighChangePercent": -0.013157895,
                "fiftyTwoWeekLow": 41.3,
                "fiftyTwoWeekHigh": 76,
                "earningsTimestamp": 1601981940,
                "earningsTimestampStart": 1601981940,
                "earningsTimestampEnd": 1601981940,
                "trailingAnnualDividendRate": 2.6,
                "trailingPE": 27.262814,
                "trailingAnnualDividendYield": 0.03611111,
                "epsTrailingTwelveMonths": 2.751,
                "epsForward": 4.08,
                "sharesOutstanding": 216472992,
                "bookValue": 15.795,
                "fiftyDayAverage": 68.39714,
                "fiftyDayAverageChange": 6.6028595,
                "fiftyDayAverageChangePercent": 0.09653707,
                "twoHundredDayAverage": 63.84014,
                "twoHundredDayAverageChange": 11.159859,
                "twoHundredDayAverageChangePercent": 0.17480943,
                "marketCap": 16235473920,
                "forwardPE": 18.382353,
                "priceToBook": 4.748338,
                "sourceInterval": 15,
                "exchangeDataDelayedBy": 0,
                "symbol": "2330.SR"
            },
            {
                "language": "en-US",
                "region": "US",
                "quoteType": "EQUITY",
                "triggerable": false,
                "currency": "SAR",
                "exchange": "SAU",
                "shortName": "Al Jouf Cement Co.",
                "longName": "Al Jouf Cement Company",
                "messageBoardId": "finmb_108716264",
                "exchangeTimezoneName": "Asia/Riyadh",
                "exchangeTimezoneShortName": "AST",
                "gmtOffSetMilliseconds": 10800000,
                "market": "sr_market",
                "esgPopulated": false,
                "marketState": "PREPRE",
                "firstTradeDateMilliseconds": 1284883200000,
                "regularMarketChange": -0.119999886,
                "regularMarketChangePercent": -0.9708729,
                "regularMarketTime": 1617781025,
                "regularMarketPrice": 12.24,
                "regularMarketDayHigh": 12.32,
                "regularMarketDayRange": "12.24 - 12.32",
                "regularMarketDayLow": 12.24,
                "regularMarketVolume": 621834,
                "regularMarketPreviousClose": 12.36,
                "bid": 12.28,
                "ask": 12.2,
                "bidSize": 0,
                "askSize": 0,
                "fullExchangeName": "Saudi",
                "financialCurrency": "SAR",
                "regularMarketOpen": 12.32,
                "averageDailyVolume3Month": 3359541,
                "averageDailyVolume10Day": 5714398,
                "fiftyTwoWeekLowChange": 4.89,
                "fiftyTwoWeekLowChangePercent": 0.6653061,
                "fiftyTwoWeekRange": "7.35 - 12.84",
                "fiftyTwoWeekHighChange": -0.6000004,
                "priceHint": 2,
                "tradeable": false,
                "fiftyTwoWeekHighChangePercent": -0.046729002,
                "fiftyTwoWeekLow": 7.35,
                "fiftyTwoWeekHigh": 12.84,
                "earningsTimestamp": 1617101940,
                "earningsTimestampStart": 1617101940,
                "earningsTimestampEnd": 1617101940,
                "epsTrailingTwelveMonths": -0.513,
                "epsForward": 0.29,
                "sharesOutstanding": 143000000,
                "bookValue": 10.228,
                "fiftyDayAverage": 11.846857,
                "fiftyDayAverageChange": 0.3931427,
                "fiftyDayAverageChangePercent": 0.0331854,
                "twoHundredDayAverage": 11.396479,
                "twoHundredDayAverageChange": 0.8435211,
                "twoHundredDayAverageChangePercent": 0.074015945,
                "marketCap": 1750320000,
                "forwardPE": 42.206898,
                "priceToBook": 1.1967149,
                "sourceInterval": 15,
                "exchangeDataDelayedBy": 0,
                "symbol": "3091.SR"
            },
            {
                "language": "en-US",
                "region": "US",
                "quoteType": "EQUITY",
                "triggerable": false,
                "currency": "SAR",
                "exchange": "SAU",
                "shortName": "Al Kathiri Holding Co.",
                "longName": "Al Kathiri Holding Company",
                "messageBoardId": "finmb_433459317",
                "exchangeTimezoneName": "Asia/Riyadh",
                "exchangeTimezoneShortName": "AST",
                "gmtOffSetMilliseconds": 10800000,
                "market": "sr_market",
                "esgPopulated": false,
                "marketState": "PREPRE",
                "firstTradeDateMilliseconds": 1572854400000,
                "regularMarketChange": -0.099998474,
                "regularMarketChangePercent": -0.10214349,
                "regularMarketTime": 1617781039,
                "regularMarketPrice": 97.8,
                "regularMarketDayHigh": 97.8,
                "regularMarketDayRange": "97.2 - 97.8",
                "regularMarketDayLow": 97.2,
                "regularMarketVolume": 9964,
                "regularMarketPreviousClose": 97.9,
                "bid": 0,
                "ask": 97.3,
                "fullExchangeName": "Saudi",
                "financialCurrency": "SAR",
                "regularMarketOpen": 97.8,
                "averageDailyVolume3Month": 876601,
                "averageDailyVolume10Day": 218053,
                "fiftyTwoWeekLowChange": 54.037,
                "fiftyTwoWeekLowChangePercent": 1.2347643,
                "fiftyTwoWeekRange": "43.763004 - 120.0",
                "fiftyTwoWeekHighChange": -22.199997,
                "priceHint": 2,
                "tradeable": false,
                "fiftyTwoWeekHighChangePercent": -0.18499997,
                "fiftyTwoWeekLow": 43.763004,
                "fiftyTwoWeekHigh": 120,
                "earningsTimestamp": 1604919540,
                "earningsTimestampStart": 1604919540,
                "earningsTimestampEnd": 1604919540,
                "trailingPE": 53.036877,
                "epsTrailingTwelveMonths": 1.844,
                "bookValue": 13.88,
                "fiftyDayAverage": 100.97714,
                "fiftyDayAverageChange": -3.1771393,
                "fiftyDayAverageChangePercent": -0.031463947,
                "twoHundredDayAverage": 93.21817,
                "twoHundredDayAverageChange": 4.581833,
                "twoHundredDayAverageChangePercent": 0.049151715,
                "priceToBook": 7.0461097,
                "sourceInterval": 15,
                "exchangeDataDelayedBy": 0,
                "symbol": "3008.SR"
            },
            {
                "language": "en-US",
                "region": "US",
                "quoteType": "EQUITY",
                "triggerable": false,
                "currency": "SAR",
                "exchange": "SAU",
                "shortName": "Al Yamamah Steel Industries Co.",
                "longName": "Al-Yamamah Steel Industries Company",
                "messageBoardId": "finmb_5418815",
                "exchangeTimezoneName": "Asia/Riyadh",
                "exchangeTimezoneShortName": "AST",
                "gmtOffSetMilliseconds": 10800000,
                "market": "sr_market",
                "esgPopulated": false,
                "marketState": "PREPRE",
                "firstTradeDateMilliseconds": 1463904000000,
                "regularMarketChange": -0.8499985,
                "regularMarketChangePercent": -2.0070803,
                "regularMarketTime": 1617781021,
                "regularMarketPrice": 41.5,
                "regularMarketDayHigh": 41.5,
                "regularMarketDayRange": "40.8 - 41.5",
                "regularMarketDayLow": 40.8,
                "regularMarketVolume": 102329,
                "regularMarketPreviousClose": 42.35,
                "bid": 41.55,
                "ask": 0,
                "bidSize": 0,
                "askSize": 0,
                "fullExchangeName": "Saudi",
                "financialCurrency": "SAR",
                "regularMarketOpen": 41.5,
                "averageDailyVolume3Month": 1603981,
                "averageDailyVolume10Day": 1781385,
                "fiftyTwoWeekLowChange": 28.5,
                "fiftyTwoWeekLowChangePercent": 2.1923077,
                "fiftyTwoWeekRange": "13.0 - 44.8",
                "fiftyTwoWeekHighChange": -3.2999992,
                "priceHint": 2,
                "tradeable": false,
                "fiftyTwoWeekHighChangePercent": -0.0736607,
                "fiftyTwoWeekLow": 13,
                "fiftyTwoWeekHigh": 44.8,
                "trailingAnnualDividendRate": 1,
                "trailingPE": 20.896275,
                "trailingAnnualDividendYield": 0.023612753,
                "epsTrailingTwelveMonths": 1.986,
                "sharesOutstanding": 50800000,
                "bookValue": 13.488,
                "fiftyDayAverage": 38.645714,
                "fiftyDayAverageChange": 2.8542862,
                "fiftyDayAverageChangePercent": 0.07385777,
                "twoHundredDayAverage": 30.227324,
                "twoHundredDayAverageChange": 11.272676,
                "twoHundredDayAverageChangePercent": 0.37293002,
                "marketCap": 2108199936,
                "priceToBook": 3.076809,
                "sourceInterval": 15,
                "exchangeDataDelayedBy": 0,
                "symbol": "1304.SR"
            },
            {
                "language": "en-US",
                "region": "US",
                "quoteType": "EQUITY",
                "triggerable": false,
                "currency": "SAR",
                "exchange": "SAU",
                "shortName": "Alujain Holding  Corp.",
                "longName": "Alujain Holding Corporation",
                "messageBoardId": "finmb_11233708",
                "exchangeTimezoneName": "Asia/Riyadh",
                "exchangeTimezoneShortName": "AST",
                "gmtOffSetMilliseconds": 10800000,
                "market": "sr_market",
                "esgPopulated": false,
                "marketState": "PREPRE",
                "firstTradeDateMilliseconds": 1267603200000,
                "regularMarketChange": 3,
                "regularMarketChangePercent": 5.940594,
                "regularMarketTime": 1617781004,
                "regularMarketPrice": 53.5,
                "regularMarketDayHigh": 53.7,
                "regularMarketDayRange": "52.7 - 53.7",
                "regularMarketDayLow": 52.7,
                "regularMarketVolume": 324617,
                "regularMarketPreviousClose": 50.5,
                "bid": 53.1,
                "ask": 53.2,
                "bidSize": 0,
                "askSize": 0,
                "fullExchangeName": "Saudi",
                "financialCurrency": "SAR",
                "regularMarketOpen": 53.6,
                "averageDailyVolume3Month": 917609,
                "averageDailyVolume10Day": 636403,
                "fiftyTwoWeekLowChange": 28.64,
                "fiftyTwoWeekLowChangePercent": 1.1520514,
                "fiftyTwoWeekRange": "24.86 - 53.7",
                "fiftyTwoWeekHighChange": -0.20000076,
                "priceHint": 2,
                "tradeable": false,
                "fiftyTwoWeekHighChangePercent": -0.003724409,
                "fiftyTwoWeekLow": 24.86,
                "fiftyTwoWeekHigh": 53.7,
                "earningsTimestamp": 1603882740,
                "earningsTimestampStart": 1603882740,
                "earningsTimestampEnd": 1603882740,
                "trailingAnnualDividendRate": 1,
                "trailingPE": 17.863106,
                "trailingAnnualDividendYield": 0.01980198,
                "epsTrailingTwelveMonths": 2.995,
                "sharesOutstanding": 69200000,
                "bookValue": 24.433,
                "fiftyDayAverage": 48.685715,
                "fiftyDayAverageChange": 4.8142853,
                "fiftyDayAverageChangePercent": 0.09888497,
                "twoHundredDayAverage": 46.942604,
                "twoHundredDayAverageChange": 6.557396,
                "twoHundredDayAverageChangePercent": 0.13968965,
                "marketCap": 3702200064,
                "priceToBook": 2.1896615,
                "sourceInterval": 15,
                "exchangeDataDelayedBy": 0,
                "symbol": "2170.SR"
            },
            {
                "language": "en-US",
                "region": "US",
                "quoteType": "EQUITY",
                "triggerable": false,
                "currency": "SAR",
                "exchange": "SAU",
                "shortName": "Arabian Cement Co.",
                "longName": "Arabian Cement Company",
                "messageBoardId": "finmb_9086316",
                "exchangeTimezoneName": "Asia/Riyadh",
                "exchangeTimezoneShortName": "AST",
                "gmtOffSetMilliseconds": 10800000,
                "market": "sr_market",
                "esgPopulated": false,
                "marketState": "PREPRE",
                "firstTradeDateMilliseconds": 1267689600000,
                "regularMarketChange": -0.25,
                "regularMarketChangePercent": -0.5605382,
                "regularMarketTime": 1617781013,
                "regularMarketPrice": 44.35,
                "regularMarketDayHigh": 44.35,
                "regularMarketDayRange": "43.9 - 44.35",
                "regularMarketDayLow": 43.9,
                "regularMarketVolume": 84929,
                "regularMarketPreviousClose": 44.6,
                "bid": 44.05,
                "ask": 44,
                "bidSize": 0,
                "askSize": 0,
                "fullExchangeName": "Saudi",
                "financialCurrency": "SAR",
                "regularMarketOpen": 44.35,
                "averageDailyVolume3Month": 568842,
                "averageDailyVolume10Day": 286231,
                "fiftyTwoWeekLowChange": 22.329998,
                "fiftyTwoWeekLowChangePercent": 1.014078,
                "fiftyTwoWeekRange": "22.02 - 46.3",
                "fiftyTwoWeekHighChange": -1.9500008,
                "priceHint": 2,
                "tradeable": false,
                "fiftyTwoWeekHighChangePercent": -0.04211665,
                "fiftyTwoWeekLow": 22.02,
                "fiftyTwoWeekHigh": 46.3,
                "earningsTimestamp": 1603796340,
                "earningsTimestampStart": 1603796340,
                "earningsTimestampEnd": 1603796340,
                "trailingAnnualDividendRate": 2.25,
                "trailingPE": 23.985937,
                "trailingAnnualDividendYield": 0.050448433,
                "epsTrailingTwelveMonths": 1.849,
                "epsForward": 0.97,
                "sharesOutstanding": 100000000,
                "bookValue": 29.118,
                "fiftyDayAverage": 42.15286,
                "fiftyDayAverageChange": 2.1971397,
                "fiftyDayAverageChangePercent": 0.052123148,
                "twoHundredDayAverage": 37.266197,
                "twoHundredDayAverageChange": 7.0838013,
                "twoHundredDayAverageChangePercent": 0.19008651,
                "marketCap": 4434999808,
                "forwardPE": 45.721645,
                "priceToBook": 1.5231128,
                "sourceInterval": 15,
                "exchangeDataDelayedBy": 0,
                "symbol": "3010.SR"
            },
            {
                "language": "en-US",
                "region": "US",
                "quoteType": "EQUITY",
                "triggerable": false,
                "currency": "SAR",
                "exchange": "SAU",
                "shortName": "Arabian Pipes Co.",
                "longName": "Arabian Pipes Company",
                "messageBoardId": "finmb_12483910",
                "exchangeTimezoneName": "Asia/Riyadh",
                "exchangeTimezoneShortName": "AST",
                "gmtOffSetMilliseconds": 10800000,
                "market": "sr_market",
                "esgPopulated": false,
                "marketState": "PREPRE",
                "firstTradeDateMilliseconds": 1267689600000,
                "regularMarketChange": 0.15999985,
                "regularMarketChangePercent": 0.7187774,
                "regularMarketTime": 1617781026,
                "regularMarketPrice": 22.42,
                "regularMarketDayHigh": 22.74,
                "regularMarketDayRange": "22.42 - 22.74",
                "regularMarketDayLow": 22.42,
                "regularMarketVolume": 415390,
                "regularMarketPreviousClose": 22.26,
                "bid": 22.44,
                "ask": 22.42,
                "bidSize": 0,
                "askSize": 0,
                "fullExchangeName": "Saudi",
                "financialCurrency": "SAR",
                "regularMarketOpen": 22.56,
                "averageDailyVolume3Month": 5492302,
                "averageDailyVolume10Day": 1909871,
                "fiftyTwoWeekLowChange": 11.82,
                "fiftyTwoWeekLowChangePercent": 1.1150943,
                "fiftyTwoWeekRange": "10.6 - 28.2",
                "fiftyTwoWeekHighChange": -5.7800007,
                "priceHint": 2,
                "tradeable": false,
                "fiftyTwoWeekHighChangePercent": -0.20496456,
                "fiftyTwoWeekLow": 10.6,
                "fiftyTwoWeekHigh": 28.2,
                "earningsTimestamp": 1605092340,
                "earningsTimestampStart": 1605092340,
                "earningsTimestampEnd": 1605092340,
                "epsTrailingTwelveMonths": -0.895,
                "sharesOutstanding": 40000000,
                "bookValue": 12.22,
                "fiftyDayAverage": 23.046858,
                "fiftyDayAverageChange": -0.62685776,
                "fiftyDayAverageChangePercent": -0.027199272,
                "twoHundredDayAverage": 19.477182,
                "twoHundredDayAverageChange": 2.9428177,
                "twoHundredDayAverageChangePercent": 0.15109052,
                "marketCap": 896800000,
                "priceToBook": 1.8346971,
                "sourceInterval": 15,
                "exchangeDataDelayedBy": 0,
                "averageAnalystRating": "4.0 - Underperform",
                "symbol": "2200.SR"
            },
            {
                "language": "en-US",
                "region": "US",
                "quoteType": "EQUITY",
                "triggerable": false,
                "currency": "SAR",
                "exchange": "SAU",
                "shortName": "Basic Chemical Industries Co.",
                "longName": "Basic Chemical Industries Company",
                "messageBoardId": "finmb_5408454",
                "exchangeTimezoneName": "Asia/Riyadh",
                "exchangeTimezoneShortName": "AST",
                "gmtOffSetMilliseconds": 10800000,
                "market": "sr_market",
                "esgPopulated": false,
                "marketState": "PREPRE",
                "firstTradeDateMilliseconds": 1267689600000,
                "regularMarketChange": -0.70000076,
                "regularMarketChangePercent": -1.7199036,
                "regularMarketTime": 1617780873,
                "regularMarketPrice": 40,
                "regularMarketDayHigh": 40.1,
                "regularMarketDayRange": "39.95 - 40.1",
                "regularMarketDayLow": 39.95,
                "regularMarketVolume": 39689,
                "regularMarketPreviousClose": 40.7,
                "bid": 39.95,
                "ask": 0,
                "bidSize": 0,
                "askSize": 0,
                "fullExchangeName": "Saudi",
                "financialCurrency": "SAR",
                "regularMarketOpen": 40,
                "averageDailyVolume3Month": 659642,
                "averageDailyVolume10Day": 619721,
                "fiftyTwoWeekLowChange": 20.66,
                "fiftyTwoWeekLowChangePercent": 1.0682523,
                "fiftyTwoWeekRange": "19.34 - 42.4",
                "fiftyTwoWeekHighChange": -2.4000015,
                "priceHint": 2,
                "tradeable": false,
                "fiftyTwoWeekHighChangePercent": -0.056603808,
                "fiftyTwoWeekLow": 19.34,
                "fiftyTwoWeekHigh": 42.4,
                "earningsTimestamp": 1604833140,
                "earningsTimestampStart": 1604833140,
                "earningsTimestampEnd": 1604833140,
                "trailingAnnualDividendRate": 1,
                "trailingPE": 28.469751,
                "trailingAnnualDividendYield": 0.024570024,
                "epsTrailingTwelveMonths": 1.405,
                "sharesOutstanding": 27500000,
                "bookValue": 20.355,
                "fiftyDayAverage": 39.28857,
                "fiftyDayAverageChange": 0.7114296,
                "fiftyDayAverageChangePercent": 0.0181078,
                "twoHundredDayAverage": 33.994366,
                "twoHundredDayAverageChange": 6.0056343,
                "twoHundredDayAverageChangePercent": 0.17666557,
                "marketCap": 1100000000,
                "priceToBook": 1.9651191,
                "sourceInterval": 15,
                "exchangeDataDelayedBy": 0,
                "symbol": "1210.SR"
            },
            {
                "language": "en-US",
                "region": "US",
                "quoteType": "EQUITY",
                "triggerable": false,
                "currency": "SAR",
                "exchange": "SAU",
                "shortName": "City Cement Co.",
                "longName": "City Cement Company",
                "messageBoardId": "finmb_215268674",
                "exchangeTimezoneName": "Asia/Riyadh",
                "exchangeTimezoneShortName": "AST",
                "gmtOffSetMilliseconds": 10800000,
                "market": "sr_market",
                "esgPopulated": false,
                "marketState": "PREPRE",
                "firstTradeDateMilliseconds": 1350288000000,
                "regularMarketChange": -0.10000038,
                "regularMarketChangePercent": -0.37174863,
                "regularMarketTime": 1617780897,
                "regularMarketPrice": 26.8,
                "regularMarketDayHigh": 26.8,
                "regularMarketDayRange": "26.65 - 26.8",
                "regularMarketDayLow": 26.65,
                "regularMarketVolume": 52892,
                "regularMarketPreviousClose": 26.9,
                "bid": 0,
                "ask": 0,
                "fullExchangeName": "Saudi",
                "financialCurrency": "SAR",
                "regularMarketOpen": 26.7,
                "averageDailyVolume3Month": 560190,
                "averageDailyVolume10Day": 472487,
                "fiftyTwoWeekLowChange": 11.394594,
                "fiftyTwoWeekLowChangePercent": 0.7396491,
                "fiftyTwoWeekRange": "15.405405 - 29.45946",
                "fiftyTwoWeekHighChange": -2.65946,
                "priceHint": 2,
                "tradeable": false,
                "fiftyTwoWeekHighChangePercent": -0.09027525,
                "fiftyTwoWeekLow": 15.405405,
                "fiftyTwoWeekHigh": 29.45946,
                "earningsTimestamp": 1604314740,
                "earningsTimestampStart": 1604314740,
                "earningsTimestampEnd": 1604314740,
                "trailingAnnualDividendRate": 0.5,
                "trailingPE": 17.015873,
                "trailingAnnualDividendYield": 0.01858736,
                "epsTrailingTwelveMonths": 1.575,
                "sharesOutstanding": 189200000,
                "bookValue": 13.179,
                "fiftyDayAverage": 26.212856,
                "fiftyDayAverageChange": 0.58714294,
                "fiftyDayAverageChangePercent": 0.022399046,
                "twoHundredDayAverage": 25.591341,
                "twoHundredDayAverageChange": 1.2086582,
                "twoHundredDayAverageChangePercent": 0.047229186,
                "marketCap": 5070559744,
                "priceToBook": 2.033538,
                "sourceInterval": 15,
                "exchangeDataDelayedBy": 0,
                "symbol": "3003.SR"
            },
            {
                "language": "en-US",
                "region": "US",
                "quoteType": "EQUITY",
                "triggerable": false,
                "currency": "SAR",
                "exchange": "SAU",
                "shortName": "Eastern Province Cement Co.",
                "longName": "Eastern Province Cement Co.",
                "messageBoardId": "finmb_9193612",
                "exchangeTimezoneName": "Asia/Riyadh",
                "exchangeTimezoneShortName": "AST",
                "gmtOffSetMilliseconds": 10800000,
                "market": "sr_market",
                "esgPopulated": false,
                "marketState": "PREPRE",
                "firstTradeDateMilliseconds": 1267689600000,
                "regularMarketChange": -0.5,
                "regularMarketChangePercent": -0.8680556,
                "regularMarketTime": 1617781011,
                "regularMarketPrice": 57.1,
                "regularMarketDayHigh": 57,
                "regularMarketDayRange": "55.6 - 57.0",
                "regularMarketDayLow": 55.6,
                "regularMarketVolume": 148180,
                "regularMarketPreviousClose": 57.6,
                "bid": 0,
                "ask": 0,
                "bidSize": 0,
                "askSize": 0,
                "fullExchangeName": "Saudi",
                "financialCurrency": "SAR",
                "regularMarketOpen": 56.8,
                "averageDailyVolume3Month": 218243,
                "averageDailyVolume10Day": 352734,
                "fiftyTwoWeekLowChange": 33.659996,
                "fiftyTwoWeekLowChangePercent": 1.4360067,
                "fiftyTwoWeekRange": "23.44 - 58.0",
                "fiftyTwoWeekHighChange": -0.9000015,
                "priceHint": 2,
                "tradeable": false,
                "fiftyTwoWeekHighChangePercent": -0.015517267,
                "fiftyTwoWeekLow": 23.44,
                "fiftyTwoWeekHigh": 58,
                "earningsTimestamp": 1603796340,
                "earningsTimestampStart": 1603796340,
                "earningsTimestampEnd": 1603796340,
                "trailingAnnualDividendRate": 2.5,
                "trailingPE": 22.604908,
                "trailingAnnualDividendYield": 0.04340278,
                "epsTrailingTwelveMonths": 2.526,
                "epsForward": 1.18,
                "sharesOutstanding": 86000000,
                "bookValue": 29.459,
                "fiftyDayAverage": 47.887142,
                "fiftyDayAverageChange": 9.212856,
                "fiftyDayAverageChangePercent": 0.19238685,
                "twoHundredDayAverage": 41.26197,
                "twoHundredDayAverageChange": 15.838028,
                "twoHundredDayAverageChangePercent": 0.3838408,
                "marketCap": 4910599680,
                "forwardPE": 48.38983,
                "priceToBook": 1.9382871,
                "sourceInterval": 15,
                "exchangeDataDelayedBy": 0,
                "symbol": "3080.SR"
            }
        ],
        "error": null
    }
}

class MockApi extends RapidApi {

    _get$(url){
        return of(
            url.match(/summaryDetail/) ? mockSummary : (
                url.match(/chart/) ? chart1m : quotesBasicMat
            )
        );
    }

}
