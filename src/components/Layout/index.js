import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { 
    Layout, 
    // Breadcrumb 
} from 'antd';
import './Layout.scss'
import HeaderComponent from './Header'
import SiderComponent from './Sider'
import routes from '../../routes'
const { Content, Footer } = Layout;

export default function LayoutPage() {
    return (
        <>
            <Layout>
                <HeaderComponent />
                <Layout>
                    <SiderComponent />
                    <Layout style={{ padding: '0 24px 24px' }}>
                        {/* <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>List</Breadcrumb.Item>
                            <Breadcrumb.Item>App</Breadcrumb.Item>
                        </Breadcrumb> */}
                        <Content
                            className="site-layout-background"
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                            }}
                        >
                            <Switch>
                                {
                                    routes.map((route, index) =>
                                        <Route key={index} {...route} />
                                    )
                                }
                            </Switch>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>

            <Footer style={{ textAlign: 'center' }}>LLBookStore - Admin Page</Footer>

        </>
    )
}

