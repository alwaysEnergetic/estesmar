import {fromPromise} from "rxjs/internal-compatibility";
import React, {useContext, useEffect, useState} from "react";
import {ApiContext} from "./rapidapi";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {flatMap, map, mergeMap, take} from "rxjs/operators";
import {SymbolCacheContext} from "./symbol-cache";
import moment from 'moment-timezone';
import {ReplaySubject, Subject} from "rxjs";
import {InfiniteQueryObserver, QueryObserver} from "react-query";



const { createContext } = React;

export const PositionContext = createContext(null);

export const PositionProvider = (props) => {

    let ret = new PositionHistory();
    ret.api = useContext(ApiContext);
    ret.sc = useContext(SymbolCacheContext);

    const value = {
        position: ret,
    };

    return (
        <PositionContext.Provider value={value}>
            {props.children}
        </PositionContext.Provider>
    );
};


export class PositionRefetch {


}


export class PositionHistory {

    api = null;
    sc = null;

    marketStatusOverride = null;

    marketStatus$ = new ReplaySubject(1);
    currentFunds$ = new ReplaySubject(1);

    constructor() {
        this.marketStatus$.next(this.isMarketOpen());
    }

    getUser(){
        return getAuth().currentUser ? getAuth().currentUser.uid : null;
    }

    getUserCollection(){
        return doc(collection(getFirestore(), "users"), this.getUser());
    }

    getCache$(){
        return fromPromise(
            getDoc(this.getUserCollection())
        );
    }


    update$(value){
        return fromPromise(
            addDoc(collection(this.getUserCollection(), 'history'), {
                timestamp: new Date(),
                value: value,
            })
        );
    }

    sell$(pos, val){
        return fromPromise(
            deleteDoc(doc(collection(this.getUserCollection(), 'stocks'), pos))
        ).pipe(mergeMap(() => this.updateFunds$(val)));
    }

    buy$(pos, val){
        let nDoc = doc(collection(this.getUserCollection(), 'stocks'));
        return fromPromise(
            setDoc(nDoc, pos)
        ).pipe(mergeMap(() => this.updateFunds$(val)));
    }

    getCurrentFunds$(){
        this.getCache$().subscribe(value => {
            this.currentFunds$.next(parseFloat(value.data().currentfunds));
        })
        return this.currentFunds$;
    }

    updateFunds$(value){
        return fromPromise(
            updateDoc(this.getUserCollection(), {
                currentfunds: value,
            })
        ).pipe(mergeMap(v => {
            this.currentFunds$.next(parseFloat(value));
            return this.currentFunds$;
        }));
    }

    updateWatchlist(doc){
        updateDoc(this.getUserCollection(), doc);
    }

    loadHistory$(){
        return fromPromise(
            getDocs(collection(this.getUserCollection(), 'history'))
        );
    }

    loadStocks$(){
        return fromPromise(
            getDocs(collection(this.getUserCollection(), 'stocks'))
        );
    }

    isMarketReallyOpen(){
        let m = moment().tz('Asia/Baghdad');
        return m.day() < 5 && m.hour() >= 10 && m.hour() < 16;
    }

    isMarketOpen(){
        return this.marketStatusOverride !== null ? this.marketStatusOverride : this.isMarketReallyOpen();
    }

    setMarketStatusOverride(value){
        this.marketStatusOverride = value;
        this.marketStatus$.next(this.isMarketOpen());
    }

    recordPosition$(){
        return this.getTotalValue$().pipe(
            mergeMap(value => this.update$(value.sumWithFunds).pipe(map(v => value)))
        );
    }

    getTotalValue$(){
        let ret = new Subject();
        this.loadStocks$().subscribe((stocks) => {
            let total = stocks.docs;
            let items = [];
            let limit = 10;

            if(total.length === 0){
                this.getCache$().subscribe(value => {
                    let sumWithFunds = parseFloat(value.data().currentfunds);
                    ret.next({sum: sumWithFunds, sumWithFunds: sumWithFunds, data: items});
                });
                return;
            }

            const getSymbolsToQuery = () => {
                let itemCount = items.length;
                return total.filter((collection, index) => index >= itemCount && index < itemCount + limit).map(item => item.data().symbol)
            }

            let obs = this.api.api.getFetchBulkQuotesQuery$(getSymbolsToQuery(), {
                refetchOnWindowFocus: false,
                enabled: false,
                getNextPageParam: (lastPage, pages) => {
                    return getSymbolsToQuery()
                }
            });

            const listener = rq => {

                if (rq.data && rq.data.pages){
                    let newItems = [];
                    rq.data.pages.forEach((value) => {
                        newItems = newItems.concat(value.result)
                    });
                    items = newItems;

                    if(items.length < total.length){
                        obs.fetchNextPage();
                    }

                    if(items.length === total.length){
                        this.getCache$().subscribe(value => {
                            let sum = 0;
                            for(let i in total){
                                let doc = total[i];
                                sum += parseFloat(doc.data().shares * items[i].regularMarketPrice);
                            }

                            let sumWithFunds = parseFloat(value.data().currentfunds) + sum;
                            ret.next({sum: sum, sumWithFunds: sumWithFunds, data: items});
                        });
                    }
                }
            };

            obs.subscribe(listener);

            if(!obs.getCurrentResult().data) {
                obs.fetchNextPage();
            }else {
                listener(obs.getCurrentResult());
            }
        });
        return ret.pipe(take(1));
    }


}




export function usePosition(){

    const pos = useContext(PositionContext);
    const ac = useContext(ApiContext);

    const [items, setItems] = useState([]);
    const [total, setTotal] = useState([]);
    const [canFetch, setCanFetch] = useState(false);
    const [callback, setCallback] = useState(null);
    const [doUpdate, setDoUpdate] = useState(true);

    let itemCount = items.length;
    let limit = 10;

    const getSymbolsToQuery = () => {
        return total.filter((collection, index) => index >= itemCount && index < itemCount + limit).map(item => item.data().symbol)
    }

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
    })();

    const reset = () => {
        setCanFetch(true);
        setItems([]);
    }

    const postUpdate = (sum) => {
        if(callback){
            if(doUpdate){
                pos.position.update$(sum).subscribe(value1 => {
                    callback();
                    reset();
                });
            } else {
                callback(sum);
                reset();
            }
        }
    }

    useEffect(()=> {

    }, []);

    useEffect(()=> {


        if(canFetch && total.length == 0){
            postUpdate(100000);
        }

        if(!pos.position.getUser()) return;

        if(canFetch && total.length > 0 && itemCount < total.length){
            setCanFetch(false);
            fetchNextPage();
        }

        if(!canFetch && data && data.pages && !isFetching && itemCount < total.length){
            let newItems = [];
            data.pages.forEach((value) => {
                newItems = newItems.concat(value.result)
            });
            setCanFetch(true);
            setItems(newItems);
        }

        if(total.length > 0 && itemCount == total.length){

            pos.position.getCache$().subscribe(value => {
                let sum = parseFloat(value.data().currentfunds);
                for(let i in total){
                    let doc = total[i];
                    sum += parseFloat(doc.data().shares * items[i].regularMarketPrice);
                }
                if(callback){
                    postUpdate(sum);
                }
            });
        }

    }, [total, data, canFetch]);

    const handleUpdate = (f, noUpdate) => {
        pos.position.loadStocks$().subscribe((v) => {
            reset();
            setCallback( () => f);
            setDoUpdate(!noUpdate);
            setTotal(v.docs);
        });
    }

    return handleUpdate;
}

export function UsePosition(props) {
    return props.children(usePosition());
}
