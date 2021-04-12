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
    Card,
    Tag,
    Popover,
    Popconfirm
} from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import axios from 'axios'
import { momentObjectToDateString } from '../utils/common'
import { RPP, DATE_FORMAT } from '../constants/config'
import { callApi } from '../utils/callApi'
const { Option } = Select;

const allStatus = [
    { id: -1, value: 'Tất cả' },
    { id: 0, value: 'Đã xóa' },
    { id: 1, value: 'Hoạt động' },
];
const allAccountTypes = [
    { id: -1, value: 'Tất cả' },
    { id: 0, value: 'Tài khoản thường' },
    { id: 1, value: 'Tài khoản admin' },
]
// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }
const ListUser = () => {
    const history = useHistory();
    // const query = useQuery();   // do it later
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
            align: 'center',
            width: '10%',
            render: (text, record, index) => (
                <p>
                    {index + 1}
                    <br />
                    <strong>ID: {record.account_id}</strong>
                </p>
            )
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            width: '16%',
            render: record => {
                const onDeleteAccount = async (account_id) => {
                    try {
                        await axios.put(`/account/${account_id}`, { active: 0 });
                        setUpdateCount(pre => pre + 1);
                        message.success('Xóa tài khoản thành công!');
                    } catch (err) {
                        console.log(err);
                        message.error('Có lỗi xảy ra. Hiện tại không thể xóa.')
                    }
                }
                const onRestoreAccount = async (account_id) => {
                    try {
                        await axios.put(`/account/${account_id}`, { active: 1 });
                        setUpdateCount(pre => pre + 1);
                        message.success('Khôi phục tài khoản thành công!');
                    } catch (err) {
                        console.log(err);
                        message.error('Có lỗi xảy ra. Hiện tại không thể khôi phục.')
                    }
                }
                return (
                    <>
                        <Popover content='Cập nhật tài khoản'>
                            <Link to={`/account/${record.account_id}`}>
                                <EditOutlined
                                    style={{ cursor: 'pointer', padding: 5, color: 'blue' }}
                                />
                            </Link> |
                    </Popover>
                        {
                            record.active === 1 ?
                                <Popover content='Xóa Tài khoản ?'>
                                    <Popconfirm
                                        title="Bạn có chắc xóa tài khoản này chứ?"
                                        onConfirm={() => onDeleteAccount(record.account_id)}
                                        okText='Đồng ý'
                                        cancelText='Không'
                                    >
                                        <DeleteOutlined style={{ cursor: 'pointer', padding: 5, color: 'red' }} />
                                    </Popconfirm>
                                </Popover>
                                :
                                <Popover content='Khôi phục xóa'>
                                    <Popconfirm
                                        title="Bạn có chắc khôi phục lại tài khoản này chứ"
                                        onConfirm={() => onRestoreAccount(record.account_id)}
                                        okText='Đồng ý'
                                        cancelText='Không'
                                    >
                                        <ReloadOutlined style={{ cursor: 'pointer', padding: 5, color: 'orange' }} />
                                    </Popconfirm>
                                </Popover>
                        }
                        <br />
                        <Row justify='space-around'>
                            <Col>
                                <strong>Trạng thái: </strong> <br />
                                {record.active === 1 && <Tag color='#87d068'>Hoạt động</Tag>}
                                {record.active === 0 && <Tag color='#f50'>Đã xóa</Tag>}

                            </Col>
                            <Col>
                                <strong>Loại TK: </strong> <br />
                                {record.type === 1 && <Tag color='magenta'>Admin </Tag>}
                                {record.type === 0 && <Tag color='lightblue'>Thường</Tag>}
                            </Col>
                        </Row>
                        <br />

                    </>
                )
            }
        },
        {
            title: 'Tài khoản',
            key: 'book_title',
            align: 'center',
            width: '30%',
            render: (record, index) => (
                <>
                    <span>username: <strong>{record.account_name}</strong></span> <br />
                    <span>Họ tên: <strong>{record.full_name}</strong></span> <br />
                    <span>Email: <strong>{record.email}</strong></span> <br />
                    <span>Số điện thoại: <strong>{record.phone}</strong></span> <br />

                </>
            )
        },
        {
            title: 'Thời gian tạo',
            key: 'admin',
            align: 'center',
            width: '20%',
            render: record => (
                <>
                    <strong>Tạo: </strong>
                    {
                        record.created_by &&
                        <>
                            <strong style={{ color: 'yellowgreen' }}>
                            </strong>{record.created_by}
                        </>
                    }<br />
                    {record.created_at} <br />
                    {
                        record.updated_at && <>
                            <strong style={{ color: 'blueviolet' }}>
                                Sửa: </strong>{record.updated_by} <br />
                            {record.updated_at}
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
        const {
            query = '',
            type,
            status,
            startTime,
            endTime
        } = form.getFieldsValue(true);
        const dataParams = {
            row_per_page: pageSize,
            current_page: page || currentPage || 1,
            q: query
        };
        if (query) dataParams.q = query;
        if (status > -1) dataParams.active = status;
        if (type > -1) dataParams.type = type;
        if (startTime) dataParams.time_start = momentObjectToDateString(startTime, 'MM-DD-YYYY');
        if (endTime) dataParams.time_end = momentObjectToDateString(endTime, 'MM-DD-YYYY');
        const res = await callApi('account', 'GET', dataParams);
        if (res && res.status === 1) {
            const data = res.data.rows;
            setData(data);
            setTotal(res.data.count);
        }
    }

    const handleSearchSubmit = (values) => {
        const {
            status,
            query,
            startTime,
            endTime
        } = values;
        params.append('q', query);
        if (status !== -1) params.append('active', status);
        if (!!startTime) params.append('start_time', `${momentObjectToDateString(startTime, 'DD-MM-YYYY')}`)
        if (!!endTime) params.append('start_time', `${momentObjectToDateString(endTime, 'DD-MM-YYYY')}`)
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
                    initialValues={{ status: -1, type: -1 }}
                >
                    <Row gutter={24} >
                        <Col span={8}>
                            <Form.Item label='Từ khóa' name='query'>
                                <Input
                                    style={{ width: '100%', marginRight: '20px', marginLeft: '10px' }}
                                    placeholder='tên tài khoản, id, email, sđt'
                                    autoFocus={true}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label='Trạng thái' name='status'>
                                <Select >
                                    {allStatus.map(item => <Option key={item.id} value={item.id}>{item.value}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label='Loại tài khoản' name='type'>
                                <Select >
                                    {allAccountTypes.map(item => <Option key={item.id} value={item.id}>{item.value}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <Form.Item label='Từ' name='startTime'>
                                <DatePicker format={DATE_FORMAT} ></DatePicker>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label='Đến' name='endTime'>
                                <DatePicker format={DATE_FORMAT} ></DatePicker>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Button type='primary' htmlType="submit">Tìm kiếm</Button>
                    <Button type='primary' onClick={() => history.push('/account/add')}
                        style={{ backgroundColor: 'green', margin: '1em' }}
                    >
                        Tạo tài khoản</Button>
                </Form>
            </Card>
            Tìm thấy <strong>{total}</strong> tài khoản
            <Pagination
                showQuickJumper
                showSizeChanger
                onChange={(page, pageSize) => handleSearch(page, pageSize)}
                total={total}
                pageSizeOptions={['10', '20', '50']}
                current={currentPage}
            />
            <Table
                rowKey={record => record.account_id}
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

export default ListUser;
