/** @jsx jsx */
import React, { ReactNode } from 'react';
import { css, jsx } from '@emotion/core';
import Lozenge from '@atlaskit/lozenge';
import { LozengeProps } from '../types';

const AsyncTooltip = React.lazy(() =>
  import(
    /* webpackChunkName: "@atlaskit-internal_@atlaskit/tooltip" */ '@atlaskit/tooltip'
  ).then((module) => {
    return {
      default: module.default,
    };
  }),
);

const wrapper = css({
  alignItems: 'center',
  boxSizing: 'border-box',
  display: 'flex',
  lineHeight: 1,
  outline: 'none',
  margin: 0,
  width: '100%',
  cursor: 'pointer',
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
    display: 'inline-block',
    color,
  });

export type AvatarItemOptionProps = {
  avatar: ReactNode;
  primaryText?: ReactNode;
  secondaryText?: ReactNode;
  lozenge?: LozengeProps;
};

export const AvatarItemOption = ({
  avatar,
  primaryText,
  secondaryText,
  lozenge,
}: AvatarItemOptionProps) => (
  <span css={wrapper}>
    {avatar}
    <div
      style={{
        maxWidth: '100%',
        minWidth: 0,
        flex: '1 1 100%',
        lineHeight: '1.4',
        paddingLeft: '8px',
      }}
    >
      <div>
        <span css={getTextStyle()}>{primaryText}</span>
        <span css={additionalInfo}>
          {lozenge?.text &&
            (lozenge?.tooltip ? (
              // Note that entire Lozenge must be wrapped in the Tooltip (rather than just the
              // Lozenge text) or tooltip won't work
              <React.Suspense
                fallback={<Lozenge {...lozenge}>{lozenge.text}</Lozenge>}
              >
                <AsyncTooltip content={lozenge.tooltip}>
                  <Lozenge {...lozenge}>{lozenge.text}</Lozenge>
                </AsyncTooltip>
              </React.Suspense>
            ) : (
              <Lozenge {...lozenge}>{lozenge.text}</Lozenge>
            ))}
        </span>
      </div>
      <div>
        <span css={getTextStyle(true)}>{secondaryText}</span>
      </div>
    </div>
  </span>
);
