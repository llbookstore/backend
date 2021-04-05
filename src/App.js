import axios from 'axios'
import './App.css';
import Layout from './components/Layout/index'
import Login from './components/Login'
import { connect } from 'react-redux'
import { API_HOST } from './constants/config'
import { isAuth } from './utils/common'
function App(props) {
  const { user } = props;
  axios.defaults.baseURL = API_HOST;
  axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;

  return (
    <div className="App">
      {
        user.token && isAuth(user.token) ?
          <Layout />
          : <Login />
      }
      {
        console.log(isAuth(user.token))
      }
    </div>
  );
}
const mapStateToProps = (state) => {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(App);
