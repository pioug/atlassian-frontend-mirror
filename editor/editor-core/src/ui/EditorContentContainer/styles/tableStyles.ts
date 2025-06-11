// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css } from '@emotion/react';

import { scrollbarStyles } from './scrollbarStyles';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const tableLayoutFixes = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.pm-table-header-content-wrap :not(.fabric-editor-alignment), .pm-table-header-content-wrap :not(p, .fabric-editor-block-mark) + div.fabric-editor-block-mark, .pm-table-cell-content-wrap :not(p, .fabric-editor-block-mark) + div.fabric-editor-block-mark':
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'p:first-of-type': {
				marginTop: 0,
			},
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-table-cell-content-wrap .mediaGroupView-content-wrap': {
		clear: 'both',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const tableCommentEditorMarginOverride = css({
	marginLeft: 0,
	marginRight: 0,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const tableCommentEditorStyles = css({
	// TODO: ED-28075 - refactor array include to unblock Compiled CSS migration
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror .pm-table-wrapper > table`]: [tableCommentEditorMarginOverride, scrollbarStyles],
});
