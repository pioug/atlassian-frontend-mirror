import React from 'react';
// eslint-disable-next-line
import icons from '!!raw-loader!../src/icons-sprite.svg';
// eslint-disable-next-line
import stuff from '!!style-loader!css-loader!../src/bundle.css';
import Warning from './utils/warning';
// eslint-disable-next-line react/no-danger
const Spritemap = () => <div dangerouslySetInnerHTML={{ __html: icons }} />;

export default () => (
  <div>
    <Warning />
    <Spritemap />
    <div className="ak-field-group">
      <label htmlFor="dummy">Dummy input</label>
      <input
        type="text"
        className="ak-field-text ak-field__size-medium"
        id="dummy"
        placeholder="Focus on this field then tab to the button"
      />
    </div>
    <p>
      <button type="button" className="ak-button ak-button__appearance-default">
        <svg focusable="false" className="ak-icon" aria-label="Add">
          <use xlinkHref="#ak-icon-add" />
        </svg>
      </button>
    </p>
  </div>
);
