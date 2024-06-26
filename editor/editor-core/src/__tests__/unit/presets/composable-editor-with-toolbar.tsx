import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import Button from '@atlaskit/button';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
	EditorCommand,
	ExtractInjectionAPI,
	NextEditorPlugin,
} from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { ComposableEditor } from '../../../composable-editor';
import { EditorContext } from '../../../index';
import { createDefaultPreset } from '../../../labs-next';
import { usePreset } from '../../../use-preset';

describe('composable editor with toolbar', () => {
	it('should be able to execute commands from outside the composable editor', async () => {
		await act(async () => {
			render(
				<EditorContext>
					<TestEditor />,
				</EditorContext>,
			);
		});

		const toolbarButton = screen.getByText('Click me!');
		fireEvent.click(toolbarButton);

		const editorElement = screen.getByRole('textbox');

		expect(editorElement.textContent).toBe('bark');
	});

	it('should not be an unknown boy as the state should always update', async () => {
		await act(async () => {
			render(
				<EditorContext>
					<TestEditor />
				</EditorContext>,
			);
		});

		const status = screen.getByTestId('dog-status');
		expect(status.textContent).toBe('Good boy');
	});

	it('should be able to execute commands and it uses the correct editor', async () => {
		await act(async () => {
			render(
				<div>
					<EditorContext>
						<TestEditor />
					</EditorContext>
					<EditorContext>
						<TestEditor />
					</EditorContext>
				</div>,
			);
		});

		const toolbarButtons = screen.getAllByText('Click me!');
		fireEvent.click(toolbarButtons[1]);
		fireEvent.click(toolbarButtons[1]);
		const editorElements = screen.getAllByRole('textbox');

		// We don't modify the first editor so it shouldn't have been modified
		expect(editorElements[0].textContent).toBe('');

		// We bark twice on the second editor
		expect(editorElements[1].textContent).toBe('barkbark');
	});

	it('should be able to read + update state', async () => {
		await act(async () => {
			render(
				<div>
					<EditorContext>
						<TestEditor />
					</EditorContext>
					<EditorContext>
						<TestEditor />
					</EditorContext>
				</div>,
			);
		});

		const toolbarButtons = screen.getAllByText('Click me!');
		const statuses = screen.getAllByTestId('dog-status');
		// Both dogs should be a good boy
		expect(statuses[0].textContent).toBe('Good boy');
		expect(statuses[1].textContent).toBe('Good boy');

		fireEvent.click(toolbarButtons[1]);
		// The second dog barks and should be a bad boy now
		expect(statuses[0].textContent).toBe('Good boy');
		expect(statuses[1].textContent).toBe('Bad boy');
	});

	it('should be able to read + update state without EditorContext', async () => {
		await act(async () => {
			render(
				<div>
					<TestEditor />
					<TestEditor />
				</div>,
			);
		});

		const toolbarButtons = screen.getAllByText('Click me!');
		const statuses = screen.getAllByTestId('dog-status');
		// Both dogs should be a good boy
		expect(statuses[0].textContent).toBe('Good boy');
		expect(statuses[1].textContent).toBe('Good boy');

		fireEvent.click(toolbarButtons[1]);
		// The second dog barks and should be a bad boy now
		expect(statuses[0].textContent).toBe('Good boy');
		expect(statuses[1].textContent).toBe('Bad boy');
	});
});

const dogPluginKey = new PluginKey('dog');

const dogPlugin: NextEditorPlugin<
	'dog',
	{
		commands: { bark: EditorCommand };
		sharedState: { hasBarked: boolean } | undefined;
	}
> = ({ api }) => {
	return {
		name: 'dog',

		commands: {
			bark: ({ tr }) => {
				tr.insertText('bark');
				tr.setMeta(dogPluginKey, true);
				return tr;
			},
		},

		getSharedState(editorState) {
			if (!editorState) {
				return undefined;
			}
			return dogPluginKey.getState(editorState);
		},

		pmPlugins() {
			return [
				{
					name: 'dogPlugin',
					plugin: () =>
						new SafePlugin({
							key: dogPluginKey,
							state: {
								init() {
									return { hasBarked: false };
								},
								apply(tr, currentState) {
									const meta = tr.getMeta(dogPluginKey);
									if (meta) {
										return {
											hasBarked: true,
										};
									}
									return currentState;
								},
							},
						}),
				},
			];
		},
	};
};

function Toolbar({ editorApi }: { editorApi: ExtractInjectionAPI<typeof dogPlugin> | undefined }) {
	const { dogState } = useSharedPluginState(editorApi, ['dog']);
	return (
		<div>
			<p data-testid="dog-status">
				{dogState ? (dogState?.hasBarked ? 'Bad boy' : 'Good boy') : 'Unknown boy'}
			</p>
			<Button
				onClick={() => {
					const command = editorApi?.dog?.commands.bark;
					editorApi?.core?.actions.execute(command);
				}}
			>
				Click me!
			</Button>
		</div>
	);
}

function TestEditor() {
	const { preset, editorApi } = usePreset(() => {
		return createDefaultPreset({ featureFlags: {}, paste: {} }).add(dogPlugin);
	}, []);

	return (
		<div>
			<Toolbar editorApi={editorApi} />
			<ComposableEditor appearance="chromeless" preset={preset} />
		</div>
	);
}

/**
 * Sanity checks
 */
// @ts-ignore
function TestEditor2() {
	const { preset, editorApi } = usePreset(() => {
		return new EditorPresetBuilder();
	}, []);

	return (
		<div>
			{/* @ts-expect-error hyperlink plugin doesn't exist here */}
			<Toolbar editorApi={editorApi} />
			<ComposableEditor appearance="chromeless" preset={preset} />
		</div>
	);
}

const catPlugin: NextEditorPlugin<'cat'> = () => {
	return {
		name: 'cat',
	};
};

// @ts-ignore
function TestEditor3() {
	const { preset, editorApi } = usePreset((builder) => {
		return builder.add(catPlugin);
	}, []);

	return (
		<div>
			{/* @ts-expect-error hyperlink plugin doesn't exist here */}
			<Toolbar editorApi={editorApi} />
			<ComposableEditor appearance="chromeless" preset={preset} />
		</div>
	);
}
