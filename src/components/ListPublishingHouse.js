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
    Image
} from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { timestampToDate } from '../utils/common'
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
const ListPublishingHouse = () => {
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
                    {index + 1}
                    <br />
                    <strong>ID: {record.publishing_id}</strong>
                </p>
            )
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: record => {
                const onDeletePublishingHouse = async (publishing_id) => {
                    try {
                        await callApi(`/publishing_house/${publishing_id}`, 'DELETE');
                        setUpdateCount(pre => pre + 1);
                        message.success('Xóa nhà phát hành thành công!');
                    } catch (err) {
                        console.log(err);
                        message.error('Có lỗi xảy ra. Hiện tại không thể xóa.')
                    }
                }
                const onRestorePublishingHouse = async (publishing_id) => {
                    try {
                        await callApi(`/publishing_house/${publishing_id}/restore`, 'PUT');
                        setUpdateCount(pre => pre + 1);
                        message.success('Khôi phục nhà phát hành thành công!');
                    } catch (err) {
                        console.log(err);
                        message.error('Có lỗi xảy ra. Hiện tại không thể khôi phục.')
                    }
                }
                return (
                    <>
                        <Popover content='Cập nhật nhà phát hành'>
                            <Link to={`/publishing-house/edit/${record.publishing_id}`}>
                                <EditOutlined
                                    style={{ cursor: 'pointer', padding: 5, color: 'blue' }}
                                />
                            </Link> |
                    </Popover>
                        {
                            record.active === 1 ?
                                <Popover content='Xóa nhà phát hành ?'>
                                    <Popconfirm
                                        title="Bạn có chắc xóa nhà phát hành này chứ?"
                                        onConfirm={() => onDeletePublishingHouse(record.publishing_id)}
                                        okText='Đồng ý'
                                        cancelText='Không'
                                    >
                                        <DeleteOutlined style={{ cursor: 'pointer', padding: 5, color: 'red' }} />
                                    </Popconfirm>
                                </Popover>
                                :
                                <Popover content='Khôi phục xóa'>
                                    <Popconfirm
                                        title="Bạn có chắc khôi phục lại nhà phát hành này chứ"
                                        onConfirm={() => onRestorePublishingHouse(record.publishing_id)}
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
                        </Row>
                    </>
                )
            }
        },
        {
            title: 'Logo',
            key: 'logo',
            dataIndex: 'image',
            align: 'center',
            render: (text, record) => (
                <Image 
                src={getImageURL(text)} 
                preview={false}
                width={160}
                fallback='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg==' 
                alt={record.name}/>
            )
        },
        {
            title: 'Tên nhà phát hành',
            key: 'name',
            dataIndex: 'name',
            align: 'center',
            render: (text) => (
                <b>{text}</b>
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

    async function handleSearch(page = currentPage) {
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
        const res = await callApi('publishing_house', 'GET', dataParams);
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
                                    placeholder='tên nhà phát hành, ID'
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
                    <Button type='primary' onClick={() => history.push('/publishing-house/add')}
                        style={{ backgroundColor: 'green',borderColor: 'green', marginLeft: '1em' }}
                    >
                        Thêm mới nhà phát hành</Button>
                </Form>
            </Card>
            Tìm thấy <strong>{total}</strong> nhà phát hành
            <Pagination
                onChange={(page) => handleSearch(page)}
                total={total}
                current={currentPage}
            />
            <Table
                rowKey={record => record.publishing_id}
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

export default ListPublishingHouse;
