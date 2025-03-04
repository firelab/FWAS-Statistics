import Typography from '@mui/material/Typography';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LineHighlightPlot, LinePlot } from '@mui/x-charts/LineChart';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';

import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";

import fwas from './fwas.json'


export default function AlertCharts() {


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
      label: 'Total Users',
      color: 'green',
      data: fwas.map((day) => day.cumulative_users),
      highlightScope: { highlight: 'item' },
    }
  ];
  return (
    <>
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