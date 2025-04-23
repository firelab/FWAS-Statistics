import * as React from 'react';
import Typography from '@mui/material/Typography';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LineHighlightPlot, LinePlot } from '@mui/x-charts/LineChart';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { useEffect, useState } from 'react';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import Grid from '@mui/material/Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import WatchesMap from "../components/Maps/WatchesMap";

export default function Home() {
    const [startDate, setStartDate] = React.useState(dayjs(new Date().setFullYear(new Date().getFullYear() - 1)));
    const [endDate, setEndDate] = React.useState(dayjs(new Date()));
    const [fwas_user, setUser] = useState([{}])
    const [fwas_alert,setAlert] = useState([{}])
    useEffect(() => {
        get_alert_charts()
    }, [])

    async function get_alert_charts() {
        let api = await fetch(import.meta.env.VITE_API+"/alerts_home?start_date=" + startDate.format('YYYY-MM-DD') + "&end_date=" + endDate.format('YYYY-MM-DD'))
        let api_user = await fetch(import.meta.env.VITE_API+"/user_summary?start_date=" + startDate.format('YYYY-MM-DD') + "&end_date=" + endDate.format('YYYY-MM-DD'))
        let alert_json = await api.json()
        setAlert(alert_json)
        console.log(alert_json[1])
        let user_json = await api_user.json()
        setUser(user_json)
        console.log(user_json[1])
    }
    const series2 = [
        {
            type: 'line',
            yAxisId: 'Alerts',
            label: 'Watches Created Per Day',
            color: 'blue',
            data: fwas_alert.map((day) => day.alerts_created),
            highlightScope: { highlight: 'item' },
        },
        {
            type: 'line',
            yAxisId: 'Total Alerts',
            label: 'Total Watches Created',
            color: 'green',
            data: fwas_alert.map((day) => day.cumulative_alerts),
            highlightScope: { highlight: 'item' },
        }
    ];
    const series1 = [
        {
            type: 'line',
            yAxisId: 'Users',
            label: 'Users Created Per Day',
            color: 'blue',
            data: fwas_user.map((day) => day.user_created),
            highlightScope: { highlight: 'item' },
        },
        {
            type: 'line',
            yAxisId: 'Total Users',
            label: 'Total Users Created',
            color: 'green',
            data: fwas_user.map((day) => day.cumulative_users),
            highlightScope: { highlight: 'item' },
        }
    ];
    console.log(series1)
    return (
        <div className="container1">
        <br/>
        <h1>Watch Locations</h1>
            <br />
            <Grid container >
                <Grid size={{ xs: 12, md: 5 }}>
                    <DatePicker label="start date" value={startDate} onChange={(newValue) => setStartDate(newValue)} />
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                    <DatePicker label="end date" value={endDate} onChange={(newValue) => setEndDate(newValue)} />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }} >
                    <Button id="btnSearch" variant="contained" color="success" onClick={get_alert_charts} >submit</Button>
                </Grid>
            </Grid>
            <br />
            <br />
            <div id="chartdiv"></div>
            <br />
            <WatchesMap />
            <br />
            <br />
            <div style={{ width: '100%' }}>
                {/* <Typography>User Created</Typography> */}
                <br/>
                <div>
                    <ResponsiveChartContainer series={series1} height={400} margin={{ top: 10 }}
                        xAxis={[{ id: 'date', data: fwas_user.map((day) => new Date(day.date)), scaleType: 'band', valueFormatter: (value) => value.toLocaleDateString(), },]}
                        yAxis={[{ id: 'Users', scaleType: 'linear', }, { id: 'Total Users', scaleType: 'linear', }]}>
                        <ChartsAxisHighlight x="line" />
                        <BarPlot />
                        <LinePlot />
                        <LineHighlightPlot />
                        <ChartsXAxis position="bottom" axisId="date" tickInterval={(value, index) => { return index % 30 === 0; }} tickLabelStyle={{ fontSize: 10, }} />
                        <ChartsYAxis label="Users created per day" position="left" axisId="Users" tickLabelStyle={{ fontSize: 10 }} sx={{ [`& .${axisClasses.label}`]: { transform: 'translateX(-5px)', }, }} />
                        <ChartsYAxis label="Total Users" position="right" axisId="Total Users" tickLabelStyle={{ fontSize: 10 }} sx={{ [`& .${axisClasses.label}`]: { transform: 'translateX(5px)', }, }} />
                        <ChartsTooltip />
                    </ResponsiveChartContainer>
                </div>
            </div>
            <div style={{ width: '100%' }}>
            <br/>
                {/* <Typography>Alerts Created</Typography> */}
                <div>
                    <ResponsiveChartContainer series={series2} height={400} margin={{ top: 10 }}
                        xAxis={[{ id: 'date1', data: fwas_alert.map((day) => new Date(day.date)), scaleType: 'band', valueFormatter: (value) => value.toLocaleDateString(), },]}
                        yAxis={[{ id: 'Alerts', scaleType: 'linear', }, { id: 'Total Alerts', scaleType: 'linear', }]}>
                        <ChartsAxisHighlight x="line" />
                        <BarPlot />
                        <LinePlot />
                        <LineHighlightPlot />
                        <ChartsXAxis  position="bottom" axisId="date1" tickInterval={(value, index) => { return index % 30 === 0; }} tickLabelStyle={{ fontSize: 10, }} />
                        <ChartsYAxis label="Watches created per day" position="left" axisId="Alerts" tickLabelStyle={{ fontSize: 10 }} sx={{ [`& .${axisClasses.label}`]: { transform: 'translateX(-5px)', }, }} />
                        <ChartsYAxis label="Total Watches" position="right" axisId="Total Alerts" tickLabelStyle={{ fontSize: 10 }} sx={{ [`& .${axisClasses.label}`]: { transform: 'translateX(5px)', }, }} />
                        <ChartsTooltip />
                    </ResponsiveChartContainer>
                </div>
            </div>
        </div>
    );
}