/** @jsx jsx */
import { forwardRef, HTMLAttributes, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const highlights: Record<string, any> = {
  blue: token('color.background.accent.blue.subtle', colors.B300),
  green: token('color.background.accent.green.subtle', colors.G300),
  neutral: token('color.border', colors.N100),
  purple: token('color.background.accent.purple.subtle', colors.P300),
  red: token('color.background.accent.red.subtle', colors.R300),
  teal: token('color.background.accent.teal.subtle', colors.T300),
  yellow: token('color.background.accent.orange.subtle', colors.Y300),
};

const highlightGroupStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
});

type HighlightGroupProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export const HighlightGroup = (
  props: HighlightGroupProps,
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
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
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
    top: token('space.0', '0px'),
    left: token('space.0', '0px'),
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
  paddingRight: token('space.050', '4px'),
  paddingLeft: token('space.050', '4px'),
  backgroundColor: token('color.background.discovery.hovered', colors.P50),
  border: `1px solid ${token('color.border.discovery', colors.P75)}`,
  borderRadius: '0.2em',
  color: token('color.text.discovery', colors.P500),
  fontFamily: 'Monaco, monospace',
  fontSize: '0.85em',
  lineHeight: 1.3,
  verticalAlign: 'baseline',
});

type CodeProps = HTMLAttributes<HTMLElement> & { children?: ReactNode };

export const Code = (props: CodeProps) => (
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
  <code {...props} css={codeStyles} />
);
