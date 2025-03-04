
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
export default function DateTime(props){
    return(
        <div className="datetime">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker label={props.label} />
            </LocalizationProvider>
        </div>
    );
}