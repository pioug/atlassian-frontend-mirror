/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import {
	boxShadowSelectionStyles,
	dangerBorderStyles,
	hideNativeBrowserTextSelectionStyles,
} from './selectionStyles';

/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const DateSharedCssClassName = {
	DATE_WRAPPER: `date-lozenger-container`,
	DATE_CONTAINER: 'dateView-content-wrap',
};
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
export const dateVanillaStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`[data-prosemirror-node-name='date'] .${DateSharedCssClassName.DATE_WRAPPER} span`]: {
		backgroundColor: token('color.background.neutral'),
		color: token('color.text'),
		borderRadius: token('radius.small'),
		padding: `${token('space.025')} ${token('space.050')}`,
		margin: '0 1px',
		position: 'relative',
		transition: 'background 0.3s',
		whiteSpace: 'nowrap',
		cursor: 'unset',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`[data-prosemirror-node-name='date'] .${DateSharedCssClassName.DATE_WRAPPER} span:hover`]: {
		backgroundColor: token('color.background.neutral.hovered'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`[data-prosemirror-node-name='date'] .${DateSharedCssClassName.DATE_WRAPPER} span.date-node-color-red`]:
		{
			backgroundColor: token('color.background.accent.red.subtlest'),
			color: token('color.text.accent.red'),
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`[data-prosemirror-node-name='date'] .${DateSharedCssClassName.DATE_WRAPPER} span.date-node-color-red:hover`]:
		{
			backgroundColor: token('color.background.accent.red.subtler'),
		},
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Ignored via go/DSP-18766
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
export const dateStyles: SerializedStyles = css({
	// Show diff: date attr change highlight. Keep this with date node styles so the highlight
	// follows the date node view instead of living in shared smart-card diff styles.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.show-diff-atomic-inline-changed-date': {
		'--show-diff-atomic-inline-changed-border-color': token('color.border.accent.purple'),
		outline: '2px solid var(--show-diff-atomic-inline-changed-border-color)',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		outlineOffset: '1px',
		borderRadius: token('radius.medium'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.show-diff-atomic-inline-changed-date.show-diff-atomic-inline-changed-traditional': {
		'--show-diff-atomic-inline-changed-border-color': token('color.border.accent.green'),
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`.${DateSharedCssClassName.DATE_WRAPPER} span`]: {
		whiteSpace: 'unset',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${DateSharedCssClassName.DATE_CONTAINER}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${DateSharedCssClassName.DATE_WRAPPER}`]: {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: 'initial',
			cursor: 'pointer',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.ak-editor-selected-node': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			[`.${DateSharedCssClassName.DATE_WRAPPER} > span`]: [
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				boxShadowSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				hideNativeBrowserTextSelectionStyles,
			],
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.danger': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${DateSharedCssClassName.DATE_CONTAINER}.ak-editor-selected-node .${DateSharedCssClassName.DATE_WRAPPER} > span`]:
			{
				boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
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
export const dangerDateStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${DateSharedCssClassName.DATE_CONTAINER}.ak-editor-selected-node.danger .${DateSharedCssClassName.DATE_WRAPPER} > span`]:
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[dangerBorderStyles],
});
