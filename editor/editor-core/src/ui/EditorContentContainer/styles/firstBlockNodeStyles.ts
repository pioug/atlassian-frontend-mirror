/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import { PanelSharedCssClassName } from '@atlaskit/editor-common/panel';
import { expandClassNames, SmartCardSharedCssClassName } from '@atlaskit/editor-common/styles';

import { CodeBlockSharedCssClassName } from './codeBlockStyles';
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const firstBlockNodeStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`> .${PanelSharedCssClassName.prefix}, > .${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER}, > .${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER}, > div[data-task-list-local-id], > div[data-layout-section], > .${expandClassNames.prefix}`]:
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&:first-child': {
					marginTop: 0,
				},
			},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
		'> hr:first-child, > .ProseMirror-widget:first-child + hr': {
			marginTop: 0,
		},
	},
});

/**
 * Gated behind the `platform_editor_first_node_fix` experiment.
 *
 * A leading ProseMirror widget (e.g. `ProseMirror-hide-cursor` when the editor is not editable)
 * renders as the first child, so the `:first-child` margin resets no longer match the first real
 * node. This zeroes its top margin. Mirrors `topLevelNodeMarginStyles` from the block-controls
 * plugin so the fix also applies where that plugin is not loaded (e.g. Jira chromeless editor).
 *
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
export const firstNodeWidgetFixStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
		'> .ProseMirror-widget:first-child + .ProseMirror-gapcursor + *:not([data-layout-section="true"], [data-prosemirror-node-name="bodiedSyncBlock"]), > .ProseMirror-widget:first-child + *:not([data-layout-section="true"], [data-prosemirror-node-name="bodiedSyncBlock"])':
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				marginTop: '0 !important',
			},
		// Reach through a `.fabric-editor-font-size` wrapper to zero the inner node's margin, since
		// the margin lives on the child, not the wrapper.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
		'> .ProseMirror-widget:first-child + .fabric-editor-font-size > :is(p, h1, h2, h3, h4, h5, h6):first-child, > .ProseMirror-widget:first-child + .ProseMirror-widget + .fabric-editor-font-size > :is(p, h1, h2, h3, h4, h5, h6):first-child, > .ProseMirror-widget:first-child + .ProseMirror-gapcursor + .fabric-editor-font-size > :is(p, h1, h2, h3, h4, h5, h6):first-child':
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				marginTop: '0 !important',
			},
	},
});
