import { Route, Redirect } from 'react-router-dom';
import React from 'react';

const checkToken = () => {
  let token = localStorage.getItem("accessToken");
  if (token === null) return true;
  return false;
}

const PublicRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => checkToken() ?
      <Component {...props} /> :
      <Redirect
        to={{
          pathname: "/address",
          state: { from: props.location }
        }}
      />}
  />
);

export default PublicRoute;