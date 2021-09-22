import React, {useContext, useEffect, useState} from "react";
import {
    Button, Divider, Grid,
    IconButton,
    Link,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography, useTheme
} from "@material-ui/core";
import {PositionContext, usePosition} from "../../services/position-history";
import BookmarkTwoToneIcon from "@material-ui/icons/BookmarkTwoTone";
import { Link as RouterLink } from 'react-router-dom';
import {formatNumber} from "../../services/formatter";
import {DataGrid} from "@material-ui/data-grid";

export function PortfolioTable (props) {

    const pos = useContext(PositionContext);

    const theme = useTheme();

    const [marketStatus, setMarketStatus] = useState(null);

    const getColor = (color) => color === '#66F9DA' ? theme.palette.success.main : theme.palette.error.main;
    const getColor2 = (val) => val >= 0 ? theme.palette.success.main : theme.palette.error.main;

    useEffect(() => {
        pos.position.marketStatus$.subscribe(value => {
            setMarketStatus(value);
        });
    }, []);

    const asTable= () => (
        <TableContainer component={"div"} style={{maxHeight: '60vh'}}>
            <Table stickyHeader size={'small'}>
                <TableHead>
                    <TableRow>
                        <TableCell><Typography>SYMBOL</Typography></TableCell>
                        {!props.compact && <TableCell><Typography>NAME</Typography></TableCell> }
                        {!props.compact && <TableCell align="right">{props.shares && <Typography>QUANTITY</Typography>}</TableCell> }
                        <TableCell align="right"><Typography>CHANGE %</Typography></TableCell>
                        {!props.compact && <TableCell align="right">{props.shares && <Typography>GAIN/LOSS</Typography>}</TableCell> }
                        <TableCell align="right"><Typography>CURRENT VALUE</Typography></TableCell>
                        {!props.compact && <TableCell>{!marketStatus && <Typography color={"error"}>Market closed!</Typography>}</TableCell> }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.symbols.map((val, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row"><Link component={RouterLink} color={"textPrimary"} to={`/stocks/${val}`}>{val}</Link></TableCell>
                                {!props.compact && <TableCell>{props.names[index]}</TableCell> }
                                {!props.compact && <TableCell align="right">{props.shares && props.shares[index]}</TableCell> }
                                <TableCell align="right" style={{color:getColor(props.color[index])}}>{props.difference[index]}</TableCell>
                                {!props.compact && <TableCell align="right" style={{color:getColor(props.color[index])}}>{props.shares && props.change[index]}</TableCell> }
                                <TableCell align="right">SAR {formatNumber(props.value[index])}</TableCell>
                                {!props.compact && <TableCell>
                                    {props.shares
                                        ? <Button color={"secondary"}
                                                  disabled={!marketStatus}
                                                  onClick={() => {props.handleStockSell(props.position[index], index)}}
                                        >SELL</Button>

                                        : <IconButton onClick={() => {props.handleWatchlist(props.symbols[index]);}}>
                                            <BookmarkTwoToneIcon/>
                                        </IconButton>
                                    }
                                </TableCell> }
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );

    const asDataGrid = () => {
        let cols = [
            {field: 'longName', headerName: 'NAME', flex: 1},
            {field: 'symbol', headerName: 'SYMBOL', renderCell: params => (<Link component={RouterLink} to={`/stocks/${params.value}`}>{params.value}</Link>)},
        ];
        if (props.shares){
            cols.push(
                {field: 'quantity', headerName: 'QUANTITY'}
            );
        }
        cols.push(
            {field: 'changePcnt', headerName: 'CHANGE %', renderCell: params => (<Typography style={{color: getColor2(params.value)}}>{params.value}</Typography>)}
        );
        if (props.shares){
            cols.push(
                {field: 'gainLoss', headerName: 'GAIN / LOSS', renderCell: params => (<Typography style={{color: getColor2(params.value)}}>{params.value}</Typography>)}
            );
        }
        cols.push(
            {field: 'currentValue', headerName: 'CURRENT VALUE', renderCell: params => (formatNumber(params.value))}
        );
        cols.push(
            {field: 'actions', headerName: ' ',
                renderHeader: params => (!marketStatus && <Typography color={"error"}>Market closed!</Typography>),
                renderCell: params => (props.shares
                    ? <Button color={"secondary"}
                              disabled={!marketStatus}
                              onClick={() => {props.handleStockSell(props.position[params.value], params.value)}}
                    >SELL</Button>

                    : <IconButton onClick={() => {props.handleWatchlist(props.symbols[params.value]);}}>
                        <BookmarkTwoToneIcon/>
                    </IconButton>)
            }
        );

        let rows = props.symbols.map((val, index) => ({
            id: val+index,
            longName: props.names[index],
            symbol: val,
            quantity: props.shares ? props.shares[index] : 0,
            changePcnt: props.difference[index],
            gainLoss: props.shares ? props.change[index] : 0,
            currentValue: props.value[index],
            actions: index,
        }));

        return (
            <DataGrid rows={rows} columns={cols}
                  hideFooter={true}
                  disableColumnMenu={true}
                  autoHeight={true} />
        );
    }

    return (
        !props.compact
            ? asDataGrid()

        : <Grid container direction={"column"}>
            {props.symbols.map((val, index) => (<>
                <Divider/>
                <Grid container item alignItems={"stretch"}>
                  <Grid item xs>
                      <Link component={RouterLink} variant={"subtitle1"} color={"textPrimary"} to={`/stocks/${val}`} >{val}</Link>
                  </Grid>
                  <Grid container  direction={"column"} item xs>
                      <Grid item>
                          <Typography variant={"subtitle1"}>SAR {formatNumber(props.value[index])}</Typography>
                      </Grid>
                      <Grid item>
                          <Typography variant={"body1"} style={{color:getColor(props.color[index])}}>{props.difference[index]}</Typography>
                      </Grid>
                  </Grid>
                </Grid>
            </>))}
        </Grid>
    );

}
