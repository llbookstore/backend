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
            const getPublishingUpdate = async () => {
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
            getPublishingUpdate();
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
                    message.success('???? th??m m???i nh?? ph??t h??nh th??nh c??ng!');
                    form.resetFields();
                    setLogoPublishing(null);
                } else {
                    if (res && res.code === '410')
                        message.warn(`${res.msg}`);
                }
                if (res && res.status === 0) {
                    message.warn(res.msg);
                }

            }
            catch (err) {
                console.log(err)
                message.error('R???t ti???c hi???n t???i kh??ng th??? th??m s??ch.')
            }
        }
        else {
            try {
                const res = await callApi(`publishing_house/${pubIdUpdate}`, 'PUT', data);
                if (res && res.status === 1) {
                    message.success('???? c???p nh???t nh?? ph??t h??nh th??nh c??ng!');
                    history.push('/publishing-house');
                } else {
                    if (res && res.code === '410')
                        message.warn(`${res.msg}`);
                }
            } catch (err) {
                console.log(err);
                message.error('R???t ti???c. Hi???n t???i kh??ng th??? c???p nh???t nh?? ph??t h??nh.')
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
            message.error('Kh??ng th??? upload file l??c n??y.')
        }
    };

    const onHandleLogoPublishingChange = (info) => {
        switch (info.file.status) {
            case "uploading":
                break;
            case "done":
                // message.success(`${info.file.name} file ???????c t???i l??n th??nh c??ng`);
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
                                scrollToFirstError
                                style={{ width: '80%' }}
                            >

                                <Form.Item
                                    name="name"
                                    label='T??n nh?? ph??t h??nh'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui l??ng nh???p t??n nh?? ph??t h??nh!',
                                            whitespace: true,
                                        },
                                        {
                                            min: 4,
                                            message: 'T??n nh?? ph??t h??nh ph???i c?? ??t nh???t 4 k?? t???'
                                        }
                                    ]}
                                    hasFeedback
                                >
                                    <Input autoFocus />
                                </Form.Item>
                                <Form.Item
                                    name="description"
                                    label="M?? t??? nh?? ph??t h??nh"
                                    hasFeedback
                                >
                                    <Input.TextArea  rows={6}/>
                                </Form.Item>

                                <Form.Item
                                    label='Logo nh?? ph??t h??nh'
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
                                        {!pubIdUpdate ? 'Th??m m???i nh?? ph??t h??nh' : 'C???p nh???t nh?? ph??t h??nh'}
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