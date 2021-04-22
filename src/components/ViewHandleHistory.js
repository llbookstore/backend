import React from 'react';
import { Table, Modal } from 'antd';
import { timestampToDate } from '../utils/common';

export default function ViewHandleHistory(props) {
    const { historyData, showHistory, setShowHistory, allStatus } = props;
    const historyColumns = [
        {
            title: 'Admin ID',
            key: 'adminID',
            align: 'center',
            dataIndex: 'admin_id',
            render: admin_id => (
                <p>{admin_id}</p>
            )
        },
        {
            title: 'Admin',
            key: 'admin_name',
            align: 'center',
            dataIndex: 'admin_name',
            render: admin => (
                <p>{admin}</p>
            )
        },
        {
            title: 'Ghi chú',
            key: 'note',
            align: 'center',
            dataIndex: 'note',
            render: note => (
                <p>{note}</p>
            )
        },
        {
            title: 'Tình trạng',
            key: 'status',
            align: 'center',
            dataIndex: 'status',
            render: (status) => (
                <p>
                    {
                        allStatus.find(item => item.status === status).name
                    }
                </p>
            )
        },
        {
            title: 'Thời gian xử lý',
            key: 'time_handle',
            align: 'center',
            dataIndex: 'handled_at',
            render: handle_at => (
                <span>
                    {timestampToDate(handle_at, 'DD/MM/YYYY, LT')}
                </span>
            )
        },
    ]

    return (
        <Modal
            title="Lịch sử xử lý"
            visible={showHistory}
            footer={null}
            onCancel={() => setShowHistory(false)}
            width='60%'
        >
            <Table
                rowKey={(record) => record.handled_at}
                bordered={true}
                columns={historyColumns}
                dataSource={historyData}
                pagination={false}
            />
        </Modal>
    )
}
