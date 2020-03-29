import { css } from 'styled-components';

import * as colors from './colors';
import { gridSize, fontSize } from './constants';

const baseHeading = (size: number, lineHeight: number) => `
  font-size: ${size / fontSize()}em;
  font-style: inherit;
  line-height: ${lineHeight / size};
`;

export const headingSizes = {
  h900: {
    size: 35,
    lineHeight: 40,
  },
  h800: {
    size: 29,
    lineHeight: 32,
  },
  h700: {
    size: 24,
    lineHeight: 28,
  },
  h600: {
    size: 20,
    lineHeight: 24,
  },
  h500: {
    size: 16,
    lineHeight: 20,
  },
  h400: {
    size: 14,
    lineHeight: 16,
  },
  h300: {
    size: 12,
    lineHeight: 16,
  },
  h200: {
    size: 12,
    lineHeight: 16,
  },
  h100: {
    size: 11,
    lineHeight: 16,
  },
};

export const h900 = () => css`
  ${baseHeading(headingSizes.h900.size, headingSizes.h900.lineHeight)}
  color: ${colors.heading};
  font-weight: 500;
  letter-spacing: -0.01em;
  margin-top: ${gridSize() * 6.5}px;
`;

export const h800 = () => css`
  ${baseHeading(headingSizes.h800.size, headingSizes.h800.lineHeight)}
  color: ${colors.heading};
  font-weight: 600;
  letter-spacing: -0.01em;
  margin-top: ${gridSize() * 5}px;
`;

export const h700 = () => css`
  ${baseHeading(headingSizes.h700.size, headingSizes.h700.lineHeight)}
  color: ${colors.heading};
  font-weight: 500;
  letter-spacing: -0.01em;
  margin-top: ${gridSize() * 5}px;
`;

export const h600 = () => css`
  ${baseHeading(headingSizes.h600.size, headingSizes.h600.lineHeight)}
  color: ${colors.heading};
  font-weight: 500;
  letter-spacing: -0.008em;
  margin-top: ${gridSize() * 3.5}px;
`;

export const h500 = () => css`
  ${baseHeading(headingSizes.h500.size, headingSizes.h500.lineHeight)}
  color: ${colors.heading};
  font-weight: 600;
  letter-spacing: -0.006em;
  margin-top: ${gridSize() * 3}px;
`;

export const h400 = () => css`
  ${baseHeading(headingSizes.h400.size, headingSizes.h400.lineHeight)}
  color: ${colors.heading};
  font-weight: 600;
  letter-spacing: -0.003em;
  margin-top: ${gridSize() * 2}px;
`;

export const h300 = () => css`
  ${baseHeading(headingSizes.h300.size, headingSizes.h300.lineHeight)}
  color: ${colors.heading};
  font-weight: 600;
  margin-top: ${gridSize() * 2.5}px;
  text-transform: uppercase;
`;

export const h200 = () => css`
  ${baseHeading(headingSizes.h200.size, headingSizes.h200.lineHeight)}
  color: ${colors.subtleHeading};
  font-weight: 600;
  margin-top: ${gridSize() * 2}px;
`;

export const h100 = () => css`
  ${baseHeading(headingSizes.h100.size, headingSizes.h100.lineHeight)}
  color: ${colors.subtleHeading};
  font-weight: 700;
  margin-top: ${gridSize() * 2}px;
`;
