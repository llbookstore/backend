import ListBook from './components/ListBook';
import AddBook from './components/AddBook';
import ListUser from './components/ListUser'
import AddUser from './components/AddUser'
import ListCategory from './components/ListCategory'
import AddCategory from './components/AddCategory'
import OrderingCategory from './components/OrderingCategory'
import ListPublishingHouse from './components/ListPublishingHouse'
import AddPublishingHouse from './components/AddPublishingHouse'
import ListAuthor from './components/ListAuthor'
import AddAuthor from './components/AddAuthor'
import ListSale from './components/ListSale'
import AddSale from './components/AddSale'
import BillManagement from './components/BillManagement'
import AdvisoryManagement from './components/AdvisoryManagement'
import ListNews from './components/ListNews'
import AddNews from './components/AddNews'
import ReviewManagement from './components/ReviewManagement'
import Dashboard from './components/Dashboard'
import {
    AppstoreOutlined,
    ReadOutlined,
    UserOutlined,
    UnorderedListOutlined,
    ApartmentOutlined,
    HomeOutlined,
    SolutionOutlined,
    TagsOutlined,
    ScheduleOutlined,
    QuestionOutlined,
    ContainerOutlined,
    CommentOutlined
} from '@ant-design/icons'

//parent: -1 - firstlayer - submenu
//parent: -2 -firstlayer - menuitem
const router = [
    //book
    {
        path: 'nopath',
        key: 1,
        parent: -1,
        icon: <AppstoreOutlined />,
        title: 'Quản lý nội dung',
        type: [1, 2]
    },
    {
        path: '/book',
        exact: true,
        component: ListBook,
        key: 2,
        parent: 1,
        isMenu: true,
        icon: <ReadOutlined />,
        title: 'Quản lý sách',
        type: [1, 2]
    },
    {
        path: '/book/add',
        exact: true,
        component: AddBook,
        key: 3,
        parent: 1,
        isMenu: false,
        type: [1, 2]
    },
    {
        path: '/book/edit/:bookIdUpdate',
        exact: true,
        component: AddBook,
        key: 4,
        parent: 1,
        isMenu: false,
        type: [1, 2]
    },
    //category
    {
        path: '/category',
        exact: true,
        component: ListCategory,
        key: 10,
        parent: 1,
        isMenu: true,
        icon: <ApartmentOutlined />,
        title: 'Quản lý danh mục sách',
        type: [1, 2]
    },
    {
        path: '/category/add',
        exact: true,
        component: AddCategory,
        key: 11,
        parent: 10,
        isMenu: false,
        type: [1, 2]
    },
    {
        path: '/category/edit/:catIdUpdate',
        exact: true,
        component: AddCategory,
        key: 12,
        parent: 10,
        isMenu: false,
        type: [1, 2]
    },
    {
        path: '/category/arrange',
        exact: true,
        component: OrderingCategory,
        key: 13,
        parent: 10,
        isMenu: false,
        type: [1, 2]
    },//publishing-house
    {
        path: '/publishing-house',
        exact: true,
        component: ListPublishingHouse,
        key: 20,
        parent: 1,
        isMenu: true,
        icon: <HomeOutlined />,
        title: 'Quản lý nhà phát hành',
        type: [1, 2]
    },
    {
        path: '/publishing-house/add',
        exact: true,
        component: AddPublishingHouse,
        key: 21,
        parent: 20,
        isMenu: false,
        type: [1, 2]
    },
    {
        path: '/publishing-house/edit/:pubIdUpdate',
        exact: true,
        component: AddPublishingHouse,
        key: 22,
        parent: 20,
        isMenu: false,
        type: [1, 2]
    },//author
    {
        path: '/author',
        exact: true,
        component: ListAuthor,
        key: 30,
        parent: 1,
        isMenu: true,
        icon: <SolutionOutlined />,
        title: 'Quản lý tác giả',
        type: [1, 2]
    },
    {
        path: '/author/add',
        exact: true,
        component: AddAuthor,
        key: 31,
        parent: 30,
        isMenu: false,
        type: [1, 2]
    },
    {
        path: '/author/edit/:authorIdUpdate',
        exact: true,
        component: AddAuthor,
        key: 32,
        parent: 30,
        isMenu: false,
        type: [1, 2]
    },//sale
    {
        path: '/sale',
        exact: true,
        component: ListSale,
        key: 40,
        parent: 1,
        isMenu: true,
        icon: <TagsOutlined />,
        title: 'Quản lý khuyến mại',
        type: [1, 2]
    },
    {
        path: '/sale/add',
        exact: true,
        component: AddSale,
        key: 41,
        parent: 40,
        isMenu: false,
        type: [1, 2]
    },
    {
        path: '/sale/edit/:saleIdUpdate',
        exact: true,
        component: AddSale,
        key: 42,
        parent: 40,
        isMenu: false,
        type: [1, 2]
    },//news
    {
        path: '/news',
        exact: true,
        component: ListNews,
        key: 45,
        parent: 1,
        isMenu: true,
        icon: <ContainerOutlined />,
        title: 'Quản lý tin tức',
        type: [1, 2]
    },
    {
        path: '/news/add',
        exact: true,
        component: AddNews,
        key: 46,
        parent: 45,
        isMenu: false,
        type: [1, 2]
    },
    {
        path: '/news/edit/:newsIdUpdate',
        exact: true,
        component: AddNews,
        key: 47,
        parent: 45,
        isMenu: false,
        type: [1, 2]
    },
    //users
    {
        path: 'nopath',
        key: 50,
        parent: -1,
        icon: <UserOutlined />,
        title: 'Users',
        type: [1, 2]
    },
    {
        path: '/account',
        exact: true,
        key: 51,
        parent: 50,
        component: ListUser,
        icon: <UnorderedListOutlined />,
        title: 'Quản lý tài khoản',
        isMenu: true,
        type: [1]
    },
    {
        path: '/account/add',
        exact: true,
        component: AddUser,
        key: 52,
        parent: 50,
        isMenu: false,
        type: [1]
    },
    {
        path: '/account/:accIdUpdate',
        exact: true,
        component: AddUser,
        key: 53,
        parent: 10,
        isMenu: false,
        type: [1]
    },
    {
        path: '/advisory',
        key: 54,
        parent: 50,
        isMenu: true,
        icon: <QuestionOutlined />,
        component: AdvisoryManagement,
        title: 'Tư vấn khách hàng',
        type: [1, 2]
    },
    {
        path: '/review',
        key: 55,
        parent: 50,
        isMenu: true,
        icon: <CommentOutlined />,
        component: ReviewManagement,
        title: 'Quản lý đánh giá sách',
        type: [1, 2]
    },
    {
        path: '/dashboard',
        key: 99,
        parent: -2,
        isMenu: true,
        icon: <ScheduleOutlined />,
        component: Dashboard,
        title: 'Dashboard',
        type: [1]
    },
    {
        path: '/bill',
        key: 100,
        parent: -2,
        isMenu: true,
        icon: <ScheduleOutlined />,
        component: BillManagement,
        title: 'Quản lý đơn hàng',
        type: [1, 2]
    },
]

export default router;