/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

interface DragHandleIconProps {
  backgroundColor?: string;
  foregroundColor?: string;
}

export const DragHandleIcon = ({
  backgroundColor,
  foregroundColor,
}: DragHandleIconProps) => (
  <svg
    width="28"
    height="20"
    viewBox="0 0 28 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="1"
      y="1"
      width="26"
      height="18"
      rx="5"
      fill={backgroundColor || '#F1F2F4'}
    />
    <g clipPath="url(#clip0_125_45007)">
      <path
        d="M11 12C11 11.4477 10.5523 11 10 11C9.44772 11 9 11.4477 9 12C9 12.5523 9.44772 13 10 13C10.5523 13 11 12.5523 11 12Z"
        fill={foregroundColor || '#626F86'}
      />
      <path
        d="M11 8C11 7.44772 10.5523 7 10 7C9.44772 7 9 7.44772 9 8C9 8.55228 9.44772 9 10 9C10.5523 9 11 8.55228 11 8Z"
        fill={foregroundColor || '#626F86'}
      />
      <path
        d="M19 12C19 11.4477 18.5523 11 18 11C17.4477 11 17 11.4477 17 12C17 12.5523 17.4477 13 18 13C18.5523 13 19 12.5523 19 12Z"
        fill={foregroundColor || '#626F86'}
      />
      <path
        d="M19 8C19 7.44772 18.5523 7 18 7C17.4477 7 17 7.44772 17 8C17 8.55228 17.4477 9 18 9C18.5523 9 19 8.55228 19 8Z"
        fill={foregroundColor || '#626F86'}
      />
      <path
        d="M15 12C15 11.4477 14.5523 11 14 11C13.4477 11 13 11.4477 13 12C13 12.5523 13.4477 13 14 13C14.5523 13 15 12.5523 15 12Z"
        fill={foregroundColor || '#626F86'}
      />
      <path
        d="M15 8C15 7.44772 14.5523 7 14 7C13.4477 7 13 7.44772 13 8C13 8.55228 13.4477 9 14 9C14.5523 9 15 8.55228 15 8Z"
        fill={foregroundColor || '#626F86'}
      />
    </g>
    <rect
      x="1"
      y="1"
      width="26"
      height="18"
      rx="5"
      stroke="white"
      strokeWidth="2"
    />
    <defs>
      <clipPath id="clip0_125_45007">
        <rect
          width="16"
          height="24"
          fill="white"
          transform="matrix(0 -1 1 0 2 18)"
        />
      </clipPath>
    </defs>
  </svg>
);
