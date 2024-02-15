import React from 'react';

import { token } from '@atlaskit/tokens';

export const AddRowBelowIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width="24"
      height="24"
      transform="matrix(-1 0 0 -1 24 24)"
      fill={token('color.border.inverse', '#FFFFFF')}
      fillOpacity="0.01"
    />
    <rect
      x="18"
      y="12"
      width="12"
      height="3"
      rx="0.5"
      transform="rotate(-180 18 12)"
      fill="currentColor"
    />
    <rect
      x="18"
      y="8"
      width="12"
      height="3"
      rx="0.5"
      transform="rotate(-180 18 8)"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 17V18.01C11.0026 18.2735 11.1092 18.5253 11.2964 18.7107C11.4837 18.896 11.7365 19 12 19C12.556 19 13 18.556 13 18.01V17H14C14.2652 17 14.5196 16.8946 14.7071 16.7071C14.8946 16.5196 15 16.2652 15 16C15 15.7348 14.8946 15.4804 14.7071 15.2929C14.5196 15.1054 14.2652 15 14 15H13V13.99C12.9974 13.7265 12.8908 13.4747 12.7036 13.2893C12.5163 13.104 12.2635 13 12 13C11.444 13 11 13.444 11 13.99V15H10C9.73478 15 9.48043 15.1054 9.29289 15.2929C9.10536 15.4804 9 15.7348 9 16C9 16.2652 9.10536 16.5196 9.29289 16.7071C9.48043 16.8946 9.73478 17 10 17H11Z"
      fill="currentColor"
    />
  </svg>
);
