import React, { useState } from 'react'
import {
    Typography,
    DatePicker,
    Button,
    Card,
} from 'antd'
import moment from 'moment'
import RevenueStatic from './RevenueStatic'
import CodStatic from './CodStatic'
import { momentObjectToTimestamp } from '../../utils/common'
const { RangePicker } = DatePicker;
const { Title } = Typography;
const dateFormat = 'DD/MM/YYYY';

export default function Dashboard() {
    const [fromDate, setFromDate] = useState(moment().add(-60, 'days'));
    const [endDate, setEndDate] = useState(moment());
    const [rangerDate, setRangerDate] = useState([momentObjectToTimestamp(fromDate), momentObjectToTimestamp(endDate)]);
    const [showRevenueStat, setShowRevenueStat] = useState(false);
    const [showCodStat, setShowCodStat] = useState(false);
    const onTimeChange = (value, dateString) => {
        setFromDate(value[0]);
        setEndDate(value[1]);
    }
    const handleStatistical = () => {
        const fromDateString = momentObjectToTimestamp(fromDate);
        const endDateString = momentObjectToTimestamp(endDate);
        setRangerDate([fromDateString, endDateString])
    }
    return (
        <div>
            <Title level={2}>Dashboard</Title>
            <Card>
                <strong>Thống kê theo ngày: </strong>
                <RangePicker
                    defaultValue={[fromDate, endDate]}
                    format={dateFormat}
                    onChange={onTimeChange}
                />
                <Button
                    type='primary'
                    style={{ marginLeft: '20px' }}
                    onClick={handleStatistical}
                >
                    Tìm kiếm
                </Button>
            </Card>
            <RevenueStatic
                fromDate={rangerDate[0]}
                endDate={rangerDate[1]}
                showChart={showRevenueStat}
                setShowChart={setShowRevenueStat}
            />
            <CodStatic
                fromDate={rangerDate[0]}
                endDate={rangerDate[1]}
                showChart={showCodStat}
                setShowChart={setShowCodStat}
            />
        </div>
    )
}
