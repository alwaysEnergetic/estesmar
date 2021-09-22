import React, {useContext, useEffect, useState} from "react";
import {
    AppBar,
    Box,
    Button,
    Container,
    Divider,
    Drawer,
    Grid,
    Hidden,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemIcon,
    makeStyles,
    TextField,
    Toolbar,
    Typography,
    useTheme
} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import PieChartOutlinedIcon from '@material-ui/icons/PieChartOutlined';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import Brightness4OutlinedIcon from '@material-ui/icons/Brightness4Outlined';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';

import {Link, NavLink, useHistory} from "react-router-dom";
import {logout} from "../auth";
import {Autocomplete, ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import {SymbolCacheContext} from "../../services/symbol-cache";
import {PositionContext} from "../../services/position-history";
import {motion} from "framer-motion";
import {formatNumber} from "../../services/formatter";
import withWidth from "@material-ui/core/withWidth";

const drawerWidth = 64;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
        backgroundColor: theme.palette.background.default,
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
        backgroundColor: theme.palette.background.default,
    },
    menuButton: {
        //marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
        overflow: "hidden",
        border: 0,
        backgroundColor: theme.palette.background.default,
    },
    content: {
        flexGrow: 1,
        [theme.breakpoints.up('md')]: {
            padding: theme.spacing(3),
        }
    },
}));

