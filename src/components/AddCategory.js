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
    Card
} from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { callApi } from '../utils/callApi'
import UnFindPage from './UnFindPage'

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
            if (findCategory.group_id === -1) {
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
                        name,
                        quantity,
                        group_id
                    } = res.data;
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
    }, [catIdUpdate, form])
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
                console.log(res)
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
    console.log(firstCategoryLayer())
    return (
        <>
            {
                !validPage ? <UnFindPage /> :
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
            }</>
    )
}
const mapStateToProps = ({ category }) => {
    return { category };
}
export default connect(mapStateToProps)(AddCategory);