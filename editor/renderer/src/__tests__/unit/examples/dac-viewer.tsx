import React from 'react';

import { fireEvent, render, screen, waitFor } from '@atlassian/testing-library';

import Example from '../../../../examples/7-dac-viewer';

jest.mock('@atlaskit/editor-test-helpers/ajv', () => ({
	initialize: () => ({
		compile: () => () => true,
	}),
}));

jest.mock('@atlaskit/util-data-test/get-emoji-resource', () => ({
	getEmojiResource: () => Promise.resolve({}),
}));

jest.mock('@atlaskit/link-provider/client', () => {
	const { APIError: MockAPIError } = jest.requireActual('@atlaskit/linking-common');
	return {
		...jest.requireActual('@atlaskit/link-provider/client'),
		__esModule: true,
		default: class {
			fetchData() {
				return Promise.reject(
					new MockAPIError('fatal', 'localhost', 'unsupported', 'ResolveUnsupportedError'),
				);
			}
			prefetchData() {
				return Promise.resolve(undefined);
			}
		},
	};
});

const inlineCardDocument = {
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Parent work item: ',
				},
				{
					type: 'inlineCard',
					attrs: {
						url: 'https://mysite.atlassian.net/browse/ABC-123',
					},
				},
				{
					type: 'text',
					text: '.',
				},
			],
		},
	],
};

const plainTextDocument = {
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Plain-text control renders correctly.',
				},
			],
		},
	],
};

const renderErrorMessage = /Something went wrong while rendering this document/u;
const providerException = /useSmartCard\(\) must be wrapped in <SmartCardProvider>/u;

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Renderer DAC document viewer example', () => {
	const originalFetch = global.fetch;
	const originalConsoleError = global.console.error;

	beforeEach(() => {
		global.fetch = jest.fn().mockResolvedValue({
			json: async () => ({}),
		});
		global.console.error = jest.fn();
	});

	afterEach(() => {
		global.fetch = originalFetch;
		global.console.error = originalConsoleError;
	});

	const waitForViewer = async () => {
		await waitFor(() => {
			expect(screen.queryByText(/Fetching latest JSON schema/u)).not.toBeInTheDocument();
		});
	};

	const setDocument = (document: object) => {
		// Controlled textarea; paste the full ADF payload rather than typing it.
		// eslint-disable-next-line testing-library/prefer-user-event -- dumping JSON into a controlled textarea
		fireEvent.change(screen.getByRole('textbox'), {
			target: { value: JSON.stringify(document, null, 2) },
		});
	};

	it('keeps the JSON editor mounted when ADF contains an inlineCard', async () => {
		render(<Example />);
		await waitForViewer();

		setDocument(inlineCardDocument);

		expect(screen.getByRole('textbox')).toBeInTheDocument();
		expect(screen.queryByText(renderErrorMessage)).not.toBeInTheDocument();

		const preview = document.querySelector('.ak-renderer-document');
		expect(preview).toBeInTheDocument();
		expect(preview).toHaveTextContent(/Parent work item:/u);
		expect((global.console.error as jest.Mock).mock.calls.flat().join('\n')).not.toMatch(
			providerException,
		);
	});

	it('still renders after switching from an inlineCard document to plain text', async () => {
		render(<Example />);
		await waitForViewer();

		setDocument(inlineCardDocument);
		setDocument(plainTextDocument);

		expect(screen.getByRole('textbox')).toBeInTheDocument();
		expect(document.querySelector('.ak-renderer-document')).toHaveTextContent(
			'Plain-text control renders correctly.',
		);
		expect(screen.queryByText(renderErrorMessage)).not.toBeInTheDocument();
	});
});
