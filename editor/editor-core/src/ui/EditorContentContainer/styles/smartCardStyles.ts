/* eslint-disable @atlaskit/volt-strict-mode/no-multiple-exports */
/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */

import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import { akEditorFullPageNarrowBreakout } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

import { boxShadowSelectionStyles, hideNativeBrowserTextSelectionStyles } from './selectionStyles';

// Constant variables here has been inlined in css from EditorContentContainer, if you need to make
// update here, please also update packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const DATASOURCE_INNER_CONTAINER_CLASSNAME = 'datasourceView-content-inner-wrap';

/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const FLOATING_TOOLBAR_LINKPICKER_CLASSNAME = 'card-floating-toolbar--link-picker';

// Constant variables here has been inlined in css from EditorContentContainer, if you need to make
// update here, please also update packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const SmartCardSharedCssClassName = {
	INLINE_CARD_CONTAINER: 'inlineCardView-content-wrap',
	BLOCK_CARD_CONTAINER: 'blockCardView-content-wrap',
	EMBED_CARD_CONTAINER: 'embedCardView-content-wrap',
	DATASOURCE_CONTAINER: 'datasourceView-content-wrap',
	LOADER_WRAPPER: 'loader-wrapper',
};

// Move this into `smartCardStyles` below when cleaning up editor_controls_patch_15
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const editorControlsSmartCardStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[`.${SmartCardSharedCssClassName.INLINE_CARD_CONTAINER}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-inlinecard-button-overlay="icon-wrapper-line-height"] span': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: 0,
		},
	},
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Ignored via go/DSP-18766
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const smartCardDiffStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
	[`.${SmartCardSharedCssClassName.EMBED_CARD_CONTAINER}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`&[data-testid="show-diff-changed-decoration-node"] .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after`]:
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 var(--diff-decoration-marker-ring-width, 1px) var(--diff-decoration-marker-color)`,
				borderColor: 'transparent',
			},
	},
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Ignored via go/DSP-18766
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 *
 * Two rule sets, one per cohort of `platform_editor_show_diff_color_scheme_refactor`. Their base
 * classes are disjoint — `wrapBlockNodeView` emits `-node`/`-node-traditional` when the gate is off
 * and `-node-vars` when it is on — so only one set can ever match an element.
 *
 * The OFF set is the pre-refactor CSS, kept verbatim: that cohort emits no custom properties, so the
 * tokens in its `var()` fallbacks are the live values. Delete it at experiment cleanup.
 *
 * The ON set reads the `--diff-delete-*` properties the factory emits inline, with no `var()`
 * fallback — `wrapBlockNodeView` sets the class and the properties in the same step. The fallbacks
 * it does keep are the ones standard leaves unset on purpose: `--diff-delete-opacity`,
 * `--diff-delete-ring-width`, and `--diff-delete-text-decoration-color`.
 */
export const showDiffDeletedNodeStyles: SerializedStyles = css({
	// --- OFF cohort: pre-refactor rules, restored verbatim ------------------------------------
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
	[`.${SmartCardSharedCssClassName.EMBED_CARD_CONTAINER}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
		[`&.show-diff-deleted-node .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			boxShadow: `0 0 0 1px var(--diff-delete-color, ${token('color.border.accent.gray')})`,
			borderColor: 'transparent',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
		[`&.show-diff-deleted-node-traditional .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after`]:
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 1px var(--diff-delete-color, ${token('color.border.accent.red')})`,
				borderColor: 'transparent',
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
		[`&.show-diff-deleted-node-traditional.show-diff-deleted-outline-new .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after`]:
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 4px var(--diff-delete-color-new, ${token('color.background.accent.red.subtlest')})`,
				borderColor: 'transparent',
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
		[`&.show-diff-deleted-node-traditional.show-diff-deleted-active .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after`]:
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 4px var(--diff-delete-color-active, ${token('color.background.accent.red.subtler.pressed')})`,
				borderColor: 'transparent',
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
		[`&.show-diff-deleted-node.show-diff-deleted-active .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after`]:
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 4px var(--diff-delete-color-active, ${token('color.background.accent.red.subtler.pressed')})`,
				borderColor: 'transparent',
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
		[`&.show-diff-deleted-node .${SmartCardSharedCssClassName.LOADER_WRAPPER}`]: {
			opacity: 0.6,
		},

		// ON cohort, same container: one rule per visual role, reading the factory's properties.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
		[`&.show-diff-deleted-node-vars .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			boxShadow: `0 0 0 1px var(--diff-delete-color)`,
			borderColor: 'transparent',
		},
		// Only schemes with a resting ring get `-outline-new`, so this is traditional-only in practice.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
		[`&.show-diff-deleted-node-vars.show-diff-deleted-outline-new .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after`]:
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 4px var(--diff-delete-color-new)`,
				borderColor: 'transparent',
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
		[`&.show-diff-deleted-node-vars.show-diff-deleted-active .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after`]:
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 4px var(--diff-delete-color-active)`,
				borderColor: 'transparent',
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
		[`&.show-diff-deleted-node-vars .${SmartCardSharedCssClassName.LOADER_WRAPPER}`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			opacity: `var(--diff-delete-opacity, 0.6)`,
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.show-diff-deleted-node .media-card-wrapper': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > div': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			boxShadow: `0 0 0 1px var(--diff-delete-color, ${token('color.border.accent.gray')})`,
			borderRadius: token('radius.small'),
			opacity: 0.6,
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.show-diff-deleted-node-traditional .media-card-wrapper': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > div': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			boxShadow: `0 0 0 1px var(--diff-delete-color, ${token('color.border.accent.red')})`,
			borderRadius: token('radius.small'),
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.show-diff-deleted-node-traditional.show-diff-deleted-outline-new .media-card-wrapper': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > div': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			boxShadow: `0 0 0 4px var(--diff-delete-color-new, ${token('color.background.accent.red.subtlest')})`,
			borderRadius: token('radius.small'),
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.show-diff-deleted-node-traditional.show-diff-deleted-active .media-card-wrapper': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > div': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			boxShadow: `0 0 0 4px var(--diff-delete-color-active, ${token('color.background.accent.red.subtler.pressed')})`,
			borderRadius: token('radius.small'),
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.show-diff-deleted-node.show-diff-deleted-active .media-card-wrapper': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > div': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			boxShadow: `0 0 0 4px var(--diff-delete-color-active, ${token('color.background.accent.red.subtler.pressed')})`,
			borderRadius: token('radius.small'),
			opacity: 0.6,
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="blockquote"].show-diff-deleted-node': {
		textDecoration: 'line-through',
	},
	// Longhands, not the `text-decoration` shorthand: the shorthand resets `text-decoration-color`,
	// and Compiled does not guarantee it lands before the longhand.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="blockquote"].show-diff-deleted-node-traditional': {
		textDecorationColor: `var(--diff-delete-text-decoration-color, ${token('color.border.accent.red')})`,
		textDecorationLine: 'line-through',
	},
	// Longhands, for the same reason as the blockquote rule above.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="embedCard"].show-diff-deleted-node-traditional': {
		textDecorationColor: `var(--diff-delete-text-decoration-color, ${token('color.border.accent.red')})`,
		textDecorationLine: 'line-through',
	},

	// --- ON cohort: merged rules, one per visual role -----------------------------------------
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.show-diff-deleted-node-vars .media-card-wrapper': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > div': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			boxShadow: `0 0 0 1px var(--diff-delete-color)`,
			borderRadius: token('radius.small'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			opacity: `var(--diff-delete-opacity, 0.6)`,
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.show-diff-deleted-node-vars.show-diff-deleted-outline-new .media-card-wrapper': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > div': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			boxShadow: `0 0 0 4px var(--diff-delete-color-new)`,
			borderRadius: token('radius.small'),
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.show-diff-deleted-node-vars.show-diff-deleted-active .media-card-wrapper': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > div': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			boxShadow: `0 0 0 4px var(--diff-delete-color-active)`,
			borderRadius: token('radius.small'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			opacity: `var(--diff-delete-opacity, 0.6)`,
		},
	},
	// Both schemes strike deleted blockquotes; only the colour differs. The variable is emitted for
	// `stateful` (traditional) only, so standard falls through to `currentColor` — what it painted
	// before. Longhands, not the shorthand, which would reset the colour.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="blockquote"].show-diff-deleted-node-vars': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		textDecorationColor: `var(--diff-delete-text-decoration-color, currentColor)`,
		textDecorationLine: 'line-through',
	},
	// Standard draws no strike on deleted embedCards, so the line itself is scheme-driven:
	// `--diff-delete-embed-strike-line` is `line-through` for traditional, `none` for standard.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="embedCard"].show-diff-deleted-node-vars': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		textDecorationColor: `var(--diff-delete-text-decoration-color, currentColor)`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		textDecorationLine: `var(--diff-delete-embed-strike-line)`,
	},
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Ignored via go/DSP-18766
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 *
 * The a11y-fixes variant of `showDiffDeletedNodeStyles`; same two-cohort split — see its note.
 */
