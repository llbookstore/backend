import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button, message } from 'antd'
import { callApi } from '../utils/callApi'
import jwt from 'jsonwebtoken'
import * as actions from '../actions/index'
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const style = {
    margin: '0 auto',
    marginTop: 100,
    maxWidth: '300px',
    backgroundColor: 'lightblue',
    padding: '20px 20px 1px 1px',
    borderRadius: '4%',
    boxShadow: '2px 1px 12px 4px'
}
const Login = (props) => {
    const { onGetUser } = props;
    const onFinish = async (values) => {
        const { username, password } = values;
        const dataLogin = { username, password };
        try {
            const res = await callApi('login', 'POST', dataLogin);
            const { status, data } = res;
            if (status === 0) message.error('Tên tài khoản hoặc mật khẩu không chính xác.');
            if (data.token) {
                //get user data
                const { userId, type } = jwt.decode(data.token);
                if(type !== 1) {
                    message.warn('Đăng nhập không thành công!')
                }
                else{
                    const res = await callApi(`/account/${userId}`, 'GET');
                    const userData = res.data;
                    userData.token = data.token;
                    onGetUser(userData);
                    message.success('Đăng nhập thành công!');
                }
            }
        } catch (err) {
            console.log(err);
        }
    };


    return (
        <Form
            style={style}
            {...layout}
            name="login"
            onFinish={onFinish}
        >
            <Form.Item
                label="Tài khoản"
                name="username"
                rules={
                    [
                        { required: true, message: 'Bạn hãy nhập tên tài khoản!' },
                        { min: 6, message: 'Tên tài khoản cần ít nhất 6 ký tự!' },
                    ]
                }
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Mật khẩu"
                name="password"
                rules={
                    [
                        { required: true, message: 'Bạn hãy nhập mật khẩu!' },
                        { min: 6, message: 'Mật khẩu cần ít nhất 6 ký tự!' },
                    ]
                }
            >
                <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout} >
                <Button type="primary" htmlType="submit">
                    Đăng nhập
        </Button>
            </Form.Item>
        </Form>
    );
};

const mapDispatchToState = (dispatch, props) => {
    return {
        onGetUser: (user) => dispatch(actions.getUserInfo(user))
    }
}
export default connect(null, mapDispatchToState)(Login);