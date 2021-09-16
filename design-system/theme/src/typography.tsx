import { token } from '@atlaskit/tokens';

import { heading, subtleHeading } from './colors';
import { fontSize, gridSize } from './constants';
import type { ThemeProps } from './types';

const baseHeading = (size: number, lineHeight: number) => ({
  fontSize: `${size / fontSize()}em`,
  fontStyle: 'inherit',
  lineHeight: lineHeight / size,
});

export const headingSizes = {
  h900: { size: 35, lineHeight: 40 },
  h800: { size: 29, lineHeight: 32 },
  h700: { size: 24, lineHeight: 28 },
  h600: { size: 20, lineHeight: 24 },
  h500: { size: 16, lineHeight: 20 },
  h400: { size: 14, lineHeight: 16 },
  h300: { size: 12, lineHeight: 16 },
  h200: { size: 12, lineHeight: 16 },
  h100: { size: 11, lineHeight: 16 },
};

export const h900 = (props: ThemeProps = {}) => ({
  ...baseHeading(headingSizes.h900.size, headingSizes.h900.lineHeight),
  color: token('color.text.highEmphasis', heading(props)),
  fontWeight: 500,
  letterSpacing: `-0.01em`,
  marginTop: `${gridSize() * 6.5}px`,
});

export const h800 = (props: ThemeProps = {}) => ({
  ...baseHeading(headingSizes.h800.size, headingSizes.h800.lineHeight),
  color: token('color.text.highEmphasis', heading(props)),
  fontWeight: 600,
  letterSpacing: `-0.01em`,
  marginTop: `${gridSize() * 5}px`,
});

export const h700 = (props: ThemeProps = {}) => ({
  ...baseHeading(headingSizes.h700.size, headingSizes.h700.lineHeight),
  color: token('color.text.highEmphasis', heading(props)),
  fontWeight: 500,
  letterSpacing: `-0.01em`,
  marginTop: `${gridSize() * 5}px`,
});

export const h600 = (props: ThemeProps = {}) => ({
  ...baseHeading(headingSizes.h600.size, headingSizes.h600.lineHeight),
  color: token('color.text.highEmphasis', heading(props)),
  fontWeight: 500,
  letterSpacing: `-0.008em`,
  marginTop: `${gridSize() * 3.5}px`,
});

export const h500 = (props: ThemeProps = {}) => ({
  ...baseHeading(headingSizes.h500.size, headingSizes.h500.lineHeight),
  color: token('color.text.highEmphasis', heading(props)),
  fontWeight: 600,
  letterSpacing: `-0.006em`,
  marginTop: `${gridSize() * 3}px`,
});

export const h400 = (props: ThemeProps = {}) => ({
  ...baseHeading(headingSizes.h400.size, headingSizes.h400.lineHeight),
  color: token('color.text.highEmphasis', heading(props)),
  fontWeight: 600,
  letterSpacing: `-0.003em`,
  marginTop: `${gridSize() * 2}px`,
});

export const h300 = (props: ThemeProps = {}) => ({
  ...baseHeading(headingSizes.h300.size, headingSizes.h300.lineHeight),
  color: token('color.text.highEmphasis', heading(props)),
  fontWeight: 600,
  marginTop: `${gridSize() * 2.5}px`,
  textTransform: 'uppercase' as const,
});

export const h200 = (props: ThemeProps = {}) => ({
  ...baseHeading(headingSizes.h200.size, headingSizes.h200.lineHeight),
  color: token('color.text.lowEmphasis', subtleHeading(props)),
  fontWeight: 600,
  marginTop: `${gridSize() * 2}px`,
});

export const h100 = (props: ThemeProps = {}) => ({
  ...baseHeading(headingSizes.h100.size, headingSizes.h100.lineHeight),
  color: token('color.text.lowEmphasis', subtleHeading(props)),
  fontWeight: 700,
  marginTop: `${gridSize() * 2}px`,
});