export const showDiffDeletedNodeStylesNew: SerializedStyles = css({
	// --- OFF cohort: pre-refactor rules, restored verbatim ------------------------------------
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
	[`.${SmartCardSharedCssClassName.EMBED_CARD_CONTAINER}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
		[`&.show-diff-deleted-node .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			boxShadow: `0 0 0 1px var(--diff-delete-color, ${token('color.border.accent.red')})`,
			borderColor: 'transparent',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
		[`&.show-diff-deleted-node-traditional .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after`]:
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 1px var(--diff-delete-color, ${token('color.border.accent.red')})`,
				borderColor: 'transparent',
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
		[`&.show-diff-deleted-node-traditional.show-diff-deleted-outline-new .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after`]:
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 4px var(--diff-delete-color-new, ${token('color.background.accent.red.subtlest')})`,
				borderColor: 'transparent',
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
		[`&.show-diff-deleted-node-traditional.show-diff-deleted-active .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after`]:
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 4px var(--diff-delete-color-active, ${token('color.background.accent.red.subtler.pressed')})`,
				borderColor: 'transparent',
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
		[`&.show-diff-deleted-node.show-diff-deleted-active .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after`]:
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 4px var(--diff-delete-color-active, ${token('color.background.accent.red.subtler.pressed')})`,
				borderColor: 'transparent',
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
		[`&.show-diff-deleted-node .${SmartCardSharedCssClassName.LOADER_WRAPPER}`]: {
			opacity: 0.8,
		},

		// ON cohort, same container. Red in both schemes here, unlike standard's gray `deleteColor`
		// — hence its own `deletedMediaRingColor` role rather than `--diff-delete-color`.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
		[`&.show-diff-deleted-node-vars .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			boxShadow: `0 0 0 1px var(--diff-delete-media-ring-color)`,
			borderColor: 'transparent',
		},
		// Only schemes with a resting ring get `-outline-new`, so this is traditional-only in practice.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
		[`&.show-diff-deleted-node-vars.show-diff-deleted-outline-new .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after`]:
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 4px var(--diff-delete-color-new)`,
				borderColor: 'transparent',
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
		[`&.show-diff-deleted-node-vars.show-diff-deleted-active .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after`]:
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 4px var(--diff-delete-color-active)`,
				borderColor: 'transparent',
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
		[`&.show-diff-deleted-node-vars .${SmartCardSharedCssClassName.LOADER_WRAPPER}`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			opacity: `var(--diff-delete-opacity, 0.8)`,
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.show-diff-deleted-node .media-card-wrapper': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > div': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			boxShadow: `0 0 0 1px var(--diff-delete-color, ${token('color.border.accent.red')})`,
			borderRadius: token('radius.small'),
			opacity: 0.8,
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.show-diff-deleted-node-traditional .media-card-wrapper': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > div': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			boxShadow: `0 0 0 var(--diff-decoration-marker-ring-width, 1px) var(--diff-delete-color, ${token('color.border.accent.red')})`,
			borderRadius: token('radius.small'),
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.show-diff-deleted-node-traditional.show-diff-deleted-outline-new .media-card-wrapper': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > div': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			boxShadow: `0 0 0 4px var(--diff-delete-color-new, ${token('color.background.accent.red.subtlest')})`,
			borderRadius: token('radius.small'),
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.show-diff-deleted-node-traditional.show-diff-deleted-active .media-card-wrapper': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > div': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			boxShadow: `0 0 0 4px var(--diff-delete-color-active, ${token('color.background.accent.red.subtler.pressed')})`,
			borderRadius: token('radius.small'),
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.show-diff-deleted-node.show-diff-deleted-active .media-card-wrapper': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > div': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			boxShadow: `0 0 0 4px var(--diff-delete-color-active, ${token('color.background.accent.red.subtler.pressed')})`,
			borderRadius: token('radius.small'),
			opacity: 0.8,
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="blockquote"].show-diff-deleted-node': {
		textDecoration: 'line-through',
	},
	// Longhands, not the `text-decoration` shorthand: the shorthand resets `text-decoration-color`,
	// and Compiled does not guarantee it lands before the longhand.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="blockquote"].show-diff-deleted-node-traditional': {
		textDecorationColor: `var(--diff-delete-text-decoration-color, ${token('color.border.accent.red')})`,
		textDecorationLine: 'line-through',
	},
	// Longhands, for the same reason as the blockquote rule above.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="embedCard"].show-diff-deleted-node-traditional': {
		textDecorationColor: `var(--diff-delete-text-decoration-color, ${token('color.border.accent.red')})`,
		textDecorationLine: 'line-through',
	},

	// --- ON cohort: merged rules, one per visual role -----------------------------------------
	// `--diff-delete-ring-width` is unset for standard (1px); traditional tracks the inherited
	// marker ring width.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.show-diff-deleted-node-vars .media-card-wrapper': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > div': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			boxShadow: `0 0 0 var(--diff-delete-ring-width, 1px) var(--diff-delete-media-ring-color)`,
			borderRadius: token('radius.small'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			opacity: `var(--diff-delete-opacity, 0.8)`,
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.show-diff-deleted-node-vars.show-diff-deleted-outline-new .media-card-wrapper': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > div': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			boxShadow: `0 0 0 4px var(--diff-delete-color-new)`,
			borderRadius: token('radius.small'),
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.show-diff-deleted-node-vars.show-diff-deleted-active .media-card-wrapper': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > div': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			boxShadow: `0 0 0 4px var(--diff-delete-color-active)`,
			borderRadius: token('radius.small'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			opacity: `var(--diff-delete-opacity, 0.8)`,
		},
	},
	// Both schemes strike deleted blockquotes; only the colour differs. The variable is emitted for
	// `stateful` (traditional) only, so standard falls through to `currentColor` — what it painted
	// before. Longhands, not the shorthand, which would reset the colour.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="blockquote"].show-diff-deleted-node-vars': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		textDecorationColor: `var(--diff-delete-text-decoration-color, currentColor)`,
		textDecorationLine: 'line-through',
	},
	// Standard draws no strike on deleted embedCards, so the line itself is scheme-driven:
	// `--diff-delete-embed-strike-line` is `line-through` for traditional, `none` for standard.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="embedCard"].show-diff-deleted-node-vars': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		textDecorationColor: `var(--diff-delete-text-decoration-color, currentColor)`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		textDecorationLine: `var(--diff-delete-embed-strike-line)`,
	},
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const smartCardStylesWithSearchMatch: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${SmartCardSharedCssClassName.INLINE_CARD_CONTAINER}`]: {
		maxWidth: 'calc(100% - 20px)',
		verticalAlign: 'top',
		wordBreak: 'break-all',

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.card-with-comment': {
			background: token('color.background.accent.yellow.subtler'),
			borderBottom: `2px solid ${token('color.border.accent.yellow')}`,
			boxShadow: token('elevation.shadow.overlay'),
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.card': {
			paddingLeft: token('space.025'),
			paddingRight: token('space.025'),
			paddingTop: token('space.100'),
			paddingBottom: token('space.100'),
			marginBottom: token('space.negative.100'),

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			[`.${SmartCardSharedCssClassName.LOADER_WRAPPER} > a:focus`]: [
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				boxShadowSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				hideNativeBrowserTextSelectionStyles,
			],
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`&.ak-editor-selected-node .${SmartCardSharedCssClassName.LOADER_WRAPPER} > a`]: [
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			hideNativeBrowserTextSelectionStyles,
		],

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`&.ak-editor-selected-node:not(.search-match-block) .${SmartCardSharedCssClassName.LOADER_WRAPPER} > a`]:
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			[
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				boxShadowSelectionStyles,
			],

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${SmartCardSharedCssClassName.LOADER_WRAPPER} > a`]: {
			// EDM-1717: box-shadow Safari fix start
			zIndex: 1,
			position: 'relative',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.danger': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${SmartCardSharedCssClassName.LOADER_WRAPPER} > a`]: {
				boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				// EDM-1717: box-shadow Safari fix start
				zIndex: 2,
				// EDM-1717: box-shadow Safari fix end
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER}`]: {
		display: 'block',
		margin: '0.75rem 0 0',
		maxWidth: `${8 * 95}px`,

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`&.ak-editor-selected-node .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div`]: [
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			boxShadowSelectionStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			hideNativeBrowserTextSelectionStyles,
			{
				borderRadius: token('radius.large', '8px'),
			},
		],

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.danger': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${SmartCardSharedCssClassName.LOADER_WRAPPER} > div`]: {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				boxShadow: `0 0 0 1px ${token('color.border.danger')} !important`,
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${SmartCardSharedCssClassName.DATASOURCE_CONTAINER}.${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER}`]:
		{
			maxWidth: '100%',
			display: 'flex',
			justifyContent: 'center',

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${DATASOURCE_INNER_CONTAINER_CLASSNAME}`]: {
				cursor: 'pointer',
				backgroundColor: token('color.background.neutral.subtle'),
				borderRadius: token('radius.large', '8px'),
				border: `1px solid ${token('color.border')}`,
				overflow: 'hidden',
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.ak-editor-selected-node': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				[`.${DATASOURCE_INNER_CONTAINER_CLASSNAME}`]: [
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					boxShadowSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					hideNativeBrowserTextSelectionStyles,
					{
						'input::selection': {
							backgroundColor: token('color.background.selected.hovered'),
						},

						'input::-moz-selection': {
							backgroundColor: token('color.background.selected.hovered'),
						},
					},
				],
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.danger': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
				[`.${DATASOURCE_INNER_CONTAINER_CLASSNAME}`]: {
					boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				},
			},
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${SmartCardSharedCssClassName.EMBED_CARD_CONTAINER}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${SmartCardSharedCssClassName.LOADER_WRAPPER} > div`]: {
			cursor: 'pointer',

			'&::after': {
				transition: 'box-shadow 0s',
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`&.ak-editor-selected-node .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after`]: [
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			hideNativeBrowserTextSelectionStyles,
		],

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`&.ak-editor-selected-node:not(.search-match-block) .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after`]:
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			[
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				boxShadowSelectionStyles,
			],

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.danger': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.media-card-frame::after': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				boxShadow: `0 0 0 1px ${token('color.border.danger')} !important`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				background: `${token('color.background.danger')} !important`,
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.richMedia-resize-handle-right::after, .richMedia-resize-handle-left::after': {
				background: token('color.border.danger'),
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${FLOATING_TOOLBAR_LINKPICKER_CLASSNAME}`]: {
		padding: 0,
	},
});

