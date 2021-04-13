import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
    Button,
    Tag,
    message,
    Popconfirm
} from 'antd'
import { Link } from 'react-router-dom'
import { callApi } from '../utils/callApi'
import SortableTable from './SortableTable/index'
const columns = [
    {
        title: 'STT',
        key: 'stt',
        align: 'center',
        render: (text, record, index) => (
            <span>{index + 1}</span>
        )
    },
    {
        title: 'ID',
        key: 'category_id',
        align: 'center',
        dataIndex: 'category_id',
        render: (category_id) => (
            <span>
                <Link to={`/category/edit/${category_id}`}>
                    {category_id}
                </Link>
            </span>
        )
    },
    {
        title: 'Trạng thái',
        key: 'status',
        align: 'center',
        dataIndex: 'active',
        render: (active) => (
            <>
                {active === 1 && <Tag color='#87d068'>Hoạt động</Tag>}
                {active === 0 && <Tag color='#f50'>Đã xóa</Tag>}
            </>
        )
    },
    {
        title: 'Tên danh mục sách',
        key: 'name',
        dataIndex: 'name',
        align: 'center',
        render: (name) => (
            <b>{name}</b>
        )
    },
    {
        title: 'Thời gian tạo',
        key: 'admin',
        align: 'center',
        render: record => (
            <>
                <strong>Tạo: </strong>
                {
                    record.created_by &&
                    <>
                        <span style={{ color: 'yellowgreen' }}>
                        </span>{`${record.created_by} | 
                        ${record.created_at}`} <br />
                    </>
                }
                {
                    record.updated_at && <>
                        <strong style={{ color: 'blueviolet' }}>
                            Sửa: </strong> {record.updated_by} |
                        {record.updated_at}
                    </>
                }
            </>
        )
    },
]
const OrderingCategory = ({ category, category_id = -1 }) => {
    const [dataSource, setDataSource] = useState(() => {
        const listChild = category
            .filter(item => `${item.group_id}` === `${category_id}`)
            .map((item, index) => {
                item.index = index;
                item.key = index;
                return item;
            })
        return listChild
    });
    const onHandleCategorySorting = async () => {
        try {
            let i = 1;
            for (const item of dataSource) {
                await callApi(`category/${item.category_id}`, 'PUT', { ordering: i });
                i++;
            }
            message.success('Đã cập nhật thứ tự danh mục sách thành công');
        } catch (err) {
            console.log(err);
            message.error('Hệ thống đang xảy ra lỗi bạn vui lòng thử lại sau');
        }
    }
    return (
        <>
            <Popconfirm
                title="Bạn có đồng ý sắp xếp các danh mục con theo thứ tự đã định chứ?"
                onConfirm={onHandleCategorySorting}
                okText='Đồng ý'
                cancelText='Không'
            >
                <Button type='primary' style={{ backgroundColor: 'blueviolet', borderColor: 'blueviolet', marginBottom: '1em' }}>
                    Sắp xếp danh mục sách theo STT
            </Button>
            </Popconfirm>
            <SortableTable
                dataSource={dataSource}
                setDataSource={setDataSource}
                columns={columns}
                pagination={false}
            />
        </>
    )
}
const mapStateToProps = ({ category }) => {
    return { category };
}
export default connect(mapStateToProps)(OrderingCategory);