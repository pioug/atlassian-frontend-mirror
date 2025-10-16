import React from 'react';

import { code } from '@atlaskit/docs';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { createDefaultPreset } from '@atlaskit/editor-core/preset-default';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { gridPlugin } from '@atlaskit/editor-plugin-grid';
import { insertBlockPlugin } from '@atlaskit/editor-plugin-insert-block';
import { mediaPlugin } from '@atlaskit/editor-plugin-media';
import { mediaInsertPlugin } from '@atlaskit/editor-plugin-media-insert';
import { listPlugin } from '@atlaskit/editor-plugins/list';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';

function Editor() {
	const { preset } = usePreset(() =>
		createDefaultPreset({ featureFlags: {}, paste: {} })
			.add(listPlugin)
			.add(gridPlugin)
			.add([
				mediaPlugin,
				{
					provider: storyMediaProviderFactory(),
					allowMediaSingle: true,
					isExternalMediaUploadDisabled: true,
				},
			])
			.add(insertBlockPlugin)
			.add(contentInsertionPlugin)
			.add([mediaInsertPlugin, { isOnlyExternalLinks: true }]),
	);

	return <ComposableEditor preset={preset} />;
}

const Example = () => {
	return (
		<div>
			<p>{'A basic example of only allowing external image URLs for media insert.'}</p>
			{code`
function Editor() {
	const { preset } = usePreset(() =>
		createDefaultPreset({ featureFlags: {}, paste: {} })
			.add(listPlugin)
			.add(gridPlugin)
			.add([mediaPlugin, { provider: storyMediaProviderFactory(), allowMediaSingle: true, isExternalMediaUploadDisabled: true }])
			.add(insertBlockPlugin)
			.add(contentInsertionPlugin)
			.add([mediaInsertPlugin, { isOnlyExternalLinks: true }])
	);

	return <ComposableEditor preset={preset} />;
}`}
			<br />
			<Editor />
		</div>
	);
};

export default Example;
