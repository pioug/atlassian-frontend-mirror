/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';
import * as colors from '@atlaskit/theme/colors';
import HomeCircleIcon from '../glyph/home-circle';

const purple = '.purple { color: rebeccapurple; fill: yellow; }';
const blue = `.blue { color: ${colors.B500}; fill: ${colors.B75}; }`;
const rainbow = `
.rainbow {
  animation: 5s ease-in 1s infinite both rainbow;
}
@keyframes rainbow {
  0%   { color: ${colors.N800}; }
  20%  { color: ${colors.B500}; }
  40%  { color: ${colors.R300}; }
  60%  { color: ${colors.Y300}; }
  80%  { color: ${colors.G300}; }
  100% { color: ${colors.P300}; }
}`;
const styles = (
  <style>
    {purple}
    {blue}
    {rainbow}
  </style>
);

export default () => (
  <div>
    {styles}
    <span className="purple">
      <HomeCircleIcon secondaryColor="inherit" size="xlarge" label="" />
    </span>
    <span className="blue">
      <HomeCircleIcon secondaryColor="inherit" size="xlarge" label="" />
    </span>
    <span className="rainbow">
      <HomeCircleIcon size="xlarge" label="" />
    </span>
  </div>
);
