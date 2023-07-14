import React from 'react';
// eslint-disable-next-line
import stuff from '!!style-loader!css-loader!../src/bundle.css';
import Warning from './utils/warning';

export default () => (
  <div>
    <Warning />
    <div title="Buttons">
      <h1>Buttons</h1>
      <h2>default appearance</h2>
      <button type="button" className="ak-button ak-button__appearance-default">
        Default ak-button
      </button>
      <h2>subtle appearance</h2>
      <button type="button" className="ak-button ak-button__appearance-subtle">
        Subtle ak-button
      </button>
      <h2>primary appearance</h2>
      <button type="button" className="ak-button ak-button__appearance-primary">
        Primary ak-button
      </button>
      <h2>link appearance</h2>
      <button type="button" className="ak-button ak-button__appearance-link">
        Link ak-button
      </button>
      <h2>subtle-link appearance</h2>
      <button
        type="button"
        className="ak-button ak-button__appearance-subtle-link"
      >
        Subtle link ak-button
      </button>
    </div>
    <div title="Buttons — disabled">
      <h1>Buttons - disabled</h1>
      <h2>default appearance</h2>
      <button
        type="button"
        className="ak-button ak-button__appearance-default"
        disabled
      >
        Default ak-button
      </button>
      <h2>subtle appearance</h2>
      <button
        type="button"
        className="ak-button ak-button__appearance-subtle"
        disabled
      >
        Subtle ak-button
      </button>
      <h2>primary appearance</h2>
      <button
        type="button"
        className="ak-button ak-button__appearance-primary"
        disabled
      >
        Primary ak-button
      </button>
      <h2>link appearance</h2>
      <button
        type="button"
        className="ak-button ak-button__appearance-link"
        disabled
      >
        Link ak-button
      </button>
      <h2>subtle-link appearance</h2>
      <button
        type="button"
        className="ak-button ak-button__appearance-subtle-link"
        disabled
      >
        Subtle link ak-button
      </button>
    </div>
  </div>
);
