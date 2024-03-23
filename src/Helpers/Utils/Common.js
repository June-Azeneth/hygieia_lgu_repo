import Box from '@mui/material/Box';
import NoData from '../../Assets/no_data.png'
import { SyncLoader, BeatLoader } from 'react-spinners';
import moment from 'moment';
import { Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export const currentDateTimestamp = Timestamp.now();

export function formatDate(timestamp) {
    return new Date(timestamp?.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatMomentArray(momentArray) {
    const startDate = momentArray[0].format('YYYY-MMM-DD');
    const endDate = momentArray[momentArray.length - 1].format('YYYY-MMM-DD');
    return `From ${startDate} To ${endDate}`;
}

export function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <div>{children}</div>
                </Box>
            )}
        </div>
    );
}

export function showLoader() {
    return (
        <SyncLoader
            color="#617C49"
        />
    );
}

export function showNoDataView() {
    return (
        <div className="flex flex-col items-center gap-5 w-full">
            <img src={NoData} alt="no data to show" className='w-[20rem] h-auto'></img>
            <h3 className='font-bold '>No Data To Show</h3>
        </div>
    )
}

export function emailSentSuccessfully() {
    return (
        <BeatLoader
            color="#5F8604"
        />
    )
}