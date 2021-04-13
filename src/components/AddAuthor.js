import React, { useState, useEffect } from 'react'
import {
    Form,
    Input,
    Button,
    Upload,
    message,
    Card,
    Image
} from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import { useHistory, useParams } from 'react-router-dom'
import { callApi, getImageURL } from '../utils/callApi'
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

const AddAuthor = () => {
    const { authorIdUpdate } = useParams();
    const [form] = Form.useForm();
    const [validPage, setValidPage] = useState(true);
    const [avatarAuthor, setAvatarAuthor] = useState(null);
    const history = useHistory();

    useEffect(() => {
        if (authorIdUpdate) {
            const getCategoryUpdate = async () => {
                const res = await callApi(`author/${authorIdUpdate}`, 'GET');
                if (res && res.status === 1 && res.data) {
                    const {
                        name,
                        description,
                        avatar
                    } = res.data;
                    form.setFieldsValue({
                        name,
                        description
                    })
                    setAvatarAuthor(avatar);
                }
                else {
                    setValidPage(false);
                }
            }
            getCategoryUpdate();
        }
        return () => {
            setValidPage(true);
        }
    }, [authorIdUpdate, form])
    const onFinish = async (values) => {
        const {
            name,
            description
        } = values;
        const data = {
            name,
            description
        }
        if (avatarAuthor) data.avatar_file_name = avatarAuthor;
        if (!authorIdUpdate) {
            try {
                const res = await callApi('author', 'POST', data);
                if (res && res.status === 1) {
                    message.success('Đã thêm mới tác giả thành công!');
                    form.resetFields();
                    setAvatarAuthor(null);
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
                const res = await callApi(`author/${authorIdUpdate}`, 'PUT', data);
                if (res && res.status === 1) {
                    message.success('Đã cập nhật tác giả thành công!');
                    history.push('/author');
                } else {
                    if (res && res.code === '410')
                        message.warn(`${res.msg}`);
                }
            } catch (err) {
                console.log(err);
                message.error('Rất tiếc. Hiện tại không thể cập nhật tác giả.')
            }
        }
    }
    const customRequest = async ({ file, onSuccess }) => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await callApi('upload', 'POST', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (res) {
                setAvatarAuthor(res);
                onSuccess('ok');
            }
        } catch (err) {
            message.error('Không thể upload file lúc này.')
        }
    };

    const onHandleavatarAuthorChange = (info) => {
        switch (info.file.status) {
            case "uploading":
                break;
            case "done":
                // message.success(`${info.file.name} file được tải lên thành công`);
                break;
            case "removed":
                setAvatarAuthor(null);
                break;
            default:
                // error or removed
                setAvatarAuthor(null);
        }
    }
    return (
        <>
            {
                !validPage ? <UnFindPage /> :
                    <>
                        <Card>
                            <Form
                                {...formItemLayout}
                                form={form}
                                name="AddAuthor"
                                onFinish={onFinish}
                                initialValues={{ quantity: 0, group_id: -1 }}
                                scrollToFirstError
                                style={{ width: '80%' }}
                            >

                                <Form.Item
                                    name="name"
                                    label='Tên tác giả'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập tên tác giả!',
                                            whitespace: true,
                                        },
                                        {
                                            min: 4,
                                            message: 'Tên tác giả phải có ít nhất 4 ký tự'
                                        }
                                    ]}
                                    hasFeedback
                                >
                                    <Input autoFocus />
                                </Form.Item>
                                <Form.Item
                                    name="description"
                                    label="Mô tả tác giả"
                                    hasFeedback
                                >
                                    <Input.TextArea  rows={6}/>
                                </Form.Item>

                                <Form.Item
                                    label='Avatar tác giả'
                                >
                                    <Upload
                                        maxCount={1}
                                        customRequest={customRequest}
                                        onChange={onHandleavatarAuthorChange}
                                    >
                                        <Button
                                            icon={<UploadOutlined />}
                                            style={{ backgroundColor: 'greenyellow', borderColor: 'greenyellow' }}
                                        >
                                            Upload
                                    </Button>
                                    </Upload>
                                    {
                                        avatarAuthor &&
                                        <Image
                                            src={getImageURL(avatarAuthor)}
                                            alt=''
                                            width={160}
                                        />
                                    }
                                </Form.Item>
                                <Form.Item {...tailFormItemLayout}>
                                    <Button type="primary" htmlType="submit" size="large">
                                        {!authorIdUpdate ? 'Thêm mới tác giả' : 'Cập nhật tác giả'}
                                    </Button>
                                </Form.Item>
                            </Form >
                        </Card>
                    </>
            }
        </>
    )
}

export default AddAuthor