/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const smartCardStylesWithSearchMatchAndBlockMenuDangerStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${SmartCardSharedCssClassName.INLINE_CARD_CONTAINER}`]: {
		maxWidth: 'calc(100% - 20px)',
		verticalAlign: 'top',
		wordBreak: 'break-all',

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.card-with-comment': {
			background: token('color.background.accent.yellow.subtler'),
			borderBottom: `2px solid ${token('color.border.accent.yellow')}`,
			boxShadow: token('elevation.shadow.overlay'),
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.card': {
			paddingLeft: token('space.025'),
			paddingRight: token('space.025'),
			paddingTop: token('space.100'),
			paddingBottom: token('space.100'),
			marginBottom: token('space.negative.100'),

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			[`.${SmartCardSharedCssClassName.LOADER_WRAPPER} > a:focus`]: [
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				boxShadowSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				hideNativeBrowserTextSelectionStyles,
			],
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`&.ak-editor-selected-node .${SmartCardSharedCssClassName.LOADER_WRAPPER} > a`]: [
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			hideNativeBrowserTextSelectionStyles,
		],

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`&.ak-editor-selected-node:not(.search-match-block):not(.danger) .${SmartCardSharedCssClassName.LOADER_WRAPPER} > a`]:
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			[
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				boxShadowSelectionStyles,
			],

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${SmartCardSharedCssClassName.LOADER_WRAPPER} > a`]: {
			// EDM-1717: box-shadow Safari fix start
			zIndex: 1,
			position: 'relative',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.danger': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${SmartCardSharedCssClassName.LOADER_WRAPPER} > a`]: {
				boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				// EDM-1717: box-shadow Safari fix start
				zIndex: 2,
				// EDM-1717: box-shadow Safari fix end
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER}`]: {
		display: 'block',
		margin: '0.75rem 0 0',
		maxWidth: `${8 * 95}px`,

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`&.ak-editor-selected-node .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div`]: [
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			boxShadowSelectionStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			hideNativeBrowserTextSelectionStyles,
			{
				borderRadius: token('radius.large', '8px'),
			},
		],

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.danger': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${SmartCardSharedCssClassName.LOADER_WRAPPER} > div`]: {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				boxShadow: `0 0 0 1px ${token('color.border.danger')} !important`,
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${SmartCardSharedCssClassName.DATASOURCE_CONTAINER}.${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER}`]:
		{
			maxWidth: '100%',
			display: 'flex',
			justifyContent: 'center',

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${DATASOURCE_INNER_CONTAINER_CLASSNAME}`]: {
				cursor: 'pointer',
				backgroundColor: token('color.background.neutral.subtle'),
				borderRadius: token('radius.large', '8px'),
				border: `1px solid ${token('color.border')}`,
				overflow: 'hidden',
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.ak-editor-selected-node': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				[`.${DATASOURCE_INNER_CONTAINER_CLASSNAME}`]: [
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					boxShadowSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					hideNativeBrowserTextSelectionStyles,
					{
						'input::selection': {
							backgroundColor: token('color.background.selected.hovered'),
						},

						'input::-moz-selection': {
							backgroundColor: token('color.background.selected.hovered'),
						},
					},
				],
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.danger': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
				[`.${DATASOURCE_INNER_CONTAINER_CLASSNAME}`]: {
					boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				},
			},
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${SmartCardSharedCssClassName.EMBED_CARD_CONTAINER}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${SmartCardSharedCssClassName.LOADER_WRAPPER} > div`]: {
			cursor: 'pointer',

			'&::after': {
				transition: 'box-shadow 0s',
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`&.ak-editor-selected-node .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after`]: [
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			hideNativeBrowserTextSelectionStyles,
		],

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`&.ak-editor-selected-node:not(.search-match-block) .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after`]:
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			[
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				boxShadowSelectionStyles,
			],

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.danger': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.media-card-frame::after': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				boxShadow: `0 0 0 1px ${token('color.border.danger')} !important`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				background: `${token('color.background.danger')} !important`,
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.richMedia-resize-handle-right::after, .richMedia-resize-handle-left::after': {
				background: token('color.border.danger'),
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${FLOATING_TOOLBAR_LINKPICKER_CLASSNAME}`]: {
		padding: 0,
	},
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const smartCardStylesWithSearchMatchAndPreviewPanelResponsiveness: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`@container editor-area (max-width: ${akEditorFullPageNarrowBreakout}px)`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-nested-selectors
		[`.${SmartCardSharedCssClassName.EMBED_CARD_CONTAINER}`]: {
			marginTop: token('space.150'),
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`.${SmartCardSharedCssClassName.EMBED_CARD_CONTAINER}.ak-editor-selected-node .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div`]:
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			[
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				boxShadowSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				hideNativeBrowserTextSelectionStyles,
				{
					borderRadius: token('radius.large', '8px'),
				},
			],
	},
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const smartLinksInLivePagesStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${SmartCardSharedCssClassName.LOADER_WRAPPER} > div`]: {
			cursor: 'pointer',

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			a: {
				cursor: 'auto',
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${SmartCardSharedCssClassName.EMBED_CARD_CONTAINER}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${SmartCardSharedCssClassName.LOADER_WRAPPER} > div`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			a: {
				cursor: 'auto',
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
export const linkingVisualRefreshV1Styles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER}:not(.${SmartCardSharedCssClassName.DATASOURCE_CONTAINER})`]:
		{
			// EDM-11991: Fix list plugin adding padding to ADS AvatarGroup
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'ul, ol': {
				paddingLeft: 'inherit',
			},
		},
});
