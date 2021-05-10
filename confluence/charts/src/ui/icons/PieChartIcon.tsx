import React from 'react';

import Icon from '@atlaskit/icon';
import { CustomGlyphProps } from '@atlaskit/icon/types';

const pieGlyph = (props: CustomGlyphProps) => (
  <svg
    {...props}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 7C13.27 7 14.42 7.49 15.31 8.28L16.73 6.86C15.48 5.71 13.82 5 12 5C8.14 5 5 8.14 5 12H7C7 9.24 9.24 7 12 7Z"
      fill="#42526E"
    />
    <path
      d="M16.52 9.90003C16.82 10.54 17 11.25 17 12C17 14.76 14.76 17 12 17C9.94998 17 8.19998 15.76 7.41998 14H5.28998C6.14998 16.89 8.82998 19 12 19C15.86 19 19 15.86 19 12C19 10.69 18.63 9.46003 18 8.41003L16.52 9.90003Z"
      fill="#42526E"
    />
  </svg>
);

const PieChartIcon = () => {
  return <Icon glyph={pieGlyph} label="Pie Chart" />;
};

export default PieChartIcon;
