import React, { useEffect, useState } from 'react'
import {
    useHistory,
    Link,
    // useLocation 
} from 'react-router-dom'
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
import { getCurrentTimestamp, timestampToDate, momentObjectToDateString } from '../utils/common'
import { RPP, DATE_FORMAT } from '../constants/config'
import { callApi, getImageURL } from '../utils/callApi'
const { Option } = Select;

const allStatus = [
    { id: -1, value: 'Tất cả' },
    { id: 0, value: 'Đã xóa' },
    { id: 1, value: 'Hoạt động' },
];
// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }
const ListBook = () => {
    const history = useHistory();
    // const query = useQuery();   // do it later
    const params = new URLSearchParams();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [startTime, setStartTime] = useState();
    const [statusFinding, setStatusFinding] = useState(-1);
    const [keyword, setKeyWord] = useState('');
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
                        await axios.put(`/book/${book_id}`, { active: 0 });
                        setUpdateCount(pre => pre + 1);
                        message.success('Xóa sách thành công!');
                    } catch (err) {
                        console.log(err);
                        message.error('Có lỗi xảy ra. Hiện tại không thể xóa.')
                    }
                }
                const onRestoreBook = async (book_id) => {
                    try {
                        await axios.put(`/book/${book_id}`, { active: 1 });
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
                <img alt={record.name} width={60} src={getImageURL(record.cover_image)} />
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
        // eslint-disable-next-line
    }, [updateCount])

    async function handleSearch(page = 1, pageSize = RPP) {
        setCurrentPage(page);
        const dataParams = {
            row_per_page: pageSize,
            current_page: page || currentPage || 1,
            q: keyword
        };
        if (statusFinding > -1) dataParams.active = statusFinding;
        if (startTime) dataParams.start_time = momentObjectToDateString(startTime, 'MM-DD-YYYY');
        if (endTime) dataParams.end_time = momentObjectToDateString(endTime, 'MM-DD-YYYY');
        const res = await callApi('books', 'GET', dataParams);
        if (res && res.status === 1) {
            const data = res.data.rows;
            setData(data);
            setTotal(res.data.count);
        }
    }

    const handleSearchSubmit = () => {
        params.append('q', keyword);
        if (statusFinding !== -1) params.append('active', statusFinding);
        if (!!startTime) params.append('start_time', `${momentObjectToDateString(startTime, 'DD-MM-YYYY')}`)
        if (!!endTime) params.append('start_time', `${momentObjectToDateString(endTime, 'DD-MM-YYYY')}`)
        history.push({ search: params.toString() });
        setUpdateCount(pre => pre + 1);
        setCurrentPage(1);
    }

    // const preventEnterSubmit = (e) => {
    //     if (e.keyCode === 13) {
    //         e.preventDefault();
    //         return false;
    //     }
    // }

    return (
        <div>
            <Row justify={'space-between'}>
                <Col>Tìm thấy <strong>{total}</strong> sách</Col>
                <Col>
                    <Button type='primary' onClick={() => history.push('/book/add')} style={{ backgroundColor: 'green' }}>Thêm sách</Button>
                </Col>
            </Row>
            <Card style={{ margin: '20px 0' }}>
                <Form
                    onFinish={handleSearchSubmit}
                    className="ant-advanced-search-form"
                    initialValues={{ status: -1 }}
                >
                    <Row gutter={24} >
                        <Col span={8}>
                            <Form.Item label='Từ khóa' name='query'>
                                <Input
                                    style={{ width: '100%', marginRight: '20px', marginLeft: '10px' }}
                                    onChange={(e) => setKeyWord(e.target.value)}
                                    placeholder='tên sách, id sách'
                                    autoFocus={true}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label='Trạng thái' name='status'>
                                <Select value={statusFinding} onChange={(value) => setStatusFinding(value)} >
                                    {allStatus.map(item => <Option key={item.id} value={item.id}>{item.value}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item label='Từ' name='startTime'>
                                <DatePicker onChange={(value) => setStartTime(value)} format={DATE_FORMAT} ></DatePicker>
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item label='Đến' name='endTime'>
                                <DatePicker onChange={(value) => setEndTime(value)} format={DATE_FORMAT} ></DatePicker>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Button type='primary' htmlType="submit">Tìm kiếm</Button>
                </Form>
            </Card>
            <Pagination
                showQuickJumper
                showSizeChanger
                onChange={(page, pageSize) => handleSearch(page, pageSize)}
                total={total}
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
                onChange={(page, pageSize) => handleSearch(page, pageSize)}
                total={total}
                pageSizeOptions={['10', '20', '50']}
                current={currentPage}
            />
        </div>
    )
}

export default ListBook;
