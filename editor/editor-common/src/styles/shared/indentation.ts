import { css } from 'styled-components';

export const indentationSharedStyles = css`
  .fabric-editor-indentation-mark {
    &[data-level='1'] {
      margin-left: 30px;
    }
    &[data-level='2'] {
      margin-left: 60px;
    }
    &[data-level='3'] {
      margin-left: 90px;
    }
    &[data-level='4'] {
      margin-left: 120px;
    }
    &[data-level='5'] {
      margin-left: 150px;
    }
    &[data-level='6'] {
      margin-left: 180px;
    }
  }
`;
