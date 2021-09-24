import React, {useContext, useEffect, useState} from "react";
import {SymbolCacheContext} from "../../services/symbol-cache";
import {Link as RouterLink, useParams} from "react-router-dom";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

import {Grid, Link, makeStyles, Typography} from "@material-ui/core";
import {ApiContext} from "../../services/rapidapi";
import BoxPaper from "../Elements/BoxPaper";
import Loader from "../Elements/Loader";
import { DataGrid } from '@material-ui/data-grid';

const useStyles = makeStyles(theme => ({
    price_up: {
        color: theme.palette.success.main
    },
    price_down: {
        color: theme.palette.error.main
    },
    ml_header: {
        whiteSpace: 'normal',
        lineHeight: 'normal'
    }
}));


export function Sector (props) {

    const sc = useContext(SymbolCacheContext);
    const ac = useContext(ApiContext);

    let {sector} = useParams();

    const [items, setItems] = useState([]);
    const [itemCount, setItemCount] = useState(0);
    const [cacheLoaded, setCacheLoaded] = useState(false);

    const classes = useStyles();

    let limit = 10;

    const getSymbolsToQuery = () => {
        return sc.cache.getItemsForSector(sector).filter((collection, index) => index >= itemCount && index < itemCount + limit).map(item => item.symbol)
    };

    const showFetch = () => {
        return items.length > 0 && items.length < sc.cache.getItemsForSector(sector).length;
    };

    const {
        data,
        fetchNextPage,
        isFetching,
    } = ac.api.useFetchBulkQuotesQuery(getSymbolsToQuery(), {
        refetchOnWindowFocus: false,
        enabled: false,
        getNextPageParam: (lastPage, pages) => {
            return getSymbolsToQuery()
        }
    }, ['bulk_quotes', sector])();

    useEffect(()=> {
        //console.log(sc.cache.collection)
        sc.cache.loaded.subscribe(() => {
            setCacheLoaded(true);
        });
    }, []);

    useEffect(()=> {
        if(cacheLoaded && !data) {
            fetchNextPage();
        }

        if(data && data.pages){
            let newItems = [];
            data.pages.forEach((value) => {
                newItems = newItems.concat(value.result)
            });
            setItems(newItems);
            setItemCount(newItems.length);
        }

    }, [sector, cacheLoaded, data]);

    document.title = `${props.title} - ${sector}`;

    const asTable= () => (
                    <TableContainer style={{maxHeight: '60vh'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell><Typography>Name</Typography></TableCell>
                                    <TableCell align="right"><Typography>Symbol</Typography></TableCell>
                                    <TableCell align="right"><Typography>Price</Typography></TableCell>
                                    <TableCell align="right"><Typography>Change %</Typography></TableCell>
                                    <TableCell align="right"><Typography>Market cap (B)</Typography></TableCell>
                                    <TableCell align="right"><Typography>Trailing P/E</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.symbol}>
                                        <TableCell component="th" scope="row">{item.longName}</TableCell>
                                        <TableCell align="right"><Link component={RouterLink} to={`/stocks/${item.symbol}`}>{item.symbol}</Link></TableCell>
                                        <TableCell align="right">{item.regularMarketPrice.toFixed(2)}</TableCell>
                                        <TableCell align="right"><Typography className={item.regularMarketChangePercent > 0 ? classes.price_up : classes.price_down}>{item.regularMarketChangePercent.toFixed(2)}</Typography></TableCell>
                                        <TableCell align="right">{  item.marketCap && (parseFloat(item.marketCap)/1000000000).toFixed(2) }</TableCell>
                                        <TableCell align="right">{item.trailingPE && item.trailingPE.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {items.length == 0 && <Loader/>}
                    </TableContainer>
    );

    const asDataGrid = () => {
        let cols = [
            {field: 'longName', headerName: 'Name', flex: 1},
            {field: 'symbol', headerName: 'Symbol', renderCell: (params) => (<Link component={RouterLink} to={`/stocks/${params.value}`}>{params.value}</Link>)},
            {field: 'regularMarketPrice', headerName: 'Price'},
            {field: 'regularMarketChangePercent', headerName: 'Change %', renderCell: (params) => (<Typography className={params.value > 0 ? classes.price_up : classes.price_down}>{params.value}</Typography>)},
            {field: 'marketCap', headerName: 'Market cap (B)'},
            {field: 'trailingPE', headerName: 'Trailing P/E'},
        ];

        let rows = items.map(item => ({
            id: item.symbol,
            longName: item.longName,
            symbol: item.symbol,
            regularMarketPrice: item.regularMarketPrice.toFixed(2),
            regularMarketChangePercent: item.regularMarketChangePercent.toFixed(2),
            marketCap: item.marketCap ? (parseFloat(item.marketCap)/1000000000).toFixed(2) : '',
            trailingPE: item.trailingPE ? item.trailingPE.toFixed(2) : ''
        }));

        return (
            <DataGrid rows={rows} columns={cols}
                      hideFooter={true}
                      disableColumnMenu={true}
                      loading={items.length == 0}
                      autoHeight={true} />
        );
    };

    return (
        <Grid container>
            <Grid item md={9} xs={12}>
                <Typography variant={'h6'}>{sector}</Typography>
                <BoxPaper transparent={true} p={0}>
                    {asDataGrid()}
                    {showFetch() && <Button variant="contained" color="primary"  onClick={() => fetchNextPage()}>Fetch more</Button>}
                </BoxPaper>
            </Grid>
        </Grid>
    );

}
