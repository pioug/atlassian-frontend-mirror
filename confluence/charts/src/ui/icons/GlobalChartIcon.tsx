import React from 'react';

import Icon from '@atlaskit/icon';
import { CustomGlyphProps } from '@atlaskit/icon/types';

const chartGlyph = (props: CustomGlyphProps) => (
  <svg
    {...props}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 6.84619V15C6 16.1046 6.89543 17 8 17H19"
      stroke="#42526E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="9.5"
      y1="13.6538"
      x2="9.5"
      y2="11.1153"
      stroke="#42526E"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="13.5"
      y1="13.6538"
      x2="13.5"
      y2="9.26919"
      stroke="#42526E"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="17.5"
      y1="13.6538"
      x2="17.5"
      y2="7.42304"
      stroke="#42526E"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GlobalChartIcon = () => {
  return <Icon glyph={chartGlyph} label="Chart" />;
};

export default GlobalChartIcon;
