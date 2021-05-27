export const API_HOST = 'https://llbook-api.herokuapp.com'
export const TINY_API_KEY = 'mbc05lhlp8rxoebbv0klufd7auraatoeyzpv7c820dsu8wy5'
export const RPP = 10 //row per page
export const DATE_FORMAT = 'DD/MM/YYYY'
export const PATTERN = {
    phone: /((09|03|07|08|05)+([0-9]{8})\b)/g
}

export const BOOK_FORMATS = [
    'Bìa mềm',
    'Bìa cứng',
    'Thẻ học thông minh'
]

export const LANGUAGES = [
    'Tiếng Việt',
    'Tiếng Trung',
    'Tiếng Anh'
]

export const ORDER_STATUS = [
    {
        status: -2,
        name: 'Tất cả',
        color: 'white'
    },
    {
        status: -1,
        name: 'Đã hủy',
        color: 'tomato'
    },
    {
        status: 0,
        name: 'Đang chờ xử lý',
        color: 'blue'
    },
    {
        status: 1,
        name: 'Đã xác nhận đơn hàng',
        color: 'yellow'
    },
    {
        status: 2,
        name: 'Đang chuyển hàng',
        color: 'violet'
    },
    {
        status: 3,
        name: 'Giao hàng thành công',
        color: 'green'
    },

]

export const paymentTypes = [
    {
        key: 0,
        title: 'Thanh toán bằng tiền mặt khi nhận hàng'
    },
    {
        key: 1,
        title: 'Thẻ ATM có Internet Banking',
    },
    {
        key: 2,
        title: 'Thẻ Visa/Master Card',
    },
]

export const ADVISORY_STATUS = [
    {
        status: -1,
        name: 'Tất cả',
        color: 'white'
    },
    {
        status: 0,
        name: 'Đã hủy',
        color: 'tomato'
    },
    {
        status: 1,
        name: 'Đang chờ xử lý',
        color: 'blue'
    },
    {
        status: 2,
        name: 'Đang xử lý',
        color: 'yellow'
    },
    {
        status: 3,
        name: 'Đã xử lý xong',
        color: 'violet'
    }
]

export const NEWS_STATUS = [
    { status: -1, name: 'Tất cả', color: 'white' },
    { status: 0, name: 'Đã xóa', color: 'tomato' },
    { status: 2, name: 'Nháp', color: 'black' },
    { status: 1, name: 'Hoạt động', color: 'lime ' }
]
export const REVIEW_STATUS = [
    { status: -1, name: 'Tất cả', color: 'white' },
    { status: 0, name: 'Đang chờ xét duyệt', color: 'lightblue' },
    { status: 1, name: 'Đã duyệt', color: 'green' },
]