import React from 'react';

import { useIntl } from 'react-intl-next';

import { isSafeUrl } from '@atlaskit/adf-schema';
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
import { withPlatformFeatureFlags } from '@atlassian/feature-flags-storybook-utils';

const MAX_URL_LENGTH = 2048;

// Define the custom message statically for React Intl extraction
const customHelperMessageDefinition = {
	id: 'example.custom.helper.message',
	defaultMessage:
		'Tip: Enter a smart value like {{variable}} or paste a valid URL to make content dynamic.',
	description: 'Custom helper message for smart value validation in media insert',
};

export const isValidSmartValueOrUrl = (value: string): boolean => {
	if (/^\{\{.+\}\}$/u.test(value)) {
		return true;
	}
	try {
		if (/\s/u.test(value) || value.length > MAX_URL_LENGTH) {
			return false;
		}
		new URL(value);
	} catch (e) {
		return false;
	}
	return isSafeUrl(value);
};

function Editor() {
	const intl = useIntl();

	// Format the custom helper message using intl.formatMessage
	const customizedHelperMessage = intl.formatMessage(customHelperMessageDefinition);

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
			.add([
				mediaInsertPlugin,
				{
					isOnlyExternalLinks: true,
					customizedUrlValidation: isValidSmartValueOrUrl,
					customizedHelperMessage: customizedHelperMessage, // Now passing a formatted string
				},
			]),
	);

	return <ComposableEditor preset={preset} />;
}

const Example = () => {
	return (
		<div>
			<p>{'A basic example of only allowing external image URLs for media insert.'}</p>
			{code`
function Editor() {
	const intl = useIntl();

	// Format the custom helper message using intl.formatMessage
	const customizedHelperMessage = intl.formatMessage(customHelperMessageDefinition);

	const { preset } = usePreset(() =>
		createDefaultPreset({ featureFlags: {}, paste: {} })
			.add(listPlugin)
			.add(gridPlugin)
			.add([mediaPlugin, { provider: storyMediaProviderFactory(), allowMediaSingle: true, isExternalMediaUploadDisabled: true }])
			.add(insertBlockPlugin)
			.add(contentInsertionPlugin)
			.add([
				mediaInsertPlugin,
				{
					isOnlyExternalLinks: true,
					customizedUrlValidation: isValidSmartValueOrUrl,
					customizedHelperMessage: customizedHelperMessage, // Now passing a formatted string
				},
			]),	);

	return <ComposableEditor preset={preset} />;
}`}
			<br />
			<Editor />
		</div>
	);
};

Example.decorators = [
	withPlatformFeatureFlags({
		platform_editor_add_media_from_url_rollout: true,
		platform_editor_media_from_url_remove_form: true,
	}),
];

export default Example;
