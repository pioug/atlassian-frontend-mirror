/** @jsx jsx */

import { css, jsx } from '@emotion/core';

import WorldIcon from '@atlaskit/icon/glyph/world';
import { borderRadius } from '@atlaskit/theme/constants';

const cardStyles = css({
  width: '100%',
  height: '108px',
  fontSize: '24px',
  borderRadius: `${borderRadius()}px`,
  padding: '1em',
  display: 'flex',
  alignItems: 'center',
  columnGap: '8px',
  ':hover': {
    cursor: 'pointer',
  },
});

const Card = ({ tokenSet }: { tokenSet: Record<string, string> }) => {
  return (
    <span
      css={[
        cardStyles,
        css({
          color: tokenSet.color,
          backgroundColor: tokenSet.backgroundColor,
          border: tokenSet.border,
          ':hover': { backgroundColor: tokenSet.hoverBackgroundColor },
          ':active': { backgroundColor: tokenSet.activeBackgroundColor },
        }),
      ]}
    >
      <WorldIcon label="world" primaryColor={tokenSet.iconColor} />
      Text
    </span>
  );
};

export default Card;
