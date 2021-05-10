import React from 'react'
import { connect } from 'react-redux'
import { Layout, Menu } from 'antd';
import { useHistory } from 'react-router-dom'
import routes from '../../routes'
const { Sider } = Layout;
const { SubMenu } = Menu;
function SiderComponent({ user }) {
    const history = useHistory();
    const { type } = user;
    return (
        <Sider width={240} >
            <Menu
                mode="inline"
                // defaultSelectedKeys={['1','50']}
                defaultOpenKeys={['1', '50']}
                style={{ height: '100%', borderRight: 0 }}
            >
                 {
                    routes
                        .filter(item => item.parent === -2 && item.type.find(i => i === type))
                        .map(item =>
                            <Menu.Item
                                key={item.key}
                                icon={item.icon}
                                title={item.title}
                                onClick={() => history.push(item.path)}
                            >
                                {item.title}
                            </Menu.Item>
                        )
                }
                {
                    routes
                        .filter(item => item.parent === -1 && item.type.find(i => i === type))
                        .map(item => <SubMenu key={item.key} icon={item.icon} title={item.title} >
                            {
                                routes
                                    .filter(i => i.parent === item.key && i.isMenu && i.type.find(iSub => iSub === type))
                                    .map((sub, index) =>
                                        <Menu.Item key={index} icon={sub.icon} onClick={() => history.push(sub.path)}>
                                            {sub.title}
                                        </Menu.Item>
                                    )
                            }
                        </SubMenu>
                        )
                }
            </Menu>
        </Sider >
    )
}
const mapStateToProps = ({ user }) => {
    return { user }
}
export default connect(mapStateToProps)(SiderComponent)