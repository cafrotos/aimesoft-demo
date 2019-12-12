import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from './components/Routes/PrivateRoute';
import PublicRoute from './components/Routes/PublicRoute';
import Login from './views/Login';
import Address from './views/Address'

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <PrivateRoute exact path="/" component={Address} />
          <PublicRoute exact path="/login" component={Login} />
          <PrivateRoute exact path="/address" component={Address} />
          <Route exact path='*' component={p => (<div>Not found</div>)} />
        </Switch>
      </Router>
    );
  }
}

export default App;
