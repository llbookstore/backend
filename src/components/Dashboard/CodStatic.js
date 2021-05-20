import React, { useEffect, useState, useCallback } from 'react'
import { BarChartOutlined, DollarCircleOutlined } from '@ant-design/icons'
import { Card, Button, Tag, Row, Modal, } from 'antd'
import { callApi } from '../../utils/callApi'
import { ORDER_STATUS } from '../../constants/config'
import { formatNumber, timestampToDate } from '../../utils/common'
import { Line } from 'react-chartjs-2'
const getInfoPrice = (arr = [], status) => {
    let total = 0;
    let count = 0;
    for (const item of arr) {
        if (item.status >= 0
            && item.total_price >= 0 &&
            item.status === status) {
            total += item.total_price;
            count++;
        }
    }
    return [total, count];
}
export default function RevenueStatic({ fromDate, endDate, showChart, setShowChart }) {
    const [data, setData] = useState();
    useEffect(() => {
        const getRevenueStatApi = async () => {
            try {
                const res = await callApi(`bill/revenue_cod_stat`, 'POST', { date_start: fromDate, date_end: endDate });
                setData(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        getRevenueStatApi();
    }, [fromDate, endDate]);
    const dayChart = useCallback(() => {
        if (data) {
            const dataDayChart = data.map(item => {
                const day = timestampToDate(item.created_at, 'DD/MM/YYYY', 'vi');
                return day;
            })
            return dataDayChart;
        }
    }, [data])
    const statusChart = useCallback((status) => {
        if (data) {
            const dataStatusChart = data.map(item => {
                const price = item.total_price;
                return item.status === status ? price : 0;
            })
            return dataStatusChart;
        }
        else return 0;
    }, [data])
    const datasetChart = ORDER_STATUS
        .filter(item => item.status !== -2)
        .map(item => {
            return {
                label: item.name,
                data: statusChart(item.status),
                backgroundColor: item.color,
                borderColor: item.color,
                borderWidth: 4
            }
        })

    const dataChart = useCallback(() => {
        return {
            labels: dayChart(),
            datasets: datasetChart
        }
    }, [dayChart, datasetChart])
    return (
        <Card>
            <Modal
                title='Biểu đồ thống kê chi tiết'
                visible={showChart}
                footer={null}
                onCancel={() => setShowChart(false)}
                width={1000}
            >
                <Line
                    data={dataChart}
                />
            </Modal>
            <BarChartOutlined /> <strong>Thống kê chi tiết </strong>
            <Button type='link' onClick={() => setShowChart(true)}>Xem biểu đồ chi tiết </Button>
            {
                ORDER_STATUS
                    .filter(item => item.status !== -2)
                    .map(item =>
                        <Row style={{ marginTop: '8px' }}>
                            <Tag color={item.color} key={item.status}>
                                <DollarCircleOutlined />
                                {item.name}(<b>{getInfoPrice(data, item.status)[1]}</b>)
                        :
                        <span style={{ fontSize: 14 }}>
                                    {formatNumber(getInfoPrice(data, item.status)[0])} VNĐ

                        </span>
                            </Tag>
                        </Row>)
            }
        </Card>
    )
}
