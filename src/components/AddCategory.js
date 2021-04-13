import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import {
    Form,
    Input,
    Button,
    Row,
    Tag,
    Col,
    Select,
    message,
    InputNumber,
    Card,
    Popconfirm
} from 'antd'

import { useHistory, useParams, Link } from 'react-router-dom'
import { callApi } from '../utils/callApi'
import UnFindPage from './UnFindPage'
import SortableTable from './SortableTable/index'
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 32,
        },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const AddCategory = ({ category }) => {
    const { catIdUpdate } = useParams();
    const [form] = Form.useForm();
    const [validPage, setValidPage] = useState(true);
    const [isCateFirst, setIsCateFirst] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const history = useHistory();
    const firstCategoryLayer = () => {
        const listCate = category
            .filter(item => item.group_id === -1)
            .map(item => {
                return {
                    key: item.category_id,
                    value: item.name,
                    active: item.active
                }
            });
        listCate.unshift({
            key: -1,
            value: 'Không có',
            active: 1
        });
        if (catIdUpdate) {
            const findCategory = category.find(item => `${item.category_id}` === catIdUpdate);
            if (findCategory && findCategory.group_id === -1) {
                const findIndex = listCate.findIndex(item => `${item.key}` === `${catIdUpdate}`);
                listCate.splice(findIndex, 1);
            }
        }
        return listCate;
    }
    useEffect(() => {
        if (catIdUpdate) {
            const getCategoryUpdate = async () => {
                const res = await callApi(`category/${catIdUpdate}`, 'GET');
                if (res && res.status === 1) {
                    const {
                        category_id,
                        name,
                        quantity,
                        group_id
                    } = res.data;
                    if (group_id === -1) {
                        setIsCateFirst(true);
                        const listChild = category
                            .filter(item => item.group_id === category_id)
                            .map((item, index) => {
                                item.index = index;
                                item.key = index;
                                return item;
                            })
                        setDataSource(listChild);
                    }
                    form.setFieldsValue({
                        name,
                        quantity,
                        group_id
                    })
                }
                else {
                    setValidPage(false);
                }
            }
            getCategoryUpdate();
        }
        return () => {
            setValidPage(true);
            setIsCateFirst(false);
        }
    }, [catIdUpdate, form, category])
    const onFinish = async (values) => {
        const {
            name,
            quantity = 0,
            group_id
        } = values;
        const data = {
            name,
            quantity,
            group_id
        }
        if (!catIdUpdate) {
            try {
                const res = await callApi('category', 'POST', data);
                if (res && res.status === 1) {
                    message.success('Đã thêm mới danh mục sách thành công!');
                    form.resetFields();
                } else {
                    if (res && res.code === '410')
                        message.warn(`${res.msg}`);
                }

            }
            catch (err) {
                console.log(err)
                message.error('Rất tiếc hiện tại không thể thêm sách.')
            }
        }
        else {
            try {
                const res = await callApi(`category/${catIdUpdate}`, 'PUT', data);
                if (res && res.status === 1) {
                    message.success('Đã cập nhật danh mục sách thành công!');
                    history.push('/category');
                } else {
                    if (res && res.code === '410')
                        message.warn(`${res.msg}`);
                }
            } catch (err) {
                console.log(err);
                message.error('Rất tiếc. Hiện tại không thể cập nhật danh mục sách.')
            }
        }
    }
    const onHandleCategorySorting = async () => {
        try {
            let i = 1;
            for (const item of dataSource) {
                await callApi(`category/${item.category_id}`, 'PUT', { ordering: i });
                i++;
            }
        } catch (err) {
            console.log(err);
            message.error('Hệ thống đang xảy ra lỗi bạn vui lòng thử lại sau');
        }
    }
    const columns = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            render: (text, record, index) => (
                <span>{index + 1}</span>
            )
        },
        {
            title: 'ID',
            key: 'category_id',
            align: 'center',
            dataIndex: 'category_id',
            render: (category_id) => (
                <span>
                    <Link to={`/category/edit/${category_id}`}>
                        {category_id}
                    </Link>
                </span>
            )
        },
        {
            title: 'Trạng thái',
            key: 'status',
            align: 'center',
            dataIndex: 'active',
            render: (active) => (
                <>
                    {active === 1 && <Tag color='#87d068'>Hoạt động</Tag>}
                    {active === 0 && <Tag color='#f50'>Đã xóa</Tag>}
                </>
            )
        },
        {
            title: 'Tên danh mục sách',
            key: 'name',
            dataIndex: 'name',
            align: 'center',
            render: (name) => (
                <b>{name}</b>
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
                            ${record.created_at}`} <br />
                        </>
                    }
                    {
                        record.updated_at && <>
                            <strong style={{ color: 'blueviolet' }}>
                                Sửa: </strong> {record.updated_by} |
                            {record.updated_at}
                        </>
                    }
                </>
            )
        },
    ]
    return (
        <>
            {
                !validPage ? <UnFindPage /> :
                    <>
                        <Card>
                            <Form
                                {...formItemLayout}
                                form={form}
                                name="AddCategory"
                                onFinish={onFinish}
                                initialValues={{ quantity: 0, group_id: -1 }}
                                scrollToFirstError
                                style={{ width: '80%' }}
                            >

                                <Form.Item
                                    name="name"
                                    label='Tên danh mục sách'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập tên danh mục sách!',
                                            whitespace: true,
                                        },
                                        {
                                            min: 4,
                                            message: 'Tên danh mục sách phải có ít nhất 4 ký tự'
                                        }
                                    ]}
                                    hasFeedback
                                >
                                    <Input autoFocus />
                                </Form.Item>
                                <Form.Item
                                    name="quantity"
                                    label="Số lượng sách"
                                    hasFeedback
                                >
                                    <InputNumber min={0} />
                                </Form.Item>
                                <Form.Item
                                    name="group_id"
                                    label="Danh mục sách cha"
                                    hasFeedback
                                >
                                    <Select>
                                        {
                                            firstCategoryLayer()
                                                .map(item => <Select.Option key={item.key} value={item.key}>
                                                    {item.value} {item.active === 0 && <Tag color='tomato'>Đã xóa</Tag>}
                                                </Select.Option>)
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item {...tailFormItemLayout}>
                                    <Row justify='space-around'>
                                        <Col>
                                            <Button type="primary" htmlType="submit" size="large">
                                                {!catIdUpdate ? 'Thêm mới danh mục sách' : 'Cập nhật danh mục sách'}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Form >
                        </Card>
                        {
                            isCateFirst &&
                            <Card>
                                <Popconfirm
                                    title="Bạn có đồng ý sắp xếp các danh mục con theo thứ tự đã định chứ?"
                                    onConfirm={onHandleCategorySorting}
                                    okText='Đồng ý'
                                    cancelText='Không'
                                >
                                    <Button type='primary' style={{ backgroundColor: 'blueviolet', borderColor: 'blueviolet', marginBottom: '1em' }}>
                                        Sắp xếp danh mục sách theo STT
                                </Button>
                                </Popconfirm>
                                <SortableTable
                                    dataSource={dataSource}
                                    setDataSource={setDataSource}
                                    columns={columns}
                                    pagination={false}
                                />
                            </Card>
                        }
                    </>
            }
        </>
    )
}
const mapStateToProps = ({ category }) => {
    return { category };
}
export default connect(mapStateToProps)(AddCategory);