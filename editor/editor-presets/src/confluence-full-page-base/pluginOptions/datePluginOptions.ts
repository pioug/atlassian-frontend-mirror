import type { DatePluginOptions } from '@atlaskit/editor-plugin-date';

interface Props {
	options: never;
}

export function datePluginOptions({}: Props): DatePluginOptions {
	return {
		weekStartDay: undefined,
	};
}
