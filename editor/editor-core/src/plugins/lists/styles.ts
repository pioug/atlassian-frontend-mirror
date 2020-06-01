import { css } from 'styled-components';

export const listsStyles = css`
  .ProseMirror li {
    position: relative;

    > p:not(:first-child) {
      margin: 4px 0 0 0;
    }
  }
`;
