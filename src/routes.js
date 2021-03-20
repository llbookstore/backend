import Home from './components/Home';

const router = [
    {
        path: '/',
        exact: true,
        component: Home
    },
    {
        path: '/book/:id',
        exact: true,
        component: ProductDetail
    },
    {
        path: '/favourite',
        exact: true, 
        component: Favourtites
    },
    {
        path: '/search',
        exact: true, 
        component: SearchProduct
    },
    {
        path: '/category/:id',
        exact: true, 
        component: CategoryDetail
    },
    {
        path: '/cart',
        exact: true, 
        component: Cart
    },
    {
        path: '/payment',
        exact: true, 
        component: Payment
    },
]

export default router;