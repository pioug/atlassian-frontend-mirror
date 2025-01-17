import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MediaApi } from '@atlaskit/media-client';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { MockedMediaClientProvider } from '../test-helpers';

import { useCopyIntent } from './useCopyIntent';

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
});
