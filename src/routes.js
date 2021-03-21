import ListBook from './components/ListBook';
import AddBook from './components/AddBook';
import { AppstoreOutlined, ReadOutlined } from '@ant-design/icons'
const router = [
    //book
    {
        path: 'nopath',
        key: 1,
        parent: -1,
        icon: <AppstoreOutlined />,
        title: 'Quản lý nội dung',
    },
    {
        path: '/book',
        exact: true,
        component: ListBook,
        key: 2,
        parent: 1,
        isMenu: true,
        icon: <ReadOutlined />,
        title: 'Quản lý sách'
    },
    {
        path: '/book/add',
        exact: true,
        component: AddBook,
        key: 3,
        parent: 1,
        isMenu: false,
    }
]

export default router;