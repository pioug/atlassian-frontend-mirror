import React from 'react';

import { IntlProvider } from 'react-intl-next';

import {
	getExamplesProviders,
	useConfluenceFullPagePreset,
} from '@af/editor-examples-helpers/example-presets';
import { DevTools } from '@af/editor-examples-helpers/utils';
import type { DocNode } from '@atlaskit/adf-schema';
import Button from '@atlaskit/button/standard-button';
import { DefaultExtensionProvider } from '@atlaskit/editor-common/extensions';
import type { EditorActions } from '@atlaskit/editor-core';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import { NATIVE_EMBED_PARAMETER_DEFAULTS, setParameters } from '@atlaskit/native-embeds-common';
import { createCollabEditProvider } from '@atlaskit/synchrony-test-helpers';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';
import { createNativeEmbedsFallbackManifest } from '@atlassian/native-embeds-fallback-editor-extension';

setupEditorExperiments('test', {
	platform_editor_controls: 'variant1',
});

const NATIVE_EMBEDS_EXAMPLE_URLS = {
	whiteboard:
		'https://pug.jira-dev.com/wiki/spaces/~5d65cd4405102c0d9347842e/whiteboard/455194935306',
};

const nativeEmbedsFallbackDoc: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'heading',
			attrs: { level: 2 },
			content: [{ type: 'text', text: 'Native Embed Fallback Extension' }],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Click "Refresh" on the first extension below. It should replace itself with a card.',
				},
			],
		},
		{
			type: 'extension',
			attrs: {
				extensionKey: 'native-embed:whiteboard',
				extensionType: 'com.atlassian.confluence.macro.core',
				parameters: setParameters(
					{},
					{
						...NATIVE_EMBED_PARAMETER_DEFAULTS,
						url: NATIVE_EMBEDS_EXAMPLE_URLS.whiteboard,
					},
				),
			},
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'The next extension has no URL and should be deleted automatically.',
				},
			],
		},
		{
			type: 'extension',
			attrs: {
				extensionKey: 'native-embed:whiteboard',
				extensionType: 'com.atlassian.confluence.macro.core',
				localId: 'native-embed-missing-url',
				parameters: setParameters(
					{},
					{
						...NATIVE_EMBED_PARAMETER_DEFAULTS,
						url: undefined,
					},
				),
			},
		},
	],
};

const NativeEmbedsFallbackEditorExample = (): React.JSX.Element => {
	const [editorView, setEditorView] = React.useState<EditorView | undefined>();
	const smartCardClient = React.useMemo(() => new CardClient('staging'), []);
	const providers = React.useMemo(() => getExamplesProviders({ sanitizePrivateContent: true }), []);
	const collabEditProvider = React.useMemo(
		() =>
			createCollabEditProvider({
				userId: 'quokka',
				defaultDoc: JSON.stringify(nativeEmbedsFallbackDoc),
			}),
		[],
	);
	const appearance = 'full-page';
	const { preset: fullPagePreset, editorApi } = useConfluenceFullPagePreset({
		editorAppearance: appearance,
		overridedFullPagePresetProps: {
			providers,
		},
	});

	const nativeEmbedsFallbackExtensionProvider = React.useMemo(
		() =>
			new DefaultExtensionProvider([createNativeEmbedsFallbackManifest(editorApi ?? undefined)]),
		[editorApi],
	);

	const onEditorReady = React.useCallback((editorActions: EditorActions) => {
		const view = editorActions._privateGetEditorView();
		setEditorView(view);
	}, []);

	return (
		<IntlProvider locale="en">
			<SmartCardProvider client={smartCardClient}>
				<DevTools editorView={editorView} />
				<ComposableEditor
					preset={fullPagePreset}
					appearance={appearance}
					defaultValue={nativeEmbedsFallbackDoc}
					collabEdit={{ provider: collabEditProvider }}
					disabled={false}
					primaryToolbarIconBefore={
						<Button iconBefore={<AtlassianIcon />} appearance="subtle" shouldFitContainer></Button>
					}
					extensionProviders={[nativeEmbedsFallbackExtensionProvider]}
					onEditorReady={onEditorReady}
					// eslint-disable-next-line react/jsx-props-no-spreading -- needed only for providers
					{...providers}
				/>
			</SmartCardProvider>
		</IntlProvider>
	);
};

export default NativeEmbedsFallbackEditorExample;
