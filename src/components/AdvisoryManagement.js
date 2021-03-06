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
                message.success('X??? l?? th??nh c??ng');
            }
            else {
                message.error('Something wrong');
                console.log(res);
            }
            setUpdateCount(pre => pre + 1);
            setShowHandleAdvisory(false);
        } catch (error) {
            message.error('H??? th???ng ??ang g???p s??? c???. B???n vui l??ng th??? l???i sau!')
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
            title: 'Th??ng tin KH',
            key: 'user_info',
            align: 'left',
            width: '34%',
            render: (text, record, index) => (
                <>
                    <p><b>H??? t??n: </b>{record.username}</p>
                    <p><b>S??? ??i???n tho???i: </b>{record.phone}</p>
                    {record.address && <p><b>?????a ch???: </b>{record.address}</p>}
                    <p>
                        <b>Th???i ??i???m y??u c???u: </b>
                        {record.created_at}
                    </p>
                </>
            )
        },
        {
            title: 'N???i dung c???n t?? v???n',
            key: 'user_note',
            align: 'center',
            dataIndex: 'user_note',
            render: user_note => (
                <p>{user_note}</p>
            )
        },
        {
            title: 'X??? l??',
            key: 'handleReq',
            align: 'center',
            width: '25%',
            dataIndex: 'handle_history',
            render: (handle_history, record, index) => (
                <>
                    <p>
                        <b>Tr???ng th??i: </b>
                        <Tag color={findStatusAdvisory(record.status).color}>{findStatusAdvisory(record.status).name}</Tag>
                    </p>
                    <Button onClick={() => handleClickHandleReq(record.advisory_id, record.status)} style={{ marginRight: '20px', background: 'lightgreen' }}>
                        X??? l??
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            setHistoryData(handle_history);
                            setShowHistory(true);
                        }}>
                        Xem l???ch s???
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
                            <Form.Item label='T??? kh??a' name='query'>
                                <Input
                                    style={{ width: '100%', marginRight: '20px', marginLeft: '10px' }}
                                    placeholder='t??n KH, s??t kh??ch h??ng'
                                    autoFocus={true}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label='Tr???ng th??i' name='status'>
                                <Select>
                                    {ADVISORY_STATUS.map(item => <Option key={item.status} value={item.status}>{item.name}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item label='T???' name='startTime'>
                                <DatePicker format={DATE_FORMAT} ></DatePicker>
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item label='?????n' name='endTime'>
                                <DatePicker format={DATE_FORMAT} ></DatePicker>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Button type='primary' htmlType="submit">T??m ki???m</Button>
                </Form>
            </Card>
             T??m th???y <strong>{total}</strong> y??u c???u t?? v???n
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