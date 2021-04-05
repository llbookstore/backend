import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import {
    Layout,
    // Breadcrumb 
} from 'antd';
import './Layout.scss'
import HeaderComponent from './Header'
import SiderComponent from './Sider'
import routes from '../../routes'
import { getAuthor, getPublishingHouse, getSales } from '../../actions/index'
import { callApi } from '../../utils/callApi';
const { Content, Footer } = Layout;

const LayoutPage = (props) => {
    const { onGetAuthors, onGetPublishingHouse, onGetSales } = props;
    const getAuthors = async () => {
        const res = await callApi('author', 'GET', { row_per_page: 100000 })
        if(res.status === 1){
            onGetAuthors(res.data.rows)
        }
    }
    const getSalesAPI = async () => {
        const res = await callApi('sale', 'GET')
        if(res.status === 1){
            onGetSales(res.data)
        }
    }
    const getPublishingHouseAPI = async () => {
        const res = await callApi('publishing_house', 'GET', {row_per_page: 100000})
        if(res.status === 1){
            onGetPublishingHouse(res.data)
        }
    }
    useEffect(() => {
        getAuthors();
        getSalesAPI();
        getPublishingHouseAPI();
    }, []);
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

const mapDispatchToProps = (dispatch) => {
    return {
        onGetAuthors: (author) => dispatch(getAuthor(author)),
        onGetSales: (sales) => dispatch(getSales(sales)),
        onGetPublishingHouse: (publishing_house) => dispatch(getPublishingHouse(publishing_house))
    }
}
export default connect(null, mapDispatchToProps)(LayoutPage);