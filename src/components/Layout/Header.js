import React from 'react'
import { connect } from 'react-redux'
import { Layout, Row, Col, Dropdown, Avatar, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons'
import './Header.scss'
const { Header } = Layout;

const menu = (<Menu theme='dark'>
    <Menu.Item key="SignOut" >
        Đăng xuất
                    </Menu.Item>
</Menu >)
function HeaderComponent(props) {
    const { user } = props;
    return (
        <Header className="header">
            <Row className='header__container'>
                <Col>
                    <div className="header__logo" >LLBook store</div>
                </Col>
                <Col>
                    {user.account_name}
                    <Dropdown overlay={menu}>
                        <Avatar className='header__acc-icon' style={{ marginLeft: 8 }} icon={<UserOutlined />} />
                    </Dropdown>
                </Col>

            </Row >
        </Header >
    )
}
const mapStateToProps = (state) => {
    const { user } = state;
    return { user };
}
export default connect(mapStateToProps)(HeaderComponent);