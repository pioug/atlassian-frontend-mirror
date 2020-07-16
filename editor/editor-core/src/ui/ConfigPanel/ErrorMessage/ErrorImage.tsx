import React from 'react';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';

const ImageContainer = styled.div`
  margin: 0 auto ${gridSize() * 3}px;
  height: 80px;
`;

const ErrorImage: React.FunctionComponent = () => (
  <ImageContainer>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 163.28 218"
      height="80"
    >
      <defs>
        <linearGradient
          id="linear-gradient"
          x1="133.86"
          x2="-2.79"
          y1="136.43"
          y2="200.15"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#ffd740" />
          <stop offset="1" stopColor="#ffab00" />
        </linearGradient>
        <clipPath id="clip-path">
          <path
            id="_Polygon_"
            d="M94.78 80.16l66.44 115.08A15.17 15.17 0 01148.08 218H15.2a15.17 15.17 0 01-13.14-22.76L68.5 80.16a15.17 15.17 0 0126.28 0z"
            className="cls-1"
            data-name="&lt;Polygon&gt;"
          />
        </clipPath>
        <style>{`.cls-1{fill:url(#linear-gradient)}.cls-2{fill:#253858}.cls-6{fill:none;stroke-linecap:round;stroke-miterlimit:10;stroke-width:2px;stroke:#5e6c84}`}</style>
      </defs>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Software">
          <path
            id="_Polygon_2"
            d="M94.78 80.16l66.44 115.08A15.17 15.17 0 01148.08 218H15.2a15.17 15.17 0 01-13.14-22.76L68.5 80.16a15.17 15.17 0 0126.28 0z"
            className="cls-1"
            data-name="&lt;Polygon&gt;"
          />
          <path
            d="M87.22 163.71l2.88-44.35a9.18 9.18 0 00-9.16-9.78 9.18 9.18 0 00-9.16 9.78l2.88 44.35a6.3 6.3 0 006.28 5.89 6.3 6.3 0 006.28-5.89zM71.38 187.25a9.53 9.53 0 0010.39 9.58 9.68 9.68 0 00-.9-19.32 9.64 9.64 0 00-9.49 9.74z"
            className="cls-2"
          />
          <path
            fill="#ffc400"
            d="M91.7 27.17L84.29.45A.61.61 0 0083.1.5l-4.66 25.1-5.8-1.08a.61.61 0 00-.7.76L79.35 52a.61.61 0 001.19 0l4.66-25.1 5.8 1.03a.61.61 0 00.7-.76z"
          />
          <path
            fill="#ffab00"
            d="M65.12 41.81l-10.88-8.55a.27.27 0 00-.41.33L59.36 45l-2.66 1.31a.27.27 0 000 .45l10.87 8.55a.27.27 0 00.41-.33l-5.57-11.43 2.66-1.29a.27.27 0 00.05-.45z"
          />
          <path
            fill="none"
            stroke="#344563"
            strokeLinecap="round"
            strokeMiterlimit="10"
            strokeWidth="2"
            d="M115.15 36.6c-1.17 1.59-11-5.6-12.16-4s8.66 8.79 7.5 10.39-11-5.6-12.17-4 8.66 8.79 7.49 10.39-11-5.6-12.17-4 8.66 8.79 7.49 10.39"
          />
          <path
            d="M119.92 64.19c-1.46 1.33-7.05-4.78-8.51-3.44s4.13 7.45 2.67 8.78-7.05-4.78-8.51-3.44c-.68.62.16 2.27 1.11 4M44.8 64c1.82.77 5-6.87 6.86-6.1s-1.39 8.4.43 9.17 5-6.87 6.86-6.1c.85.36.61 2.19.29 4.13"
            className="cls-6"
          />
        </g>
      </g>
    </svg>
  </ImageContainer>
);

export default ErrorImage;
