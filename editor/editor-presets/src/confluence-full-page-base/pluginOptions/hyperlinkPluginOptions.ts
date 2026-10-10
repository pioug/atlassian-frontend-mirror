import type { OnClickCallback } from '@atlaskit/editor-common/card/cardOptions';
import type { LinkPickerOptions } from '@atlaskit/editor-common/types/hyperlink';
import type { HyperlinkPluginOptions } from '@atlaskit/editor-plugin-hyperlink/hyperlinkPluginType';

import type { FullPageEditorAppearance } from '../types';

interface Props {
	options: {
		editorAppearance: FullPageEditorAppearance;
		linkPicker: LinkPickerOptions | undefined;
		onClickCallback: OnClickCallback | undefined;
	};
}

export function hyperlinkPluginOptions({ options }: Props): HyperlinkPluginOptions {
	return {
		editorAppearance: options.editorAppearance,
		// SECTION: From confluence/next/packages/editor-features/src/hooks/useEditorFeatureFlags.ts
		lpLinkPicker: true,
		// END SECTION
		linkPicker: options.linkPicker,
		onClickCallback: options.onClickCallback,
		platform: 'web',
	};
}
