import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
    Form,
    Input,
    Button,
    TreeSelect,
    Select,
    Tag,
    DatePicker,
    Upload,
    message,
    Row,
    Col,
    InputNumber,
    Space
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import { callApi, getImageURL } from '../utils/callApi'
import { timestampToDate } from '../utils/common'
import { LANGUAGES, BOOK_FORMATS } from '../constants/config'
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
const { Option } = Select;
const { SHOW_PARENT } = TreeSelect;
const { TextArea } = Input;
const AddBook = (props) => {
    const { author, sale, publishing_house, category } = props;
    const [form] = Form.useForm();
    const [coverImgFile, setCoverImgFile] = useState(null);
    const history = useHistory();
    const categoryTree = () => {
        return category.filter(item =>
            item.group_id === -1
        ).map((i) => {
            const newItem = { title: i.name, value: i.category_id, key: i.category_id };
            const filterChildren = category
                .filter(item => item.group_id === i.category_id)
                .map((item, index) => {
                    const itemChildren = {
                        title: item.name,
                        value: item.category_id,
                        key: item.category_id
                    }
                    return itemChildren;
                });
            newItem.children = filterChildren;
            return newItem;
        })
    }
    const onError = async (values) => {
        console.log(values);
    }
    const onFinish = async (values) => {
        console.log(values);
        try {
            // const res = callApi('book', 'POST', fakeData, { headers: { 'Content-Type': 'multipart/form-data' } })
            // console.log(res);
        } catch (err) {
            console.log(err);
            message.error('Rất tiếc. Hiện tại không thể thêm sách.')
        }
    }
    const onImagePreview = () => {
        window.open(getImageURL(coverImgFile), '_blank');
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
                setCoverImgFile(null);
                break;
            default:
                // error or removed
                setCoverImgFile(null);
        }
    }

    return (
        <Form
            {...formItemLayout}
            form={form}
            name="addbook"
            onFinish={onFinish}
            onError={onError}
            initialValues={{
                language: [LANGUAGES[0]],
                format: BOOK_FORMATS[0]
            }}
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
                        hasFeedback
                    >
                        <Input autoFocus />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Giới thiệu sách"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập giới thiệu sách!',
                                whitespace: true,
                            }
                        ]}
                        hasFeedback
                    >
                        <TextArea />
                    </Form.Item>
                    <Form.Item
                        label="Ảnh bìa"
                        name="cover_img"
                        rules={[
                            {
                               validator: () => {
                                    if(!coverImgFile) return Promise.reject('Ảnh bìa không được để trống');
                                    else 
                                    return Promise.resolve();
                               }
                            }
                        ]}
                    >
                        <Upload
                            name="cover_img"
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
                    <Form.Item
                        name="author"
                        label="Tác giả"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn tác giả!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {
                                author.map(item =>
                                    <Option key={item.author_id} value={item.author_id}>
                                        <Space>
                                            {item.name}
                                            {!item.active && <Tag color='error' style={{ fontWeight: 600 }}>Inactive</Tag>}
                                        </Space>
                                    </Option>)
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="publisher"
                        label='Nhà xuất bản'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên nhà xuất bản',
                                whitespace: true,
                            }
                        ]}
                        hasFeedback
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="published_date"
                        label='Ngày xuất bản'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập ngày xuất bản',
                            }
                        ]}
                        hasFeedback
                    >
                        <DatePicker format='DD/MM/YYYY' placeholder='DD/MM/YYYY' />
                    </Form.Item>
                    <Form.Item
                        name="publishing_house"
                        label="Nhà phát hành"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn Nhà phát hành!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {
                                publishing_house.map(item =>
                                    <Option key={item.publishing_id} value={item.publishing_id}>
                                        <Space>
                                            {item.name}
                                            {!item.active && <Tag color='error' style={{ fontWeight: 600 }}>Inactive</Tag>}
                                        </Space>
                                    </Option>)
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name='categories'
                        label='Loại sách'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn loại sách!',
                            },
                        ]}
                        hasFeedback
                    >
                        <TreeSelect
                            treeData={categoryTree()}
                            showSearch
                            allowClear
                            multiple
                            // dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            filterTreeNode={(input, cate) => cate.title.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            // treeCheckable={true}
                            // showCheckedStrategy={SHOW_PARENT}
                            placeholder='Please select'
                        />
                    </Form.Item>
                </Col>
                <Col lg={12} >
                    <Form.Item
                        name='translator'
                        label='Người dịch'
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label='Giá bìa'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập giá bìa',
                            }
                        ]}
                        hasFeedback
                    >
                        <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                            formatter={value => `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                    <Form.Item
                        name="sale"
                        label="Khuyến mại"
                    >
                        <Select
                            showSearch
                            allowClear={true}
                            optionFilterProp="saleItem"
                            filterOption={(input, option) => {
                                return option.children[1].props.children[0].toString().indexOf(input) >= 0;
                            }}
                        >
                            {
                                sale.map(item =>
                                    <Option key={item.sale_id} value={item.sale_id}>
                                        Giảm:
                                        <span style={{ color: 'green', fontWeight: 600 }}>
                                            {item.percent}%
                                        </span>
                                        <Space>
                                            <span style={{ color: 'tomato' }}>
                                                [{timestampToDate(item.date_start)} - {timestampToDate(item.date_end)}]
                                            </span>
                                            {!item.active && <Tag color='error' style={{ fontWeight: 600 }}>Inactive</Tag>}
                                        </Space>
                                    </Option>)
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name='quantity'
                        label='Số lượng'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số lượng sách',
                            }
                        ]}
                        hasFeedback
                    >
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item
                        name='pages'
                        label='Số trang sách'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số trang sách',
                            }
                        ]}
                        hasFeedback
                    >
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item
                        name='dimension'
                        label='Kích thước sách(cm)'
                    >
                        <Input.Group compact>
                            <Form.Item
                                name='dimensionX'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập chiều dài sách',
                                    }
                                ]}
                                hasFeedback
                                noStyle
                            >
                                <InputNumber style={{ width: 100, textAlign: 'center' }} placeholder="Chiều dài" min={0} />
                            </Form.Item>
                            <Input
                                className="site-input-split"
                                style={{
                                    width: 30,
                                    borderLeft: 0,
                                    borderRight: 0,
                                    pointerEvents: 'none',
                                }}
                                value='X'
                                disabled
                            />
                            <Form.Item
                                name='dimensionY'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập chiều rộng sách',
                                    }
                                ]}
                                hasFeedback
                                noStyle
                            >
                                <InputNumber
                                    className="site-input-right"
                                    style={{
                                        width: 100,
                                        textAlign: 'center',
                                    }}
                                    placeholder="Chiều rộng"
                                    min={0}
                                />

                            </Form.Item>
                        </Input.Group>
                    </Form.Item>
                    <Form.Item
                        name='weight'
                        label='Khối lượng sách(gam)'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập khối lượng sách',
                            }
                        ]}
                        hasFeedback
                    >
                        <InputNumber min={0} />
                    </Form.Item>

                    <Form.Item
                        name='language'
                        label='Ngôn ngữ'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn ngôn ngữ sách',
                            }
                        ]}
                        hasFeedback
                    >
                        <Select
                            showSearch
                            mode='multiple'
                            allowClear={true}
                        >
                            {
                                LANGUAGES.map((item, index) =>
                                    <Option key={index} value={item}>
                                        {item}
                                    </Option>)
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name='format'
                        label='Định dạng'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn định dạng sách',
                            }
                        ]}
                        hasFeedback

                    >
                        <Select
                            showSearch
                            allowClear={true}
                        >
                            {
                                BOOK_FORMATS.map((item, index) =>
                                    <Option key={index} value={item}>
                                        {item}
                                    </Option>)
                            }
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                    Thêm
                </Button>
            </Form.Item>
        </Form >
    )
}

const mapStateToProps = ({ author, sale, publishing_house, category }) => {
    return { author, sale, publishing_house, category }
}

export default connect(mapStateToProps)(AddBook);