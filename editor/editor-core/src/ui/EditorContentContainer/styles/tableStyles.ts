/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { scrollbarStyles } from './scrollbarStyles';
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
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
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
export const tableLayoutFixesWithFontSize: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.pm-table-header-content-wrap :not(.fabric-editor-alignment, .fabric-editor-font-size), .pm-table-header-content-wrap :not(p, .fabric-editor-block-mark) + div.fabric-editor-block-mark, .pm-table-cell-content-wrap :not(p, .fabric-editor-block-mark) + div.fabric-editor-block-mark':
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
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
export const tableCommentEditorMarginOverride: SerializedStyles = css({
	marginLeft: 0,
	marginRight: 0,
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
export const tableCommentEditorStyles: SerializedStyles = css({
	// TODO: ED-28075 - refactor array include to unblock Compiled CSS migration
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror .pm-table-wrapper > table`]: [tableCommentEditorMarginOverride, scrollbarStyles],
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
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
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
export const tableEmptyRowStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror .pm-table-wrapper': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.pm-table-cell-content-wrap, .pm-table-header-content-wrap': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'p:empty': {
				/* add a minimum height to empty table rows in SSR */
				minHeight: '1.714em',
			},
		},
	},
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
export const tableContentModeStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.pm-table-resizer-container:has(table[data-initial-width-mode="content"])': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		width: 'max-content !important',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'--ak-editor-table-width': 'max-content',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.resizer-item:has(table[data-initial-width-mode="content"])': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		width: 'max-content !important',
	},

	// Reset the extended hover zone padding for content-mode tables so it doesn't
	// inflate the max-content width of parent elements (resizer-container, wrapper).
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.resizer-item:has(table[data-initial-width-mode="content"]) > .resizer-hover-zone.resizer-is-extended':
		{
			padding: 'unset',
			left: 'unset',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror .pm-table-wrapper table[data-initial-width-mode="content"]': {
		tableLayout: 'auto',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		width: 'max-content !important',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror .pm-table-wrapper table[data-initial-width-mode="content"] > colgroup > col': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		width: 'unset !important',
	},
});
/**
 * SSR-safe rounded corners for the outermost table cells.
 *
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
export const tableRoundedCornerStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.ProseMirror .pm-table-wrapper > table > tbody > tr > td[data-reaches-top][data-reaches-left], .ProseMirror .pm-table-wrapper > table > tbody > tr > th[data-reaches-top][data-reaches-left]':
		{
			borderTopLeftRadius: token('radius.xlarge'),
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.ProseMirror .pm-table-wrapper > table > tbody > tr > td[data-reaches-top][data-reaches-right], .ProseMirror .pm-table-wrapper > table > tbody > tr > th[data-reaches-top][data-reaches-right]':
		{
			borderTopRightRadius: token('radius.xlarge'),
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.ProseMirror .pm-table-wrapper > table > tbody > tr > td[data-reaches-bottom][data-reaches-left], .ProseMirror .pm-table-wrapper > table > tbody > tr > th[data-reaches-bottom][data-reaches-left]':
		{
			borderBottomLeftRadius: token('radius.xlarge'),
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.ProseMirror .pm-table-wrapper > table > tbody > tr > td[data-reaches-bottom][data-reaches-right], .ProseMirror .pm-table-wrapper > table > tbody > tr > th[data-reaches-bottom][data-reaches-right]':
		{
			borderBottomRightRadius: token('radius.xlarge'),
		},
});
