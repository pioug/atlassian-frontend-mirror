import React, { Fragment } from 'react';
// eslint-disable-next-line
import stuff from '!!style-loader!css-loader!../src/bundle.css';
import Warning from './utils/warning';

export default () => (
  <Fragment>
    <Warning />
    <form onSubmit={(e) => e.preventDefault()}>
      <h2>Add a comment</h2>
      <div className="ak-field-group">
        <label htmlFor="description">Comment</label>
        <textarea
          className="ak-field-textarea"
          rows="5"
          id="comment"
          name="comment"
        />
      </div>
      <div className="ak-field-group">
        <label htmlFor="feedback">Feedback</label>
        <textarea
          className="ak-field-textarea"
          rows="3"
          id="feedback"
          name="feedback"
          disabled
        />
      </div>
      <div className="ak-field-group">
        <button className="ak-button ak-button__appearance-primary">
          Add comment
        </button>
      </div>
    </form>
  </Fragment>
);
