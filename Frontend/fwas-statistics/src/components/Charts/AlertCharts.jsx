import Typography from '@mui/material/Typography';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LineHighlightPlot, LinePlot } from '@mui/x-charts/LineChart';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import Grid from '@mui/material/Grid2';

import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

import fwas from './fwas.json'
import alerts from './alerts.json'


export default function AlertCharts() {
  const windSpeed = [
    {
      type: 'bar',
      yAxisId: 'Alerts/Day',
      label: 'Wind Speed Alerts /Day',
      color: 'grey',
      data: alerts.map((day) => day["Wind Speed"]),
      highlightScope: { highlight: 'item' },
    },
    {
      type: 'line',
      yAxisId: 'Total Alerts',
      label: 'Total Wind Speed Alerts',
      color: 'green',
      data: alerts.map((day) => day.cumulative_Wind_Speed),
    },
  ];

  const windGust = [
    {
      type: 'bar',
      yAxisId: 'Alerts/Day',
      label: 'Wind Gust Alerts/Day',
      color: 'grey',
      data: alerts.map((day) => day["Wind Gust"]),
      highlightScope: { highlight: 'item' },
    },
    {
      type: 'line',
      yAxisId: 'Total Alerts',
      label: 'Total Wind Gust Alerts',
      color: 'green',
      data: alerts.map((day) => day.cumulative_Wind_Gust),
    },
  ];

  const Precipitation = [
    {
      type: 'bar',
      yAxisId: 'Alerts/Day',
      label: 'Precipitation/Day',
      color: 'grey',
      data: alerts.map((day) => day.Precipitation),
      highlightScope: { highlight: 'item' },
    },
    {
      type: 'line',
      yAxisId: 'Total Alerts',
      label: 'Total Precipitation Alerts',
      color: 'green',
      data: alerts.map((day) => day.cumulative_Precipitation),
    },
  ];
  const FloodWarning = [
    {
      type: 'bar',
      yAxisId: 'Alerts/Day',
      label: 'Flood Warning/Day',
      color: 'grey',
      data: alerts.map((day) => day['Flood Warning']),
      highlightScope: { highlight: 'item' },
    },
    {
      type: 'line',
      yAxisId: 'Total Alerts',
      label: 'Total Flood Warning Alerts',
      color: 'green',
      data: alerts.map((day) => day.cumulative_Flood_Warning),
    },
  ];
  const FloodAdvisory = [
    {
      type: 'bar',
      yAxisId: 'Alerts/Day',
      label: 'Flood Advisory/Day',
      color: 'grey',
      data: alerts.map((day) => day['Flood Advisory']),
      highlightScope: { highlight: 'item' },
    },
    {
      type: 'line',
      yAxisId: 'Total Alerts',
      label: 'Total Flood Advisory Alerts',
      color: 'green',
      data: alerts.map((day) => day.cumulative_Flood_Advisory),
    },
  ];
  const FloodWatch = [
    {
      type: 'bar',
      yAxisId: 'Alerts/Day',
      label: 'Flood Watch/Day',
      color: 'grey',
      data: alerts.map((day) => day['Flood Watch']),
      highlightScope: { highlight: 'item' },
    },
    {
      type: 'line',
      yAxisId: 'Total Alerts',
      label: 'Total Flood Watch Alerts',
      color: 'green',
      data: alerts.map((day) => day.cumulative_Flood_Watch),
    },
  ];
  const SpecialWeatherStatement = [
    {
      type: 'bar',
      yAxisId: 'Alerts/Day',
      label: 'Special Weather Statement/Day',
      color: 'grey',
      data: alerts.map((day) => day['Special Weather Statement']),
      highlightScope: { highlight: 'item' },
    },
    {
      type: 'line',
      yAxisId: 'Total Alerts',
      label: 'Total Special Weather Statement Alerts',
      color: 'green',
      data: alerts.map((day) => day.cumulative_Special_Weather_Statement),
    },
  ];
  const WinterWeatherAdvisory = [
    {
      type: 'bar',
      yAxisId: 'Alerts/Day',
      label: 'Winter Weather Advisory/Day',
      color: 'grey',
      data: alerts.map((day) => day['Winter Weather Advisory']),
      highlightScope: { highlight: 'item' },
    },
    {
      type: 'line',
      yAxisId: 'Total Alerts',
      label: 'Total Winter Weather Advisory Alerts',
      color: 'green',
      data: alerts.map((day) => day.cumulative_Winter_Weather_Advisory),
    },
  ];
  return (
    <>
      <Grid container >
        <div style={{ width: '50%' }}>
          <Typography>Wind Speed Alerts</Typography>
          <div>
            <ResponsiveChartContainer series={windSpeed} height={400} margin={{ top: 10 }}
              xAxis={[{id: 'date',data: alerts.map((day) => new Date(day.date)),scaleType: 'band',valueFormatter: (value) => value.toLocaleDateString(),},]}
              yAxis={[{id: 'Alerts/Day', scaleType: 'linear',},{id: 'Total Alerts',scaleType: 'linear',}]}>
              <ChartsAxisHighlight x="line" />
              <BarPlot />
              <LinePlot />
              <LineHighlightPlot />
              <ChartsXAxis label="date" position="bottom" axisId="date" tickInterval={(value, index) => {  return index % 30 === 0;}}tickLabelStyle={{  fontSize: 10,}} />
              <ChartsYAxis label="Alerts/Day" position="left" axisId="Alerts/Day" tickLabelStyle={{ fontSize: 10 }} sx={{[`& .${axisClasses.label}`]: {  transform: 'translateX(-5px)',},}}/>
              <ChartsYAxis label="Total Alerts" position="right" axisId="Total Alerts" tickLabelStyle={{ fontSize: 10 }} sx={{[`& .${axisClasses.label}`]: {  transform: 'translateX(5px)',},}}/>
              <ChartsTooltip />
            </ResponsiveChartContainer>
          </div>
        </div>
        <div style={{ width: '50%' }}>
          <Typography>Wind Gust</Typography>
          <div>
            <ResponsiveChartContainer series={windGust} height={400} margin={{ top: 10 }}
              xAxis={[{id: 'date',data: alerts.map((day) => new Date(day.date)),scaleType: 'band',valueFormatter: (value) => value.toLocaleDateString(),},]}
              yAxis={[{id: 'Alerts/Day', scaleType: 'linear',},{id: 'Total Alerts',scaleType: 'linear',}]}>
              <ChartsAxisHighlight x="line" />
              <BarPlot />
              <LinePlot />
              <LineHighlightPlot />
              <ChartsXAxis label="date" position="bottom" axisId="date" tickInterval={(value, index) => {  return index % 30 === 0;}}tickLabelStyle={{  fontSize: 10,}} />
              <ChartsYAxis label="Alerts/Day" position="left" axisId="Alerts/Day" tickLabelStyle={{ fontSize: 10 }} sx={{[`& .${axisClasses.label}`]: {  transform: 'translateX(-5px)',},}}/>
              <ChartsYAxis label="Total Alerts" position="right" axisId="Total Alerts" tickLabelStyle={{ fontSize: 10 }} sx={{[`& .${axisClasses.label}`]: {  transform: 'translateX(5px)',},}}/>
              <ChartsTooltip />
            </ResponsiveChartContainer>
          </div>
        </div>
      </Grid>
      <Grid container >
        <div style={{ width: '50%' }}>
          <Typography>Precipitation</Typography>
          <div>
            <ResponsiveChartContainer series={Precipitation} height={400} margin={{ top: 10 }}
              xAxis={[{id: 'date',data: alerts.map((day) => new Date(day.date)),scaleType: 'band',valueFormatter: (value) => value.toLocaleDateString(),},]}
              yAxis={[{id: 'Alerts/Day', scaleType: 'linear',},{id: 'Total Alerts',scaleType: 'linear',}]}>
              <ChartsAxisHighlight x="line" />
              <BarPlot />
              <LinePlot />
              <LineHighlightPlot />
              <ChartsXAxis label="date" position="bottom" axisId="date" tickInterval={(value, index) => {  return index % 30 === 0;}}tickLabelStyle={{  fontSize: 10,}} />
              <ChartsYAxis label="Alerts/Day" position="left" axisId="Alerts/Day" tickLabelStyle={{ fontSize: 10 }} sx={{[`& .${axisClasses.label}`]: {  transform: 'translateX(-5px)',},}}/>
              <ChartsYAxis label="Total Alerts" position="right" axisId="Total Alerts" tickLabelStyle={{ fontSize: 10 }} sx={{[`& .${axisClasses.label}`]: {  transform: 'translateX(5px)',},}}/>
              <ChartsTooltip />
            </ResponsiveChartContainer>
          </div>
        </div>
        <div style={{ width: '50%' }}>
          <Typography>Flood Warning</Typography>
          <div>
            <ResponsiveChartContainer series={FloodWarning} height={400} margin={{ top: 10 }}
              xAxis={[{id: 'date',data: alerts.map((day) => new Date(day.date)),scaleType: 'band',valueFormatter: (value) => value.toLocaleDateString(),},]}
              yAxis={[{id: 'Alerts/Day', scaleType: 'linear',},{id: 'Total Alerts',scaleType: 'linear',}]}>
              <ChartsAxisHighlight x="line" />
              <BarPlot />
              <LinePlot />
              <LineHighlightPlot />
              <ChartsXAxis label="date" position="bottom" axisId="date" tickInterval={(value, index) => {  return index % 30 === 0;}}tickLabelStyle={{  fontSize: 10,}} />
              <ChartsYAxis label="Alerts/Day" position="left" axisId="Alerts/Day" tickLabelStyle={{ fontSize: 10 }} sx={{[`& .${axisClasses.label}`]: {  transform: 'translateX(-5px)',},}}/>
              <ChartsYAxis label="Total Alerts" position="right" axisId="Total Alerts" tickLabelStyle={{ fontSize: 10 }} sx={{[`& .${axisClasses.label}`]: {  transform: 'translateX(5px)',},}}/>
              <ChartsTooltip />
            </ResponsiveChartContainer>
          </div>
        </div>
      </Grid>
      <Grid container >
        <div style={{ width: '50%' }}>
          <Typography>Flood Advisory</Typography>
          <div>
            <ResponsiveChartContainer series={FloodAdvisory} height={400} margin={{ top: 10 }}
              xAxis={[{id: 'date',data: alerts.map((day) => new Date(day.date)),scaleType: 'band',valueFormatter: (value) => value.toLocaleDateString(),},]}
              yAxis={[{id: 'Alerts/Day', scaleType: 'linear',},{id: 'Total Alerts',scaleType: 'linear',}]}>
              <ChartsAxisHighlight x="line" />
              <BarPlot />
              <LinePlot />
              <LineHighlightPlot />
              <ChartsXAxis label="date" position="bottom" axisId="date" tickInterval={(value, index) => {  return index % 30 === 0;}}tickLabelStyle={{  fontSize: 10,}} />
              <ChartsYAxis label="Alerts/Day" position="left" axisId="Alerts/Day" tickLabelStyle={{ fontSize: 10 }} sx={{[`& .${axisClasses.label}`]: {  transform: 'translateX(-5px)',},}}/>
              <ChartsYAxis label="Total Alerts" position="right" axisId="Total Alerts" tickLabelStyle={{ fontSize: 10 }} sx={{[`& .${axisClasses.label}`]: {  transform: 'translateX(5px)',},}}/>
              <ChartsTooltip />
            </ResponsiveChartContainer>
          </div>
        </div>
        <div style={{ width: '50%' }}>
          <Typography>Flood Watch</Typography>
          <div>
            <ResponsiveChartContainer series={FloodWatch} height={400} margin={{ top: 10 }}
              xAxis={[{id: 'date',data: alerts.map((day) => new Date(day.date)),scaleType: 'band',valueFormatter: (value) => value.toLocaleDateString(),},]}
              yAxis={[{id: 'Alerts/Day', scaleType: 'linear',},{id: 'Total Alerts',scaleType: 'linear',}]}>
              <ChartsAxisHighlight x="line" />
              <BarPlot />
              <LinePlot />
              <LineHighlightPlot />
              <ChartsXAxis label="date" position="bottom" axisId="date" tickInterval={(value, index) => {  return index % 30 === 0;}}tickLabelStyle={{  fontSize: 10,}} />
              <ChartsYAxis label="Alerts/Day" position="left" axisId="Alerts/Day" tickLabelStyle={{ fontSize: 10 }} sx={{[`& .${axisClasses.label}`]: {  transform: 'translateX(-5px)',},}}/>
              <ChartsYAxis label="Total Alerts" position="right" axisId="Total Alerts" tickLabelStyle={{ fontSize: 10 }} sx={{[`& .${axisClasses.label}`]: {  transform: 'translateX(5px)',},}}/>
              <ChartsTooltip />
            </ResponsiveChartContainer>
          </div>
        </div>
      </Grid>
      <Grid container >
        <div style={{ width: '50%' }}>
          <Typography>Special Weather Statement</Typography>
          <div>
            <ResponsiveChartContainer series={SpecialWeatherStatement} height={400} margin={{ top: 10 }}
              xAxis={[{id: 'date',data: alerts.map((day) => new Date(day.date)),scaleType: 'band',valueFormatter: (value) => value.toLocaleDateString(),},]}
              yAxis={[{id: 'Alerts/Day', scaleType: 'linear',},{id: 'Total Alerts',scaleType: 'linear',}]}>
              <ChartsAxisHighlight x="line" />
              <BarPlot />
              <LinePlot />
              <LineHighlightPlot />
              <ChartsXAxis label="date" position="bottom" axisId="date" tickInterval={(value, index) => {  return index % 30 === 0;}}tickLabelStyle={{  fontSize: 10,}} />
              <ChartsYAxis label="Alerts/Day" position="left" axisId="Alerts/Day" tickLabelStyle={{ fontSize: 10 }} sx={{[`& .${axisClasses.label}`]: {  transform: 'translateX(-5px)',},}}/>
              <ChartsYAxis label="Total Alerts" position="right" axisId="Total Alerts" tickLabelStyle={{ fontSize: 10 }} sx={{[`& .${axisClasses.label}`]: {  transform: 'translateX(5px)',},}}/>
              <ChartsTooltip />
            </ResponsiveChartContainer>
          </div>
        </div>
        <div style={{ width: '50%' }}>
          <Typography>Winter Weather Advisory</Typography>
          <div>
            <ResponsiveChartContainer series={WinterWeatherAdvisory} height={400} margin={{ top: 10 }}
              xAxis={[{id: 'date',data: alerts.map((day) => new Date(day.date)),scaleType: 'band',valueFormatter: (value) => value.toLocaleDateString(),},]}
              yAxis={[{id: 'Alerts/Day', scaleType: 'linear',},{id: 'Total Alerts',scaleType: 'linear',}]}>
              <ChartsAxisHighlight x="line" />
              <BarPlot />
              <LinePlot />
              <LineHighlightPlot />
              <ChartsXAxis label="date" position="bottom" axisId="date" tickInterval={(value, index) => {  return index % 30 === 0;}}tickLabelStyle={{  fontSize: 10,}} />
              <ChartsYAxis label="Alerts/Day" position="left" axisId="Alerts/Day" tickLabelStyle={{ fontSize: 10 }} sx={{[`& .${axisClasses.label}`]: {  transform: 'translateX(-5px)',},}}/>
              <ChartsYAxis label="Total Alerts" position="right" axisId="Total Alerts" tickLabelStyle={{ fontSize: 10 }} sx={{[`& .${axisClasses.label}`]: {  transform: 'translateX(5px)',},}}/>
              <ChartsTooltip />
            </ResponsiveChartContainer>
          </div>
        </div>
      </Grid>
    </>
  );
}