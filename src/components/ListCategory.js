import React, { useEffect, useState } from 'react'
import {
    useHistory,
    Link,
    // useLocation 
} from 'react-router-dom'
import { connect } from 'react-redux'
import {
    Button,
    Table,
    message,
    Tag,
    Popover,
    Popconfirm
} from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { callApi } from '../utils/callApi'
import { getCategories } from '../actions/index'
import './ListCategory.scss'


const ListCategory = ({ category, onGetCategories }) => {
    const history = useHistory();
    const [updateCount, setUpdateCount] = useState(0);

    const getCategoryByGroupId = (groupId) => {
        return category.filter(item => item.group_id === groupId);
    }

    useEffect(() => {
        const getCategoriesAPI = async () => {
            const res = await callApi('category', 'GET', { row_per_page: 1000000 });
            if (res && res.status === 1) {
                onGetCategories(res.data.rows);
            }
        }
        getCategoriesAPI();
    }, [updateCount, onGetCategories]);

    const columns = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '10%',
            render: (text, record, index) => (
                <span>{index + 1}</span>
            )
        },
        {
            title: 'ID',
            key: 'category_id',
            align: 'center',
            dataIndex: 'category_id',
            width: '10%',
            render: (category_id) => (
                <span>{category_id}</span>
            )
        },
        {
            title: 'Trạng thái',
            key: 'status',
            align: 'center',
            dataIndex: 'active',
            width: '10%',
            render: (active) => (
                <>
                    {active === 1 && <Tag color='#87d068'>Hoạt động</Tag>}
                    {active === 0 && <Tag color='#f50'>Đã xóa</Tag>}
                </>
            )
        },

        {
            title: 'Action',
            key: 'action',
            align: 'center',
            width: '16%',
            render: record => {
                const onDeleteCategory = async (category_id) => {
                    try {
                        await callApi(`/category/${category_id}`, 'DELETE');
                        setUpdateCount(pre => pre + 1);
                        message.success('Xóa danh mục sách thành công!');
                    } catch (err) {
                        console.log(err);
                        message.error('Có lỗi xảy ra. Hiện tại không thể xóa.')
                    }
                }
                const onRestoreCategory = async (category_id) => {
                    try {
                        await callApi(`/category/${category_id}`, 'PUT', { active: 1 });
                        setUpdateCount(pre => pre + 1);
                        message.success('Khôi phục danh mục sách thành công!');
                    } catch (err) {
                        console.log(err);
                        message.error('Có lỗi xảy ra. Hiện tại không thể khôi phục.')
                    }
                }
                return (
                    <>
                        <Popover content='Cập nhật danh mục sách'>
                            <Link to={`/category/edit/${record.category_id}`}>
                                <EditOutlined
                                    style={{ cursor: 'pointer', padding: 5, color: 'blue' }}
                                />
                            </Link> |
                    </Popover>
                        {
                            record.active === 1 ?
                                <Popover content='Xóa danh mục sách ?'>
                                    <Popconfirm
                                        title="Bạn có chắc xóa danh mục sách này chứ?"
                                        onConfirm={() => onDeleteCategory(record.category_id)}
                                        okText='Đồng ý'
                                        cancelText='Không'
                                    >
                                        <DeleteOutlined style={{ cursor: 'pointer', padding: 5, color: 'red' }} />
                                    </Popconfirm>
                                </Popover>
                                :
                                <Popover content='Khôi phục xóa'>
                                    <Popconfirm
                                        title="Bạn có chắc khôi phục lại danh mục sách này chứ"
                                        onConfirm={() => onRestoreCategory(record.category_id)}
                                        okText='Đồng ý'
                                        cancelText='Không'
                                    >
                                        <ReloadOutlined style={{ cursor: 'pointer', padding: 5, color: 'orange' }} />
                                    </Popconfirm>
                                </Popover>
                        }
                    </>
                )
            }
        },
        {
            title: 'Tên danh mục sách',
            key: 'name',
            dataIndex: 'name',
            align: 'center',
            width: '30%',
            render: (name) => (
                <b>{name}</b>
            )
        },
        {
            title: 'Thời gian tạo',
            key: 'admin',
            align: 'center',
            width: '20%',
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

    const SubCategory = ({ categoryId }) => {
        return <Table
            columns={columns}
            rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
            dataSource={getCategoryByGroupId(categoryId)}
            pagination={false}
            bordered={'true'}
            rowKey={record => record.category_id}
        />;
    };
    return (
        <div>

            <Button type='primary' onClick={() => history.push('/category/add')}
                style={{ backgroundColor: 'green', marginLeft: '1em' }}
            >
                Tạo danh mục sách
                </Button>
            <Button type='primary' onClick={() => history.push('/category/arrange')}
                style={{ marginLeft: '1em' }}
            >
                Sắp xếp mục sách đầu tiên
                </Button>
            <Table
                columns={columns}
                dataSource={getCategoryByGroupId(-1)}
                rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light-main' : 'table-row-dark-main'}
                bordered={false}
                pagination={false}
                rowKey={record => record.category_id}
                expandable={{ expandedRowRender: record => <SubCategory categoryId={record.category_id} /> }}
                style={{ paddingBottom: '20px', paddingTop: '20px' }}
            />
        </div>
    )
}
const getStateToProps = ({ category }) => {
    return { category }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onGetCategories: (category) => dispatch(getCategories(category)),
    }
}
export default connect(getStateToProps, mapDispatchToProps)(ListCategory);
