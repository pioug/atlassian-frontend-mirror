import { css } from '@emotion/react';
import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const placeHolderClassName = 'placeholder-decoration';

export const placeholderStyles = css`
  .ProseMirror .${placeHolderClassName} {
    position: relative;
    color: ${token('color.text.subtlest', N200)};
    width: 100%;

    pointer-events: none;
    display: block;
    user-select: none;

    > span {
      position: absolute;
      pointer-events: none;
      outline: none;
    }

    &.align-end > span {
      right: 0;
    }

    &.align-center > span {
      left: 0;
    }
  }
`;
