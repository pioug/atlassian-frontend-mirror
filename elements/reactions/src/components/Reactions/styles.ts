/** @jsx jsx */
import { css } from '@emotion/react';

export const reactionPickerStyle = css({
  display: 'inline-block',
  marginTop: '4px',
});

export const seeWhoReacted = css({
  height: '24px',
  lineHeight: '24px',
  paddingLeft: 0,
  paddingRight: 0,
  marginTop: '4px',
  marginLeft: '4px',
});

export const wrapperStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  position: 'relative',
  alignItems: 'center',
  borderRadius: '15px',
  marginTop: '-4px',
  '> :first-of-type > :first-of-type': { marginLeft: 0 },
});
