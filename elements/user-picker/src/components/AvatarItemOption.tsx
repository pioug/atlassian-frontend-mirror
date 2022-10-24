/** @jsx jsx */
import React, { ReactNode } from 'react';
import { gridSize } from '@atlaskit/theme/constants';
import { css, jsx } from '@emotion/core';
import Lozenge from '@atlaskit/lozenge';
import { token } from '@atlaskit/tokens';

import { LozengeProps } from '../types';
import { isLozengeText } from './utils';

const AsyncTooltip = React.lazy(() =>
  import(
    /* webpackChunkName: "@atlaskit-internal_@atlaskit/tooltip" */ '@atlaskit/tooltip'
  ).then((module) => {
    return {
      default: module.default,
    };
  }),
);

const wrapper = (isDisabled?: boolean) =>
  css({
    alignItems: 'center',
    boxSizing: 'border-box',
    display: 'flex',
    lineHeight: 1,
    outline: 'none',
    margin: 0,
    width: '100%',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? token('opacity.disabled', '0.4') : undefined,
  });

const optionWrapper = css({
  maxWidth: '100%',
  minWidth: 0,
  flex: '1 1 100%',
  lineHeight: '1.4',
  paddingLeft: `${gridSize()}px`,
});

const getTextStyle = (isSecondary?: boolean) => {
  const secondaryCssArgs = isSecondary ? { fontSize: '0.85em' } : {};

  return css({
    margin: 0,
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    ...secondaryCssArgs,
  });
};

const additionalInfo = css({
  float: 'right',
});

export const textWrapper = (color?: string) =>
  css({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline',
    color,
  });

export type AvatarItemOptionProps = {
  avatar: ReactNode;
  isDisabled?: boolean;
  lozenge?: ReactNode | LozengeProps;
  primaryText?: ReactNode;
  secondaryText?: ReactNode;
};

export const AvatarItemOption = ({
  avatar,
  isDisabled,
  lozenge,
  primaryText,
  secondaryText,
}: AvatarItemOptionProps) => {
  const renderLozenge = () => {
    if (isLozengeText(lozenge)) {
      if (lozenge?.tooltip) {
        // Note that entire Lozenge must be wrapped in the Tooltip (rather than just the
        // Lozenge text) or tooltip won't work
        return (
          <React.Suspense
            fallback={<Lozenge {...lozenge}>{lozenge.text}</Lozenge>}
          >
            <AsyncTooltip content={lozenge.tooltip}>
              <Lozenge {...lozenge}>{lozenge.text}</Lozenge>
            </AsyncTooltip>
          </React.Suspense>
        );
      }

      return <Lozenge {...lozenge}>{lozenge.text}</Lozenge>;
    }

    return lozenge;
  };

  return (
    <span css={wrapper(isDisabled)}>
      {avatar}
      <div css={optionWrapper}>
        <div>
          <div css={getTextStyle()}>{primaryText}</div>
          {secondaryText && <div css={getTextStyle(true)}>{secondaryText}</div>}
        </div>
      </div>
      {lozenge && <div css={additionalInfo}>{renderLozenge()}</div>}
    </span>
  );
};
