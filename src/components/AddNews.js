import React, { useState, useEffect } from 'react'
import {
    Form,
    Input,
    Button,
    Upload,
    message,
    Select,
    Row,
    Col,
} from 'antd'
import { Editor } from '@tinymce/tinymce-react';
import { UploadOutlined } from '@ant-design/icons'
import { useHistory, useParams } from 'react-router-dom'
import { callApi, getImageURL } from '../utils/callApi'
import { TINY_API_KEY, NEWS_STATUS } from '../constants/config'
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
const AddNews = () => {
    const { newsIdUpdate } = useParams();
    const [form] = Form.useForm();
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [validPage, setValidPage] = useState(true);
    const [newsDescription, setNewsDescription] = useState('');
    const history = useHistory();
    useEffect(() => {
        if (newsIdUpdate) {
            const getNewsUpdate = async () => {
                const res = await callApi(`news/${newsIdUpdate}`, 'GET');
                if (res && res.status === 1) {
                    const {
                        title,
                        description,
                        thumbnail,
                        source,
                        summary,
                        status
                    } = res.data;
                    setThumbnailFile(thumbnail);
                    setNewsDescription(description);
                    form.setFieldsValue({
                        title,
                        source,
                        summary,
                        status
                    })

                }
                else {
                    setValidPage(false);
                }
            }
            getNewsUpdate();
        }
    }, [newsIdUpdate, form])

    const onFinish = async (values) => {
        const {
            title,
            source,
            summary,
            status
        } = values;
        const data = {
            thumbnail: thumbnailFile,
            title,
            source,
            summary,
            status,
            description: newsDescription
        }
        try {
            if (!newsIdUpdate) {
                const res = await callApi('news', 'POST', data);
                if (res && res.status === 1) {
                    message.success('???? th??m tin t???c th??nh c??ng!');
                    setThumbnailFile(null);
                    setNewsDescription('');
                    form.resetFields();
                }
                console.log(data);
                console.log(res);
            }
            else {
                const res = await callApi(`news/${newsIdUpdate}`, 'PUT', data);
                if (res && res.status === 1) {
                    message.success('???? c???p nh???t tin t???c th??nh c??ng!');
                    history.push('/news');
                }
            }
        } catch (err) {
            console.log(err);
            message.error('R???t ti???c. Hi???n t???i kh??ng th??? th??m tin t???c.')
        }
    }
    const onImagePreview = () => {
        window.open(getImageURL(thumbnailFile), '_blank');
    }
    const customRequest = async ({ file, onSuccess }) => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await callApi('upload', 'POST', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (res) {
                setThumbnailFile(res);
                onSuccess('ok');
            }
        } catch (err) {
            message.error('Kh??ng th??? upload file l??c n??y.')
        }
    };

    const onCoverImageChange = (info) => {
        switch (info.file.status) {
            case "uploading":
                break;
            case "done":
                // message.success(`${info.file.name} file ???????c t???i l??n th??nh c??ng`);
                break;
            case "removed":
                setThumbnailFile(null);
                break;
            default:
                // error or removed
                setThumbnailFile(null);
        }
    }

    return (
        <>
            {
                !validPage ? <UnFindPage /> :
                    <Form
                        {...formItemLayout}
                        form={form}
                        name="AddNews"
                        onFinish={onFinish}
                        initialValues={{ status: 2 }}
                        scrollToFirstError
                    >
                        <Row gutter={24}>
                            <Col lg={12}>
                                <Form.Item
                                    name="title"
                                    label='Ti??u ????? tin t???c'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui l??ng nh???p ti??u ????? tin t???c!',
                                            whitespace: true,
                                        },
                                        {
                                            min: 4,
                                            message: 'Ti??u ????? ??t nh???t ph???i c?? 4 k?? t???!',
                                        }
                                    ]}
                                    hasFeedback
                                >
                                    <Input.TextArea autoFocus rows={2} />
                                </Form.Item>
                                <Form.Item
                                    name='summary'
                                    label='T??m t???t tin t???c'
                                    rules={[
                                        { required: true, message: 'T??m t???t tin t???c kh??ng ???????c ????? tr???ng' },
                                        { max: 500, message: 'T??m t???t tin t???c kh??ng ???????c v?????t qu?? 500 k?? t???' },
                                    ]}
                                >
                                    <Input.TextArea rows={5} />
                                </Form.Item>
                            </Col>
                            <Col lg={12} >
                                <Form.Item
                                    label="???nh thumbnail tin t???c"
                                >
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Form.Item
                                            noStyle
                                            name="thumbnail"
                                        >
                                            <Upload
                                                listType="picture-card"
                                                className="avatar-uploader"
                                                onChange={onCoverImageChange}
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
                                        {thumbnailFile && <img src={getImageURL(thumbnailFile)} alt="avatar" width={100} height='auto' style={{ float: 'left' }} />}
                                    </div>
                                </Form.Item>
                                <Form.Item
                                    name='source'
                                    label='Ngu???n b??i vi???t'
                                    rules={[
                                        { max: 200, message: 'Ngu???n b??i vi???t kh??ng ???????c v?????t qu?? 500 k?? t???' },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name='status'
                                    label='Tr???ng th??i b??i vi???t'
                                >
                                    <Select >
                                        {
                                            newsIdUpdate ? //UPDATE
                                                NEWS_STATUS
                                                    .filter(item => item.status > -1)
                                                    .map(item => <Select.Option key={item.status} value={item.status}>{item.name}</Select.Option>)
                                                :
                                                NEWS_STATUS
                                                    .filter(item => item.status > 0)
                                                    .map(item => <Select.Option key={item.status} value={item.status}>{item.name}</Select.Option>)
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        N???i dung tin t???c:
                                <Editor
                            apiKey={TINY_API_KEY}
                            value={newsDescription}
                            init={{
                                height: 600,
                                menubar: false,
                                plugins: [
                                    'advlist autolink lists link image charmap print preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'image code',
                                    'insertdatetime media table paste code help wordcount'
                                ],
                                toolbar: 'bold italic underline | alignleft aligncenter alignright alignjustify table bullist | link image editimage preview | fontsizeselect',
                                images_reuse_filename: true,
                                images_upload_handler: async function (blobInfo, success, failure) {
                                    const formData = new FormData();
                                    formData.append('image', blobInfo.blob());
                                    try {
                                        const res = await callApi('upload', 'POST', formData);
                                        if (res) {
                                            success(getImageURL(res));
                                        }
                                    } catch (err) {
                                        failure('Kh??ng th??? upload ???nh');
                                    }

                                },
                            }}
                            onEditorChange={(content) => { setNewsDescription(content) }}
                        />
                        {!newsDescription ? <p style={{ color: 'red' }}>N???i dung tin t???c kh??ng ???????c b??? tr???ng</p>
                            : <br />
                        }
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" size="large">
                                {!newsIdUpdate ? 'Th??m m???i tin t???c' : 'C???p nh???t tin t???c'}
                            </Button>
                        </Form.Item>
                    </Form >
            }</>
    )
}


export default AddNews;