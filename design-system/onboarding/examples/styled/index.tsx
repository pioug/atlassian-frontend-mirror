/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import { forwardRef } from 'react';

import { css, jsx } from '@emotion/core';

import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const highlights: Record<string, any> = {
  blue: token('color.background.accent.blue.bold', colors.B300),
  green: token('color.background.accent.green.bold', colors.G300),
  neutral: token('color.border', colors.N100),
  purple: token('color.background.accent.purple.bold', colors.P300),
  red: token('color.background.accent.red.bold', colors.R300),
  teal: token('color.background.accent.teal', colors.T300),
  yellow: token('color.background.accent.orange.bold', colors.Y300),
};

const highlightGroupStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
});

export const HighlightGroup: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
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
        backgroundColor:
          props.bg ?? token('elevation.surface.raised', colors.N20),
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
  backgroundColor: token('color.background.discovery.hovered', colors.P50),
  border: `1px solid ${token('color.border.discovery', colors.P75)}`,
  borderRadius: '0.2em',
  color: token('color.text.discovery', colors.P500),
  fontFamily: 'Monaco, monospace',
  fontSize: '0.85em',
  lineHeight: 1.3,
  verticalAlign: 'baseline',
});

export const Code: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => (
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
  <code {...props} css={codeStyles} />
);
