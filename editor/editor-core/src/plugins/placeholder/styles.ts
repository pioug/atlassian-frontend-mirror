import { css } from 'styled-components';
import { colors } from '@atlaskit/theme';

export const placeHolderClassName = 'placeholder-decoration';

export const placeholderStyles = css`
  .ProseMirror .${placeHolderClassName} {
    position: relative;
    color: ${colors.N90};
    width: 100%;

    pointer-events: none;
    display: block;
    user-select: none;

    > span {
      position: absolute;
      pointer-events: none;
    }

    &.align-end > span {
      right: 0;
    }

    &.align-center > span {
      left: 0;
    }
  }
`;
