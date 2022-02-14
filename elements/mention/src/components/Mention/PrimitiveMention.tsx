/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { themed, useGlobalTheme } from '@atlaskit/theme/components';
import type { Theme } from '@atlaskit/theme/types';
import {
  B400,
  B200,
  N500,
  DN800,
  DN100,
  DN80,
  N30A,
  DN30,
  N20,
} from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { MentionType } from '../../types';
import { forwardRef, HTMLAttributes } from 'react';

export interface PrimitiveMentionProps extends HTMLAttributes<HTMLSpanElement> {
  mentionType: MentionType;
}

const mentionStyle = {
  [MentionType.SELF]: {
    background: themed({
      light: token('color.background.brand.bold', B400),
      dark: token('color.background.brand.bold', B200),
    }),
    borderColor: 'transparent',
    text: themed({
      light: token('color.text.inverse', N20),
      dark: token('color.text.inverse', DN30),
    }),
    hoveredBackground: themed({
      light: token('color.background.brand.bold.hovered', B400),
      dark: token('color.background.brand.bold.hovered', B200),
    }),
    pressedBackground: themed({
      light: token('color.background.brand.bold.pressed', B400),
      dark: token('color.background.brand.bold.pressed', B200),
    }),
  },
  [MentionType.RESTRICTED]: {
    background: 'transparent',
    borderColor: themed({
      light: token('color.border', N500),
      dark: token('color.border', DN80),
    }),
    text: themed({
      light: token('color.text.disabled', N500),
      dark: token('color.text.disabled', DN100),
    }),
    hoveredBackground: 'transparent',
    pressedBackground: 'transparent',
  },
  [MentionType.DEFAULT]: {
    background: themed({
      light: token('color.background.neutral', N30A),
      dark: token('color.background.neutral', DN80),
    }),
    borderColor: 'transparent',
    text: themed({
      light: token('color.text.subtle', N500),
      dark: token('color.text.subtle', DN800),
    }),
    hoveredBackground: themed({
      light: token('color.background.neutral.hovered', N30A),
      dark: token('color.background.neutral.hovered', DN80),
    }),
    pressedBackground: themed({
      light: token('color.background.neutral.pressed', N30A),
      dark: token('color.background.neutral.pressed', DN80),
    }),
  },
} as const;

const getStyle = (
  { mentionType, theme }: PrimitiveMentionProps & { theme: Theme },
  property:
    | 'background'
    | 'borderColor'
    | 'text'
    | 'hoveredBackground'
    | 'pressedBackground',
) => {
  const obj = mentionStyle[mentionType][property];

  return typeof obj === 'string' ? obj : obj({ theme });
};

const PrimitiveMention = forwardRef<HTMLSpanElement, PrimitiveMentionProps>(
  ({ mentionType, ...other }, ref) => {
    const theme = useGlobalTheme();
    return (
      <span
        ref={ref}
        css={css`
          display: inline;
          border: 1px solid ${getStyle({ theme, mentionType }, 'borderColor')};
          background: ${getStyle({ theme, mentionType }, 'background')};
          color: ${getStyle({ theme, mentionType }, 'text')};
          border-radius: 20px;
          cursor: pointer;
          padding: 0 0.3em 2px 0.23em;
          line-height: 1.714;
          font-size: 1em;
          font-weight: normal;
          word-break: break-word;
          &:hover {
            background: ${getStyle(
              { theme, mentionType },
              'hoveredBackground',
            )};
          }
          &:active {
            background: ${getStyle(
              { theme, mentionType },
              'pressedBackground',
            )};
          }
        `}
        {...other}
      />
    );
  },
);

export default PrimitiveMention;
