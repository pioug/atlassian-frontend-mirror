import { css } from 'styled-components';
import { akEditorMentionSelected } from '../../styles';

export const mentionsStyles = css`
  .ProseMirror-selectednode .ak-mention {
    background: ${akEditorMentionSelected};
  }
`;
