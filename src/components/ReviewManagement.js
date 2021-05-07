import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
    Button,
    Table,
    Select,
    Form,
    Pagination,
    Card,
    Tag,
    Rate,
    message,
    Popover,
    Popconfirm
} from 'antd';
import { LikeOutlined, DeleteOutlined } from '@ant-design/icons'
import { callApi } from '../utils/callApi'
import { timestampToDate } from '../utils/common'
import { REVIEW_STATUS } from '../constants/config'

const getStatus = (status) => {
    return REVIEW_STATUS.find(item => item.status === status);
}
const { Option } = Select;

const ReviewManagement = () => {
    const history = useHistory();
    const [form] = Form.useForm();
    const params = new URLSearchParams();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [updateCount, setUpdateCount] = useState(0);
    const columns = [
        {
            title: 'STT',
            key: 'stt',
            width: '10%',
            align: 'center',
            render: (text, record, index) => (
                <p>{index + 1}</p>
            )
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: record => {
                const onDeleteReview = async (review_id) => {
                    try {
                        await callApi(`/review/${review_id}`, 'DELETE');
                        setUpdateCount(pre => pre + 1);
                        message.success('Xóa đánh giá thành công!');
                    } catch (err) {
                        console.log(err);
                        message.error('Có lỗi xảy ra. Hiện tại không thể xóa.')
                    }
                }
                const onAcceptReview = async (review_id) => {
                    try {
                        await callApi(`/review/${review_id}/accept`, 'PUT');
                        setUpdateCount(pre => pre + 1);
                        message.success('Đã duyệt đánh giá thành công!');
                    } catch (err) {
                        console.log(err);
                        message.error('Có lỗi xảy ra. Hiện tại không thể duyệt đánh giá!')
                    }
                }

                return (
                    <>
                        {
                            record.status === 0 &&
                            <Popover content='Duyệt đánh giá'>
                                <Popconfirm
                                    title="Bạn có chắc muốn duyệt đánh giá này?"
                                    onConfirm={() => onAcceptReview(record.review_id)}
                                    okText='Đồng ý'
                                    cancelText='Không'
                                >
                                    <LikeOutlined
                                        style={{ cursor: 'pointer', padding: 5, color: 'blue' }}
                                    /> |
                                </Popconfirm>
                            </Popover>
                        }
                        {
                            < Popover content='Xóa đánh giá ?' >
                                <Popconfirm
                                    title="Bạn có chắc xóa đánh giá này chứ?"
                                    onConfirm={() => onDeleteReview(record.review_id)}
                                    okText='Đồng ý'
                                    cancelText='Không'
                                >
                                    <DeleteOutlined style={{ cursor: 'pointer', padding: 5, color: 'red' }} />
                                </Popconfirm>
                            </Popover >
                        }
                    </>
                )
            }
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            align: 'center',
            width: '15%',
            render: status => {
                return (
                    <>
                        {
                            getStatus(status) &&
                            <Tag color={getStatus(status).color}>
                                {getStatus(status).name}
                            </Tag>
                        }
                    </>
                )
            }
        },
        {
            title: 'Nội dung đánh giá',
            key: 'comment',
            dataIndex: 'comment',
            width: '35%',
            align: 'left',
            render: (text, record) => (<>
                <b>Họ tên:</b> {record.full_name} <br />
                <b>Rate:</b> <Rate value={record.rating} disabled /> <br />
                <b>Bình luận:</b> {text} <br />
            </>)
        },
        {
            title: 'Thông tin',
            key: 'admin',
            align: 'center',
            render: record => (
                <>
                    <strong>Tạo: </strong>
                    {
                        <>
                            {timestampToDate(record.created_at, 'DD/MM/YYYY LT')} <br />
                        </>
                    }
                    {
                        record.accepted_at && <>
                            <strong style={{ color: 'blueviolet' }}>
                                Đã duyệt: </strong> {record.accepted_by} <br />
                            {timestampToDate(record.accepted_at, 'DD/MM/YYYY LT')} <br />
                        </>
                    }
                    {
                        record.published_at && <>
                            <strong style={{ color: 'yellowgreen' }}>
                                Phát hành: </strong> {record.published_by} |
                            {timestampToDate(record.published_at, 'DD/MM/YYYY LT')}
                        </>
                    }
                </>
            )
        },
    ]

    useEffect(() => {
        handleSearch();
        // eslint-disable-next-line
    }, [updateCount])

    async function handleSearch(page = 1) {
        setCurrentPage(page);
        const { status } = form.getFieldsValue(true);
        const dataParams = {
            current_page: page || currentPage || 1
        };
        if (status > -1) dataParams.status = status;
        const res = await callApi('review', 'GET', dataParams);
        if (res && res.status === 1) {
            const data = res.data.rows;
            setData(data);
            setTotal(res.data.count);
        }
    }

    const handleSearchSubmit = (values) => {
        const {
            status
        } = values;
        if (status !== -1) params.append('status', status);
        history.push({ search: params.toString() });
        setUpdateCount(pre => pre + 1);
        setCurrentPage(1);
    }
    return (
        <div>
            <Card style={{ margin: '20px 0' }}>
                <Form
                    form={form}
                    onFinish={handleSearchSubmit}
                    className="ant-advanced-search-form"
                    initialValues={{ status: -1 }}
                >
                    <Form.Item label='Trạng thái' name='status' style={{ width: '50%' }}>
                        <Select >
                            {REVIEW_STATUS.map(item =>
                                <Option key={item.status} value={item.status}>{item.name}</Option>)}
                        </Select>
                    </Form.Item>
                    <Button type='primary' htmlType="submit">Tìm kiếm</Button>
                </Form>
            </Card>
            Tìm thấy <strong>{total}</strong> tin tức
            <Pagination
                onChange={(page) => handleSearch(page)}
                total={total}
                current={currentPage}
            />
            <Table
                rowKey={record => record.review_id}
                bordered={true}
                columns={columns}
                dataSource={data}
                pagination={false}
                style={{ paddingBottom: '20px', paddingTop: '20px' }}
            />
            <Pagination
                onChange={(page) => handleSearch(page)}
                total={total}
                current={currentPage}
            />
        </div>
    )
}

export default ReviewManagement;
