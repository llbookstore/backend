import React from 'react';
import './index.css';
import { Table } from 'antd';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import arrayMove from 'array-move';

const DragHandle = sortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

const SortableTable = ({ dataSource, setDataSource, columns, ...rest }) => {
    const sortColumns = () => {
        const col = [...columns];
        col.unshift({
            title: 'Sắp xếp',
            key: 'sort',
            dataIndex: 'sort',
            width: 30,
            className: 'drag-visible',
            render: () => <DragHandle />,
        });
        return col;
    }
   
    const onSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex) {
            const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el);
            console.log('Sorted items: ', newData);
            setDataSource(newData)
        }
    };

    const DraggableContainer = props => (
        <SortableContainer
            useDragHandle
            disableAutoscroll
            helperClass="row-dragging"
            onSortEnd={onSortEnd}
            {...props}
        />
    );

    const DraggableBodyRow = ({ className, style, ...restProps }) => {
        // function findIndex base on Table rowKey props and should always be a right array index
        const index = dataSource.findIndex(x => x.index === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps} />;
    };
    return (
        <Table
            {...rest}
            dataSource={dataSource}
            columns={sortColumns()}
            rowKey="index"
            components={{
                body: {
                    wrapper: DraggableContainer,
                    row: DraggableBodyRow,
                },
            }}
        />
    );
}
export default SortableTable;
