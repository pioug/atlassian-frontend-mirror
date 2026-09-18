import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';

import { ANALYTICS_CHANNEL } from '../../common/constants';
import { type LinkCreateFailureContext } from '../../common/types';
import { LinkCreateCallbackProvider, useLinkCreateCallback } from './main';

const buildResponse = (status: number, traceId?: string) => {
	return new Response(null, {
		status,
		headers: traceId ? { 'x-trace-id': traceId } : {},
	});
};

const FailButton = ({ error, context }: { error: unknown; context?: LinkCreateFailureContext }) => {
	const { onFailure } = useLinkCreateCallback();

	return (
		<button type="button" onClick={() => onFailure?.(error, context)}>
			fail
		</button>
	);
};

const fireFailure = async (error: unknown, context?: LinkCreateFailureContext) => {
	const onEvent = jest.fn();

	render(
		<AnalyticsListener channel={ANALYTICS_CHANNEL} onEvent={onEvent}>
			<LinkCreateCallbackProvider>
				<FailButton error={error} context={context} />
			</LinkCreateCallbackProvider>
		</AnalyticsListener>,
	);

	await userEvent.click(screen.getByRole('button', { name: 'fail' }));

	const createFailed = onEvent.mock.calls
		.map(([event]) => event)
		.find((event) => event.payload?.actionSubjectId === 'linkCreate');

	return createFailed?.payload?.attributes;
};

// LinkCreateCallbackProvider renders no UI of its own — it only supplies context. The `button`
// rendered here is a test harness for invoking `onFailure`, not the component under test, so an
// accessibility assertion would only be testing the harness. Accessibility of the Link Create UI
// is covered by the tests for the components that render it.
// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('LinkCreateCallbackProvider onFailure analytics', () => {
	it('should be accessible', async () => {
		await fireFailure(buildResponse(503, 'abc-123'), {
			operation: 'create-page',
		});

		await expect(document.body).toBeAccessible();
	});

	describe('when processing failures', () => {
		it('records the operation and status for a failed response', async () => {
			const attributes = await fireFailure(buildResponse(503, 'abc-123'), {
				operation: 'fetch-space',
			});

			expect(attributes).toEqual(
				expect.objectContaining({
					failureType: 'NetworkError',
					operation: 'fetch-space',
					status: 503,
				}),
			);
		});

		it('distinguishes the two parallel default-value prefetches', async () => {
			const spaceAttributes = await fireFailure(buildResponse(404), {
				operation: 'fetch-space',
			});
			expect(spaceAttributes).toEqual(
				expect.objectContaining({ operation: 'fetch-space', status: 404 }),
			);
		});

		it('distinguishes the page prefetch', async () => {
			const pageAttributes = await fireFailure(buildResponse(404), { operation: 'fetch-page' });
			expect(pageAttributes).toEqual(
				expect.objectContaining({ operation: 'fetch-page', status: 404 }),
			);
		});

		it('records the operation with null network fields for a non-Response error', async () => {
			const attributes = await fireFailure(new Error('boom'), { operation: 'create-page' });

			expect(attributes).toEqual(
				expect.objectContaining({
					failureType: 'Error',
					operation: 'create-page',
					status: null,
				}),
			);
		});

		it('falls back to a null operation when the call site provides no context', async () => {
			const attributes = await fireFailure(buildResponse(500));

			expect(attributes).toEqual(expect.objectContaining({ operation: null, status: 500 }));
		});

		// The response below carries an `x-trace-id` header, so this also asserts that a trace id
		// is not captured merely because one is available. `traceId` is unique per event and so
		// cannot be aggregated; request-level correlation belongs in logs, not product analytics.
		it('never records a url, path or traceId', async () => {
			const attributes = await fireFailure(buildResponse(503, 'abc-123'), {
				operation: 'create-page',
			});

			expect(attributes).not.toHaveProperty('path');
			expect(attributes).not.toHaveProperty('url');
			expect(attributes).not.toHaveProperty('traceId');
		});
	});
});
