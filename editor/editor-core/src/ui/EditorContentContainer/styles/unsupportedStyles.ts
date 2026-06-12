/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import {
	backgroundSelectionStyles,
	borderSelectionStyles,
	hideNativeBrowserTextSelectionStyles,
} from './selectionStyles';

/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const UnsupportedSharedCssClassName = {
	BLOCK_CONTAINER: 'unsupportedBlockView-content-wrap',
	INLINE_CONTAINER: 'unsupportedInlineView-content-wrap',
};

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Ignored via go/DSP-18766
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
export const unsupportedStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${UnsupportedSharedCssClassName.BLOCK_CONTAINER} > div, .${UnsupportedSharedCssClassName.INLINE_CONTAINER} > span:nth-of-type(2)`]:
		{
			cursor: 'pointer',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-selected-node': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`&.${UnsupportedSharedCssClassName.BLOCK_CONTAINER} > div, &.${UnsupportedSharedCssClassName.INLINE_CONTAINER} > span:nth-of-type(2)`]:
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			[
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				backgroundSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				borderSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				hideNativeBrowserTextSelectionStyles,
			],
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.danger': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-selected-node': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`&.${UnsupportedSharedCssClassName.BLOCK_CONTAINER} > div, &.${UnsupportedSharedCssClassName.INLINE_CONTAINER} > span:nth-of-type(2)`]:
				{
					border: `1px solid ${token('color.border.danger')}`,
					backgroundColor: token('color.blanket.danger'),
				},
		},
	},
});
