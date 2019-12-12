import { Route, Redirect, withRouter } from 'react-router-dom';
import React from 'react';
import { BASE_URL } from '../../constant';
import Axios from 'axios';


class PrivateRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: localStorage.getItem('accessToken') ? true : false,
    }
  }

  componentDidMount() {
    this.verifyToken()
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if(this.state.isLogin) {
  //     console.log("aaa")
  //     this.verifyToken()
  //   } 
  // }

  verifyToken = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return this.setState({ isLogin: false });
    }
    try {
      await Axios({
        url: BASE_URL + "/me",
        method: "GET",
        headers: {
          "authorization": "Bearer " + token
        }
      })
    } catch (error) {
      localStorage.removeItem("accessToken")
      return this.setState({ isLogin: false })
    }
  }

  render() {
    const { component: Component, ...rest } = this.props;
    const { isLogin } = this.state;
    if (!isLogin) {
      return (<Redirect
        to={{
          pathname: "/login",
          state: { from: this.props.location }
        }}
      />)
    }
    return (
      this.props.from === '/' ?
        <Redirect
          to={this.props.to}
          key={this.props.location.pathname}
          render={props => (
            <Component {...this.props} />
          )}
        /> :
        <Route
          {...rest}
          key={this.props.location.pathname}
          render={props => (
            <Component {...this.props} />
          )}
        />
    )
  }
}

export default withRouter(PrivateRoute);