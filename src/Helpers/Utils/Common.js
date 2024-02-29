import Box from '@mui/material/Box';
import NoData from '../../Assets/no_data.png'
import { PulseLoader, BeatLoader } from 'react-spinners';
import { FaPaperPlane } from "react-icons/fa";
import { GoAlertFill } from "react-icons/go";
import Modal from '@mui/material/Modal';
import { Timestamp } from 'firebase/firestore';

export const currentDateTimestamp = Timestamp.now();

export function formatDate(timestamp) {
    return new Date(timestamp?.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
        <PulseLoader
            color="#5F8604"
        />
    );
}

export function showNoDataView() {
    return (
        <div className="flex flex-col items-center gap-5">
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