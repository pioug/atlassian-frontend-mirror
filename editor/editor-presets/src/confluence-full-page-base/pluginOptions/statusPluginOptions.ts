import type { StatusPluginOptions } from '@atlaskit/editor-plugin-status/types';

interface Props {
	options: never;
}

export function statusPluginOptions({}: Props): StatusPluginOptions {
	return {
		menuDisabled: false,
		allowZeroWidthSpaceAfter: true,
	};
}
