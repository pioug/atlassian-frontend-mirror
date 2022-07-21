/** @jsx jsx */

import { css, jsx } from '@emotion/core';

import WorldIcon from '@atlaskit/icon/glyph/world';
import { borderRadius } from '@atlaskit/theme/constants';

const cardStyles = css({
  display: 'flex',
  width: '100%',
  height: '108px',
  padding: '1em',
  alignItems: 'center',
  columnGap: '8px',
  borderRadius: `${borderRadius()}px`,
  fontSize: '24px',
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
          backgroundColor: tokenSet.backgroundColor,
          border: tokenSet.border,
          color: tokenSet.color,
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
