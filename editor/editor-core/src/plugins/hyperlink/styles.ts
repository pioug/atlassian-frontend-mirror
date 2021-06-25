import styled, { css } from 'styled-components';
import { linkSharedStyle } from '@atlaskit/editor-common';

export const linkStyles = css`
  .ProseMirror {
    ${linkSharedStyle}
  }
`;

/**
 * Visible only to screenreaders. Use when there is a need
 * to provide more context to a non-sighted user.
 */
export const visuallyHiddenStyles = css`
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: inset(50%);
  height: 1px;
  width: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
`;
export const ScreenReaderText = styled.div`
  ${visuallyHiddenStyles};
`;
