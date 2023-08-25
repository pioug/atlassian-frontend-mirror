import React from 'react';

import { useIconThemed } from '../use-icon-themed';

export default function IconAction() {
  const { iconThemed } = useIconThemed();

  return (
    <svg focusable="false" aria-hidden width={40} height={40}>
      <g fill="none" fillRule="evenodd">
        <path
          fill={iconThemed({ light: '#FFF', dark: '#161A1D' })}
          d="M0 0h40v40H0z"
        />
        <g transform="translate(7 10)">
          <path
            d="M3 0h30v20H3a3 3 0 01-3-3V3a3 3 0 013-3z"
            fill={iconThemed({ light: '#ECEDF0', dark: '#454F59' })}
          />
          <rect
            fill={iconThemed({ light: '#0052CC', dark: '#09326C' })}
            x={5}
            y={5}
            width={10}
            height={10}
            rx={2}
          />
          <path
            d="M8.81 12.365l.05.055a.5.5 0 00.77-.042l.048-.065 3.11-4.205a.666.666 0 00-.09-.886.554.554 0 00-.82.098l-2.703 3.655-1.096-1.184a.553.553 0 00-.825 0 .667.667 0 000 .892l1.556 1.682z"
            fill={iconThemed({ light: '#FFF', dark: '#8696A7' })}
          />
          <path
            d="M20 9h13v2H20a1 1 0 010-2z"
            fill={iconThemed({ light: '#C1C7D0', dark: '#738496' })}
          />
        </g>
      </g>
    </svg>
  );
}
