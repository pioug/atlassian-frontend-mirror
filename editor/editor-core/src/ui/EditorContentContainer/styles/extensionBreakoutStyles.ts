/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

// copied from packages/editor/editor-shared-styles/src/consts/consts.ts
const blockNodesVerticalMargin = '0.75rem';

/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const extensionWithBreakoutStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.fabric-editor-breakout-mark': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has([data-prosemirror-node-name="extension"]), &:has([data-prosemirror-node-name="bodiedExtension"]), &:has([data-prosemirror-node-name="multiBodiedExtension"])':
			{
				margin: `${blockNodesVerticalMargin} 0`,
			},
	},
});
