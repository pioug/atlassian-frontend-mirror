/** @jsx jsx */
import { forwardRef, HTMLAttributes, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const highlights: Record<string, any> = {
  blue: token('color.background.accent.blue.subtle'),
  green: token('color.background.accent.green.subtle'),
  neutral: token('color.border'),
  purple: token('color.background.accent.purple.subtle'),
  red: token('color.background.accent.red.subtle'),
  teal: token('color.background.accent.teal.subtle'),
  yellow: token('color.background.accent.orange.subtle'),
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
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  padding: '1em 2em',
  position: 'relative',
  alignItems: 'space-between',
  justifyContent: 'space-between',
  borderInlineStartStyle: 'solid',
  borderInlineStartWidth: '4px',
  overflow: 'hidden',
  '&::after': {
    width: '4px',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'transparent',
    content: '""',
    insetBlockStart: token('space.0', '0px'),
    insetInlineStart: token('space.0', '0px'),
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
        backgroundColor: props.bg ?? token('elevation.surface.raised'),
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
  backgroundColor: token('color.background.discovery.hovered'),
  border: `1px solid ${token('color.border.discovery')}`,
  borderRadius: '0.2em',
  color: token('color.text.discovery'),
  fontFamily: 'Monaco, monospace',
  fontSize: '0.85em',
  lineHeight: 1.3,
  paddingInlineEnd: token('space.050', '4px'),
  paddingInlineStart: token('space.050', '4px'),
  verticalAlign: 'baseline',
});

type CodeProps = HTMLAttributes<HTMLElement> & { children?: ReactNode };

export const Code = (props: CodeProps) => (
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
  <code {...props} css={codeStyles} />
);
