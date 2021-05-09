import React, { useState, useEffect } from 'react'
import {
    Form,
    Button,
    message,
    Card,
    InputNumber,
    DatePicker
} from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { callApi } from '../utils/callApi'
import { momentObjectToTimestamp, timestampToMomentObject } from '../utils/common';
import UnFindPage from './UnFindPage'
const { RangePicker } = DatePicker;
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

const AddSale = () => {
    const { saleIdUpdate } = useParams();
    const [form] = Form.useForm();
    const [validPage, setValidPage] = useState(true);
    const history = useHistory();

    useEffect(() => {
        if (saleIdUpdate) {
            const getSaleUpdate = async () => {
                const res = await callApi(`sale/${saleIdUpdate}`, 'GET');
                if (res && res.status === 1 && res.data) {
                    const {
                        percent,
                        date_start,
                        date_end,
                    } = res.data;
                    const dateStart = timestampToMomentObject(date_start);
                    const dateEnd = timestampToMomentObject(date_end);
                    form.setFieldsValue({
                        percent,
                        date: [dateStart, dateEnd]
                    })
                }
                else {
                    setValidPage(false);
                }
            }
            getSaleUpdate();
        }
        return () => {
            setValidPage(true);
        }
    }, [saleIdUpdate, form])
    const onFinish = async (values) => {
        const {
            percent,
            date
        } = values;
        const data = {
            percent,
            date_start: momentObjectToTimestamp(date[0]),
            date_end: momentObjectToTimestamp(date[1]),
        }
        if (!saleIdUpdate) {
            try {
                const res = await callApi('sale', 'POST', data);
                if (res && res.status === 1) {
                    message.success('Đã thêm mới khuyến mại thành công!');
                    form.resetFields();
                }
            }
            catch (err) {
                console.log(err)
                message.error('Rất tiếc hiện tại không thể thêm sách.')
            }
        }
        else {
            try {
                const res = await callApi(`sale/${saleIdUpdate}`, 'PUT', data);
                if (res && res.status === 1) {
                    message.success('Đã cập nhật khuyến mại thành công!');
                    history.push('/sale');
                }
            } catch (err) {
                console.log(err);
                message.error('Rất tiếc. Hiện tại không thể cập nhật khuyến mại.')
            }
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
                                name="AddSale"
                                onFinish={onFinish}
                                scrollToFirstError
                                style={{ width: '80%' }}
                            >

                                <Form.Item
                                    name="percent"
                                    label='Phần trăm giảm giá'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập phần trăm khuyến mại!',
                                        }
                                    ]}
                                    hasFeedback
                                >
                                    <InputNumber
                                        autoFocus
                                        min={0}
                                        max={100}
                                        formatter={value => `${value}%`}
                                        parser={value => value.replace('%', '')}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="date"
                                    label="Thời gian khuyến mại"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập thời gian khuyến mại!',
                                        }
                                    ]}
                                    hasFeedback
                                >
                                    <RangePicker showTime format='DD/MM/YYYY hh:mm:ss' />
                                </Form.Item>
                                <Form.Item {...tailFormItemLayout}>
                                    <Button type="primary" htmlType="submit" size="large">
                                        {!saleIdUpdate ? 'Thêm mới khuyến mại' : 'Cập nhật khuyến mại'}
                                    </Button>
                                </Form.Item>
                            </Form >
                        </Card>
                    </>
            }
        </>
    )
}

export default AddSale