import type { EditorContentMode } from '@atlaskit/editor-common/types/editor-appearance';
import type { ContentFormatPluginOptions } from '@atlaskit/editor-plugin-content-format/contentFormatPluginType';

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
