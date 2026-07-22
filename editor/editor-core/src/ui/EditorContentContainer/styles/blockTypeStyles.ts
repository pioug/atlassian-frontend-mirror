/* eslint-disable @atlaskit/volt-strict-mode/no-multiple-exports */
/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import { akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const blocktypeStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// Block Quote Shared Styles
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& blockquote': {
			boxSizing: 'border-box',
			color: 'inherit',
			width: '100%',
			display: 'inline-block',

			// These 2 styles are needed to avoid Confluence's batch.css overrides that expand blockquote with extra padding after SSR.
			paddingTop: 0,
			paddingBottom: 0,

			paddingLeft: token('space.200'),
			borderLeftWidth: token('border.width.selected'),
			borderLeftStyle: 'solid',
			borderLeftColor: token('color.border'),
			margin: '0.75rem 0 0 0', // From https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
			marginRight: 0,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
			'[dir="rtl"] &': {
				paddingLeft: 0,
				paddingRight: token('space.200'),
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:first-child': {
				marginTop: 0,
			},
			'&::before': {
				content: "''",
			},
			'&::after': {
				content: 'none',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'& p': {
				display: 'block',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
			'& table, & table:last-child': {
				display: 'inline-table',
			},
			// Workaround for overriding the inline-block display on last child of a blockquote set in CSS reset.
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
			'> .code-block:last-child, >.mediaSingleView-content-wrap:last-child, >.mediaGroupView-content-wrap:last-child':
				{
					display: 'block',
				},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
			'> .extensionView-content-wrap:last-child': {
				display: 'block',
			},
		},
		// Headings Shared Styles -> Heading With Alignment Styles
		// Override marginTop: 0 with default margin found in headingsSharedStyles for first heading in alignment block that is not the first child
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'.fabric-editor-block-mark.fabric-editor-alignment:not(:first-child)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
			'> h1:first-child': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginTop: '1.667em',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
			'> h2:first-child': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginTop: '1.8em',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
			'> h3:first-child': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginTop: '2em',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
			'> h4:first-child': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginTop: '1.357em',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
			'> h5:first-child': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginTop: '1.667em',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
			'> h6:first-child': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginTop: '1.455em',
			},
		},
		// Set marginTop: 0 if alignment block is next to a gap cursor or widget that is first child
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror-gapcursor:first-child + .fabric-editor-block-mark.fabric-editor-alignment, .ProseMirror-widget:first-child + .fabric-editor-block-mark.fabric-editor-alignment, .ProseMirror-widget:first-child + .ProseMirror-widget:nth-child(2) + .fabric-editor-block-mark.fabric-editor-alignment':
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
				'> :is(h1, h2, h3, h4, h5, h6):first-child': {
					marginTop: '0',
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
export const blockquoteDangerStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror blockquote.danger': {
		backgroundColor: `${token('color.background.danger')}`,
		borderLeftColor: `${token('color.border.danger')}`,
	},
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const blockquoteSelectedNodeStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror blockquote.ak-editor-selected-node': {
		background: token('color.background.accent.blue.subtler'),
		borderLeftColor: token('color.border.selected'),
		WebkitUserSelect: 'text',

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'&::selection, *::selection': {
			backgroundColor: 'transparent',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'&::-moz-selection, *::-moz-selection': {
			backgroundColor: 'transparent',
		},
	},
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const blocktypeStyles_fg_platform_editor_typography_ugc: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& h1': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			font: 'var(--editor-font-ugc-token-heading-h1)',
			marginBottom: 0,
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '1.45833em',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'& strong': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontWeight: 'var(--editor-font-ugc-token-weight-heading-bold)',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& h2': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			font: 'var(--editor-font-ugc-token-heading-h2)',
			marginBottom: 0,
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '1.4em',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'& strong': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontWeight: 'var(--editor-font-ugc-token-weight-heading-bold)',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& h3': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			font: 'var(--editor-font-ugc-token-heading-h3)',
			marginBottom: 0,
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '1.31249em',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'& strong': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontWeight: 'var(--editor-font-ugc-token-weight-heading-bold)',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& h4': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			font: 'var(--editor-font-ugc-token-heading-h4)',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '1.25em',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'& strong': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontWeight: 'var(--editor-font-ugc-token-weight-heading-bold)',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& h5': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			font: 'var(--editor-font-ugc-token-heading-h5)',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '1.45833em',
			textTransform: 'none',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'& strong': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontWeight: 'var(--editor-font-ugc-token-weight-heading-bold)',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& h6': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			font: 'var(--editor-font-ugc-token-heading-h6)',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '1.59091em',
			textTransform: 'none',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'& strong': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontWeight: 'var(--editor-font-ugc-token-weight-heading-bold)',
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
export const blocktypeStyles_fg_platform_editor_nested_dnd_styles_changes: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-content-area.appearance-full-page .ProseMirror blockquote': {
		paddingLeft: token('space.250'),
	},
	// Don't want extra padding for inline editor (nested)
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-content-area .ak-editor-content-area .ProseMirror blockquote': {
		paddingLeft: token('space.200'),
	},
});

// This class applies when the node is selected directly or is included in the selected range
const isSelectedNode = `.${akEditorSelectedNodeClassName}`;
const isOuterMostSelectedNode = `${isSelectedNode}:not(${isSelectedNode} *)`;

const isList = ':is(ul, ol, div[data-node-type="actionList"])';
const isOuterMostList = `${isList}:not(${isList} *)`;
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const listSelectedNodeStyles: SerializedStyles = css({
	// only apply selected styles to the outermost list to avoid nested selection styles for lists within lists
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[`.ProseMirror ${isOuterMostList}${isOuterMostSelectedNode}`]: {
		background: token('color.background.accent.blue.subtler'),
		WebkitUserSelect: 'text',

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'&::selection, *::selection': {
			backgroundColor: 'transparent',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'&::-moz-selection, *::-moz-selection': {
			backgroundColor: 'transparent',
		},
	},
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const listDangerStyles: SerializedStyles = css({
	// only apply danger styles to the outermost list to avoid nested danger styles for lists within lists
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[`.ProseMirror ${isOuterMostList}${isOuterMostSelectedNode}.danger`]: {
		background: token('color.background.danger'),
	},
});

const isText = `:is(p, h1, h2, h3, h4, h5, h6)`;
const isRootText = `${isText}:not(${isList} ${isText})`;
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const textSelectedNodeStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[`.ProseMirror ${isRootText}${isOuterMostSelectedNode}`]: {
		background: token('color.background.accent.blue.subtler'),
		WebkitUserSelect: 'text',
		boxShadow: `0 -4px 0 ${token('color.background.accent.blue.subtler')}, 0 4px 0 ${token('color.background.accent.blue.subtler')}`,

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'&::selection, *::selection': {
			backgroundColor: 'transparent',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'&::-moz-selection, *::-moz-selection': {
			backgroundColor: 'transparent',
		},
	},
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const textDangerStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[`.ProseMirror ${isRootText}${isOuterMostSelectedNode}.danger`]: {
		background: token('color.background.danger'),
		boxShadow: `0 -4px 0 ${token('color.background.danger')}, 0 4px 0 ${token('color.background.danger')}`,
	},
});
