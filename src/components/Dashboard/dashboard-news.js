import React, {useContext, useEffect, useState} from "react";
import BoxPaper from "../Elements/BoxPaper";
import {Box, Card, CardContent, CardHeader, CardMedia, Grid, Link, Typography} from "@material-ui/core";
import {ApiContext} from "../../services/rapidapi";

export function DashboardNews (props) {

    const [items, setItems] = useState([]);

    const ac = useContext(ApiContext);

    useEffect(() => {
        /*ac.api.getNews$('Saudi stock market', 'Month', 8).subscribe(result => {
            setItems(result.value)
        });*/

        ac.api.getArticles$(3).subscribe(result => {
            setItems(result)
        });


    }, []);

    const formatDate = s => new Date(s).toLocaleDateString(undefined, { dateStyle: 'long' });

    return (
        <>
            <Typography variant={'h6'}>Recent Articles</Typography>
            <Grid container spacing={1}>
                {items && items.map((item) => (
                    <Grid item style={{width:'100%'}}>
                        <Card>
                            <CardHeader title={<Link href={item.link} color={"textPrimary"} style={{display:'inline-block',margin:'-16px',padding:'16px'}}>{item.title}</Link>}
                                        titleTypographyProps={{variant:"h6"}}
                            />
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
        /*<>
            <Typography variant={'h6'}>Recent News</Typography>
            <Grid container spacing={1}>
            {items && items.map((item) => (
                <Grid item>
                    <Card>
                        <CardHeader title={<Link href={item.url} color={"textPrimary"}>{item.name}</Link>}
                                    subheader={`${item.provider[0].name}, ${formatDate(item.datePublished)}`}
                                    titleTypographyProps={{variant:"h6"}}
                        />
                        <Grid container alignItems={"stretch"}>
                            <Grid item md>
                                <CardContent>
                                    {item.description}
                                </CardContent>
                            </Grid>
                            {item.image && <Grid item md={3}>
                                <Box pb={2} pr={2} style={{height: '100%'}}>
                                    <CardMedia image={item.image.thumbnail.contentUrl} style={{height: '100%'}}/>
                                </Box>
                            </Grid>}
                        </Grid>
                    </Card>
                </Grid>
            ))}
            </Grid>
        </>*/
    );

}
