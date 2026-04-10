import type { CodeBidiWarningPluginOptions } from '@atlaskit/editor-plugin-code-bidi-warning';

import type { FullPageEditorAppearance } from '../types';

interface Props {
	options: {
		editorAppearance: FullPageEditorAppearance;
	};
}

export function codeBidiWarningPluginOptions({ options }: Props): CodeBidiWarningPluginOptions {
	return {
		appearance: options.editorAppearance,
	};
}
