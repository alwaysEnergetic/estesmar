import React, {useContext, useState} from "react";
import {SymbolCacheContext} from "../../services/symbol-cache";
import {Grid} from "@material-ui/core";
import {SectorChip} from "../SectorPage/sector-chip";
import {Skeleton} from "@material-ui/lab";

export function SymbolSectorchip (props) {
    const sc = useContext(SymbolCacheContext);

    const [cacheLoaded, setCacheLoaded] = useState(false);
    const [sector, setSector] = useState(null);

    if(!cacheLoaded) sc.cache.loaded.subscribe(() => {
        setCacheLoaded(true);
        setSector(sc.cache.getSectorForSymbol(props.symbol));
    });

    return (
        sector
            ?<Grid container>
              <Grid item><SectorChip value={sector}/></Grid>
            </Grid>
            : <Skeleton/>
    );
}
