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
    Card,
    Tag,
    Popover,
    Popconfirm,
} from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { callApi } from '../utils/callApi'
import { timestampToDate } from '../utils/common';
const { Option } = Select;
const allStatus = [
    { id: -1, value: 'Tất cả' },
    { id: 0, value: 'Đã xóa' },
    { id: 1, value: 'Hoạt động' },
];
// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }
const ListSale = () => {
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
            render: (text, record, index) => (
                <p>
                    {`${index + 1} `}
                    [<strong>ID: {record.sale_id}</strong>]
                </p>
            )
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: record => {
                const onDeleteSale = async (sale_id) => {
                    try {
                        await callApi(`/sale/${sale_id}`, 'DELETE');
                        setUpdateCount(pre => pre + 1);
                        message.success('Xóa khuyến mại thành công!');
                    } catch (err) {
                        console.log(err);
                        message.error('Có lỗi xảy ra. Hiện tại không thể xóa.')
                    }
                }
                const onRestoreSale = async (sale_id) => {
                    try {
                        await callApi(`/sale/${sale_id}/restore`, 'PUT');
                        setUpdateCount(pre => pre + 1);
                        message.success('Khôi phục khuyến mại thành công!');
                    } catch (err) {
                        console.log(err);
                        message.error('Có lỗi xảy ra. Hiện tại không thể khôi phục.')
                    }
                }
                return (
                    <>
                        <Popover content='Cập nhật khuyến mại'>
                            <Link to={`/sale/edit/${record.sale_id}`}>
                                <EditOutlined
                                    style={{ cursor: 'pointer', padding: 5, color: 'blue' }}
                                />
                            </Link> |
                    </Popover>
                        {
                            record.active === 1 ?
                                <Popover content='Xóa khuyến mại ?'>
                                    <Popconfirm
                                        title="Bạn có chắc xóa khuyến mại này chứ?"
                                        onConfirm={() => onDeleteSale(record.sale_id)}
                                        okText='Đồng ý'
                                        cancelText='Không'
                                    >
                                        <DeleteOutlined style={{ cursor: 'pointer', padding: 5, color: 'red' }} />
                                    </Popconfirm>
                                </Popover>
                                :
                                <Popover content='Khôi phục xóa'>
                                    <Popconfirm
                                        title="Bạn có chắc khôi phục lại khuyến mại này chứ"
                                        onConfirm={() => onRestoreSale(record.sale_id)}
                                        okText='Đồng ý'
                                        cancelText='Không'
                                    >
                                        <ReloadOutlined style={{ cursor: 'pointer', padding: 5, color: 'orange' }} />
                                    </Popconfirm>
                                </Popover>
                        }
                    </>
                )
            }
        },
        {
            title: 'Trạng thái',
            key: 'active',
            dataIndex: 'active',
            align: 'center',
            render: (text) => (
                <>
                    {text === 1 && <Tag color='#87d068'>Hoạt động</Tag>}
                    {text === 0 && <Tag color='#f50'>Đã xóa</Tag>}
                </>
            )
        },
        {
            title: 'Giảm giá',
            key: 'percent',
            dataIndex: 'percent',
            align: 'center',
            render: (text) => (
                <b>{text}%</b>
            )
        },
        {
            title: 'Thời gian bắt đầu',
            key: 'date_start',
            dataIndex: 'date_start',
            align: 'center',
            render: text => (
                <>
                    {timestampToDate(text, 'DD/MM/YYYY hh:mm:ss')}
                </>
            )
        },
        {
            title: 'Thời gian kết thúc',
            key: 'date_end',
            dataIndex: 'date_end',
            align: 'center',
            render: text => (
                <>
                    {timestampToDate(text, 'DD/MM/YYYY hh:mm:ss')}
                </>
            )
        },
        {
            title: 'Thời gian tạo',
            key: 'admin',
            align: 'center',
            render: record => (
                <>
                    <strong>Tạo: </strong>
                    {
                        record.created_by &&
                        <>
                            <span style={{ color: 'yellowgreen' }}>
                            </span>{`${record.created_by} | 
                            ${timestampToDate(record.created_at)}`} <br />
                        </>
                    }
                    {
                        record.updated_at && <>
                            <strong style={{ color: 'blueviolet' }}>
                                Sửa: </strong> {record.updated_by} |
                            {timestampToDate(record.updated_at)}
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
        const {
            query = '',
            status,
        } = form.getFieldsValue(true);
        const dataParams = {
            current_page: page || currentPage || 1,
            q: query
        };
        if (query) dataParams.q = query;
        if (status > -1) dataParams.active = status;
        const res = await callApi('sale', 'GET', dataParams);
        if (res && res.status === 1) {
            const data = res.data.rows;
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
        if (status !== -1) params.append('active', status);
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
                    <Row gutter={24} >
                        <Col span={8}>
                            <Form.Item label='Từ khóa' name='query'>
                                <Input
                                    style={{ width: '100%', marginRight: '20px', marginLeft: '10px' }}
                                    placeholder='tên khuyến mại, ID'
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
                    </Row>
                    <Button type='primary' htmlType="submit">Tìm kiếm</Button>
                    <Button type='primary' onClick={() => history.push('/sale/add')}
                        style={{ backgroundColor: 'green', borderColor: 'green', marginLeft: '1em' }}
                    >
                        Thêm mới khuyến mại</Button>
                </Form>
            </Card>
            Tìm thấy <strong>{total}</strong> khuyến mại
            <Pagination
                onChange={(page) => handleSearch(page)}
                total={total}
                current={currentPage}
            />
            <Table
                rowKey={record => record.sale_id}
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

export default ListSale;
