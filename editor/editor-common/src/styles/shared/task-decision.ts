import { css } from 'styled-components';
import { akEditorTableCellMinWidth } from '../consts';

export const tasksAndDecisionsStyles = css`
  .ProseMirror .taskItemView-content-wrap,
  .ProseMirror .decisionItemView-content-wrap {
    position: relative;
    min-width: ${akEditorTableCellMinWidth}px;
  }

  .ProseMirror .decisionItemView-content-wrap {
    margin-top: 0;
  }

  div[data-task-list-local-id] {
    margin: 12px 0 0 0;
  }

  div[data-task-list-local-id]:first-child {
    margin-top: 0;
  }

  div[data-task-list-local-id] div[data-task-list-local-id] {
    margin-top: 0px;
    margin-left: 24px;
  }
`;
