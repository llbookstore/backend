import React from 'react'
import { Result, Button } from 'antd'
import { useHistory, } from 'react-router-dom';
export default function UnFindPage() {
    const history = useHistory();
    return (
        <Result
            status="404"
            title="404"
            subTitle="Rất tiếc, trang web này không tồn tại!"
            extra={<Button type="primary" onClick={() => history.goBack()}>Trở lại</Button>}
        />
    )
}