const Layout = (props) => {

    const { window } = props;

    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();
    const sc = useContext(SymbolCacheContext);
    const pos = useContext(PositionContext);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [themeMode, setThemeMode] = useState(theme.palette.type);
    const [searchOptions, setSearchOptions] = useState([]);
    const [funds, setFunds] = useState(null);
    const [marketStatus, setMarketStatus] = useState(pos.position.isMarketOpen());

    useEffect(() => {

        pos.position.getCurrentFunds$().subscribe(value => {
            setFunds(value);
        });

        pos.position.marketStatus$.subscribe(value => {
            setMarketStatus(value);
        });

    }, []);


    const toggleSearchFocus = () => {
        setSearchFocused(!searchFocused);
    }

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleThemeMode = (event, value) => {
        let mode = value ? value: 'light';
        props.setTheme(mode);
        setThemeMode(mode);
    };

    const handleMarketStatusToggle = () => {
        pos.position.setMarketStatusOverride(
            pos.position.marketStatusOverride === null ? !pos.position.isMarketOpen()
            : null);
    };

    const searchStocks = (filter) => {
        if(filter == ''){
            setSearchOptions([]);
            return;
        }
        setSearchOptions(sc.cache.collection.filter(item =>  (item.symbol.match(new RegExp(filter, 'i')) || item.lonaName.match(new RegExp(filter, 'i')))));
    }

    const isSmall = () => /xs/.test(props.width);

    const drawer = (
        <aside>
            <div className={classes.toolbar} />

            <Grid container justify={"space-between"} direction={"column"} style={{height:'100vh'}}>
                <Grid item>

            <List>
                <Grid container justify={"space-between"} direction={"column"} style={{height:'250px'}}>
                    <Grid item>
                        <ListItem button component={NavLink} to="/dashboard" activeClassName="Mui-selected" exact>
                            <ListItemIcon>
                                <HomeOutlinedIcon color={"primary"}/>
                            </ListItemIcon>
                        </ListItem>
                    </Grid>

                    <Grid item>
                        <ListItem button component={NavLink} to="/portfolio" activeClassName="Mui-selected" exact>
                            <ListItemIcon>
                                <PieChartOutlinedIcon color={"primary"}/>
                            </ListItemIcon>
                        </ListItem>
                    </Grid>

                    <Grid item>
                        <ListItem button component={NavLink} to="/watchlist" activeClassName="Mui-selected" exact>
                            <ListItemIcon>
                               <BookmarkBorderOutlinedIcon color={"primary"}/>
                            </ListItemIcon>
                        </ListItem>
                    </Grid>

                    {isSmall() &&
                        <Grid item>
                            <Box p={1}>
                                <ToggleButtonGroup
                                    value={themeMode}
                                    exclusive
                                    onChange={handleThemeMode}
                                >
                                    <ToggleButton value="dark">
                                        <Brightness4OutlinedIcon/>
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                        </Grid>
                    }

                    <Grid item>
                        <ListItem button onClick={() => logout()}>
                            <ListItemIcon>
                                <ExitToAppOutlinedIcon/>
                            </ListItemIcon>
                        </ListItem>
                    </Grid>
                </Grid>
            </List>


                </Grid>

                <Grid container alignItems={"center"} justify={"center"} item style={{flexGrow: 1}}>
                    <Grid item>
                        <Box style={{transform: 'rotate(-90deg)'}}>
                            <Typography variant={'h6'} style={{whiteSpace: 'nowrap'}}>
                                Market status:&nbsp;
                                <span style={{color: marketStatus ? theme.palette.success.main : theme.palette.error.main}} onClick={handleMarketStatusToggle}>
                                {marketStatus ? 'open' : 'closed'}
                            </span>
                                {pos.position.marketStatusOverride !== null && <span>&nbsp;OVERRIDE</span>}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

            </Grid>

        </aside>
    );

    const variants = {
        reg: {width: '100%'},
        focus: {width : '120%', backgroundColor: theme.palette.background.paper}
    }

    const topbar = (
        <Grid container>
            <Grid container item md={6} xs={12}>
                {!isSmall() &&
                    <Grid item>
                        <Box p={1}>
                            <ToggleButtonGroup
                                value={themeMode}
                                exclusive
                                onChange={handleThemeMode}
                            >
                                <ToggleButton value="dark">
                                    <Brightness4OutlinedIcon/>
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Grid>
                }

                <Grid container item xs justify={"space-between"} alignItems={"center"}>

                    <Grid item xs={6}>
                        <motion.div
                            animate={searchFocused ? 'focus' : 'reg'}
                            variants={variants}
                        >
                        <Autocomplete

                                      onFocus={toggleSearchFocus}
                                      onBlur={toggleSearchFocus}
                            options={searchOptions}
                            onInputChange={(event, newInputValue) => {
                                searchStocks(newInputValue)
                            }}
                            onChange={(event, value) => history.push(`/stocks/${value.symbol}`)}
                            getOptionLabel={(option) => option.symbol}
                            filterOptions = {(option, value) => {
                                return option;
                            }}
                            renderInput={(params) => {
                                params.InputProps.startAdornment = <>
                                    <InputAdornment position="start" style={{marginRight:0}}>
                                        <SearchOutlinedIcon />
                                    </InputAdornment>
                                    {params.InputProps.startAdornment}
                                </>;
                                return <TextField {...params}
                                    size={isSmall() ? 'small' : 'medium'}
                                    variant={'outlined'}
                                    placeholder={'Search by symbol or name'}
                                />}}
                            renderOption={(option, { selected }) => (<div>
                                <Typography variant={'h6'}>{option.symbol}</Typography>
                                <Typography variant={'body1'}>{option.lonaName}</Typography>
                            </div>)}
                        />
                        </motion.div>
                    </Grid>

                    <Grid item>
                        <Box p={1}>
                            <Link to="/portfolio">
                                <Button size={isSmall() ? 'small' : 'medium'} variant="contained" startIcon={<AccountBalanceWalletOutlinedIcon/>}>
                                    SAR {funds ? formatNumber(funds.toFixed(0)) : ''}
                                </Button>
                            </Link>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Container style={{float: 'left'}}>
            <div className={classes.root}>
                <AppBar position="fixed" className={classes.appBar} elevation={0}>
                    <Toolbar>
                        <IconButton
                            color="default"
                            edge="start"
                            onClick={handleDrawerToggle}
                            className={classes.menuButton}
                        >
                            <MenuIcon/>
                        </IconButton>
                        {topbar}
                    </Toolbar>
                </AppBar>
                <nav className={classes.drawer}>
                    <Hidden smUp implementation="css">
                        <Drawer
                            container={container}
                            variant="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                            elevation={0}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                            elevation={0}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                </nav>
                <main className={classes.content}>

                    <div className={classes.toolbar} />
                    {props.children}

                </main>
            </div>
        </Container>
    );
};

export default withWidth()(Layout);
