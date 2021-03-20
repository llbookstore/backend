import React from 'react'
import { connect } from 'react-redux'
import { Layout, Row, Col, Dropdown, Avatar, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons'
import * as actions from '../../actions/index'
import './Header.scss'
const { Header } = Layout;

function HeaderComponent(props) {
    const { user, onLogout } = props;
    const menu = (<Menu theme='dark'>
        <Menu.Item key="SignOut" onClick={() => onLogout()}>
            Đăng xuất
    </Menu.Item>
    </Menu >)
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
const mapDispatchToState = (dispatch, props) => {
    return {
        onLogout: () => dispatch(actions.logOut())
    }
}
export default connect(mapStateToProps, mapDispatchToState)(HeaderComponent);