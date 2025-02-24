/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

// eslint-disable-next-line @atlaskit/editor/warn-no-restricted-imports
import { DevTools } from '@af/editor-examples-helpers/utils';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractPresetAPI } from '@atlaskit/editor-common/src/preset';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import { usePluginStateEffect } from '@atlaskit/editor-common/use-plugin-state-effect';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
// eslint-disable-next-line @atlaskit/editor/warn-no-restricted-imports
import type { EditorActions } from '@atlaskit/editor-core';
import { EditorContext } from '@atlaskit/editor-core';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { createDefaultPreset } from '@atlaskit/editor-core/preset-default';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { codeBlockAdvancedPlugin } from '@atlaskit/editor-plugin-code-block-advanced';
import { cardPlugin } from '@atlaskit/editor-plugins/card';
import { connectivityPlugin } from '@atlaskit/editor-plugins/connectivity';
import { gridPlugin } from '@atlaskit/editor-plugins/grid';
import type { ListPlugin } from '@atlaskit/editor-plugins/list';
import { listPlugin } from '@atlaskit/editor-plugins/list';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { cardProviderStaging } from '@atlaskit/editor-test-helpers/card-provider';
import { ConfluenceCardClient } from '@atlaskit/editor-test-helpers/confluence-card-client';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { Box, xcss } from '@atlaskit/primitives';

const editorStyles = xcss({
	margin: 'space.100',
});

const smartCardClient = new ConfluenceCardClient('stg');

const createPreset = () =>
	createDefaultPreset({ featureFlags: {}, paste: {} })
		.add(gridPlugin)
		.add([cardPlugin, { provider: Promise.resolve(cardProviderStaging) }])
		.add(listPlugin)
		.add(codeBlockAdvancedPlugin)
		.add(connectivityPlugin);

interface ListToolbarProps {
	editorApi: PublicPluginAPI<[ListPlugin]> | undefined;
}

function ListToolbar({ editorApi }: ListToolbarProps) {
	const bulletListDisabled = useSharedPluginStateSelector(editorApi, 'list.bulletListDisabled');
	const bulletListActive = useSharedPluginStateSelector(editorApi, 'list.bulletListActive');
	const orderedListDisabled = useSharedPluginStateSelector(editorApi, 'list.orderedListDisabled');
	const orderedListActive = useSharedPluginStateSelector(editorApi, 'list.orderedListActive');

	const toggleOrderedList = editorApi?.list?.commands.toggleOrderedList(INPUT_METHOD.TOOLBAR);

	const toggleBulletList = editorApi?.list?.commands.toggleBulletList(INPUT_METHOD.TOOLBAR);

	return (
		<ButtonGroup>
			<Button
				isDisabled={bulletListDisabled}
				onClick={() => {
					editorApi?.core?.actions.execute(toggleBulletList);
				}}
				isSelected={bulletListActive}
			>
				Bullet List
			</Button>
			<Button
				isDisabled={orderedListDisabled}
				onClick={() => {
					editorApi?.core?.actions.execute(toggleOrderedList);
				}}
				isSelected={orderedListActive}
			>
				Ordered List
			</Button>
		</ButtonGroup>
	);
}

function FormattingToolbar({ editorApi }: ToolbarProps) {
	const { textFormattingState } = useSharedPluginState(editorApi, ['textFormatting']);
	const toggleStrong = editorApi?.textFormatting?.commands.toggleStrong(INPUT_METHOD.TOOLBAR);

	return (
		<Button
			isDisabled={textFormattingState?.strongDisabled}
			onClick={() => {
				editorApi?.core?.actions.execute(toggleStrong);
			}}
			isSelected={textFormattingState?.strongActive}
		>
			Bold
		</Button>
	);
}

interface ToolbarProps {
	editorApi: ExtractPresetAPI<ReturnType<typeof createPreset>> | undefined;
}

function Toolbar({ editorApi }: ToolbarProps) {
	const activeLinkMark = useSharedPluginStateSelector(editorApi, 'hyperlink.activeLinkMark');

	// Using effect in toolbar
	const pluginStateEffect = React.useCallback((states: any) => {
		const { hyperlinkState, textFormattingState } = states;
		// Use as necessary ie. analytics, network requests
		console.log('logging', { hyperlinkState, textFormattingState });
	}, []);
	usePluginStateEffect(editorApi, ['textFormatting', 'hyperlink'], pluginStateEffect);

	const showLinkToolbarAction = editorApi?.hyperlink?.commands.showLinkToolbar(
		INPUT_METHOD.TOOLBAR,
	);

	return (
		<ButtonGroup>
			<FormattingToolbar editorApi={editorApi} />
			<ListToolbar editorApi={editorApi} />

			<Button
				appearance="subtle"
				isDisabled={activeLinkMark !== undefined}
				onClick={() => {
					editorApi?.core?.actions.execute(showLinkToolbarAction);
				}}
			>
				{activeLinkMark ? 'Active Link' : 'Insert Link'}
			</Button>

			<Button
				appearance="primary"
				onClick={() => {
					editorApi?.core?.actions.execute(({ tr }) => {
						return tr.insertText('*Knowing where ones towel is.*');
					});
				}}
			>
				Insert Text
			</Button>

			<Button
				appearance="primary"
				onClick={() => {
					editorApi?.core?.actions.blur();
				}}
			>
				Blur
			</Button>

			<Button
				appearance="primary"
				onClick={() => {
					editorApi?.core?.actions.focus();
				}}
			>
				Focus
			</Button>
		</ButtonGroup>
	);
}

export function ComposableEditorWithToolbar() {
	const { preset, editorApi } = usePreset(createPreset);
	const [editorView, setEditorView] = React.useState<EditorView>();
	const onReady = React.useCallback((editorActions: EditorActions<any>) => {
		setEditorView(editorActions._privateGetEditorView());
	}, []);

	return (
		<React.Fragment>
			<DevTools editorView={editorView} />
			<Box xcss={editorStyles}>
				<Toolbar editorApi={editorApi} />
				<ComposableEditor onEditorReady={onReady} appearance="chromeless" preset={preset} />
			</Box>
		</React.Fragment>
	);
}

export default function ComposableEditorExample() {
	return (
		<EditorContext>
			<SmartCardProvider client={smartCardClient}>
				<ComposableEditorWithToolbar />
			</SmartCardProvider>
		</EditorContext>
	);
}
