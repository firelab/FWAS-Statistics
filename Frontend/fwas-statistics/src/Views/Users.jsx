import * as React from 'react';
import CountCard from "../components/CountCard";
import Grid from '@mui/material/Grid2';
import DateTime from '../components/DateTime';
import dayjs from 'dayjs';
import UserCharts from '../components/Charts/UserCharts';
function Users() {
    const total_users = 98
    const active_users = 49
    const inactive_users = 21
    const agencies = 51
    const job_titles = 51
    const ph_providers = 53
    const [startDate, setStartDate] = React.useState(dayjs('2022-04-17T15:30'));
    const [endDate, setEndDate] = React.useState(dayjs('2022-04-17T16:30'));
    return (
        <div className="container1">
            <br />
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 2 }}>
                    <CountCard class1="cardUser" count={total_users} title="Total Users" />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                    <CountCard class1="cardUser" count={active_users} title="Active Users" />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                    <CountCard class1="cardUser" count={inactive_users} title="Inactive Users" />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                    <CountCard class1="cardUser" count={agencies} title="Agencies" />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                    <CountCard class1="cardUser" count={job_titles} title="Job Titles" />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                    <CountCard class1="cardUser" count={ph_providers} title="Phone Providers" />
                </Grid>
            </Grid>
            <br />
            <Grid container >
                <Grid size={{ xs: 12, md: 6 }}>
                    <DateTime label="start time" value={startDate} onChange={(newValue) => setStartDate(newValue)}/>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <DateTime label="end time" value={endDate} onChange={(newValue) => setEndDate(newValue)} />
                </Grid>
            </Grid>
            <br/>
            <UserCharts/>
        </div>
    );
}
export default Users