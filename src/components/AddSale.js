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
                    message.success('???? th??m m???i khuy???n m???i th??nh c??ng!');
                    form.resetFields();
                }
            }
            catch (err) {
                console.log(err)
                message.error('R???t ti???c hi???n t???i kh??ng th??? th??m s??ch.')
            }
        }
        else {
            try {
                const res = await callApi(`sale/${saleIdUpdate}`, 'PUT', data);
                if (res && res.status === 1) {
                    message.success('???? c???p nh???t khuy???n m???i th??nh c??ng!');
                    history.push('/sale');
                }
            } catch (err) {
                console.log(err);
                message.error('R???t ti???c. Hi???n t???i kh??ng th??? c???p nh???t khuy???n m???i.')
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
                                    label='Ph???n tr??m gi???m gi??'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui l??ng nh???p ph???n tr??m khuy???n m???i!',
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
                                    label="Th???i gian khuy???n m???i"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui l??ng nh???p th???i gian khuy???n m???i!',
                                        }
                                    ]}
                                    hasFeedback
                                >
                                    <RangePicker showTime format='DD/MM/YYYY hh:mm:ss' />
                                </Form.Item>
                                <Form.Item {...tailFormItemLayout}>
                                    <Button type="primary" htmlType="submit" size="large">
                                        {!saleIdUpdate ? 'Th??m m???i khuy???n m???i' : 'C???p nh???t khuy???n m???i'}
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