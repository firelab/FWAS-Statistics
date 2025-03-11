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


export default function UserCharts() {
  const [startDate, setStartDate] = React.useState(dayjs(new Date().setFullYear(new Date().getFullYear() - 1)));
  const [endDate, setEndDate] = React.useState(dayjs(new Date()));
  const [fwas,setData] = useState([{}])
  useEffect(()=>{
    get_user_charts()
  },[])
  
  async function get_user_charts(){
    let api = await fetch(import.meta.env.VITE_API+"/user_summary?start_date=" +startDate.format('YYYY-MM-DD') +"&end_date=" +endDate.format('YYYY-MM-DD'))
    let user_json = await api.json()
    setData(user_json) 
  }
  
  const series = [
    {
      type: 'bar',
      yAxisId: 'Users',
      label: 'Users Last Active',
      color: 'grey',
      data: fwas.map((day) => day.user_last_updated),
      highlightScope: { highlight: 'item' },
    },
    {
      type: 'line',
      yAxisId: 'Alerts/Watches',
      label: 'Watches/User',
      color: 'black',
      data: fwas.map((day) => day.avg_alerts_per_user),
    },
    {
      type: 'line',
      yAxisId: 'Alerts/Watches',
      label: 'Alerts/User',
      color: 'green',
      data: fwas.map((day) => day.avg_alert_history_per_user),
    },
  ];
  const series1 = [
    {
      type: 'line',
      yAxisId: 'Users',
      label: 'Users Created',
      color: 'blue',
      data: fwas.map((day) => day.user_created),
      highlightScope: { highlight: 'item' },
    },
    {
      type: 'line',
      yAxisId: 'Total Users',
      label: 'Total Users Created',
      color: 'green',
      data: fwas.map((day) => day.cumulative_users),
      highlightScope: { highlight: 'item' },
    }
  ];
  return (
    <>
    <Grid container >
        <Grid size={{ xs: 12, md: 5 }}>
            <DatePicker label="start date" value={startDate} onChange={(newValue) => setStartDate(newValue)}/>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
            <DatePicker label="end date" value={endDate} onChange={(newValue) => setEndDate(newValue)} />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }} >
            <Button id="btnSearch" variant="contained" color="success" onClick={get_user_charts} >submit</Button>
        </Grid>
    </Grid>
    <br/>
    <div style={{ width: '100%' }}>
      <Typography>User Charts</Typography>
      <div>
        <ResponsiveChartContainer series={series} height={400} margin={{ top: 10 }}
          xAxis={[{id: 'date',data: fwas.map((day) => new Date(day.date)),scaleType: 'band',valueFormatter: (value) => value.toLocaleDateString(),},]}
          yAxis={[{id: 'Users', scaleType: 'linear',},{id: 'Alerts/Watches',scaleType: 'linear',}]}>
          <ChartsAxisHighlight x="line" />
          <BarPlot />
          <LinePlot />
          <LineHighlightPlot />
          <ChartsXAxis label="date" position="bottom" axisId="date" tickInterval={(value, index) => {  return index % 30 === 0;}}tickLabelStyle={{  fontSize: 10,}} />
          <ChartsYAxis label="Users" position="left" axisId="Users" tickLabelStyle={{ fontSize: 10 }} sx={{[`& .${axisClasses.label}`]: {  transform: 'translateX(-5px)',},}}/>
          <ChartsYAxis label="Alerts/Watches" position="right" axisId="Alerts/Watches" tickLabelStyle={{ fontSize: 10 }} sx={{[`& .${axisClasses.label}`]: {  transform: 'translateX(5px)',},}}/>
          <ChartsTooltip />
        </ResponsiveChartContainer>
      </div>
    </div>
    <div style={{ width: '100%' }}>
      <Typography>User Created</Typography>
      <div>
        <ResponsiveChartContainer series={series1} height={400} margin={{ top: 10 }}
          xAxis={[{  id: 'date',  data: fwas.map((day) => new Date(day.date)),  scaleType: 'band',  valueFormatter: (value) => value.toLocaleDateString(),},]}
          yAxis={[{  id: 'Users',  scaleType: 'linear',},{  id: 'Total Users',  scaleType: 'linear',}]}>
          <ChartsAxisHighlight x="line" />
          <BarPlot />
          <LinePlot />
          <LineHighlightPlot />
          <ChartsXAxis label="date" position="bottom" axisId="date" tickInterval={(value, index) => {return index % 30 === 0;}} tickLabelStyle={{fontSize: 10,}}/>
          <ChartsYAxis label="Users" position="left" axisId="Users" tickLabelStyle={{ fontSize: 10 }} sx={{[`& .${axisClasses.label}`]: {  transform: 'translateX(-5px)',},}}/>
          <ChartsYAxis label="Total Users" position="right" axisId="Total Users" tickLabelStyle={{ fontSize: 10 }} sx={{[`& .${axisClasses.label}`]: {  transform: 'translateX(5px)',},}}/>
          <ChartsTooltip />
        </ResponsiveChartContainer>
      </div>
    </div>
    </>
  );
}