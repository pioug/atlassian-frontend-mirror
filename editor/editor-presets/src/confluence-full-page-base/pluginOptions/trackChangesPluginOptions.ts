import type { TrackChangesPluginOptions } from '@atlaskit/editor-plugin-track-changes/track-changes-plugin-type';

type Props = {
	options: TrackChangesPluginOptions | undefined;
};

// eslint-disable-next-line jsdoc/require-jsdoc
export function trackChangesPluginOptions({
	options,
}: Props): TrackChangesPluginOptions | undefined {
	return {
		ButtonWrapper: options?.ButtonWrapper,
		showOnToolbar: true,
	};
}
