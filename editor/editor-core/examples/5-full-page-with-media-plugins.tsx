import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { createDefaultPreset } from '@atlaskit/editor-core/preset-default';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { mediaPlugin } from '@atlaskit/editor-plugin-media';
import { mediaEditingPlugin } from '@atlaskit/editor-plugin-media-editing';
import { mediaInsertPlugin } from '@atlaskit/editor-plugin-media-insert';
import { gridPlugin } from '@atlaskit/editor-plugins/grid';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';

const mediaProvider = storyMediaProviderFactory();

const ImageEditor = (): React.JSX.Element => {
	const createPreset = () =>
		createDefaultPreset({ featureFlags: {}, paste: {} })
			.add(gridPlugin)

			.add([
				mediaPlugin,
				{
					provider: mediaProvider,
					allowMediaSingle: true,
					allowResizing: true,
					allowAdvancedToolBarOptions: true,
					allowImagePreview: true,
					allowImageEditing: true,
				},
			])
			.add(mediaEditingPlugin)
			.add(mediaInsertPlugin);
	const { preset } = usePreset(createPreset);
	return (
		<IntlProvider locale="en">
			<ComposableEditor preset={preset} appearance="full-page" />
		</IntlProvider>
	);
};

export default ImageEditor;
