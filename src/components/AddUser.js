import React, { useState, useEffect } from 'react'
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    Select,
    message,
    Modal
} from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { callApi } from '../utils/callApi'
import { LANGUAGES, BOOK_FORMATS, PATTERN } from '../constants/config'
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
const allAccountTypes = [
    { id: 0, value: 'Tài khoản thường' },
    { id: 1, value: 'Tài khoản admin' },
]
const AddUser = () => {
    const { accIdUpdate } = useParams();
    const [showModalSetPassword, setShowModalSetPassword] = useState(false);
    const [form] = Form.useForm();
    const [validPage, setValidPage] = useState(true);
    const history = useHistory();
    useEffect(() => {
        if (accIdUpdate) {
            const getBookUpdate = async () => {
                const res = await callApi(`account/${accIdUpdate}`, 'GET');
                if (res && res.status === 1) {
                    const {
                        account_name,
                        full_name,
                        email,
                        type,
                        phone
                    } = res.data;
                    form.setFieldsValue({
                        username: account_name,
                        fullname: full_name,
                        email,
                        phone,
                        type
                    })

                }
                else {
                    setValidPage(false);
                }
            }
            getBookUpdate();
        }
    }, [accIdUpdate, form])
    const onFinish = async (values) => {
        const {
            username,
            fullname,
            password,
            email,
            phone,
            type = 0,
        } = values;
        const data = {
            username,
            fullname,
            password,
            email,
            phone,
            type
        }
        if (!accIdUpdate) {
            try {
                const res = await callApi('account', 'POST', data);
                if (res && res.status === 1) {
                    message.success('Đã thêm mới tài khoản thành công!');
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
                const res = await callApi(`account/${accIdUpdate}`, 'PUT', data);
                console.log(res)
                if (res && res.status === 1) {
                    message.success('Đã cập nhật tài khoản thành công!');
                    history.push('/account');
                } else {
                    if (res && res.code === '410')
                        message.warn(`${res.msg}`);
                }
            } catch (err) {
                console.log(err);
                message.error('Rất tiếc. Hiện tại không thể cập nhật tài khoản.')
            }
        }
    }

    const onSubmitSetPassword = async (values) => {
        const { newPassword } = values;
        try {
            const res = await callApi(`account/${accIdUpdate}/change-password`, 'PUT', {password: newPassword});
            if(res && res.status === 1) {
                message.success('Thay đổi mật khẩu thành công');
            }
            setShowModalSetPassword(false);
        } catch (err) {
            console.log(err);
            message.warn('Rất tiếc! Hiện tại không thể cập nhật mật khẩu');
        }
    }
    return (
        <>
            {
                !validPage ? <UnFindPage /> :
                    <>
                        <Form
                            {...formItemLayout}
                            form={form}
                            name="AddUser"
                            onFinish={onFinish}
                            initialValues={{ language: [LANGUAGES[0]], format: BOOK_FORMATS[0] }}
                            scrollToFirstError
                            style={{ width: '80%' }}
                        >

                            <Form.Item
                                name="username"
                                label='Account name'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên tài khoán!',
                                        whitespace: true,
                                    },
                                    {
                                        min: 6,
                                        message: 'Tên tài khoản phải có ít nhất 6 ký tự'
                                    }
                                ]}
                                hasFeedback
                            >
                                <Input autoFocus disabled={accIdUpdate} />
                            </Form.Item>
                            <Form.Item
                                name="fullname"
                                label="Họ tên"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập họ tên tài khoản!',
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input />
                            </Form.Item>
                            {
                                !accIdUpdate &&
                                <Form.Item
                                    name='password'
                                    label='Mật khẩu'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập mật khẩu',
                                        },
                                        {
                                            min: 6,
                                            message: 'Mật khẩu phải có ít nhất 6 ký tự'
                                        }
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>
                            }
                            <Form.Item
                                name="email"
                                label='Email'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập Email',
                                    },
                                    {
                                        type: 'email',
                                        message: 'Định dạng email không hợp lệ'
                                    }
                                ]}
                                hasFeedback
                            >
                                <Input type='email' />
                            </Form.Item>
                            <Form.Item
                                name="phone"
                                label='Số điện thoại'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên số điện thoại',
                                    },
                                    {
                                        pattern: PATTERN.phone,
                                        message: 'Định dạng số điện thoại không hợp lệ'
                                    }
                                ]}
                                hasFeedback
                            >
                                <Input />
                            </Form.Item>
                            {
                                accIdUpdate &&
                                <Form.Item
                                    name="type"
                                    label='Loại tài khoản'
                                >
                                    <Select>
                                        {
                                            allAccountTypes.map(item => <Select.Option key={item.id} value={item.id} >{item.value}</Select.Option>)
                                        }
                                    </Select>
                                </Form.Item>

                            }
                            <Form.Item {...tailFormItemLayout}>
                                <Row justify='space-around'>
                                    <Col>
                                        <Button type="primary" htmlType="submit" size="large">
                                            {!accIdUpdate ? 'Thêm' : 'Cập nhật'}
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button
                                            type="primary"
                                            size="large"
                                            style={{ backgroundColor: 'purple', borderColor: 'purple' }}
                                            onClick={() => setShowModalSetPassword(true)}
                                        >
                                            Đổi mật khẩu
                                    </Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Form >
                        <Modal
                            title='Đổi mật khẩu'
                            footer={null}
                            onCancel={() => setShowModalSetPassword(false)}
                            visible={showModalSetPassword}
                        >
                            <Form onFinish={onSubmitSetPassword} form={form} name='setPassword'>
                                <Form.Item
                                    name='newPassword'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'vui lòng nhập mật khẩu mới'
                                        },
                                        {
                                            min: 6,
                                            message: 'Mật khẩu phải có ít nhất 6 ký tự'
                                        }
                                    ]}
                                >
                                    <Input placeholder='mật khẩu mới' />

                                </Form.Item>
                                <Button
                                    type="primary"
                                    size="medium"
                                    htmlType="submit"
                                    style={{ backgroundColor: 'Highlight', borderColor: 'Highlight' }}
                                    onClick={() => setShowModalSetPassword(true)}
                                >
                                    Xác nhận thay đổi mật khẩu
                                    </Button>
                            </Form>
                        </Modal>
                    </>
            }</>
    )
}

export default AddUser;