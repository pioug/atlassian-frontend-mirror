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
// eslint-disable-next-line @atlaskit/editor/warn-no-restricted-imports
import type { EditorActions } from '@atlaskit/editor-core';
import { EditorContext } from '@atlaskit/editor-core';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { createDefaultPreset } from '@atlaskit/editor-core/preset-default';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { cardPlugin } from '@atlaskit/editor-plugins/card';
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
		.add(listPlugin);

interface ListToolbarProps {
	editorApi: PublicPluginAPI<[ListPlugin]> | undefined;
}

function ListToolbar({ editorApi }: ListToolbarProps) {
	const { listState } = useSharedPluginState(editorApi, ['list']);
	const toggleOrderedList = editorApi?.list?.commands.toggleOrderedList(INPUT_METHOD.TOOLBAR);

	const toggleBulletList = editorApi?.list?.commands.toggleBulletList(INPUT_METHOD.TOOLBAR);

	return (
		<ButtonGroup>
			<Button
				isDisabled={listState?.bulletListDisabled}
				onClick={() => {
					editorApi?.core?.actions.execute(toggleBulletList);
				}}
				isSelected={listState?.bulletListActive}
			>
				Bullet List
			</Button>
			<Button
				isDisabled={listState?.orderedListDisabled}
				onClick={() => {
					editorApi?.core?.actions.execute(toggleOrderedList);
				}}
				isSelected={listState?.orderedListActive}
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
	const { hyperlinkState } = useSharedPluginState(editorApi, ['hyperlink']);

	const showLinkToolbarAction = editorApi?.hyperlink?.commands.showLinkToolbar(
		INPUT_METHOD.TOOLBAR,
	);

	return (
		<ButtonGroup>
			<FormattingToolbar editorApi={editorApi} />
			<ListToolbar editorApi={editorApi} />

			<Button
				appearance="subtle"
				isDisabled={hyperlinkState?.activeLinkMark !== undefined}
				onClick={() => {
					editorApi?.core?.actions.execute(showLinkToolbarAction);
				}}
			>
				{hyperlinkState?.activeLinkMark ? 'Active Link' : 'Insert Link'}
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
