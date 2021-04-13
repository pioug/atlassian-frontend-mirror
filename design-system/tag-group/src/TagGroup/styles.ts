import { CSSObject } from '@emotion/core';

export const containerStyles = (justify: 'start' | 'end'): CSSObject => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: `flex-${justify}`,
  width: '100%',
});

// TODO: remove this comment
// < force a build of the tag-group package on Confluence >
