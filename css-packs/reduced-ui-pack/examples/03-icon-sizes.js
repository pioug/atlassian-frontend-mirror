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
    <Spritemap />
    <Warning />
    <p>
      <svg
        focusable="false"
        className="ak-icon ak-icon__size-small"
        aria-label="Add"
      >
        <use xlinkHref="#ak-icon-add" />
      </svg>
      <svg
        focusable="false"
        className="ak-icon ak-icon__size-medium"
        aria-label="Add"
      >
        <use xlinkHref="#ak-icon-add" />
      </svg>
      <svg
        focusable="false"
        className="ak-icon ak-icon__size-large"
        aria-label="Add"
      >
        <use xlinkHref="#ak-icon-add" />
      </svg>
      <svg
        focusable="false"
        className="ak-icon ak-icon__size-xlarge"
        aria-label="Add"
      >
        <use xlinkHref="#ak-icon-add" />
      </svg>
    </p>
  </div>
);
