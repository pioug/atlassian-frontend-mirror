import type { TypeAheadPluginOptions } from '@atlaskit/editor-plugin-type-ahead';

interface Props {
	options: never;
}

export function typeAheadPluginOptions({}: Props): TypeAheadPluginOptions {
	return {
		isMobile: false,
	};
}
