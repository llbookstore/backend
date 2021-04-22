import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Row, Card, Col, Typography, Table, Modal, Statistic } from 'antd'
import { callApi, getImageURL } from '../utils/callApi'
import { timestampToDate } from '../utils/common'
import './BillDetails.scss'
import { paymentTypes, ORDER_STATUS } from '../constants/config'
const { Title } = Typography;
const getOrderStatus = (status) => {
    const statusOrder = ORDER_STATUS.find(item => item.status === status);
    return statusOrder ? statusOrder.name : '';
}
const getPaymentType = (type) => {
    const findType = paymentTypes.find(item => item.key === type);
    return findType ? findType.title : '';
}
const BillDetails = ({ id, showBillDetail, setShowBillDetail }) => {
    const [orderData, setOrderData] = useState();
    const [widthScreen, setWidthScreen] = useState(window.innerWidth);
    useEffect(() => {
        const getUserOrder = async () => {
            const getOrder = await callApi(`bill/${id}`, 'GET');
            if (getOrder && getOrder.status === 1) {
                setOrderData(getOrder.data);
            }
        }
        getUserOrder();
    }, [id])
    useEffect(() => {
        window.addEventListener('resize', () => {
            setWidthScreen(window.innerWidth);
        })
    }, [])
    const columns = [
        {
            title: 'Sách đã đặt',
            key: 'book',
            render: record => {
                const { book } = record;
                return (
                    <Row gutter={[16, 24]}>
                        { widthScreen >= 620 &&
                            <Col>
                                <img
                                    src={getImageURL(book.cover_image)}
                                    alt={book.name}
                                    width='50px'
                                />
                            </Col>
                        }
                        <Col>
                            <Link to={`/book/edit/${record.book_id}`} style={{ fontSize: '1.4em' }}>{book.name} </Link>
                        </Col>
                    </Row>
                )
            }
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'age',
            render: text => {
                return (
                    <Statistic value={text} valueStyle={{ fontSize: '1.4em' }} />
                )
            }
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: text => {
                return (
                    <span style={{ fontSize: '1.4em' }}>{text}</span>
                )
            }
        },
        {
            title: 'Tạm tính',
            key: 'tempCal',
            render: (record) =>
                <Statistic value={record.quantity * record.price} valueStyle={{ fontSize: '1.4em' }} />
        },
    ]
    return (
        <Modal
            title="Chi tiết hóa đơn"
            visible={showBillDetail}
            footer={null}
            style={{ top: 20 }}
            onCancel={() => setShowBillDetail(false)}
            width='80%'
        >
            {
                orderData &&
                <div style={{ backgroundColor: 'lightgrey', padding: '1em' }}>
                    <Row justify='space-between'>
                        <span className='order-detail__title'>
                            Chi tiết đơn hàng: #{id} - {getOrderStatus(orderData.status)}
                        </span>
                        <span className='order-detail__date-buy'>
                            Ngày đặt hàng: {timestampToDate(orderData.created_at, 'DD/MM/YYYY, LT')}
                        </span>
                    </Row>
                    <hr />
                    <Card title='THÔNG TIN ĐẶT HÀNG' style={{ fontSize: '1.4em', minHeight: '250px' }}>
                        <Title level={4}>{orderData.user_name}</Title>
                        <strong>Địa chỉ:</strong> {orderData.address} <br />
                        <strong>Điện thoại:</strong> {orderData.phone} <br />
                        {orderData.user_note &&
                            <>
                                <strong>KH ghi chú:</strong> {orderData.user_note}
                                <br />
                            </>
                        }
                        <strong>Hình thức thanh toán:</strong> {getPaymentType(orderData.payment_method)}
                    </Card>
                    <Table
                        columns={columns}
                        dataSource={orderData.bill_details}
                        rowKey={(record) => record.book_id}
                        style={{ marginTop: '2em' }}
                        pagination={false}
                    />
                    {
                        orderData.user_note &&
                        <Card style={{ fontSize: '1.4em' }}>
                            <strong>Ghi chú:</strong>
                            {orderData.user_note}
                        </Card>
                    }
                    <Card >
                        <Row justify='space-between'>
                            <Title level={4}>
                                Tổng cộng
                        </Title>
                            <Statistic value={orderData.total_price} />
                        </Row>
                    </Card>
                </div>
            }
        </Modal>
    )
}

export default BillDetails;