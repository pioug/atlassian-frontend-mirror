import React from 'react';

import { render } from '@testing-library/react';

import * as pmView from '@atlaskit/editor-prosemirror/view';

import { mockCreateRange } from '../../mocks';
import { JQLEditor } from '../../src';
import { defaultAutocompleteProvider } from '../../src/plugins/autocomplete/constants';

jest.mock('@atlaskit/editor-prosemirror/view', () => {
	const originalModule = jest.requireActual('@atlaskit/editor-prosemirror/view');

	return {
		__esModule: true,
		...originalModule,
	};
});

describe('JQLEditor', () => {
	beforeEach(() => {
		document.createRange = jest.fn(mockCreateRange);
	});

	afterEach(() => {
		jest.restoreAllMocks();
		// @ts-ignore
		//pmView.EditorView = originalEditorView;
	});

	it('should render without throwing', () => {
		const { queryByTestId } = render(
			<JQLEditor
				locale={'en'}
				analyticsSource={'test'}
				query={'issuetype = bug'}
				onUpdate={() => null}
				autocompleteProvider={defaultAutocompleteProvider}
			/>,
		);

		expect(queryByTestId('jql-editor-read-only')).not.toBeInTheDocument();
	});

	it('should render JQLEditorReadOnly when a child component throws an error', () => {
		// Override the prosemirror EditorView implementation to throw an error. To simulate our error handling.
		// @ts-ignore
		jest.spyOn(pmView, 'EditorView').mockReturnValue(() => {
			throw new Error("Ignore me, I'm just a simulated test error :)");
		});

		const { queryByTestId } = render(
			<JQLEditor
				locale={'en'}
				analyticsSource={'test'}
				query={'issuetype = bug'}
				onUpdate={() => null}
				autocompleteProvider={defaultAutocompleteProvider}
			/>,
		);

		expect(queryByTestId('jql-editor-read-only')).toBeInTheDocument();
	});
});
