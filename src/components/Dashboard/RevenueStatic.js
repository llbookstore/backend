import React, { useEffect, useState, useCallback } from 'react'
import { BarChartOutlined, DollarCircleOutlined } from '@ant-design/icons'
import { Card, Button, Statistic, Row, Col, Modal } from 'antd'
import { Line } from 'react-chartjs-2'
import { callApi } from '../../utils/callApi'
import { timestampToDate } from '../../utils/common'
const getInfoPrice = (arr = [], paymentMethod) => {
    let total = 0;
    let count = 0;
    for (const item of arr) {
        if (item.payment_method >= 0
            && item.total_price >= 0 &&
            item.payment_method === paymentMethod) {
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
                const res = await callApi(`bill/revenue_stat`, 'POST', { date_start: fromDate, date_end: endDate });
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

    const codChart = useCallback(() => {
        if (data) {
            const dataCodChart = data.map(item => {
                const cod = item.total_price;
                return item.payment_method === 0 ? cod : 0;
            })
            return dataCodChart;
        }
        else return 0;
    }, [data])
    const bankingChart = useCallback(() => {
        if (data) {
            const dataBankingChart = data
                .map(item => {
                    const price = item.total_price;
                    return item.payment_method !== 0 ? price : 0;
                })
            return dataBankingChart;
        }
        else return 0;
    }, [data])
    const dataChart = useCallback(() => {
        return {
            labels: dayChart(),
            datasets: [
                {
                    label: 'cod',
                    data: codChart(),
                    backgroundColor: ['rgba(255,99, 71, 0.8)'],
                    borderColor: 'tomato',
                    borderWidth: 4
                },
                {
                    label: 'banking',
                    data: bankingChart(),
                    backgroundColor: ['rgba(75,192, 192, 0.8)'],
                    borderColor: 'lightblue',
                    borderWidth: 4
                },
            ]
        }
    }, [codChart, bankingChart, dayChart])
    return (
        <>
            <Modal
                title='Bi???u ????? th???ng k?? doanh thu'
                visible={showChart}
                footer={null}
                onCancel={() => setShowChart(false)}
                width={1000}
            >
                <Line
                    data={dataChart}
                //  options={options} 
                />
            </Modal>
            <Card>
                <BarChartOutlined /> <strong>Th???ng k?? doanh thu</strong>
                <Button type='link' onClick={() => setShowChart(true)}>Xem bi???u ????? chi ti???t</Button>
                <Row gutter={24}>
                    <Col>
                        <Statistic
                            title={<span style={{ color: 'black' }}>  <DollarCircleOutlined />
                        Thanh to??n COD
                        (<b>{getInfoPrice(data, 0)[1]}</b>):
                </span>}
                            value={getInfoPrice(data, 0)[0]}
                            prefix='VN??'
                        />
                    </Col>
                    <Col>
                        <Statistic
                            title={<span style={{ color: 'black' }}> <DollarCircleOutlined />
                         Thanh to??n banking(<b>{getInfoPrice(data, 1)[1]}</b>):
                </span>}
                            value={getInfoPrice(data, 1)[0]}
                            prefix='VN??'
                        />
                    </Col>
                </Row>
            </Card>
        </>
    )
}
