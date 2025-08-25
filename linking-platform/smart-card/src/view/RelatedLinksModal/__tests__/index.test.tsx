import '@atlaskit/link-test-helpers/jest';

import React from 'react';

import { screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { type CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { asMockFunction } from '@atlaskit/media-test-helpers';
import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';

import useIncomingOutgoingAri from '../../../state/hooks/use-incoming-outgoing-links';
import useResponse from '../../../state/hooks/use-response';
import { ANALYTICS_CHANNEL } from '../../../utils/analytics';
import { fakeFactory } from '../../../utils/mocks';
import RelatedLinksModal from '../index';

import {
	mockErrorResponse,
	mockForbiddenResponse,
	mockNotFoundResponse,
	mockSuccessResponse,
	mockUnAuthResponse,
} from './__mocks__/mocks';

jest.mock('../../../state/hooks/use-incoming-outgoing-links');
jest.mock('../../../state/hooks/use-response');

const mockIncomingAri: string = 'ari:cloud:incoming:1234';
const mockOutgoingAri: string = 'ari:cloud:outgoing:1234';

describe('RelatedLinksModal', () => {
	let ari: string;
	let mockClient: CardClient;
	const onEvent = jest.fn();
	const mockFetchAris = jest.fn();
	const mockGetIncomingOutgoingAris = jest.fn();
	const mockHandleResolvedLinkResponse = jest.fn();

	const expectEventRelatedLinksSuccess = (incomingCount: number, outgoingCount: number) =>
		waitFor(() =>
			expect(onEvent).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'success',
					actionSubject: 'relatedLinks',
					eventType: 'operational',
					attributes: {
						incomingCount,
						outgoingCount,
					},
				},
			}),
		);
	const expectEventModalOpened = () =>
		waitFor(() =>
			expect(onEvent).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'opened',
					actionSubject: 'modal',
					eventType: 'ui',
					actionSubjectId: 'relatedLinks',
				},
			}),
		);

	const expectEventRelatedLinksFailed = (reason: string) =>
		waitFor(() =>
			expect(onEvent).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'failed',
					actionSubject: 'relatedLinks',
					eventType: 'operational',
					attributes: {
						reason,
					},
				},
			}),
		);

	const setup = ({
		ari,
		baseUriWithNoTrailingSlash,
		client = mockClient,
	}: {
		ari: string;
		baseUriWithNoTrailingSlash?: string;
		client?: CardClient;
	}) =>
		renderWithIntl(
			<AnalyticsListener onEvent={onEvent} channel={ANALYTICS_CHANNEL}>
				<SmartCardProvider client={client}>
					<RelatedLinksModal
						ari={ari}
						onClose={() => {}}
						showModal={true}
						baseUriWithNoTrailingSlash={baseUriWithNoTrailingSlash}
					/>
				</SmartCardProvider>
			</AnalyticsListener>,
		);

	beforeEach(() => {
		mockFetchAris
			.mockImplementationOnce(() => Promise.resolve([mockSuccessResponse, mockSuccessResponse]))
			.mockImplementationOnce(() => Promise.resolve([mockSuccessResponse, mockSuccessResponse]));
		mockClient = new (fakeFactory(undefined, undefined, undefined, mockFetchAris))();
		asMockFunction(useIncomingOutgoingAri).mockImplementation(() => ({
			getIncomingOutgoingAris: mockGetIncomingOutgoingAris,
		}));
		asMockFunction(useResponse).mockImplementation(() => ({
			handleResolvedLinkResponse: mockHandleResolvedLinkResponse,
			handleResolvedLinkError: jest.fn(),
		}));

		ari = 'ari:cloud:example:1234';
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders related links modal', async () => {
		mockGetIncomingOutgoingAris.mockImplementationOnce(() =>
			Promise.resolve({
				incomingAris: [mockIncomingAri, mockIncomingAri],
				outgoingAris: [mockOutgoingAri, mockOutgoingAri],
			}),
		);

		setup({ ari });

		const modal = await screen.findByRole('dialog');
		const modalTitle = await screen.findByText('Related links');
		const incomingLinksTitle = await screen.findByText('Found in');
		const outgoingLinksTitle = await screen.findByText('Includes links to');
		const closeButton = await screen.findByRole('button', { name: 'Close' });

		expect(modal).toBeInTheDocument();
		expect(modalTitle).toBeInTheDocument();
		expect(incomingLinksTitle).toBeInTheDocument();
		expect(outgoingLinksTitle).toBeInTheDocument();
		expect(closeButton).toBeInTheDocument();

		expect(mockGetIncomingOutgoingAris).toHaveBeenCalledTimes(1);
		expect(mockFetchAris).toHaveBeenCalledTimes(2);
		expect(mockHandleResolvedLinkResponse).toHaveBeenCalledTimes(4);

		await expectEventRelatedLinksSuccess(2, 2);
		await expectEventModalOpened();
	});

	it('renders related links modal with links only from success(granted) responses', async () => {
		mockFetchAris.mockReset();
		mockGetIncomingOutgoingAris.mockImplementationOnce(() =>
			Promise.resolve({
				incomingAris: Array(6).fill(mockIncomingAri),
				outgoingAris: Array(5).fill(mockIncomingAri),
			}),
		);
		mockFetchAris
			.mockImplementationOnce(() =>
				Promise.resolve([
					mockSuccessResponse,
					mockErrorResponse,
					mockSuccessResponse,
					mockForbiddenResponse,
					mockNotFoundResponse,
					mockUnAuthResponse,
				]),
			)
			.mockImplementationOnce(() =>
				Promise.resolve([
					mockSuccessResponse,
					mockErrorResponse,
					mockSuccessResponse,
					mockForbiddenResponse,
					mockNotFoundResponse,
				]),
			);
		mockClient = new (fakeFactory(undefined, undefined, undefined, mockFetchAris))();

		setup({ ari });

		const incomingLinksTitle = await screen.findByText('Found in');
		const outgoingLinksTitle = await screen.findByText('Includes links to');
		expect(incomingLinksTitle).toBeInTheDocument();
		expect(outgoingLinksTitle).toBeInTheDocument();

		const allLinks = await screen.findAllByRole('link');
		expect(allLinks.length).toBe(4);

		const incomingLinks = await screen.findByTestId('incoming-related-links-list');
		expect(incomingLinks).toBeInTheDocument();
		expect(await screen.findByTestId('incoming-related-links-list-item-0')).toBeInTheDocument();
		expect(await screen.findByTestId('incoming-related-links-list-item-1')).toBeInTheDocument();

		const outgoingLinks = await screen.findByTestId('outgoing-related-links-list');
		expect(outgoingLinks).toBeInTheDocument();
		expect(await screen.findByTestId('outgoing-related-links-list-item-0')).toBeInTheDocument();
		expect(await screen.findByTestId('outgoing-related-links-list-item-1')).toBeInTheDocument();

		expect(mockGetIncomingOutgoingAris).toHaveBeenCalledTimes(1);
		expect(mockFetchAris).toHaveBeenCalledTimes(2);
		expect(mockHandleResolvedLinkResponse).toHaveBeenCalledTimes(4);

		await expectEventRelatedLinksSuccess(2, 2);
		await expectEventModalOpened();
	});

	it('renders related links modal with only incomingAris', async () => {
		mockFetchAris.mockReset();
		mockGetIncomingOutgoingAris.mockImplementationOnce(() =>
			Promise.resolve({
				incomingAris: [mockIncomingAri, mockIncomingAri],
				outgoingAris: [],
			}),
		);

		mockFetchAris.mockImplementationOnce(() =>
			Promise.resolve([mockSuccessResponse, mockSuccessResponse]),
		);
		mockClient = new (fakeFactory(undefined, undefined, undefined, mockFetchAris))();

		setup({ ari });

		const incomingLinksTitle = await screen.findByText('Found in');
		const outgoingLinksTitle = await screen.findByText('Includes links to');
		expect(incomingLinksTitle).toBeInTheDocument();
		expect(outgoingLinksTitle).toBeInTheDocument();

		const allLinks = await screen.findAllByRole('link');
		expect(allLinks.length).toBe(2);

		const incomingLinks = await screen.findByTestId('incoming-related-links-list');
		expect(incomingLinks).toBeInTheDocument();
		expect(await screen.findByTestId('incoming-related-links-list-item-0')).toBeInTheDocument();
		expect(await screen.findByTestId('incoming-related-links-list-item-1')).toBeInTheDocument();

		const emptyListText = await screen.findAllByText("We didn't find any links to show here.");
		expect(emptyListText.length).toBe(1);

		expect(mockGetIncomingOutgoingAris).toHaveBeenCalledTimes(1);
		expect(mockFetchAris).toHaveBeenCalledTimes(1);
		expect(mockHandleResolvedLinkResponse).toHaveBeenCalledTimes(2);

		await expectEventRelatedLinksSuccess(2, 0);
		await expectEventModalOpened();
	});

	it('renders related links modal with only outgoingAris', async () => {
		mockFetchAris.mockReset();
		mockGetIncomingOutgoingAris.mockImplementationOnce(() =>
			Promise.resolve({
				incomingAris: [],
				outgoingAris: [mockOutgoingAri],
			}),
		);

		mockFetchAris.mockImplementationOnce(() => Promise.resolve([mockSuccessResponse]));
		mockClient = new (fakeFactory(undefined, undefined, undefined, mockFetchAris))();

		setup({ ari, client: mockClient });

		const incomingLinksTitle = await screen.findByText('Found in');
		const outgoingLinksTitle = await screen.findByText('Includes links to');
		expect(incomingLinksTitle).toBeInTheDocument();
		expect(outgoingLinksTitle).toBeInTheDocument();

		const allLinks = await screen.findAllByRole('link');
		expect(allLinks.length).toBe(1);

		const outgoingLinks = await screen.findByTestId('outgoing-related-links-list');
		expect(outgoingLinks).toBeInTheDocument();
		expect(await screen.findByTestId('outgoing-related-links-list-item-0')).toBeInTheDocument();

		const emptyListText = await screen.findAllByText("We didn't find any links to show here.");
		expect(emptyListText.length).toBe(1);

		expect(mockGetIncomingOutgoingAris).toHaveBeenCalledTimes(1);
		expect(mockFetchAris).toHaveBeenCalledTimes(1);
		expect(mockHandleResolvedLinkResponse).toHaveBeenCalledTimes(1);

		await expectEventRelatedLinksSuccess(0, 1);
		await expectEventModalOpened();
	});

	it('renders related links modal renders only 5 links per list maximum even if more links are resolved', async () => {
		mockFetchAris.mockReset();
		mockGetIncomingOutgoingAris.mockImplementationOnce(() =>
			Promise.resolve({
				incomingAris: new Array(6).fill(mockIncomingAri),
				outgoingAris: new Array(10).fill(mockOutgoingAri),
			}),
		);
		mockFetchAris
			.mockImplementationOnce(() => Promise.resolve(new Array(6).fill(mockSuccessResponse)))
			.mockImplementationOnce(() => Promise.resolve(new Array(10).fill(mockSuccessResponse)));
		mockClient = new (fakeFactory(undefined, undefined, undefined, mockFetchAris))();

		setup({ ari });

		const incomingLinksTitle = await screen.findByText('Found in');
		const outgoingLinksTitle = await screen.findByText('Includes links to');

		expect(incomingLinksTitle).toBeInTheDocument();
		expect(outgoingLinksTitle).toBeInTheDocument();

		const allLinks = await screen.findAllByRole('link');
		expect(allLinks.length).toBe(10);

		const incomingLinks = await screen.findByTestId('incoming-related-links-list');
		expect(incomingLinks).toBeInTheDocument();
		expect(await screen.findByTestId('incoming-related-links-list-item-0')).toBeInTheDocument();
		expect(await screen.findByTestId('incoming-related-links-list-item-1')).toBeInTheDocument();
		expect(await screen.findByTestId('incoming-related-links-list-item-2')).toBeInTheDocument();
		expect(await screen.findByTestId('incoming-related-links-list-item-3')).toBeInTheDocument();
		expect(await screen.findByTestId('incoming-related-links-list-item-4')).toBeInTheDocument();

		const outgoingLinks = await screen.findByTestId('outgoing-related-links-list');
		expect(outgoingLinks).toBeInTheDocument();
		expect(await screen.findByTestId('outgoing-related-links-list-item-0')).toBeInTheDocument();
		expect(await screen.findByTestId('outgoing-related-links-list-item-1')).toBeInTheDocument();
		expect(await screen.findByTestId('outgoing-related-links-list-item-2')).toBeInTheDocument();
		expect(await screen.findByTestId('outgoing-related-links-list-item-3')).toBeInTheDocument();
		expect(await screen.findByTestId('outgoing-related-links-list-item-4')).toBeInTheDocument();

		expect(mockGetIncomingOutgoingAris).toHaveBeenCalledTimes(1);
		expect(mockFetchAris).toHaveBeenCalledTimes(2);
		expect(mockHandleResolvedLinkResponse).toHaveBeenCalledTimes(16);

		await expectEventRelatedLinksSuccess(6, 10);
		await expectEventModalOpened();
	});

	it('renders related links modal with unavailable view if no incoming/outgoing aris', async () => {
		mockGetIncomingOutgoingAris.mockReturnValue(
			Promise.resolve({ incomingAris: [], outgoingAris: [] }),
		);

		setup({ ari });

		const modal = await screen.findByRole('dialog');
		const modalTitle = await screen.findByText('Related links');
		const unavailableTitle = await screen.findByText("We couldn't find any related links");
		const closeButton = await screen.findByRole('button', { name: 'Close' });

		expect(modal).toBeInTheDocument();
		expect(modalTitle).toBeInTheDocument();
		expect(unavailableTitle).toBeInTheDocument();
		expect(closeButton).toBeInTheDocument();

		expect(mockGetIncomingOutgoingAris).toHaveBeenCalledTimes(1);
		expect(mockFetchAris).not.toHaveBeenCalled();
		expect(mockHandleResolvedLinkResponse).toHaveBeenCalledTimes(0);

		await expectEventRelatedLinksSuccess(0, 0);
		await expectEventModalOpened();
	});

	it('renders related links modal with unavailable view if resolve links are all errored', async () => {
		mockFetchAris.mockReset();
		mockGetIncomingOutgoingAris.mockImplementationOnce(() =>
			Promise.resolve({
				incomingAris: [mockIncomingAri, mockIncomingAri],
				outgoingAris: [mockOutgoingAri, mockOutgoingAri],
			}),
		);
		mockFetchAris
			.mockImplementationOnce(() => Promise.resolve([mockErrorResponse, mockErrorResponse]))
			.mockImplementationOnce(() => Promise.resolve([mockErrorResponse, mockErrorResponse]));
		mockClient = new (fakeFactory(undefined, undefined, undefined, mockFetchAris))();

		setup({ ari });

		const allLinks = screen.queryAllByRole('link');
		expect(allLinks.length).toBe(0);

		const unavailableTitle = await screen.findByText("We couldn't find any related links");
		expect(unavailableTitle).toBeInTheDocument();

		expect(mockGetIncomingOutgoingAris).toHaveBeenCalledTimes(1);
		expect(mockFetchAris).toHaveBeenCalledTimes(2);
		expect(mockHandleResolvedLinkResponse).not.toHaveBeenCalled();

		await expectEventRelatedLinksSuccess(0, 0);
		await expectEventModalOpened();
	});

	it('renders related links modal with Error View if no ari is supplied', async () => {
		setup({ ari: '' });

		const modal = await screen.findByRole('dialog');
		const modalTitle = await screen.findByText('Related links');
		const errorTitle = await screen.findByText("We're having trouble loading related links");
		const closeButton = await screen.findByRole('button', { name: 'Close' });

		expect(modal).toBeInTheDocument();
		expect(modalTitle).toBeInTheDocument();
		expect(errorTitle).toBeInTheDocument();
		expect(closeButton).toBeInTheDocument();

		expect(mockGetIncomingOutgoingAris).not.toHaveBeenCalled();
		expect(mockFetchAris).not.toHaveBeenCalled();
		expect(mockHandleResolvedLinkResponse).not.toHaveBeenCalled();

		await expectEventRelatedLinksFailed('ARI empty');
		await expectEventModalOpened();
	});

	it('renders related links modal with Error View if AGS call fails', async () => {
		mockGetIncomingOutgoingAris.mockReturnValue(Promise.reject('Error: Failed AGS call'));

		setup({ ari });

		const modal = await screen.findByRole('dialog');
		const modalTitle = await screen.findByText('Related links');
		const errorTitle = await screen.findByText("We're having trouble loading related links");
		const closeButton = await screen.findByRole('button', { name: 'Close' });

		expect(modal).toBeInTheDocument();
		expect(modalTitle).toBeInTheDocument();
		expect(errorTitle).toBeInTheDocument();
		expect(closeButton).toBeInTheDocument();

		expect(mockGetIncomingOutgoingAris).toHaveBeenCalledTimes(1);
		expect(mockHandleResolvedLinkResponse).not.toHaveBeenCalled();
		expect(mockFetchAris).not.toHaveBeenCalled();

		await expectEventRelatedLinksFailed('Failed to fetch related links');
		await expectEventModalOpened();
	});

	it('renders related links modal with Error View if resolve ari batch fails', async () => {
		mockFetchAris.mockReset();
		mockGetIncomingOutgoingAris.mockImplementationOnce(() =>
			Promise.resolve({
				incomingAris: [mockIncomingAri, mockIncomingAri],
				outgoingAris: [mockOutgoingAri, mockOutgoingAri],
			}),
		);
		mockFetchAris
			.mockImplementationOnce(() => Promise.reject(new Error('Error: Failed resolve ari batch')))
			.mockImplementationOnce(() => Promise.reject(new Error('Error: Failed resolve ari batch')));
		mockClient = new (fakeFactory(undefined, undefined, undefined, mockFetchAris))();

		setup({ ari });

		const modal = await screen.findByRole('dialog');
		const modalTitle = await screen.findByText('Related links');
		const errorTitle = await screen.findByText("We're having trouble loading related links");
		const closeButton = await screen.findByRole('button', { name: 'Close' });

		expect(modal).toBeInTheDocument();
		expect(modalTitle).toBeInTheDocument();
		expect(errorTitle).toBeInTheDocument();
		expect(closeButton).toBeInTheDocument();

		expect(mockGetIncomingOutgoingAris).toHaveBeenCalledTimes(1);
		expect(mockFetchAris).toHaveBeenCalledTimes(2);
		expect(mockHandleResolvedLinkResponse).toHaveBeenCalledTimes(0);

		await expectEventRelatedLinksFailed('Failed to fetch related links');
		await expectEventModalOpened();
	});

	it('renders related links modal with only one list if one resolve ari batch fails', async () => {
		mockFetchAris.mockReset();
		mockGetIncomingOutgoingAris.mockImplementationOnce(() =>
			Promise.resolve({
				incomingAris: [mockIncomingAri, mockIncomingAri],
				outgoingAris: [mockOutgoingAri, mockOutgoingAri],
			}),
		);
		mockFetchAris
			.mockImplementationOnce(() => Promise.resolve([mockSuccessResponse, mockSuccessResponse]))
			.mockImplementationOnce(() => Promise.reject('Error resolve ari batch'));
		mockClient = new (fakeFactory(undefined, undefined, undefined, mockFetchAris))();

		setup({ ari });

		const incomingLinksTitle = await screen.findByText('Found in');
		const outgoingLinksTitle = await screen.findByText('Includes links to');

		expect(incomingLinksTitle).toBeInTheDocument();
		expect(outgoingLinksTitle).toBeInTheDocument();

		const allLinks = await screen.findAllByRole('link');
		expect(allLinks.length).toBe(2);

		const incomingLinks = await screen.findByTestId('incoming-related-links-list');
		expect(incomingLinks).toBeInTheDocument();
		expect(await screen.findByTestId('incoming-related-links-list-item-0')).toBeInTheDocument();
		expect(await screen.findByTestId('incoming-related-links-list-item-1')).toBeInTheDocument();

		const emptyListText = await screen.findAllByText("We didn't find any links to show here.");
		expect(emptyListText.length).toBe(1);

		expect(mockGetIncomingOutgoingAris).toHaveBeenCalledTimes(1);
		expect(mockFetchAris).toHaveBeenCalledTimes(2);
		expect(mockHandleResolvedLinkResponse).toHaveBeenCalledTimes(2);

		await expectEventRelatedLinksSuccess(2, 0);
		await expectEventModalOpened();
	});

	it('renders related links modal loading state', async () => {
		setup({ ari });
		const resolvingView = screen.getByTestId('related-links-resolving-view');
		expect(resolvingView).toBeInTheDocument();
		await waitForElementToBeRemoved(resolvingView);
		await expectEventModalOpened();
	});

	it('uses the base url to make calls to get relationships', async () => {
		setup({ baseUriWithNoTrailingSlash: 'custom-base-url', ari });
		expect(await screen.findByRole('dialog')).toBeInTheDocument();

		expect(useIncomingOutgoingAri).toHaveBeenCalledWith('custom-base-url');
		await expectEventModalOpened();
	});

	it('Fires modal closed event on close', async () => {
		// Explicitly need to set time using jest.useFakeTimers
		// because Date.now is mocked to always return 1502841600000
		// see platform/build/configs/jest-config/setup/setup-dates.js

		// also needed to provider advanceTimers
		// because the test will hang  otherwise
		jest.useFakeTimers({ now: new Date(2024, 7, 22), advanceTimers: 5 });
		setup({ ari });

		await expectEventModalOpened();

		const closeButton = await screen.findByRole('button', { name: 'Close' });
		onEvent.mockClear();
		expect(closeButton).toBeInTheDocument();
		await userEvent.click(closeButton);
		await waitFor(() =>
			expect(onEvent).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'closed',
					actionSubject: 'modal',
					eventType: 'ui',
					actionSubjectId: 'relatedLinks',
				},
			}),
		);
		// greater than 5 because advanceTimers is set to 5 above
		// so assuming it will take atleast 1 timer
		//also [0][0] because we cleared the mock above and expect just one event to reducy flakyness
		expect(onEvent.mock.calls[0][0].payload.attributes.dwellTime).toBeGreaterThan(5);
		jest.useRealTimers();
	});
	it('should capture and report a11y violations', async () => {
		const { container } = setup({ ari });
		await expect(container).toBeAccessible();
	});
});
