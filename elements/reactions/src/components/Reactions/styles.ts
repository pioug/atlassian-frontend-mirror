/** @jsx jsx */
import { css } from '@emotion/react';

export const reactionStyle = css({
  display: 'inline-block',
  // top margin of 2px to allow spacing between rows when wrapped (paired with top margin in reactionsStyle)
  margin: '2px 4px 0 4px',
});

export const wrapperStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  position: 'relative',
  alignItems: 'center',
  borderRadius: '15px',
  // To allow to row spacing of 2px on wrap, and 0px on first row
  marginTop: '-2px',
  '> :first-of-type > :first-child': { marginLeft: 0 },
});
