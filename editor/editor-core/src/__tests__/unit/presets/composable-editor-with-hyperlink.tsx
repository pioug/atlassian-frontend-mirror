import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import Button from '@atlaskit/button/new';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractPresetAPI } from '@atlaskit/editor-common/preset';

import { ComposableEditor } from '../../../composable-editor';
import { EditorContext } from '../../../index';
import { createDefaultPreset } from '../../../labs-next';
import { usePreset } from '../../../use-preset';

describe('hyperlink lpLinkPicker flag behaviour in composable editor with default preset', () => {
	it('check that new link picker is used when lpLinkPicker is true', async () => {
		await act(async () => {
			render(
				<EditorContext>
					<ComposableEditorWithToolbar lpLinkPicker={true} />
				</EditorContext>,
			);
		});

		const toolbarButton = screen.getByText('Click me!');
		fireEvent.click(toolbarButton);
		// check that the link picker is rendered
		await screen.findByTestId('link-picker');
		expect(screen.queryByTestId('hyperlink-add-toolbar')).not.toBeInTheDocument();
	});

	it('check that new link picker is used when lpLinkPicker is undefined', async () => {
		await act(async () => {
			render(
				<EditorContext>
					<ComposableEditorWithToolbar />
				</EditorContext>,
			);
		});

		const toolbarButton = screen.getByText('Click me!');
		fireEvent.click(toolbarButton);
		// check that the link picker is rendered
		await screen.findByTestId('link-picker');
		expect(screen.queryByTestId('hyperlink-add-toolbar')).not.toBeInTheDocument();
	});

	it('check link picker not shown when lpLinkPicker is false', async () => {
		await act(async () => {
			render(
				<EditorContext>
					<ComposableEditorWithToolbar lpLinkPicker={false} />
				</EditorContext>,
			);
		});

		const toolbarButton = screen.getByText('Click me!');
		fireEvent.click(toolbarButton);
		// check that the old link picker is rendered
		await screen.findByTestId('hyperlink-add-toolbar');
		expect(screen.queryByTestId('link-picker')).not.toBeInTheDocument();
	});
});

const createPreset = (lpLinkPicker: boolean | undefined) =>
	createDefaultPreset({
		featureFlags: {},
		paste: {},
		hyperlinkOptions: { lpLinkPicker },
	});

interface ToolbarProps {
	editorApi: ExtractPresetAPI<ReturnType<typeof createPreset>> | undefined;
}

function Toolbar({ editorApi }: ToolbarProps) {
	const { hyperlinkState } = useSharedPluginState(editorApi, ['hyperlink']);
	const showLinkToolbarAction = editorApi?.hyperlink?.commands?.showLinkToolbar(
		INPUT_METHOD.TOOLBAR,
	);

	return (
		<Button
			appearance="subtle"
			onClick={() => {
				editorApi?.core?.actions.execute(showLinkToolbarAction);
			}}
		>
			{hyperlinkState?.activeLinkMark ? 'Active Link' : 'Click me!'}
		</Button>
	);
}

function ComposableEditorWithToolbar({ lpLinkPicker }: { lpLinkPicker?: boolean }) {
	const { preset, editorApi } = usePreset(() => createPreset(lpLinkPicker), []);

	return (
		<div>
			<Toolbar editorApi={editorApi} />
			<ComposableEditor appearance="chromeless" preset={preset} />
		</div>
	);
}
