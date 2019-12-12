import React from 'react';
import { Redirect, withRouter} from 'react-router-dom'
import { Row, Col, Input, Button, Form } from 'antd';
import Axios from 'axios';
import { BASE_URL } from '../../constant';
import './style.less'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      disabled: false
    }
  }

  onChangeInput = name => (event) => {
    this.setState({
      [name]: event.target.value,
      disabled: false,
      [`${name}Err`]: "",
      message: ""
    })
  }

  onBlur = name => () => {
    if (!this.state[name] && !this.state[`${name}Err`]) {
      return this.setState({
        [`${name}Err`]: "Please input your " + name,
        disabled: true
      })
    }
  }

  login = async () => {
    if (!this.state.username || !this.state.password) {
      return this.setState({ disabled: true })
    }
    try {
      const response = await Axios({
        url: BASE_URL + "/login",
        method: "POST",
        data: {
          username: this.state.username,
          password: this.state.password
        }
      })
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.token)
        this.setState({ isLogin: true })
      }
    } catch (error) {
      this.setState({ message: "Username or password not match" })
    }
  }

  render() {
    if (this.state.isLogin) {
      return (<Redirect
        to={{
          pathname: "/address",
          state: { from: this.props.location }
        }}
      />)
    }
    return (
      <Row gutter={[16, 16]} style={{ display: "flex", justifyContent: "center", paddingTop: "5%", height: "100vh", width: "100%" }}>
        <Col span={8}>
          <div style={{ fontSize: 40, padding: 20, textAlign: "center" }} >Demo Aimesoft</div>
          <div style={{ padding: "0 20px" }}>
            <label htmlFor="">Username</label>
            <Form.Item help={this.state.usernameErr}>
              <Input
                onChange={this.onChangeInput("username")}
                onBlur={this.onBlur("username")}
              />
            </Form.Item>
            <label htmlFor="">Password</label>
            <Form.Item help={this.state.passwordErr}>
              <Input.Password
                onChange={this.onChangeInput("password")}
                onBlur={this.onBlur("password")}
              />
            </Form.Item>
            <Form.Item help={this.state.message} className="login_submit">
              <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                <Button type="primary" onClick={this.login} disabled={this.state.disabled}>
                  Login
              </Button>
              </div>
            </Form.Item>
          </div>
        </Col>
      </Row>
    )
  }
}

export default withRouter(Login)