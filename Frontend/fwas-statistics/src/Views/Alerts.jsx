import * as React from 'react';
import CountCard from "../components/CountCard";
import Grid from '@mui/material/Grid2';
import DateTime from '../components/DateTime';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import AlertCharts from '../components/Charts/AlertCharts';
export default function Alerts(){
    const total_alerts = 11900
    const active_alerts = 9877
    const expired_alerts = 1123
    const processing_alerts = 973
    const [alerts,setData] = useState([{}])
          useEffect(()=>{
            get_alerts_dashboard()
          },[])
          async function get_alerts_dashboard(){
            let api = await fetch("http://localhost:5000/alert_dashboard")
            let alert_json = await api.json()
            setData(alert_json) 
          }
    const [startDate, setStartDate] = React.useState(dayjs('2022-04-17T15:30'));
    const [endDate, setEndDate] = React.useState(dayjs('2022-04-17T16:30'));
    return(
        <div className="container1"> 
            <br />
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <CountCard class1="cardUser" count={alerts.total_alerts} title="Total Alerts" />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <CountCard class1="cardUser" count={alerts.active_alerts} title="Active Alerts" />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <CountCard class1="cardUser" count={alerts.expired_alerts} title="Expired Alerts" />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <CountCard class1="cardUser" count={alerts.processing_alerts} title="Processing Alerts" />
                </Grid>
            </Grid>
            <br />
            <Grid container >
                <Grid size={{ xs: 12, md: 6 }}>
                    <DateTime
                        label="start time"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <DateTime
                        label="end time"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                    />
                </Grid>
            </Grid>
            <br />
            <AlertCharts/>
        </div>
    );
}