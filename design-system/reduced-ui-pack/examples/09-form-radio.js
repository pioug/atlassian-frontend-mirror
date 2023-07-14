import React, { Fragment } from 'react';
// eslint-disable-next-line
import stuff from '!!style-loader!css-loader!../src/bundle.css';
import Warning from './utils/warning';

export default () => (
  <Fragment>
    <Warning />
    <form onSubmit={(e) => e.preventDefault()}>
      <h2>Settings</h2>
      <fieldset className="ak-field-group">
        <legend>
          <span>Time display options</span>
        </legend>
        <div className="ak-field-radio">
          <input
            type="radio"
            name="option"
            id="option1"
            value="option1"
            defaultChecked
          />
          <label htmlFor="option1">
            Use relative times (eg. 2 minutes ago)
          </label>
        </div>
        <div className="ak-field-radio">
          <input type="radio" name="option" id="option2" value="option2" />
          <label htmlFor="option2">Use your time zone</label>
        </div>
        <div className="ak-field-radio">
          <input
            type="radio"
            name="option"
            id="option3"
            value="option3"
            disabled
          />
          <label htmlFor="option3">Use the server time</label>
        </div>
      </fieldset>
      <fieldset className="ak-field-group">
        <legend>
          <span>More options</span>
        </legend>
        <div className="ak-field-radio">
          <input
            type="radio"
            name="tests"
            id="testsoption1"
            value="option1"
            disabled
            defaultChecked
          />
          <label htmlFor="testsoption1">Needs tests</label>
        </div>
        <div className="ak-field-radio">
          <input
            type="radio"
            name="tests"
            id="testsoption2"
            value="option2"
            disabled
          />
          <label htmlFor="testsoption2">No tests required</label>
        </div>
      </fieldset>
      <div className="ak-field-group">
        <button className="ak-button ak-button__appearance-primary">
          Save
        </button>
      </div>
    </form>
  </Fragment>
);
