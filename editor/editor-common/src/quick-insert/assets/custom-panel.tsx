import React from 'react';

import { useIconThemed } from '../use-icon-themed';

export default function IconCustomPanel() {
  const { iconThemed } = useIconThemed();

  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      focusable="false"
      aria-hidden
    >
      <rect
        width="40"
        height="40"
        fill={iconThemed({ light: '#fff', dark: '#161A1D' })}
      />
      <path
        d="M8 13C8 12.4477 8.44772 12 9 12H40V28H9C8.44772 28 8 27.5523 8 27V13Z"
        fill={iconThemed({ light: '#E3FAFC', dark: '#1D474C' })}
      />
      <g clipPath="url(#clip0)">
        <path
          d="M19.9999 16.2222C15.5817 16.2222 12.2222 19.5818 12.2222 24H16.0093C16.0093 21.7962 17.7964 20.0093 19.9999 20.0093V16.2222Z"
          fill={iconThemed({ light: '#6E5DC6', dark: '#9F8FEF' })}
        />
        <path
          d="M12 23.9998H12.676C12.676 19.9578 15.9502 16.6809 19.9909 16.676V16C15.5767 16.0051 12 19.5847 12 23.9998Z"
          fill={iconThemed({ light: '#E34935', dark: '#EF5C48' })}
        />
        <path
          d="M12.6851 24H13.3517C13.3517 20.3262 16.3273 17.3478 19.9999 17.3429V16.6762C15.9593 16.6811 12.6851 19.958 12.6851 24Z"
          fill={iconThemed({ light: '#D97008', dark: '#F18D13' })}
        />
        <path
          d="M13.3518 24H14.0185C14.0185 20.6945 16.6956 18.0145 20 18.0096V17.3429C16.3274 17.3478 13.3518 20.3262 13.3518 24Z"
          fill={iconThemed({ light: '#E2B203', dark: '#E2B203' })}
        />
        <path
          d="M14.0184 24H14.6851C14.6851 21.0629 17.064 18.6811 20 18.6762V18.0096C16.6955 18.0144 14.0184 20.6944 14.0184 24Z"
          fill={iconThemed({ light: '#6A9A23', dark: '#82B536' })}
        />
        <path
          d="M14.6851 24H15.3517C15.3517 21.4311 17.4322 19.348 19.9999 19.3431V18.6762C17.0639 18.6811 14.6851 21.0629 14.6851 24Z"
          fill={iconThemed({ light: '#0055CC', dark: '#579DFF' })}
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect
            width="8"
            height="8"
            fill={iconThemed({ light: '#fff', dark: '#fff' })}
            transform="translate(12 16)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
