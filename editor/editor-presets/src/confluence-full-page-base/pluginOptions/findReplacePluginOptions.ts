import type { FindReplacePluginOptions } from '@atlaskit/editor-plugin-find-replace';

interface Props {
	options: never;
}

export function findReplacePluginOptions({}: Props): FindReplacePluginOptions {
	return {
		// originally depends on !!featureFlags.showAvatarGroupAsPlugin === false && !hasBeforePrimaryToolbar(props.primaryToolbarComponents),
		takeFullWidth: true,
		twoLineEditorToolbar: false,
	};
}
