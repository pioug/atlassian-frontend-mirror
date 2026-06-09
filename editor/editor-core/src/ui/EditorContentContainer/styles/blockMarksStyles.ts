/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const blockMarksStyles: SerializedStyles = css({
	// We need to remove margin-top from first item
	// inside doc, tableCell, tableHeader, blockquote, etc.
	//
	// - For nested block marks apart from those with indentation mark.
	// - Do not remove the margin top for nodes inside indentation marks.
	// - Do not remove the margin top for nodes inside alignment marks.
	// - Do not remove the margin top for nodes inside font size marks.
	//- If first element inside a block node has alignment or font size mark, then remove the margin-top.
	//- If first document element has indentation mark remove margin-top.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
	'*:not(.fabric-editor-block-mark) >, *:not(.fabric-editor-block-mark) > div.fabric-editor-block-mark:first-of-type:not(.fabric-editor-indentation-mark):not(.fabric-editor-alignment):not(.fabric-editor-font-size), .fabric-editor-alignment:first-of-type:first-child, .fabric-editor-font-size:first-of-type:first-child, .ProseMirror .fabric-editor-indentation-mark:first-of-type:first-child':
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
