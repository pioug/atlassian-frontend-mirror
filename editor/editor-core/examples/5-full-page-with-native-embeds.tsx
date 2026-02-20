import React from 'react';

import { IntlProvider } from 'react-intl-next';

import {
	getExamplesProviders,
	useConfluenceFullPagePreset,
} from '@af/editor-examples-helpers/example-presets';
import type { DocNode } from '@atlaskit/adf-schema';
import Button from '@atlaskit/button/standard-button';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
// eslint-disable-next-line import/no-extraneous-dependencies -- used by example only, not a regular dependency
import { nativeEmbedsPlugin } from '@atlaskit/editor-plugin-native-embeds';
import { TitleInput , getNativeEmbedsExtensionProvider } from '@atlaskit/editor-test-helpers/example-helpers';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import { createCollabEditProvider } from '@atlaskit/synchrony-test-helpers';

const NATIVE_EMBEDS_EXAMPLE_URLS = {
	localDefault: 'http://localhost:9000/examples/editor/editor-core/full-page-with-native-embeds',
	whiteboard: 'https://example.atlassian.net/wiki/spaces/DEMO/whiteboard/12345',
	dbExperience: 'https://example.atlassian.net/wiki/spaces/DEMO/pages/12345/db/67890',
};

const nativeEmbedsDefaultDoc: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'heading',
			attrs: { level: 2 },
			content: [{ type: 'text', text: 'Default Embed Preview' }],
		},
		{
			type: 'extension',
			attrs: {
				extensionKey: 'native-embed',
				extensionType: 'com.atlassian.native-embeds',
				parameters: {
					url: NATIVE_EMBEDS_EXAMPLE_URLS.localDefault,
				},
			},
		},
		{
			type: 'rule',
		},
		{
			type: 'heading',
			attrs: { level: 2 },
			content: [
				{
					type: 'text',
					text: 'Paste a supported URL to auto-convert:',
				},
			],
		},
		{
			type: 'table',
			attrs: {
				isNumberColumnEnabled: false,
				layout: 'default',
			},
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableCell',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Whiteboard' }],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: NATIVE_EMBEDS_EXAMPLE_URLS.whiteboard,
											marks: [
												{ type: 'link', attrs: { href: NATIVE_EMBEDS_EXAMPLE_URLS.whiteboard } },
											],
										},
									],
								},
							],
						},
					],
				},
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableCell',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Databases' }],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: NATIVE_EMBEDS_EXAMPLE_URLS.dbExperience,
											marks: [
												{ type: 'link', attrs: { href: NATIVE_EMBEDS_EXAMPLE_URLS.dbExperience } },
											],
										},
									],
								},
							],
						},
					],
				},
			],
		},
	],
};

const NativeEmbedsEditorExample = (): React.JSX.Element => {
	const smartCardClient = React.useMemo(() => new CardClient('staging'), []);
	const providers = React.useMemo(() => getExamplesProviders({ sanitizePrivateContent: true }), []);
	const collabEditProvider = React.useMemo(
		() =>
			createCollabEditProvider({
				userId: 'quokka',
				defaultDoc: JSON.stringify(nativeEmbedsDefaultDoc),
			}),
		[],
	);
	const appearance = 'full-page';
	const nativeEmbedsExtensionProvider = React.useMemo(
		() => getNativeEmbedsExtensionProvider(),
		[],
	);

	const { preset: fullPagePreset } = useConfluenceFullPagePreset({
		editorAppearance: appearance,
		overridedFullPagePresetProps: {
			providers,
		},
	});

	const { preset } = usePreset(
		() => fullPagePreset.add(nativeEmbedsPlugin),
		[fullPagePreset],
	);

	return (
		<IntlProvider locale="en">
			<SmartCardProvider client={smartCardClient}>
				<ComposableEditor
					preset={preset}
					appearance={appearance}
					defaultValue={nativeEmbedsDefaultDoc}
					collabEdit={{ provider: collabEditProvider }}
					disabled={false}
					contentComponents={<TitleInput value="Native Embeds Editor Testing" />}
					primaryToolbarIconBefore={
						<Button
							iconBefore={<AtlassianIcon />}
							appearance="subtle"
							shouldFitContainer
						></Button>
					}
					extensionProviders={[nativeEmbedsExtensionProvider]}
					// eslint-disable-next-line react/jsx-props-no-spreading -- needed only for providers
					{...providers}
				/>
			</SmartCardProvider>
		</IntlProvider>
	);
};

export default NativeEmbedsEditorExample;
