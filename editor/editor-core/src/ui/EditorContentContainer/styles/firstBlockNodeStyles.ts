import { css } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled

import { PanelSharedCssClassName } from '@atlaskit/editor-common/panel';
import { expandClassNames, SmartCardSharedCssClassName } from '@atlaskit/editor-common/styles';

import { CodeBlockSharedCssClassName } from './codeBlockStyles';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const firstBlockNodeStylesOld = css({
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
		'> hr:first-of-type': {
			marginTop: 0,
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const firstBlockNodeStyles = css({
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
