/** @jsx jsx */
import { css } from '@emotion/react';

export const reactionStyle = css({
  display: 'inline-block',
  margin: '4px',
});

export const seeWhoReacted = css({
  height: '24px',
  lineHeight: '24px',
  paddingLeft: '4px',
  paddingRight: '4px',
  margin: '4px',
});

export const wrapperStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  position: 'relative',
  alignItems: 'center',
  borderRadius: '15px',
  '> :first-of-type > :first-of-type': { marginLeft: 0 },
});
