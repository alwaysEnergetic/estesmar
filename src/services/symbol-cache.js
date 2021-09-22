import React from "react";
import {getDatabase, onValue, ref} from 'firebase/database'
import {ReplaySubject} from "rxjs";


const { createContext } = React;

export const SymbolCacheContext = createContext(null);

export class SymbolCache {

    collection = [];
    loaded = new ReplaySubject(1);
    inited = false;

    constructor() {
        this.inited = true;
        let gref = ref(getDatabase(), "/");
        if (this.collection.length === 0) {
            onValue(gref, (snapshot) => {
                snapshot.val().map((index) => {
                    this.collection.push(index);
                });
                this.loaded.next();
            });
        }
    }

    init(){

    }

    getSectors(){
        let ret = [];
        for(let item of this.collection){
            if(!ret.includes(item.sector)) ret.push(item.sector);
        }
        return ret;
    }

    getItemsForSector(sectorName){
        let ret = [];
        for(let item of this.collection){
            if(item.sector == sectorName) ret.push(item);
        }
        return ret;
    }

    getSectorForSymbol(symbol){
        let ret =  this.collection.filter(value => value.symbol == symbol);
        return ret.length > 0 ? ret[0].sector : null;
    }

}

export const SymbolCacheProvider = (props) => {

    const value = {
        cache: new SymbolCache()
    };

    return (
        <SymbolCacheContext.Provider value={value}>
            {props.children}
        </SymbolCacheContext.Provider>
    );
};



