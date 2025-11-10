// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

import { scrollbarStyles } from './scrollbarStyles';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const tableLayoutFixes: SerializedStyles = css({
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
export const tableCommentEditorMarginOverride: SerializedStyles = css({
	marginLeft: 0,
	marginRight: 0,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const tableCommentEditorStyles: SerializedStyles = css({
	// TODO: ED-28075 - refactor array include to unblock Compiled CSS migration
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror .pm-table-wrapper > table`]: [tableCommentEditorMarginOverride, scrollbarStyles],
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const tableContainerStyles: SerializedStyles = css({
	/* Fix for HOT-119925: Ensure table containers have proper width constraints and overflow handling */
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror .pm-table-wrapper': {
		maxWidth: '100%',
		overflowX: 'auto',
		// Ensure the wrapper doesn't grow beyond its container
		width: '100%',
		boxSizing: 'border-box',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror .pm-table-wrapper.pm-table-wrapper-no-overflow': {
		overflowX: 'visible',
	},

	/* Fix for HOT-119925: Ensure table elements are responsive and don't overflow */
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror .pm-table-wrapper table': {
		maxWidth: '100%',
		width: '100%',
		tableLayout: 'fixed',
		// Ensure tables can be scrolled horizontally if needed
		minWidth: 'auto',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const tableContainerOverflowY: SerializedStyles = css({
	/* Fix for HOT-119925: Ensure table containers have proper width constraints and overflow handling */
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror .pm-table-wrapper': {
		overflowY: 'visible',
	},
});
