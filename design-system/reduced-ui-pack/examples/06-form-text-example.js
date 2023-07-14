import React, { Fragment } from 'react';
// eslint-disable-next-line
import stuff from '!!style-loader!css-loader!../src/bundle.css';
import Warning from './utils/warning';

export default () => (
  <Fragment>
    <Warning />
    <form onSubmit={(e) => e.preventDefault()}>
      <h2>Log in form</h2>
      <div className="ak-field-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          className="ak-field-text ak-field__size-medium"
          id="username"
          name="username"
          placeholder="eg. you@yourcompany.com"
        />
      </div>
      <div className="ak-field-group">
        <label htmlFor="org">Organisation</label>
        <input
          type="text"
          className="ak-field-text ak-field__size-medium"
          id="org"
          name="org"
          disabled
        />
      </div>
      <div className="ak-field-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="ak-field-password ak-field__size-medium"
          id="password"
          name="password"
        />
      </div>
      <div className="ak-field-group">
        <button className="ak-button ak-button__appearance-primary">
          Log in
        </button>
      </div>
    </form>
  </Fragment>
);
