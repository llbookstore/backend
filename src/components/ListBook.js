import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useHistory, Link } from 'react-router-dom'
import {
    Button,
    Table,
    message,
    Select,
    Form,
    Pagination,
    Row,
    Col,
    Input,
    DatePicker,
    Statistic,
    Card,
    Tag,
    Popover,
    Popconfirm
} from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import axios from 'axios'
import { getCurrentTimestamp, timestampToDate } from '../utils/common'
import { API_HOST, RPP } from '../constants/config'
const { Option } = Select;
const dateFormat = 'DD/MM/YYYY';
const allStatus = [
    { id: -1, value: 'Tất cả' },
    { id: 0, value: 'Đã xóa' },
    { id: 1, value: 'Chưa xóa' },
];

const ListBook = (props) => {
    const history = useHistory();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [rowPerPage, setRowPerPage] = useState(RPP);
    const [currentPage, setCurrentPage] = useState(1);
    const [startTime, setStartTime] = useState();
    const [statusFinding, setStatusFinding] = useState(-1);
    const [keyword, setKeyWord] = useState();
    const [endTime, setEndTime] = useState();
    const [updateCount, setUpdateCount] = useState(0);
    const columns = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '10%',
            render: (text, record, index) => (
                <p>
                    {index + 1}
                    <br />
                    <strong>ID: {record.book_id}</strong>
                </p>
            )
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            width: '10%',
            render: record => {
                const onDeleteBook = async (book_id) => {
                    try {
                        await axios.put(`/book/${book_id}`, {active: 0});
                        setUpdateCount(pre => pre + 1);
                        message.success('Xóa sách thành công!');
                    } catch (err) {
                        console.log(err);
                        message.error('Có lỗi xảy ra. Hiện tại không thể xóa.')
                    }
                }
                const onRestoreBook = async (book_id) => {
                    try {
                        await axios.put(`/book/${book_id}`, {active: 1});
                        setUpdateCount(pre => pre + 1);
                        message.success('Khôi phục sách thành công!');
                    } catch (err) {
                        console.log(err);
                        message.error('Có lỗi xảy ra. Hiện tại không thể khôi phục.')
                    }
                }
                return (
                    <>
                        <Popover content='Cập nhật sách'>
                            <Link to={`/book/edit/${record.book_id}`}>
                                <EditOutlined
                                    style={{ cursor: 'pointer', padding: 5, color: 'blue' }}
                                />
                            </Link> |
                    </Popover>
                        {
                            record.active === 1 ?
                                <Popover content='Xóa sách'>
                                    <Popconfirm
                                        title="Bạn có chắc xóa sách này chứ"
                                        onConfirm={() => onDeleteBook(record.book_id)}
                                        okText='Đồng ý'
                                        cancelText='Không'
                                    >
                                        <DeleteOutlined style={{ cursor: 'pointer', padding: 5, color: 'red' }} />
                                    </Popconfirm>
                                </Popover>
                                :
                                <Popover content='Khôi phục xóa'>
                                    <Popconfirm
                                        title="Bạn có chắc khôi phục lại sách này chứ"
                                        onConfirm={() => onRestoreBook(record.book_id)}
                                        okText='Đồng ý'
                                        cancelText='Không'
                                    >
                                        <ReloadOutlined style={{ cursor: 'pointer', padding: 5, color: 'orange' }} />
                                    </Popconfirm>
                                </Popover>
                        }
                        <br />
                        <strong>Trạng thái: </strong> <br />
                        {record.active === 1 && <Tag color='#87d068'>Hoạt động</Tag>}
                        {record.active === 0 && <Tag color='#f50'>Đã xóa</Tag>}
    
                    </>
                )
            }
        },
        {
            title: 'Bìa sách',
            key: 'cover_image',
            align: 'left',
            width: '10%',
            render: (record, index) => (
                <img alt={record.name} width={60} src={`${API_HOST}/images/${record.cover_image}`} />
            )
        },
        {
            title: 'Tên sách',
            key: 'book_title',
            align: 'left',
            width: '30%',
            render: (record, index) => (
                <strong>{record.name}</strong>
            )
        },
        {
            title: 'Giá bìa',
            key: 'book_price',
            align: 'left',
            width: '15%',
            render: (record, index) => (
                <>
                    <Statistic value={record.price} style={{ fontSize: '14px' }} />
                    {
                        record.sale && record.sale.active === 1 && record.sale.date_end > getCurrentTimestamp()
                        && <><strong>Sale: </strong><Tag color='tomato'>{record.sale.percent}%</Tag></>
                    }
                </>
            )
        },
        {
            title: 'Admin',
            key: 'admin',
            align: 'center',
            width: '20%',
            render: record => (
                <>
                    <strong style={{ color: 'yellowgreen' }}>Tạo: </strong>{record.created_by} <br />
                    {timestampToDate(record.created_at, 'DD/MM/YYYY hh:mm:ss ')}
                    <p></p>
                    {
                        record.updated_at && <>
                            <strong style={{ color: 'blueviolet' }}>Sửa: </strong>{record.updated_by} <br />
                            {timestampToDate(record.updated_at, 'DD/MM/YYYY hh:mm:ss ')}
                        </>
                    }
                </>
            )
        },
    ]

    useEffect(() => {
        handleSearch();
    }, [updateCount])
    async function handleSearch(page, pageSize) {
        const dataParams = {
            row_per_page: rowPerPage,
            current_page: currentPage
        };
        // if (keyword && keyword !== '') {
        //     dataParams.keyword = keyword;
        // }
        // if (statusFinding > -1) dataParams.status = statusFinding;
        // if (startTime) dataParams.timeStart = startTime.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).unix();
        // if (endTime) dataParams.timeEnd = endTime.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).unix();
        if (page > 0) {
            setCurrentPage(page);
            dataParams.current_page = page;
        }
        const result = await axios.get('/books', {params: dataParams});
        console.log(result,'lslslsl')
        if (result && result.data.status === 1) {
            const data = result.data.data.rows;
            setData(data);
            setTotal(result.data.data.count);
        }
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setUpdateCount(pre => pre + 1);
        setCurrentPage(1);
    }

    const preventEnterSubmit = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            return false;
        }
    }

    return (
        <div>
            <Row justify={'space-between'}>
                <Col>Tìm thấy <strong>{total}</strong> sách</Col>
                <Col>
                    <Button type='primary' onClick={() => history.push('/book/add')} style={{ backgroundColor: 'green' }}>Thêm sách</Button>
                </Col>
            </Row>
            <Card style={{ margin: '20px 0' }}>
                <Form onSubmit={handleSearchSubmit} onKeyDown={preventEnterSubmit} className="ant-advanced-search-form">
                    <Row gutter={24} >
                        <Col span={8}>
                            <Form.Item label='Từ khóa'>
                                <Input
                                    style={{ width: '100%', marginRight: '20px', marginLeft: '10px' }}
                                    onChange={(e) => setKeyWord(e.target.value)}
                                    placeholder='tên sách, id sách'
                                    autoFocus={true}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label='Trạng thái'>
                                <Select value={statusFinding} onChange={(value) => setStatusFinding(value)} style={{ width: '100%' }} >
                                    {allStatus.map(item => <Option key={item.id} value={item.id}>{item.value}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item label='Từ'>
                                <DatePicker onChange={(value) => setStartTime(value)} format={dateFormat} ></DatePicker>
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item label='Đến'>
                                <DatePicker onChange={(value) => setEndTime(value)} format={dateFormat} ></DatePicker>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Button type='primary' htmlType="submit">Tìm kiếm</Button>
                </Form>
            </Card>
            <Pagination
                showQuickJumper
                showSizeChanger
                onShowSizeChange={(current, pageSize) => { setRowPerPage(pageSize); setCurrentPage(1); }}
                onChange={(page, pageSize) => handleSearch(page, pageSize)}
                total={total}
                pageSize={rowPerPage}
                pageSizeOptions={['10', '20', '50']}
                current={currentPage}
            />
            <Table
                rowKey={record => record.book_id}
                bordered={true}
                columns={columns}
                dataSource={data}
                pagination={false}
                style={{ paddingBottom: '20px', paddingTop: '20px' }}
            />
            <Pagination
                showQuickJumper
                showSizeChanger
                onShowSizeChange={(current, pageSize) => { setRowPerPage(pageSize); setCurrentPage(1); }}
                onChange={(page, pageSize) => handleSearch(page, pageSize)}
                total={total}
                pageSize={rowPerPage}
                pageSizeOptions={['10', '20', '50']}
                current={currentPage}
            />
        </div>
    )
}

export default ListBook;
