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

const AddPublishingHouse = () => {
    const { pubIdUpdate } = useParams();
    const [form] = Form.useForm();
    const [validPage, setValidPage] = useState(true);
    const [logoPublishing, setLogoPublishing] = useState(null);
    const history = useHistory();

    useEffect(() => {
        if (pubIdUpdate) {
            const getCategoryUpdate = async () => {
                const res = await callApi(`publishing_house/${pubIdUpdate}`, 'GET');
                if (res && res.status === 1 && res.data) {
                    const {
                        name,
                        description,
                        image
                    } = res.data;
                    form.setFieldsValue({
                        name,
                        description
                    })
                    setLogoPublishing(image);
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
    }, [pubIdUpdate, form])
    const onFinish = async (values) => {
        const {
            name,
            description
        } = values;
        const data = {
            name,
            description
        }
        if (logoPublishing) data.logo_file_name = logoPublishing;
        if (!pubIdUpdate) {
            try {
                const res = await callApi('publishing_house', 'POST', data);
                if (res && res.status === 1) {
                    message.success('Đã thêm mới nhà phát hành thành công!');
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
                const res = await callApi(`publishing_house/${pubIdUpdate}`, 'PUT', data);
                if (res && res.status === 1) {
                    message.success('Đã cập nhật nhà phát hành thành công!');
                    history.push('/publishing-house');
                } else {
                    if (res && res.code === '410')
                        message.warn(`${res.msg}`);
                }
            } catch (err) {
                console.log(err);
                message.error('Rất tiếc. Hiện tại không thể cập nhật nhà phát hành.')
            }
        }
    }
    const customRequest = async ({ file, onSuccess }) => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await callApi('upload', 'POST', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (res) {
                setLogoPublishing(res);
                onSuccess('ok');
            }
        } catch (err) {
            message.error('Không thể upload file lúc này.')
        }
    };

    const onHandleLogoPublishingChange = (info) => {
        switch (info.file.status) {
            case "uploading":
                break;
            case "done":
                // message.success(`${info.file.name} file được tải lên thành công`);
                break;
            case "removed":
                setLogoPublishing(null);
                break;
            default:
                // error or removed
                setLogoPublishing(null);
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
                                name="AddPublishingHouse"
                                onFinish={onFinish}
                                initialValues={{ quantity: 0, group_id: -1 }}
                                scrollToFirstError
                                style={{ width: '80%' }}
                            >

                                <Form.Item
                                    name="name"
                                    label='Tên nhà phát hành'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập tên nhà phát hành!',
                                            whitespace: true,
                                        },
                                        {
                                            min: 4,
                                            message: 'Tên nhà phát hành phải có ít nhất 4 ký tự'
                                        }
                                    ]}
                                    hasFeedback
                                >
                                    <Input autoFocus />
                                </Form.Item>
                                <Form.Item
                                    name="description"
                                    label="Mô tả nhà phát hành"
                                    hasFeedback
                                >
                                    <Input.TextArea  rows={6}/>
                                </Form.Item>

                                <Form.Item
                                    label='Logo nhà phát hành'
                                >
                                    <Upload
                                        maxCount={1}
                                        customRequest={customRequest}
                                        onChange={onHandleLogoPublishingChange}
                                    >
                                        <Button
                                            icon={<UploadOutlined />}
                                            style={{ backgroundColor: 'greenyellow', borderColor: 'greenyellow' }}
                                        >
                                            Upload
                                    </Button>
                                    </Upload>
                                    {
                                        logoPublishing &&
                                        <Image
                                            src={getImageURL(logoPublishing)}
                                            alt=''
                                            width={160}
                                        />
                                    }
                                </Form.Item>
                                <Form.Item {...tailFormItemLayout}>
                                    <Button type="primary" htmlType="submit" size="large">
                                        {!pubIdUpdate ? 'Thêm mới nhà phát hành' : 'Cập nhật nhà phát hành'}
                                    </Button>
                                </Form.Item>
                            </Form >
                        </Card>
                    </>
            }
        </>
    )
}

export default AddPublishingHouse