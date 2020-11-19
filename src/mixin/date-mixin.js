import moment_timezone from 'moment-timezone';
import {DATE_TIME_FORMAT} from '@/constants';

export default {

    methods: {
        convertToLocalDate(date, timezone = Intl.DateTimeFormat().resolvedOptions().timeZone) { // get current timezone or pass custom one
            return date ?
                moment_timezone
                    .utc(date)
                    .tz(timezone)
                    .format(DATE_TIME_FORMAT)
                : ''; // convert to tz date time
        }
    }
};