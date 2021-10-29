/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import { forwardRef } from 'react';

import { css, jsx } from '@emotion/core';

import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const highlights: Record<string, any> = {
  blue: token('color.accent.boldBlue', colors.B300),
  green: token('color.accent.boldGreen', colors.G300),
  neutral: token('color.border.neutral', colors.N100),
  purple: token('color.accent.boldPurple', colors.P300),
  red: token('color.accent.boldRed', colors.R300),
  teal: token('color.accent.subtleTeal', colors.T300),
  yellow: token('color.accent.boldOrange', colors.Y300),
};

const highlightGroupStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
});

export const HighlightGroup: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div {...props} css={highlightGroupStyles} />;

interface HighlightProps {
  color: string;
  radius?: number;
  bg?: string;
}

const highlightStyles = css({
  display: 'inline-flex',
  boxSizing: 'border-box',
  padding: '1em 2em',
  position: 'relative',
  alignItems: 'space-between',
  justifyContent: 'space-between',
  borderLeftStyle: 'solid',
  borderLeftWidth: '4px',
  overflow: 'hidden',
  '&::after': {
    width: '4px',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'transparent',
    content: '""',
  },
});

export const Highlight = forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & HighlightProps
>((props, ref) => (
  <div
    {...props}
    css={highlightStyles}
    style={
      {
        backgroundColor: props.bg ?? token('color.background.card', colors.N20),
        borderRadius: `${props.radius ?? 0}px`,
        borderLeftColor: highlights[props.color],
        cursor: props.onClick ? 'pointer' : 'auto',
      } as React.CSSProperties
    }
    ref={ref as React.Ref<HTMLDivElement>}
  />
));

const codeStyles = css({
  display: 'inline-block',
  paddingRight: '0.3em',
  paddingLeft: '0.3em',
  backgroundColor: token('color.background.subtleDiscovery.hover', colors.P50),
  border: `1px solid ${token('color.iconBorder.discovery', colors.P75)}`,
  borderRadius: '0.2em',
  color: token('color.text.discovery', colors.P500),
  fontFamily: 'Monaco, monospace',
  fontSize: '0.85em',
  lineHeight: 1.3,
  verticalAlign: 'baseline',
});

export const Code: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => (
  <code {...props} css={codeStyles} />
);
