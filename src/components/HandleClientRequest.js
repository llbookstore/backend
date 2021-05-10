import React from 'react'
import { Button, Select, Modal, Row, Col, Input, Switch, Popover, Popconfirm } from 'antd';
const { TextArea } = Input;
const { Option } = Select;
export default function HandleClientRequest(props) {
    const {
        showHandleReq,
        setShowHandleReq,
        handleSubmitHandleReq,
        allStatus,
        note,
        setNote,
        status,
        setStatus,
        isPaid,
        setIsPaid,
        showChangePaid,
        isReallyPaid
    } = props;
    return (
        <Modal
            title="Xử lý yêu cầu"
            visible={showHandleReq}
            onCancel={() => setShowHandleReq(false)}
            onOk={handleSubmitHandleReq}
            footer={[
                <Button key="back" onClick={() => setShowHandleReq(false)}>Hủy bỏ</Button>,
                <Button key="submit" type="primary" onClick={handleSubmitHandleReq}>
                    Xác nhận
            </Button>,
            ]}
        >
            <Row gutter={24} style={{ paddingBottom: '10px' }}>
                <Col lg={6}>
                    <b>Trạng thái</b>
                </Col>
                <Col lg={18}>
                    <Select
                        onChange={(value) => setStatus(value)}
                        value={status}
                        style={{ width: '100%' }}
                    >
                        {
                            allStatus.map(item => <Option key={item.status} value={item.status}>{item.name}</Option>)
                        }
                    </Select>
                </Col>
            </Row>
            {
                showChangePaid &&
                <Row gutter={24} style={{ paddingBottom: '10px' }}>
                    <Col lg={6}><b>Đã thanh toán</b></Col>
                    <Col lg={18}>
                        {
                            isPaid ? <Switch
                                checked={isPaid}
                                onChange={checked => setIsPaid(checked)}
                                disabled={isReallyPaid}
                            />
                                :
                                <Popover content='Xác nhận đã thanh toán?'>
                                    <Popconfirm
                                        title="Bạn có chắc xác nhận đã thanh toán chứ? Nếu xác nhận sẽ không thể hủy bỏ được!"
                                        onConfirm={() => setIsPaid(true)}
                                        onCancel={() => setIsPaid(false)}
                                        okText='Đồng ý'
                                        cancelText='Không'

                                    >
                                        <Switch checked={isPaid} />
                                    </Popconfirm>
                                </Popover>
                        }
                    </Col>
                </Row>
            }
            <Row gutter={24}>
                <Col lg={6}><b>Ghi chú</b></Col>
                <Col lg={18}>
                    <TextArea rows={4} value={note} onChange={(e) => setNote(e.target.value)} />
                </Col>
            </Row>
        </Modal>
    )
}
