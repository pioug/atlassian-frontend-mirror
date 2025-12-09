import React, { useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import { DevTools } from '@af/editor-examples-helpers/utils';
import Button from '@atlaskit/button/new';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import { type EditorActions } from '@atlaskit/editor-core';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import { primaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import { annotationPlugin } from '@atlaskit/editor-plugins/annotation';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';
import { cardPlugin } from '@atlaskit/editor-plugins/card';
import { connectivityPlugin, type ConnectivityPlugin } from '@atlaskit/editor-plugins/connectivity';
import { contentInsertionPlugin } from '@atlaskit/editor-plugins/content-insertion';
import { copyButtonPlugin } from '@atlaskit/editor-plugins/copy-button';
import { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';
import { editorDisabledPlugin } from '@atlaskit/editor-plugins/editor-disabled';
import { emojiPlugin } from '@atlaskit/editor-plugins/emoji';
import { extensionPlugin } from '@atlaskit/editor-plugins/extension';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';
import { focusPlugin } from '@atlaskit/editor-plugins/focus';
import { gridPlugin } from '@atlaskit/editor-plugins/grid';
import { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';
import { insertBlockPlugin } from '@atlaskit/editor-plugins/insert-block';
import { layoutPlugin } from '@atlaskit/editor-plugins/layout';
import { loomPlugin } from '@atlaskit/editor-plugins/loom';
import { mediaPlugin } from '@atlaskit/editor-plugins/media';
import { mentionsPlugin } from '@atlaskit/editor-plugins/mentions';
import { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';
import { selectionPlugin } from '@atlaskit/editor-plugins/selection';
import { selectionToolbarPlugin } from '@atlaskit/editor-plugins/selection-toolbar';
import { tablesPlugin } from '@atlaskit/editor-plugins/table';
import { tasksAndDecisionsPlugin } from '@atlaskit/editor-plugins/tasks-and-decisions';
import { widthPlugin } from '@atlaskit/editor-plugins/width';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { useEditorAnnotationProviders } from '@atlaskit/editor-test-helpers/annotation-example';
import { cardProviderStaging } from '@atlaskit/editor-test-helpers/card-provider';
import { ConfluenceCardClient } from '@atlaskit/editor-test-helpers/confluence-card-client';
import { getExampleExtensionProviders } from '@atlaskit/editor-test-helpers/example-helpers';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { SmartCardProvider } from '@atlaskit/link-provider';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';

import { getLoomProvider } from './utils/provider/loom-provider';

const styles = xcss({ height: '100%' });
const smartCardClient = new ConfluenceCardClient('stg');

function OfflineIndicator({
	editorApi,
}: {
	editorApi: PublicPluginAPI<ConnectivityPlugin> | undefined;
}) {
	const { connectivityState } = useSharedPluginState(editorApi, ['connectivity']);
	return (
		<Box as="span" padding="space.100">
			Offline status: {connectivityState?.mode}
		</Box>
	);
}

function SimulateMode() {
	const [offline, setOffline] = useState(false);
	return (
		<Button
			onClick={() => {
				if (!offline) {
					setOffline(true);
					window.dispatchEvent(new Event('offline'));
				} else {
					setOffline(false);
					window.dispatchEvent(new Event('online'));
				}
			}}
		>
			Simulate {offline ? 'online' : 'offline'}
		</Button>
	);
}

function Editor() {
	const editorAnnotationProviders = useEditorAnnotationProviders();
	const { preset, editorApi } = usePreset((builder) =>
		builder
			.add(basePlugin)
			.add(blockTypePlugin)
			.add(typeAheadPlugin)
			.add([
				quickInsertPlugin,
				{
					enableElementBrowser: true,
				},
			])
			.add(hyperlinkPlugin)
			.add(widthPlugin)
			.add([
				insertBlockPlugin,
				{
					showElementBrowserLink: true,
					appearance: 'full-page',
				},
			])
			.add(editorDisabledPlugin)
			.add(decorationsPlugin)
			.add(copyButtonPlugin)
			.add(floatingToolbarPlugin)
			.add(selectionPlugin)
			.add(guidelinePlugin)
			.add(gridPlugin)
			.add(focusPlugin)
			.add([
				mediaPlugin,
				{
					provider: storyMediaProviderFactory(),
					allowMediaSingle: true,
					allowMediaSingleEditable: true,
					allowLinking: true,
					allowCommentsOnMedia: true,
					allowAdvancedToolBarOptions: true,
				},
			])
			.add([analyticsPlugin, {}])
			.add(contentInsertionPlugin)
			.add(mentionsPlugin)
			.add([tablesPlugin, { tableOptions: { advanced: true } }])
			.add([emojiPlugin, { emojiProvider: getEmojiResource() }])
			.add([cardPlugin, { provider: Promise.resolve(cardProviderStaging) }])
			.add(layoutPlugin)
			.add([selectionToolbarPlugin, {}])
			.add(tasksAndDecisionsPlugin)
			.add([annotationPlugin, editorAnnotationProviders])
			.add([
				loomPlugin,
				{
					...getLoomProvider({
						// NOTE: DEV MOVE - A public key referencing a sandbox loom account, this will eventially be substituted
						// for a session token that will intialise the SDK.
						publicAppId: '4dc78821-b6d2-44ee-ab43-54d0494290c8',
					}),
					shouldShowToolbarButton: true,
				},
			])
			.add(primaryToolbarPlugin)
			.add(connectivityPlugin)
			.add(extensionPlugin),
	);

	const [editorView, setEditorView] = React.useState<EditorView>();
	const onReady = React.useCallback((editorActions: EditorActions<any>) => {
		setEditorView(editorActions._privateGetEditorView());
	}, []);

	return (
		<Box xcss={styles}>
			<SimulateMode />
			<DevTools editorView={editorView} />
			<OfflineIndicator editorApi={editorApi} />
			<ComposableEditor
				appearance="full-page"
				preset={preset}
				onEditorReady={onReady}
				mentionProvider={Promise.resolve(mentionResourceProvider)}
				extensionProviders={(editorActions?: EditorActions) => [
					getExampleExtensionProviders(editorApi, editorActions),
				]}
			/>
		</Box>
	);
}

export default (): React.JSX.Element => {
	return (
		<IntlProvider locale="en">
			<SmartCardProvider client={smartCardClient}>
				<Editor />
			</SmartCardProvider>
		</IntlProvider>
	);
};
