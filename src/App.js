
import './App.css';
import Layout from './components/Layout/index'
import Login from './components/Login'
import { connect } from 'react-redux'
function App(props) {
  const { user } = props;
  console.log(user);
  return (
    <div className="App">
      {
        user.account_id ?
        <Layout />
        : <Login />
      }
      {/* <Layout /> */}
    </div>
  );
}
const mapStateToProps = (state) => {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(App);
