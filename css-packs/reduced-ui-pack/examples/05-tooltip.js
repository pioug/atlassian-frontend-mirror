import React from 'react';
// eslint-disable-next-line
import stuff from '!!style-loader!css-loader!../src/bundle.css';
import Warning from './utils/warning';

export default () => (
  <div>
    <Warning />
    <p>
      Note that tooltips are only available for <code>button</code> elements,
      and
      <code>a</code> elements with an <code>href</code> attribute.
    </p>
    <h2>Button triggers</h2>
    <button
      className="ak-button ak-button__appearance-default"
      data-ak-tooltip="Oh hi there"
      data-ak-tooltip-position="top"
    >
      Top
    </button>
    <button
      className="ak-button ak-button__appearance-default"
      data-ak-tooltip="Oh hi there"
      data-ak-tooltip-position="right"
    >
      Right
    </button>
    <button
      className="ak-button ak-button__appearance-default"
      data-ak-tooltip="Oh hi there"
      data-ak-tooltip-position="bottom"
    >
      Bottom
    </button>
    <button
      className="ak-button ak-button__appearance-default"
      data-ak-tooltip="Oh hi there"
      data-ak-tooltip-position="left"
    >
      Left
    </button>
    <button
      className="ak-button ak-button__appearance-default"
      data-ak-tooltip="Oh hi there I am a tooltip with way too much text, let us see how I behave!"
      data-ak-tooltip-position="top"
    >
      Long Text
    </button>

    <h2>Using a link</h2>
    <a
      href="#trigger"
      data-ak-tooltip="Oh hi there"
      data-ak-tooltip-position="right"
    >
      Using a Link as a target
    </a>
  </div>
);
