import { CSSObject } from '@emotion/core';

export const containerStyles = (justify: 'start' | 'end'): CSSObject => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: `flex-${justify}`,
  width: '100%',
});
