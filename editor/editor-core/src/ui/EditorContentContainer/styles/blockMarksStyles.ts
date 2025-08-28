// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const blockMarksStyles: SerializedStyles = css({
	// We need to remove margin-top from first item
	// inside doc, tableCell, tableHeader, blockquote, etc.
	//
	// - For nested block marks apart from those with indentation mark.
	// - Do not remove the margin top for nodes inside indentation marks.
	// - Do not remove the margin top for nodes inside alignment marks.
	//- If first element inside a block node has alignment mark, then remove the margin-top.
	//- If first document element has indentation mark remove margin-top.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
	'*:not(.fabric-editor-block-mark) >, *:not(.fabric-editor-block-mark) > div.fabric-editor-block-mark:first-of-type:not(.fabric-editor-indentation-mark):not(.fabric-editor-alignment), .fabric-editor-alignment:first-of-type:first-child, .ProseMirror .fabric-editor-indentation-mark:first-of-type:first-child':
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'p, h1, h2, h3, h4, h5, h6, .heading-wrapper': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
				'&:first-child:not(style), style:first-child + *': {
					marginTop: 0,
				},
			},
		},
});
