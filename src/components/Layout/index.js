import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'
import {
    Layout,
    // Breadcrumb 
} from 'antd';
import './Layout.scss'
import HeaderComponent from './Header'
import SiderComponent from './Sider'
import routes from '../../routes'
import { getAuthor, getPublishingHouse, getSales, getCategories } from '../../actions/index'
import { callApi } from '../../utils/callApi';
import { isAuth } from '../../utils/common';
const { Content, Footer } = Layout;

const LayoutPage = (props) => {
    const {
        onGetAuthors,
        onGetPublishingHouse,
        onGetSales,
        onGetCategories,
        user
    } = props;
    const { token } = user;
    const getAuthors = async () => {
        const res = await callApi('author', 'GET', { row_per_page: 100000 });
        if (res && res.status === 1) {
            onGetAuthors(res.data.rows)
        }
    }
    const getSalesAPI = async () => {
        const res = await callApi('sale', 'GET', { row_per_page: 100000 });
        if (res && res.status === 1) {
            onGetSales(res.data.rows)
        }
    }
    const getPublishingHouseAPI = async () => {
        const res = await callApi('publishing_house', 'GET', { row_per_page: 100000 });
        if (res && res.status === 1) {
            onGetPublishingHouse(res.data.rows)
        }
    }
    const getCategoriesAPI = async () => {
        const res = await callApi('category', 'GET', { row_per_page: 1000000 });
        if (res && res.status === 1) {
            onGetCategories(res.data.rows)
        }
    }

    useEffect(() => {
        getAuthors();
        getSalesAPI();
        getPublishingHouseAPI();
        getCategoriesAPI();
        // eslint-disable-next-line
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
                                minHeight: 440,
                            }}
                        >
                            <Switch>
                                {
                                    routes.map((route, index) => {
                                        const { component: Component, type: TypeAuth, ...rest } = route;
                                        return (
                                            <Route
                                                key={index}
                                                {...rest}
                                                render={(props) => isAuth(token, TypeAuth)
                                                    ? <Component {...props} />
                                                    : <Redirect to={{ pathname: '/', state: { from: props.location } }} />
                                                }
                                            />
                                        )
                                    })
                                }
                            </Switch>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>

            <Footer style={{ textAlign: 'center' }}>Trang Admin - Sách trí tuệ</Footer>

        </>
    )
}
const mapStateToProps = ({ user }) => {
    return { user }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onGetAuthors: (author) => dispatch(getAuthor(author)),
        onGetSales: (sales) => dispatch(getSales(sales)),
        onGetPublishingHouse: (publishing_house) => dispatch(getPublishingHouse(publishing_house)),
        onGetCategories: (category) => dispatch(getCategories(category))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LayoutPage);