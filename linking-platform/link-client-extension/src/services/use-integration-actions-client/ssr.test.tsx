/**
 * @jest-environment node
 */
import React from 'react';

import { renderToString } from 'react-dom/server';

import CardClient from '@atlaskit/link-provider/client';

import { EXECUTE_INTEGRATION_ACTION_OPERATION_NAME } from './constants';
import { getAggUrl } from './get-agg-url';
import { useIntegrationActionsClient } from './index';
import { IntegrationActionError } from './integration-action-error';
import type { ExecuteIntegrationActionRequest } from './types';

const data: ExecuteIntegrationActionRequest = {
	actionTypeKey: 'atlassian::custom:action',
	filter: { actionId: 'google-drive:list-comments', integrationKey: 'google-drive' },
	actionInput: { inputs: { fileId: 'file-id' } },
};

const relativeAggUrl = `/gateway/api/graphql?operationName=${EXECUTE_INTEGRATION_ACTION_OPERATION_NAME}`;

/** Renders the hook on the server and returns the client it created. */
const renderOnServer = (cardClient: CardClient = new CardClient()) => {
	let client: ReturnType<typeof useIntegrationActionsClient> | undefined;
	const Component = () => {
		client = useIntegrationActionsClient(cardClient);
		return null;
	};
	const html = renderToString(<Component />);
	return { html, client: client! };
};

const getError = async (promise: Promise<unknown>): Promise<IntegrationActionError> => {
	try {
		await promise;
	} catch (error) {
		return error as IntegrationActionError;
	}
	throw new Error('Expected promise to reject');
};

describe('useIntegrationActionsClient on the server', () => {
	const originalFetch = (global as any).fetch;

	afterEach(() => {
		(global as any).fetch = originalFetch;
	});

	it('has no window', () => {
		expect(typeof window).toBe('undefined');
	});

	it('renders without throwing', () => {
		const { html, client } = renderOnServer();

		expect(html).toBe('');
		expect(client.executeAction).toEqual(expect.any(Function));
	});

	it('uses a relative AGG URL', () => {
		expect(getAggUrl()).toBe(relativeAggUrl);
		expect(getAggUrl('custom')).toBe(relativeAggUrl);
	});

	it('rejects with an http error when fetch rejects the relative URL', async () => {
		// Node's fetch throws a TypeError for relative URLs.
		const mockFetch = jest
			.fn()
			.mockRejectedValue(new TypeError(`Failed to parse URL from ${relativeAggUrl}`));
		(global as any).fetch = mockFetch;
		const { client } = renderOnServer();

		const error = await getError(client.executeAction(data));

		expect(mockFetch).toHaveBeenCalledWith(relativeAggUrl, expect.any(Object));
		expect(error).toBeInstanceOf(IntegrationActionError);
		expect(error.kind).toBe('http');
		expect(error.statusCode).toBeUndefined();
	});

	it('rejects with an http error when fetch is not available', async () => {
		delete (global as any).fetch;
		const { client } = renderOnServer();

		const error = await getError(client.executeAction(data));

		expect(error).toBeInstanceOf(IntegrationActionError);
		expect(error.kind).toBe('http');
	});

	it('rejects with an http error for the custom environment used in SSR', async () => {
		(global as any).fetch = jest
			.fn()
			.mockRejectedValue(new TypeError(`Failed to parse URL from ${relativeAggUrl}`));
		const { client } = renderOnServer(
			new CardClient('custom', 'https://ors.internal/object-resolver'),
		);

		const error = await getError(client.executeAction(data));

		expect((global as any).fetch).toHaveBeenCalledWith(relativeAggUrl, expect.any(Object));
		expect(error.kind).toBe('http');
	});
});
