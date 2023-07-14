import React, { Fragment } from 'react';
// eslint-disable-next-line
import stuff from '!!style-loader!css-loader!../src/bundle.css';
import Warning from './utils/warning';

export default () => (
  <Fragment>
    <Warning />
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="ak-field-group">
        <label htmlFor="search">Search</label>
        <input
          type="search"
          className="ak-field-search"
          id="search"
          name="search"
        />
      </div>
      <div className="ak-field-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          className="ak-field-email"
          id="email"
          name="email"
        />
      </div>
      <div className="ak-field-group">
        <label htmlFor="url">Url</label>
        <input type="url" className="ak-field-url" id="url" name="url" />
      </div>
      <div className="ak-field-group">
        <label htmlFor="tel">Tel</label>
        <input type="tel" className="ak-field-tel" id="tel" name="tel" />
      </div>
      <div className="ak-field-group">
        <label htmlFor="number">Number</label>
        <input
          type="number"
          className="ak-field-number"
          id="number"
          name="number"
        />
      </div>
      <div className="ak-field-group">
        <label htmlFor="range">Range</label>
        <input
          type="range"
          className="ak-field-range"
          id="range"
          name="range"
        />
      </div>
      <div className="ak-field-group">
        <label htmlFor="date">Date</label>
        <input type="date" className="ak-field-date" id="date" name="date" />
      </div>
      <div className="ak-field-group">
        <label htmlFor="month">Month</label>
        <input
          type="month"
          className="ak-field-month"
          id="month"
          name="month"
        />
      </div>
      <div className="ak-field-group">
        <label htmlFor="week">Week</label>
        <input type="week" className="ak-field-week" id="week" name="week" />
      </div>
      <div className="ak-field-group">
        <label htmlFor="time">Time</label>
        <input type="time" className="ak-field-time" id="time" name="time" />
      </div>
      <div className="ak-field-group">
        <label htmlFor="datetime-local">Datetime-local</label>
        <input
          type="datetime-local"
          className="ak-field-datetime-local"
          id="datetime-local"
          name="datetime-local"
        />
      </div>
      <div className="ak-field-group">
        <label htmlFor="color">Color</label>
        <input
          type="color"
          className="ak-field-color"
          id="color"
          name="color"
        />
      </div>
      <div className="ak-field-group">
        <button className="ak-button ak-button__appearance-primary">
          Submit
        </button>
      </div>
    </form>
  </Fragment>
);
