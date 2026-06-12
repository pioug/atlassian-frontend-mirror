/* eslint-disable @atlaskit/volt-strict-mode/no-multiple-exports */
/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// TODO: ED-28075 - refactor selection styles to unblock Compiled CSS migration
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const hideNativeBrowserTextSelectionStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&::selection,*::selection': {
		backgroundColor: 'transparent',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
	'&::-moz-selection,*::-moz-selection': {
		backgroundColor: 'transparent',
	},
});

// TODO: ED-28075 - refactor selection styles to unblock Compiled CSS migration
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const borderSelectionStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
	border: `1px solid ${token('color.border.selected')}`,

	// Fixes ED-15246: Trello card is visible through a border of a table border
	'&::after': {
		height: '100%',
		content: "'\\00a0'",
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
		background: token('color.border.selected'),
		position: 'absolute',
		right: -1,
		top: 0,
		bottom: 0,
		width: 1,
		border: 'none',
		display: 'inline-block',
	},
});

// TODO: ED-28075 - refactor selection styles to unblock Compiled CSS migration
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const boxShadowSelectionStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
	boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
	borderColor: 'transparent',
});

// TODO: ED-28075 - refactor selection styles to unblock Compiled CSS migration
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const backgroundSelectionStyles: SerializedStyles = css({
	backgroundColor: token('color.background.selected'),
});

// TODO: ED-28075 - refactor selection styles to unblock Compiled CSS migration
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const blanketSelectionStyles: SerializedStyles = css({
	position: 'relative',
	// Fixes ED-9263, where emoji or inline card in panel makes selection go outside the panel
	// in Safari. Looks like it's caused by user-select: all in the emoji element
	WebkitUserSelect: 'text',

	'&::before': {
		position: 'absolute',
		content: "''",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		width: '100%',
		pointerEvents: 'none',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
		zIndex: 12,
		backgroundColor: token('color.blanket.selected'),
	},
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const hideSelectionStyles: SerializedStyles = css({
	// Hide selection styles for ProseMirror editor
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror-hideselection': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'*::selection': {
			background: 'transparent',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'*::-moz-selection': {
			background: 'transparent',
		},
	},
});

/**
 * This prosemirror css style: https://github.com/ProseMirror/prosemirror-view/blob/f37ebb29befdbde3cd194fe13fe17b78e743d2f2/style/prosemirror.css#L24
 */
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const hideCursorWhenHideSelectionStyles: SerializedStyles = css({
	// Hide cursor when hide selection styles are applied
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror-hideselection': {
		caretColor: 'transparent',
	},
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const selectedNodeStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror-selectednode': {
		outline: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror-selectednode:empty': {
		outline: `2px solid ${token('color.border.focused')}`,
	},
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const dangerBorderStyles: SerializedStyles = css({
	boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const dangerBackgroundStyles: SerializedStyles = css({
	backgroundColor: token('color.background.danger'),
});
