/** @jsx jsx */
import { jsx } from '@emotion/react';

import { errorStyles } from './styled';

const ErrorSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 82 110"
    // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
    css={errorStyles}
  >
    <defs>
      <linearGradient
        id="a"
        x1="81.992%"
        x2="-1.724%"
        y1="43.911%"
        y2="87.726%"
      >
        <stop offset="0%" stopColor="#FFD740" />
        <stop offset="100%" stopColor="#FFAB00" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <path
        fill="url(#a)"
        fillRule="nonzero"
        d="M47.39 40.58l33.22 57.54a7.585 7.585 0 0 1-6.57 11.38H7.6a7.585 7.585 0 0 1-6.57-11.38l33.22-57.54a7.585 7.585 0 0 1 13.14 0z"
      />
      <path
        fill="#253858"
        fillRule="nonzero"
        d="M43.61 82.355l1.44-22.175a4.59 4.59 0 0 0-4.58-4.89 4.59 4.59 0 0 0-4.58 4.89l1.44 22.175a3.15 3.15 0 0 0 3.14 2.945 3.15 3.15 0 0 0 3.14-2.945zM35.69 94.125a4.765 4.765 0 0 0 5.195 4.79 4.84 4.84 0 0 0-.45-9.66 4.82 4.82 0 0 0-4.745 4.87z"
      />
      <path
        fill="#FFC400"
        fillRule="nonzero"
        d="M45.85 14.085L42.145.725a.305.305 0 0 0-.595.025L39.22 13.3l-2.9-.54a.305.305 0 0 0-.35.38l3.705 13.36a.305.305 0 0 0 .595 0l2.33-12.55 2.9.515a.305.305 0 0 0 .35-.38z"
      />
      <path
        fill="#FFAB00"
        fillRule="nonzero"
        d="M32.56 21.405l-5.44-4.275a.135.135 0 0 0-.205.165L29.68 23l-1.33.655a.135.135 0 0 0 0 .225l5.435 4.275a.135.135 0 0 0 .205-.165l-2.785-5.715 1.33-.645a.135.135 0 0 0 .025-.225z"
      />
      <path
        stroke="#344563"
        strokeLinecap="round"
        strokeWidth="2"
        d="M57.575 18.8c-.585.795-5.5-2.8-6.08-2-.58.8 4.33 4.395 3.75 5.195-.58.8-5.5-2.8-6.085-2-.585.8 4.33 4.395 3.745 5.195-.585.8-5.5-2.8-6.085-2-.585.8 4.33 4.395 3.745 5.195"
      />
      <path
        stroke="#5E6C84"
        strokeLinecap="round"
        strokeWidth="2"
        d="M59.96 32.595c-.73.665-3.525-2.39-4.255-1.72-.73.67 2.065 3.725 1.335 4.39-.73.665-3.525-2.39-4.255-1.72-.34.31.08 1.135.555 2M22.4 32.5c.91.385 2.5-3.435 3.43-3.05.93.385-.695 4.2.215 4.585.91.385 2.5-3.435 3.43-3.05.425.18.305 1.095.145 2.065"
      />
    </g>
  </svg>
);

export default ErrorSVG;
