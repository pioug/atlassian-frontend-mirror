import type { ReactNode } from 'react';
import React from 'react';

import { render } from '@testing-library/react';

import { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
	createProsemirrorEditorFactory,
	Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

import EditorActions from '../../../actions';
import EditorContext from '../../../ui/EditorContext';
import { WithEditorView } from '../../WithEditorView';

describe('WithEditorView', () => {
	const createEditor = createProsemirrorEditorFactory();

	function setup(options: { child: ReactNode; editorView: EditorView }) {
		const editorActions = new EditorActions();

		editorActions._privateRegisterEditor(options.editorView, new EventDispatcher());

		return render(
			<main>
				<EditorContext editorActions={editorActions}>{options.child}</EditorContext>
			</main>,
		);
	}

	it('should pass the editorView', async () => {
		const { editorView } = createEditor({
			preset: new Preset<LightEditorPlugin>(),
		});

		let receivedEditorView: EditorView | undefined;
		const DummyComponent = (props: { editorView: EditorView | undefined }) => {
			receivedEditorView = props.editorView;
			return null;
		};

		const DummyComponentWithFlags = WithEditorView(DummyComponent);

		const { container } = setup({
			editorView,
			child: <DummyComponentWithFlags />,
		});

		expect(receivedEditorView).toEqual(editorView);
		await expect(container).toBeAccessible();
	});
});
