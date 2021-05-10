import React from 'react';

import Icon from '@atlaskit/icon';
import { CustomGlyphProps } from '@atlaskit/icon/types';

const barGlyph = (props: CustomGlyphProps) => (
  <svg
    {...props}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="7" y="12" width="2" height="5" rx="1" fill="#42526E" />
    <rect x="11" y="9" width="2" height="8" rx="1" fill="#42526E" />
    <rect x="15" y="7" width="2" height="10" rx="1" fill="#42526E" />
  </svg>
);

const BarChartIcon = () => {
  return <Icon glyph={barGlyph} label="Bar Chart" />;
};

export default BarChartIcon;
