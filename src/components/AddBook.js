import React, { useState } from 'react'
import {
    Form,
    Input,
    Button,
    Radio,
    Checkbox,
    DatePicker,
    Upload,
    message,
    Row,
    Col
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import { callApi, getImageURL } from '../utils/callApi'
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
export default function AddBook() {
    const [form] = Form.useForm();
    const [coverImgFile, setCoverImgFile] = useState();
    const history = useHistory();
    const onFinish = async (values) => {
        try {
            const fakeData = {
                name: '12341251',
                author_id: 7,
                description: 'asga',
                pages: 123,
                dimension: 'agas',
                weight: 330,
                publisher: 'sg',
                // published_date: '10/10/2020',
                publishing_id: 2,
                coverImgFile,
                // format,
                // book_translator,
                // quantity,
                price: 3333,
                // sale_id,
                // status,
                // language
            }
            // const a = new FormData();
            const res = callApi('book', 'POST', fakeData, { headers: { 'Content-Type': 'multipart/form-data' } })
            console.log(res);
        } catch (err) {
            console.log(err);
            message.error('Rất tiếc. Hiện tại không thể thêm sách.')
        }
    }
    const onImagePreview = () => {
        window.open(getImageURL(coverImgFile),'_blank');
    }
    const customRequest = async ({ file, onSuccess }) => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await callApi('upload', 'POST', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (res) {
                setCoverImgFile(res);
                onSuccess('ok');
            }
        } catch (err) {
            message.error('Không thể upload file lúc này.')
        }
    };

    const onCoverImageChange = (info) => {
        switch (info.file.status) {
            case "uploading":
                break;
            case "done":
                // message.success(`${info.file.name} file được tải lên thành công`);
                break;
            case "removed":
                setCoverImgFile('');
                break;
            default:
                // error or removed
                setCoverImgFile('');
        }
    }
    return (
        <Form
            {...formItemLayout}
            form={form}
            name="addbook"
            onFinish={onFinish}
            scrollToFirstError
        >
            <Row gutter={24}>
                <Col lg={12}>
                    <Form.Item
                        name="name"
                        label='Tên sách'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên sách!',
                                whitespace: true,
                            }
                        ]}
                    >

                        <Input autoFocus />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label={
                            <span>
                                Mô tả chi tiết:
                    </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mô tả chi tiết!',
                                whitespace: true,
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="cover_image"
                        label="Ảnh bìa"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu!',
                            }
                        ]}
                        hasFeedback
                    >

                        <Upload
                            name="cover_img"
                            listType="picture-card"
                            className="avatar-uploader"
                            onChange={onCoverImageChange}
                            // headers={{ 'content-type': 'multipart/form-data' }}
                            maxCount={1}
                            customRequest={customRequest}
                            onPreview={onImagePreview}
                            progress={{
                                strokeColor: {
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                },
                                strokeWidth: 3,
                                format: percent => `${parseFloat(percent.toFixed(2))}%`,
                            }}
                        >
                            <UploadOutlined />
                            Upload
                        </Upload>

                    </Form.Item>



                {/* <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                            {
                                type: 'email',
                                message: 'Email không hợp lệ!',
                            },
                            {
                                required: true,
                                message: 'Vui lòng nhập E-mail!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số điện thoại!',
                            },
                            {
                                pattern: /((09|03|07|08|05)+([0-9]{8})\b)/g,
                                message: 'Số điện thoại không hợp lệ!'
                            }
                        ]}
                    >
                        <Input
                            style={{
                                width: '100%',
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="gender"
                        label="Giới tính"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn giới tính!',
                            }
                        ]}
                    >
                        <Radio.Group>
                            <Radio value="0">Nam</Radio>
                            <Radio value="1">Nữ</Radio>
                        </Radio.Group>

                    </Form.Item>

                    <Form.Item
                        name="birth_date"
                        label="Ngày sinh"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số ngày sinh!'
                            },
                        ]}
                    >
                        <DatePicker format="DD/MM/YYYY" />
                    </Form.Item>
                    <Form.Item
                        name="agreement"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value ? Promise.resolve() : Promise.reject('B'),
                            },
                        ]}
                        {...tailFormItemLayout}
                    >
                        <Checkbox>
                            Tôi đã đọc và đồng ý với <a href="">điều khoản</a>
                        </Checkbox>
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            Thêm
                </Button>
                    </Form.Item>
                </Col>
                <Col lg={12}>
                    <Form.Item
                        name="name"
                        label='Tên sách'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên tài khoản!',
                                whitespace: true,
                            },
                            {
                                min: 6,
                                max: 20,
                                message: 'tên tài khoản phải lớn hơn 6 ký tự và nhỏ hơn 20 ký tự'
                            }
                        ]}
                    >

                        <Input autoFocus />
                    </Form.Item>

                    <Form.Item
                        name="fullname"
                        label={
                            <span>
                                Họ và tên
                </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập họ và tên!',
                                whitespace: true,
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu!',
                            },
                            {
                                min: 6,
                                max: 50,
                                message: 'Mật khẩu từ 6-50 ký tự.'
                            }
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>



                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                            {
                                type: 'email',
                                message: 'Email không hợp lệ!',
                            },
                            {
                                required: true,
                                message: 'Vui lòng nhập E-mail!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item> */}

                {/* <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập số điện thoại!',
                        },
                        {
                            pattern: /((09|03|07|08|05)+([0-9]{8})\b)/g,
                            message: 'Số điện thoại không hợp lệ!'
                        }
                    ]}
                >
                    <Input
                        style={{
                            width: '100%',
                        }}
                    />
                </Form.Item> */}

                <Form.Item
                    name="gender"
                    label="Giới tính"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn giới tính!',
                        }
                    ]}
                >
                    <Radio.Group>
                        <Radio value="0">Nam</Radio>
                        <Radio value="1">Nữ</Radio>
                    </Radio.Group>

                </Form.Item>

                <Form.Item
                    name="birth_date"
                    label="Ngày sinh"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập số ngày sinh!'
                        },
                    ]}
                >
                    <DatePicker format="DD/MM/YYYY" />
                </Form.Item>
                <Form.Item
                    name="agreement"
                    valuePropName="checked"
                    rules={[
                        {
                            validator: (_, value) =>
                                value ? Promise.resolve() : Promise.reject('B'),
                        },
                    ]}
                    {...tailFormItemLayout}
                >
                    <Checkbox>
                        Tôi đã đọc và đồng ý với
                        </Checkbox>
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Thêm
                </Button>
                </Form.Item>
                </Col>
            </Row>
        </Form >
    )
}
