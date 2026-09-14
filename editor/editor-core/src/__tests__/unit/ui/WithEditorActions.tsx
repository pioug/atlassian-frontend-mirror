import React from 'react';

import { act, render } from '@testing-library/react';

import EditorActions from '../../../actions';
import EditorContext from '../../../ui/EditorContext';
import WithEditorActions from '../../../ui/WithEditorActions';

describe('WithEditorActions', () => {
	it('should render component with editorActions', async () => {
		const editorActions = new EditorActions();
		const component = jest.fn(() => null);
		const { container } = render(
			<main>
				<EditorContext editorActions={editorActions}>
					<WithEditorActions render={component} />
				</EditorContext>
			</main>,
		);
		expect(component).toHaveBeenCalledWith(editorActions);
		await expect(container).toBeAccessible();
	});

	it('should re-render component after editor is registered in editorActions', () => {
		const mockEditorView: any = {};
		const editorActions = new EditorActions();
		const component = jest.fn(() => null);
		render(
			<EditorContext editorActions={editorActions}>
				<WithEditorActions render={component} />
			</EditorContext>,
		);
		act(() => {
			editorActions._privateRegisterEditor(mockEditorView, {} as any);
		});
		const lastCall: any = component.mock.calls.pop();
		const [actions]: [EditorActions] = lastCall;
		expect(actions._privateGetEditorView()).toBe(mockEditorView);
	});

	it('should render component with editor actions even if they were registered before WithEditorActions component renders', () => {
		const mockEditorView: any = {};
		const editorActions = new EditorActions();
		const component = jest.fn(() => null);
		editorActions._privateRegisterEditor(mockEditorView, {} as any);
		render(
			<EditorContext editorActions={editorActions}>
				<WithEditorActions render={component} />
			</EditorContext>,
		);
		const lastCall: any = component.mock.calls.pop();
		const [actions]: [EditorActions] = lastCall;
		expect(actions._privateGetEditorView()).toBe(mockEditorView);
	});
});
