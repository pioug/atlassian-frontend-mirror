import React from 'react';

import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { createDefaultPreset } from '@atlaskit/editor-core/preset-default';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { mediaPlugin } from '@atlaskit/editor-plugin-media';
import { mediaInsertPlugin } from '@atlaskit/editor-plugin-media-insert';
import { gridPlugin } from '@atlaskit/editor-plugins/grid';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';

const mediaProvider = storyMediaProviderFactory();

const ImageEditor = () => {
	const createPreset = () =>
		createDefaultPreset({ featureFlags: {}, paste: {} })
			.add(gridPlugin)
			.add([
				mediaPlugin,
				{
					provider: mediaProvider,
					allowMediaSingle: true,
					allowResizing: true,
				},
			])
			.add(mediaInsertPlugin);
	const { preset } = usePreset(createPreset);
	return <ComposableEditor preset={preset} />;
};

export default ImageEditor;
