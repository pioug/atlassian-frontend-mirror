import type { EditorContentMode } from '@atlaskit/editor-common/types';
import type { ContentFormatPluginOptions } from '@atlaskit/editor-plugin-content-format';

interface Props {
	options:
		| {
				initialContentMode?: EditorContentMode;
		  }
		| undefined;
}

export function contentFormatPluginOptions({ options }: Props): ContentFormatPluginOptions {
	return {
		initialContentMode: options?.initialContentMode ?? 'standard',
	};
}
