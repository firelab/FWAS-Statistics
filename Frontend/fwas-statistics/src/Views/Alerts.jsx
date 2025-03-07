import * as React from 'react';
import CountCard from "../components/CountCard";
import Grid from '@mui/material/Grid2';
import DateTime from '../components/DateTime';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import AlertCharts from '../components/Charts/AlertCharts';
import WatchesMap from '../components/Maps/WatchesMap';
export default function Alerts(){
    const [alerts,setData] = useState([{}])
    const [map_locs,SetALocs] = useState([{}])
    useEffect(()=>{
        get_alerts_dashboard()
        get_alert_locs()
    },[])
    async function get_alerts_dashboard(){
        let api = await fetch("http://localhost:9091/alert_dashboard")
        let alert_json = await api.json()
        setData(alert_json) 
    }
    async function get_alert_locs(){
        let api = await fetch("http://localhost:9091/alerts_locations")
        let alert_locs = await api.json()
        SetALocs(alert_locs) 
    }
    return(
        <div className="container1"> 
            <br />
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <CountCard class1="cardUser" count={alerts.total_watches} title="Total Watches" />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <CountCard class1="cardUser" count={alerts.active_watches} title="Active Watches" />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <CountCard class1="cardUser" count={alerts.expired_watches} title="Expired Watches" />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <CountCard class1="cardUser" count={alerts.processing_watches} title="Watches in Process" />
                </Grid>
            </Grid>
            <br />
            <div id="chartdiv"></div>
            <WatchesMap/>
            <br/>
            <AlertCharts/>
        </div>
    );
}