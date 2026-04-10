import type { GridPluginOptions } from '@atlaskit/editor-plugin-grid';

interface Props {
	options: never;
}

export function gridPluginOptions({}: Props): GridPluginOptions {
	return {
		shouldCalcBreakoutGridLines: true,
	};
}
