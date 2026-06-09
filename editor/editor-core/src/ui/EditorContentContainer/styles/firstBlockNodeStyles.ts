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
