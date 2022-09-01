/** @jsx jsx */
import { css } from '@emotion/core';
import { token } from '@atlaskit/tokens';
import { N90 } from '@atlaskit/theme/colors';

export const verticalMargin = 5;

export const tooltipStyle = css({
  maxWidth: '150px',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  marginBottom: verticalMargin,

  ul: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    textAlign: 'left',
  },
  li: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginTop: verticalMargin,
  },
});

export const emojiNameStyle = css({
  textTransform: 'capitalize',
  color: token('color.text.inverse', N90),
  fontWeight: 600,
});

export const footerStyle = css({
  color: token('color.text.inverse', N90),
  fontWeight: 300,
});
