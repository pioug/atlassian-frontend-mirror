/* eslint-disable @atlaskit/design-system/no-css-tagged-template-expression -- Perfectly safe to auto-fix, but leaving it up to the team to remediate as the readability only gets worse with autofixing */
import { css } from '@emotion/react';

export const blockMarksSharedStyles = css`
	/**
   * We need to remove margin-top from first item
   * inside doc, tableCell, tableHeader, blockquote, etc.
   */
	*:not(.fabric-editor-block-mark) >,
  /* For nested block marks apart from those with indentation mark */
  *:not(.fabric-editor-block-mark) >
    div.fabric-editor-block-mark:first-of-type
    /* Do not remove the margin top for nodes inside indentation marks */
      :not(.fabric-editor-indentation-mark)
    /* Do not remove the margin top for nodes inside alignment marks */
      :not(.fabric-editor-alignment),
  // If first element inside a block node has alignment mark, then remove the margin-top
  .fabric-editor-alignment:first-of-type:first-child,
  // If first document element has indentation mark remove margin-top
  .ProseMirror .fabric-editor-indentation-mark:first-of-type:first-child {
		p,
		h1,
		h2,
		h3,
		h4,
		h5,
		h6,
		.heading-wrapper {
			:first-child:not(style),
			style:first-child + * {
				margin-top: 0;
			}
		}
	}
`;
