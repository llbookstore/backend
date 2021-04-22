import React, { useEffect, useState } from 'react'
import {
    useHistory,
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
    Card,
    Tag,
} from 'antd';
import { momentObjectToTimestamp } from '../utils/common'
import { DATE_FORMAT, ADVISORY_STATUS } from '../constants/config'
import { callApi } from '../utils/callApi'
import ViewHandleHistory from './ViewHandleHistory'
import HandleClientRequest from './HandleClientRequest'
const { Option } = Select;

const findStatusAdvisory = (status) => {
    const advisory = ADVISORY_STATUS.find(item => item.status === status);
    return advisory || { color: 'white', name: '' };
}

function AdvisoryManagement() {
    const history = useHistory();
    const [form] = Form.useForm();
    const [data, setData] = useState();
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [updateCount, setUpdateCount] = useState(0);
    //handle history
    const [showHistory, setShowHistory] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [note, setNote] = useState('');
    const [status, setStatus] = useState();
    const [currentAdvisoryId, setCurrentAdvisoryId] = useState();
    const [showHandleAdvisory, setShowHandleAdvisory] = useState(false);
    const params = new URLSearchParams();

    useEffect(() => {
        handleSearch();
        // eslint-disable-next-line
    }, [updateCount])

    async function handleSearch(page = 1) {
        setCurrentPage(page);
        const {
            query = '',
            status,
            startTime,
            endTime
        } = form.getFieldsValue(true);
        const dataParams = {
            current_page: page || currentPage || 1,
            q: query
        };
        if (query) dataParams.q = query;
        if (status > -1) dataParams.status = status;
        if (startTime) dataParams.time_start = momentObjectToTimestamp(startTime);
        if (endTime) dataParams.time_end = momentObjectToTimestamp(endTime);
        const res = await callApi('advisory', 'GET', dataParams);
        if (res && res.status === 1) {
            const data = res.data.rows;
            for (let item of data) {
                item.handle_history = item.handle_history ? JSON.parse(item.handle_history) : [];
            }
            setData(data);
            setTotal(res.data.count);
        }
    }

    const handleSearchSubmit = (values) => {
        const {
            status,
            query
        } = values;
        params.append('q', query);
        if (status !== -2) params.append('status', status);
        history.push({ search: params.toString() });
        setUpdateCount(pre => pre + 1);
        setCurrentPage(1);
    }
    const handleClickHandleReq = (advisoryId, status) => {
        setNote('');
        setCurrentAdvisoryId(advisoryId);
        setStatus(status);
        setShowHandleAdvisory(true);
    }
    const handleSubmitAdvisory = async () => {
        const dataHandle = {
            note,
            status
        }
        try {
            const res = await callApi(`/advisory/${currentAdvisoryId}`, 'PUT', dataHandle);
            if (res && res.status === 1) {
                message.success('Xử lý thành công');
            }
            else {
                message.error('Something wrong');
                console.log(res);
            }
            setUpdateCount(pre => pre + 1);
            setShowHandleAdvisory(false);
        } catch (error) {
            message.error('Hệ thống đang gặp sự cố. Bạn vui lòng thử lại sau!')
        }
    }
    const columns = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '10%',
            render: (text, record, index) => (
                <p>{index + 1}</p>
            )
        },
        {
            title: 'Thông tin KH',
            key: 'user_info',
            align: 'left',
            width: '34%',
            render: (text, record, index) => (
                <>
                    <p><b>Họ tên: </b>{record.username}</p>
                    <p><b>Số điện thoại: </b>{record.phone}</p>
                    {record.address && <p><b>Địa chỉ: </b>{record.address}</p>}
                    <p>
                        <b>Thời điểm yêu cầu: </b>
                        {record.created_at}
                    </p>
                </>
            )
        },
        {
            title: 'Nội dung cần tư vấn',
            key: 'user_note',
            align: 'center',
            dataIndex: 'user_note',
            render: user_note => (
                <p>{user_note}</p>
            )
        },
        {
            title: 'Xử lý',
            key: 'handleReq',
            align: 'center',
            width: '25%',
            dataIndex: 'handle_history',
            render: (handle_history, record, index) => (
                <>
                    <p>
                        <b>Trạng thái: </b>
                        <Tag color={findStatusAdvisory(record.status).color}>{findStatusAdvisory(record.status).name}</Tag>
                    </p>
                    <Button onClick={() => handleClickHandleReq(record.advisory_id, record.status)} style={{ marginRight: '20px', background: 'lightgreen' }}>
                        Xử lý
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            setHistoryData(handle_history);
                            setShowHistory(true);
                        }}>
                        Xem lịch sử
                    </Button>
                </>
            )
        },

    ];
    return (
        <>
            <HandleClientRequest
                note={note}
                setNote={setNote}
                status={status}
                setStatus={setStatus}
                allStatus={ADVISORY_STATUS.filter(item => item.status !== -1)}
                showHandleReq={showHandleAdvisory}
                setShowHandleReq={setShowHandleAdvisory}
                handleSubmitHandleReq={handleSubmitAdvisory}
            />
            <ViewHandleHistory
                allStatus={ADVISORY_STATUS}
                showHistory={showHistory}
                setShowHistory={setShowHistory}
                historyData={historyData}
            />
            <Card style={{ margin: '20px 0' }}>
                <Form
                    form={form}
                    onFinish={handleSearchSubmit}
                    className="ant-advanced-search-form"
                    initialValues={{ status: -1 }}
                >
                    <Row gutter={24} >
                        <Col span={6}>
                            <Form.Item label='Từ khóa' name='query'>
                                <Input
                                    style={{ width: '100%', marginRight: '20px', marginLeft: '10px' }}
                                    placeholder='tên KH, sđt khách hàng'
                                    autoFocus={true}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label='Trạng thái' name='status'>
                                <Select>
                                    {ADVISORY_STATUS.map(item => <Option key={item.status} value={item.status}>{item.name}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item label='Từ' name='startTime'>
                                <DatePicker format={DATE_FORMAT} ></DatePicker>
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item label='Đến' name='endTime'>
                                <DatePicker format={DATE_FORMAT} ></DatePicker>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Button type='primary' htmlType="submit">Tìm kiếm</Button>
                </Form>
            </Card>
             Tìm thấy <strong>{total}</strong> yêu cầu tư vấn
            <Pagination
                onChange={(page) => handleSearch(page)}
                total={total}
                current={currentPage}
            />
            <Table
                rowKey={record => record.advisory_id}
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
        </>
    )
}

export default AdvisoryManagement;