import React from 'react';

import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import * as pmView from '@atlaskit/editor-prosemirror/view';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { mockCreateRange } from '../../mocks';
import { defaultAutocompleteProvider } from '../../src/plugins/autocomplete/constants';
import JQLEditor from '../../src/ui';
import { type HydratedValues } from '../../src/ui/jql-editor/types';

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
		//pmView.EditorView = originalEditorView;
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<JQLEditor
				locale={'en'}
				analyticsSource={'test'}
				query={'issuetype = bug'}
				onUpdate={() => null}
				autocompleteProvider={defaultAutocompleteProvider}
			/>,
		);

		await expect(container).toBeAccessible();
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

	describe('Assets object rich inline nodes', () => {
		const OBJECT_ARI = 'ari:cloud:cmdb::object/ac72f855-c692-441a-8557-bb958b38f698/10';
		const AVATAR_URL = 'https://assets-media.example.com/icons48/printer.png';
		const ASSETS_QUERY = `Assets IN ("${OBJECT_ARI}")`;

		// Keyed as the API returns it, not as the query spells it — the casing difference matters.
		const onHydrate = async (): Promise<HydratedValues> => ({
			Assets: [
				{
					type: 'assets',
					id: OBJECT_ARI,
					name: 'Object 1 - DT-10',
					avatarUrl: AVATAR_URL,
				},
			],
		});

		const renderEditor = () =>
			render(
				<JQLEditor
					locale={'en'}
					analyticsSource={'test'}
					query={ASSETS_QUERY}
					onUpdate={() => null}
					autocompleteProvider={defaultAutocompleteProvider}
					enableRichInlineNodes
					onHydrate={onHydrate}
				/>,
			);

		it('replaces the ARI with the object name once hydration resolves when the gate is on', async () => {
			passGate('orion-8274-cmdb-object-jql-values-resolver');

			const { findByText, queryByText } = renderEditor();

			expect(await findByText('Object 1 - DT-10')).toBeVisible();
			expect(queryByText(OBJECT_ARI)).not.toBeInTheDocument();
		});

		it('shows the hydrated object icon, looked up under the field name the API returned', async () => {
			passGate('orion-8274-cmdb-object-jql-values-resolver');

			// The name rides on node attributes; only the icon goes through the store lookup.
			const { container, findByText } = renderEditor();
			await findByText('Object 1 - DT-10');

			await waitFor(() =>
				expect(container.querySelector('img')).toHaveAttribute('src', AVATAR_URL),
			);
		});

		it('leaves the ARI as plain text when the gate is off', async () => {
			failGate('orion-8274-cmdb-object-jql-values-resolver');

			const { container, queryByText } = renderEditor();

			await waitFor(() => expect(container.textContent).toContain(OBJECT_ARI));
			expect(queryByText('Object 1 - DT-10')).not.toBeInTheDocument();
		});
	});
});
