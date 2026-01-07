import React from 'react';

import { render } from '@testing-library/react';

import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p, panel } from '@atlaskit/editor-test-helpers/doc-builder';

import { ChromelessEditorContainer } from '../../../Appearance/Chromeless';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Chromeless editor', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	const createEditor = createEditorFactory();
	const editor = (doc: DocBuilder) =>
		createEditor({
			doc,
			editorProps: {
				allowPanel: true,
				appearance: 'chromeless',
				quickInsert: true,
			},
		});

	it('should keep paragraph as the last node', async () => {
		const { editorView, typeAheadTool } = editor(doc(p('{<>}')));
		await typeAheadTool.searchQuickInsert('info')?.insert({ index: 0 });

		expect(editorView.state.doc).toEqualDocument(doc(panel({ panelType: 'info' })(p('')), p('')));
	});

	it('should render correct overridden styles', () => {
		const { container } = render(
			<ChromelessEditorContainer minHeight={100} maxHeight={200}>
				<p>Hello world</p>
				<p>Hello world</p>
			</ChromelessEditorContainer>,
		);

		expect(container).toMatchSnapshot();
	});
});
