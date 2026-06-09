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
export const InlineNodeViewSharedStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.inlineNodeView': {
			display: 'inline',
			userSelect: 'all',
			whiteSpace: 'nowrap',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'& > *:not(.zeroWidthSpaceContainer)': {
				whiteSpace: 'pre-wrap',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'& > .assistive': {
				userSelect: 'none',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.ua-safari': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.inlineNodeView': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'&::selection, *::selection': {
					background: 'transparent',
				},
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.ua-chrome .inlineNodeView > span': {
			userSelect: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.inlineNodeViewAddZeroWidthSpace': {
			'&::after': {
				content: "'\u200b'", // ZERO_WIDTH_SPACE
			},
		},
	},
});
