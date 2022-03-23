/** @jsx jsx */
import { ReactNode } from 'react';
import { css, jsx } from '@emotion/core';
import { B400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const outerWrapper = css({
  alignItems: 'center',
  boxSizing: 'border-box',
  display: 'flex',
  lineHeight: 1,
  outline: 'none',
  margin: 0,
  width: '100%',
  cursor: 'pointer',
});

const detailsWrapper = css({
  display: 'flex',
  maxWidth: '100%',
  minWidth: 0,
  flex: '1 1 100%',
  lineHeight: 1.4,
  paddingLeft: '8px',
  alignItems: 'center',
});

const textSection = css({
  width: 'calc(100% - 32px)',
  flex: 'auto',
});

const getTextStyle = (isSecondary?: boolean) => {
  const secondaryCssArgs = isSecondary
    ? {
        color: token('color.text.selected', B400),
        fontSize: '0.85em',
      }
    : {};
  return css({
    display: 'flex',
    maxWidth: '100%',
    margin: 0,
    color: token('color.text.selected', B400),
    ...{ secondaryCssArgs },
    whiteSpace: 'nowrap',
    '> span': {
      maxWidth: 'inherit',
    },
  });
};

export type ExternalAvatarItemOptionProps = {
  avatar: ReactNode;
  primaryText: ReactNode;
  secondaryText?: ReactNode;
  sourcesInfoTooltip?: ReactNode;
};

export const ExternalAvatarItemOption = ({
  avatar,
  primaryText,
  secondaryText,
  sourcesInfoTooltip,
}: ExternalAvatarItemOptionProps) => (
  <div css={outerWrapper}>
    {avatar}
    <div css={detailsWrapper}>
      <div css={textSection}>
        <div>
          <div css={getTextStyle()}>{primaryText}</div>
        </div>
        {secondaryText && (
          <div>
            <div css={getTextStyle(true)}>{secondaryText}</div>
          </div>
        )}
      </div>
      <div>{sourcesInfoTooltip}</div>
    </div>
  </div>
);
