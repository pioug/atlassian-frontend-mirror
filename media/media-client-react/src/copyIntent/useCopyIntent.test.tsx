import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { type MediaApi } from '@atlaskit/media-client';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { MockedMediaClientProvider } from '../test-helpers';

import { useCopyIntent } from './useCopyIntent';

// Polyfill ClipboardEvent for JSDOM
if (typeof ClipboardEvent === 'undefined') {
	// @ts-ignore - JSDOM doesn't have ClipboardEvent
	global.ClipboardEvent = class ClipboardEvent extends Event {
		clipboardData: DataTransfer | null;
		constructor(type: string, eventInitDict?: ClipboardEventInit) {
			super(type, eventInitDict);
			this.clipboardData = eventInitDict?.clipboardData ?? null;
		}
	};
}

type DummyComponentProps = {
	id: string;
	collectionName?: string;
};

const DummyComponent = ({ id, collectionName }: DummyComponentProps) => {
	const { copyNodeRef } = useCopyIntent(id, { collectionName });

	return (
		<div data-testid="target" ref={copyNodeRef}>
			some text
		</div>
	);
};

describe('useCopyIntent', () => {
	let mockedMediaApi: Partial<MediaApi>;
	const auth = {
		clientId: 'some-client',
		token: 'some-token',
		baseUrl: 'someUrl',
	};

	beforeEach(() => {
		jest.restoreAllMocks();

		const registerCopyIntents = jest.fn().mockResolvedValue(undefined);
		const resolveAuth = jest.fn().mockResolvedValue(auth);
		mockedMediaApi = {
			registerCopyIntents,
			resolveAuth,
		};
	});

	ffTest.on('platform_media_cross_client_copy', 'Copy intent', () => {
		it('should call registerCopyIntent when the component is copied', async () => {
			const user = userEvent.setup();
			render(
				<MockedMediaClientProvider mockedMediaApi={mockedMediaApi}>
					<div>from here</div>
					<DummyComponent id="some-id" />
					<div>to here</div>
					<div>other text</div>
				</MockedMediaClientProvider>,
			);

			await user.pointer({
				keys: '[MouseLeft][MouseLeft>]',
				target: screen.getByText('from here'),
				offset: 0,
			});

			await user.pointer({
				target: screen.getByText('to here'),
			});

			await user.copy();

			expect(mockedMediaApi.registerCopyIntents).toHaveBeenCalledTimes(1);
			expect(mockedMediaApi.registerCopyIntents).toHaveBeenCalledWith(
				[{ id: 'some-id' }],
				{ spanId: expect.any(String), traceId: expect.any(String) },
				auth,
			);
		});

		it('should not call registerCopyIntent when the component is not selected', async () => {
			const user = userEvent.setup();
			render(
				<MockedMediaClientProvider mockedMediaApi={mockedMediaApi}>
					<div>from here</div>
					<div>to here</div>
					<div>other text</div>
					<DummyComponent id="some-id" />
				</MockedMediaClientProvider>,
			);

			await user.pointer([
				{
					keys: '[MouseLeft>]',
					target: screen.getByText('from here'),
					offset: 0,
				},
				{
					target: screen.getByText('to here'),
				},
				{
					keys: '[/MouseLeft]',
				},
			]);

			// @ts-ignore
			jest.spyOn(window, 'getSelection').mockImplementation(() => ({
				containsNode: () => false,
			}));

			await user.copy();

			expect(mockedMediaApi.registerCopyIntents).not.toHaveBeenCalled();
		});

		it('should batch call registerCopyIntent for the same collection selected', async () => {
			const user = userEvent.setup();
			render(
				<MockedMediaClientProvider mockedMediaApi={mockedMediaApi}>
					<div>from here</div>
					<DummyComponent id="some-other-id" collectionName="some-collection" />
					<DummyComponent id="some-id" collectionName="some-collection" />
					<div>to here</div>
					<div>other text</div>
				</MockedMediaClientProvider>,
			);

			await user.pointer([
				{
					keys: '[MouseLeft>]',
					target: screen.getByText('from here'),
					offset: 0,
				},
				{
					target: screen.getByText('to here'),
				},
				{
					keys: '[/MouseLeft]',
				},
			]);

			await user.copy();

			expect(mockedMediaApi.registerCopyIntents).toHaveBeenCalledTimes(1);
			expect(mockedMediaApi.registerCopyIntents).toHaveBeenCalledWith(
				expect.arrayContaining([
					{ id: 'some-id', collection: 'some-collection' },
					{ id: 'some-other-id', collection: 'some-collection' },
				]),
				{ spanId: expect.any(String), traceId: expect.any(String) },
				auth,
			);
		});

		it('should batch call registerCopyIntent for different collections with the same auth', async () => {
			const user = userEvent.setup();
			render(
				<MockedMediaClientProvider mockedMediaApi={mockedMediaApi}>
					<div>from here</div>
					<DummyComponent id="some-id" collectionName="some-collection" />
					<DummyComponent id="some-other-id" collectionName="some-other-collection" />
					<div>to here</div>
					<div>other text</div>
				</MockedMediaClientProvider>,
			);

			await user.pointer([
				{
					keys: '[MouseLeft>]',
					target: screen.getByText('from here'),
					offset: 0,
				},
				{
					target: screen.getByText('to here'),
				},
				{
					keys: '[/MouseLeft]',
				},
			]);

			await user.copy();

			expect(mockedMediaApi.registerCopyIntents).toHaveBeenCalledTimes(1);
			expect(mockedMediaApi.registerCopyIntents).toHaveBeenCalledWith(
				[
					{ id: 'some-id', collection: 'some-collection' },
					{ id: 'some-other-id', collection: 'some-other-collection' },
				],
				{ spanId: expect.any(String), traceId: expect.any(String) },
				auth,
			);
		});

		it('should call registerCopyIntent for different auths', async () => {
			const collection1 = 'some-collection';
			const collection2 = 'some-other-collection';
			const auth2 = { ...auth, token: 'some-other-token' };

			mockedMediaApi.resolveAuth = jest.fn().mockImplementation(async ({ collectionName }) => {
				if (collectionName === collection1) {
					return auth;
				}
				return auth2;
			});

			const user = userEvent.setup();
			render(
				<MockedMediaClientProvider mockedMediaApi={mockedMediaApi}>
					<div>from here</div>
					<DummyComponent id="some-id" collectionName={collection1} />
					<DummyComponent id="some-other-id" collectionName={collection2} />
					<div>to here</div>
					<div>other text</div>
				</MockedMediaClientProvider>,
			);

			await user.pointer([
				{
					keys: '[MouseLeft>]',
					target: screen.getByText('from here'),
					offset: 0,
				},
				{
					target: screen.getByText('to here'),
				},
				{
					keys: '[/MouseLeft]',
				},
			]);

			await user.copy();

			expect(mockedMediaApi.registerCopyIntents).toHaveBeenCalledTimes(2);
			expect(mockedMediaApi.registerCopyIntents).toHaveBeenCalledWith(
				[{ id: 'some-id', collection: 'some-collection' }],
				{ spanId: expect.any(String), traceId: expect.any(String) },
				auth,
			);

			expect(mockedMediaApi.registerCopyIntents).toHaveBeenCalledWith(
				[{ id: 'some-other-id', collection: 'some-other-collection' }],
				{ spanId: expect.any(String), traceId: expect.any(String) },
				auth2,
			);
		});

		it('should call registerCopyIntent when the context menu is opened for an image', async () => {
			const user = userEvent.setup();
			render(
				<MockedMediaClientProvider mockedMediaApi={mockedMediaApi}>
					<div>from here</div>
					<DummyComponent id="some-id" />
					<div>to here</div>
					<div>other text</div>
				</MockedMediaClientProvider>,
			);

			const target = screen.getByTestId('target');

			await user.pointer({ target, keys: '[MouseRight]' });

			expect(mockedMediaApi.registerCopyIntents).toHaveBeenCalledTimes(1);
			expect(mockedMediaApi.registerCopyIntents).toHaveBeenCalledWith(
				[{ id: 'some-id' }],
				{ spanId: expect.any(String), traceId: expect.any(String) },
				auth,
			);
		});
	});

	describe('Cross-client copy with auth', () => {
		ffTest.on('platform_media_cross_client_copy_with_auth', 'when feature flag is enabled', () => {
			ffTest.on('platform_media_cross_client_copy', 'and copy intent flag is enabled', () => {
				it('should inject clientId into clipboard HTML when copying', async () => {
					const user = userEvent.setup();
					const mockGetClientId = jest.fn().mockResolvedValue('test-client-id');
					mockedMediaApi.resolveAuth = jest.fn().mockResolvedValue({
						...auth,
						clientId: 'test-client-id',
					});

					render(
						<MockedMediaClientProvider
							mockedMediaApi={mockedMediaApi}
							mockGetClientId={mockGetClientId}
						>
							<div>from here</div>
							<DummyComponent id="some-id" collectionName="some-collection" />
							<div>to here</div>
							<div>other text</div>
						</MockedMediaClientProvider>,
					);

					// Wait for clientId to be fetched
					await waitFor(() => expect(mockGetClientId).toHaveBeenCalledWith('some-collection'));

					await user.pointer({
						keys: '[MouseLeft][MouseLeft>]',
						target: screen.getByText('from here'),
						offset: 0,
					});

					await user.pointer({
						target: screen.getByText('to here'),
					});

					// Create a mock ClipboardEvent with HTML that matches what the implementation expects
					const clipboardData = new DataTransfer();
					clipboardData.setData(
						'text/html',
						'<div data-node-type="media" data-id="some-file-id" data-context-id="some-context">some content</div>',
					);

					const copyEvent = new ClipboardEvent('copy', {
						clipboardData,
						bubbles: true,
						cancelable: true,
					});

					// Dispatch the copy event
					document.dispatchEvent(copyEvent);

					// Verify the HTML was modified with clientId
					const modifiedHtml = clipboardData.getData('text/html');
					expect(modifiedHtml).toContain('data-client-id="test-client-id"');
					expect(modifiedHtml).toContain('data-node-type="media"');
				});

				it('should not inject clientId if clientId is not available', async () => {
					const user = userEvent.setup();
					// Return undefined instead of rejecting to avoid unhandled promise errors
					const mockGetClientId = jest.fn().mockResolvedValue(undefined);

					render(
						<MockedMediaClientProvider
							mockedMediaApi={mockedMediaApi}
							mockGetClientId={mockGetClientId}
						>
							<div>from here</div>
							<DummyComponent id="some-id" collectionName="some-collection" />
							<div>to here</div>
							<div>other text</div>
						</MockedMediaClientProvider>,
					);

					// Wait for clientId fetch to complete
					await waitFor(() => expect(mockGetClientId).toHaveBeenCalled());

					await user.pointer({
						keys: '[MouseLeft][MouseLeft>]',
						target: screen.getByText('from here'),
						offset: 0,
					});

					await user.pointer({
						target: screen.getByText('to here'),
					});

					// Create a mock ClipboardEvent with HTML that matches media nodes
					const clipboardData = new DataTransfer();
					clipboardData.setData(
						'text/html',
						'<div data-node-type="media" data-id="some-file-id" data-context-id="some-context">some content</div>',
					);

					const copyEvent = new ClipboardEvent('copy', {
						clipboardData,
						bubbles: true,
						cancelable: true,
					});

					// Dispatch the copy event
					document.dispatchEvent(copyEvent);

					// Verify the HTML was not modified with clientId (since clientId is undefined)
					const modifiedHtml = clipboardData.getData('text/html');
					expect(modifiedHtml).not.toContain('data-client-id');
					expect(modifiedHtml).toContain('data-node-type="media"');
				});

				it('should handle getClientId failure gracefully (e.g. when authProvider is not configured)', async () => {
					const user = userEvent.setup();
					// Simulate the error that occurs when authProvider is not a function
					// This is what happens in some test environments (like Jira unit tests)
					const mockGetClientId = jest
						.fn()
						.mockRejectedValue(new TypeError('authProvider is not a function'));

					render(
						<MockedMediaClientProvider
							mockedMediaApi={mockedMediaApi}
							mockGetClientId={mockGetClientId}
						>
							<div>from here</div>
							<DummyComponent id="some-id" collectionName="some-collection" />
							<div>to here</div>
							<div>other text</div>
						</MockedMediaClientProvider>,
					);

					// Wait for clientId fetch to be attempted and fail
					await waitFor(() => expect(mockGetClientId).toHaveBeenCalled());

					// Component should still be rendered without crashing
					expect(screen.getByTestId('target')).toBeInTheDocument();

					await user.pointer({
						keys: '[MouseLeft][MouseLeft>]',
						target: screen.getByText('from here'),
						offset: 0,
					});

					await user.pointer({
						target: screen.getByText('to here'),
					});

					// Create a mock ClipboardEvent with HTML that matches media nodes
					const clipboardData = new DataTransfer();
					clipboardData.setData(
						'text/html',
						'<div data-node-type="media" data-id="some-file-id" data-context-id="some-context">some content</div>',
					);

					const copyEvent = new ClipboardEvent('copy', {
						clipboardData,
						bubbles: true,
						cancelable: true,
					});

					// Dispatch the copy event - should not crash
					document.dispatchEvent(copyEvent);

					// Verify the HTML was not modified with clientId (since getClientId failed)
					const modifiedHtml = clipboardData.getData('text/html');
					expect(modifiedHtml).not.toContain('data-client-id');
					// But the copy event should still have been processed
					expect(modifiedHtml).toContain('data-node-type="media"');
				});
			});
		});

		ffTest.off(
			'platform_media_cross_client_copy_with_auth',
			'when feature flag is disabled',
			() => {
				ffTest.on('platform_media_cross_client_copy', 'and copy intent flag is enabled', () => {
					it('should not inject clientId into clipboard HTML', async () => {
						const user = userEvent.setup();
						const mockGetClientId = jest.fn().mockResolvedValue('test-client-id');

						render(
							<MockedMediaClientProvider
								mockedMediaApi={mockedMediaApi}
								mockGetClientId={mockGetClientId}
							>
								<div>from here</div>
								<DummyComponent id="some-id" collectionName="some-collection" />
								<div>to here</div>
								<div>other text</div>
							</MockedMediaClientProvider>,
						);

						// clientId should not be fetched when flag is off
						expect(mockGetClientId).not.toHaveBeenCalled();

						await user.pointer({
							keys: '[MouseLeft][MouseLeft>]',
							target: screen.getByText('from here'),
							offset: 0,
						});

						await user.pointer({
							target: screen.getByText('to here'),
						});

						// Create a mock ClipboardEvent with HTML that matches media nodes
						const clipboardData = new DataTransfer();
						clipboardData.setData(
							'text/html',
							'<div data-node-type="media" data-id="some-file-id" data-context-id="some-context">some content</div>',
						);

						const copyEvent = new ClipboardEvent('copy', {
							clipboardData,
							bubbles: true,
							cancelable: true,
						});

						// Dispatch the copy event
						document.dispatchEvent(copyEvent);

						// Verify the HTML was not modified with clientId (flag is off)
						const modifiedHtml = clipboardData.getData('text/html');
						expect(modifiedHtml).not.toContain('data-client-id');
					});
				});
			},
		);
	});
});
