import React from 'react';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import RelatedLinksModal from '../index';
import useIncomingOutgoingAri from '../../../state/hooks/use-incoming-outgoing-links';
import { asMockFunction } from '@atlaskit/media-test-helpers';
import type { CardClient } from '@atlaskit/link-provider';
import { fakeFactory } from '../../../utils/mocks';
import SmartCardProvider from '@atlaskit/link-provider/src/provider';
import useResponse from '../../../state/hooks/use-response';
import {
	mockErrorResponse,
	mockForbiddenResponse,
	mockNotFoundResponse,
	mockSuccessResponse,
	mockUnAuthResponse,
} from './mocks';
import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';

jest.mock('../../../state/hooks/use-incoming-outgoing-links');
jest.mock('../../../state/hooks/use-response');

const mockIncomingAri: string = 'ari:cloud:incoming:1234';
const mockOutgoingAri: string = 'ari:cloud:outgoing:1234';

describe('RelatedLinksModal', () => {
	let ari: string;
	let mockClient: CardClient;
	const mockFetchAris = jest.fn();
	const mockGetIncomingOutgoingAris = jest.fn();
	const mockHandleResolvedLinkResponse = jest.fn();

	const setup = ({
		ari,
		baseUriWithNoTrailingSlash,
		client = mockClient,
	}: {
		ari: string;
		client?: CardClient;
		baseUriWithNoTrailingSlash?: string;
	}) =>
		renderWithIntl(
			<SmartCardProvider client={client}>
				<RelatedLinksModal
					ari={ari}
					onClose={() => {}}
					showModal={true}
					baseUriWithNoTrailingSlash={baseUriWithNoTrailingSlash}
				/>
			</SmartCardProvider>,
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
		const modalTitle = await screen.findByText('Recent Links');
		const incomingLinksTitle = await screen.findByText('Found In');
		const outgoingLinksTitle = await screen.findByText('Includes Links To');
		const closeButton = await screen.findByRole('button', { name: 'Close' });

		expect(modal).toBeInTheDocument();
		expect(modalTitle).toBeInTheDocument();
		expect(incomingLinksTitle).toBeInTheDocument();
		expect(outgoingLinksTitle).toBeInTheDocument();
		expect(closeButton).toBeInTheDocument();

		expect(mockGetIncomingOutgoingAris).toHaveBeenCalledTimes(1);
		expect(mockFetchAris).toHaveBeenCalledTimes(2);
		expect(mockHandleResolvedLinkResponse).toHaveBeenCalledTimes(4);
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

		const incomingLinksTitle = await screen.findByText('Found In');
		const outgoingLinksTitle = await screen.findByText('Includes Links To');
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

		const incomingLinksTitle = await screen.findByText('Found In');
		const outgoingLinksTitle = await screen.findByText('Includes Links To');
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

		const incomingLinksTitle = await screen.findByText('Found In');
		const outgoingLinksTitle = await screen.findByText('Includes Links To');
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

		const incomingLinksTitle = await screen.findByText('Found In');
		const outgoingLinksTitle = await screen.findByText('Includes Links To');

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
	});

	it('renders related links modal with unavailable view if no incoming/outgoing aris', async () => {
		mockGetIncomingOutgoingAris.mockReturnValue(
			Promise.resolve({ incomingAris: [], outgoingAris: [] }),
		);

		setup({ ari });

		const modal = await screen.findByRole('dialog');
		const modalTitle = await screen.findByText('Recent Links');
		const unavailableTitle = await screen.findByText('No recent links');
		const closeButton = await screen.findByRole('button', { name: 'Close' });

		expect(modal).toBeInTheDocument();
		expect(modalTitle).toBeInTheDocument();
		expect(unavailableTitle).toBeInTheDocument();
		expect(closeButton).toBeInTheDocument();

		expect(mockGetIncomingOutgoingAris).toHaveBeenCalledTimes(1);
		expect(mockFetchAris).not.toHaveBeenCalled();
		expect(mockHandleResolvedLinkResponse).toHaveBeenCalledTimes(0);
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

		const unavailableTitle = await screen.findByText('No recent links');
		expect(unavailableTitle).toBeInTheDocument();

		expect(mockGetIncomingOutgoingAris).toHaveBeenCalledTimes(1);
		expect(mockFetchAris).toHaveBeenCalledTimes(2);
		expect(mockHandleResolvedLinkResponse).not.toHaveBeenCalled();
	});

	it('renders related links modal with Error View if no ari is supplied', async () => {
		setup({ ari: '' });

		const modal = await screen.findByRole('dialog');
		const modalTitle = await screen.findByText('Recent Links');
		const errorTitle = await screen.findByText('Something went wrong');
		const closeButton = await screen.findByRole('button', { name: 'Close' });

		expect(modal).toBeInTheDocument();
		expect(modalTitle).toBeInTheDocument();
		expect(errorTitle).toBeInTheDocument();
		expect(closeButton).toBeInTheDocument();

		expect(mockGetIncomingOutgoingAris).not.toHaveBeenCalled();
		expect(mockFetchAris).not.toHaveBeenCalled();
		expect(mockHandleResolvedLinkResponse).not.toHaveBeenCalled();
	});

	it('renders related links modal with Error View if AGS call fails', async () => {
		mockGetIncomingOutgoingAris.mockReturnValue(Promise.reject('Error: Failed AGS call'));

		setup({ ari });

		const modal = await screen.findByRole('dialog');
		const modalTitle = await screen.findByText('Recent Links');
		const errorTitle = await screen.findByText('Something went wrong');
		const closeButton = await screen.findByRole('button', { name: 'Close' });

		expect(modal).toBeInTheDocument();
		expect(modalTitle).toBeInTheDocument();
		expect(errorTitle).toBeInTheDocument();
		expect(closeButton).toBeInTheDocument();

		expect(mockGetIncomingOutgoingAris).toHaveBeenCalledTimes(1);
		expect(mockHandleResolvedLinkResponse).not.toHaveBeenCalled();
		expect(mockFetchAris).not.toHaveBeenCalled();
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
		const modalTitle = await screen.findByText('Recent Links');
		const errorTitle = await screen.findByText('Something went wrong');
		const closeButton = await screen.findByRole('button', { name: 'Close' });

		expect(modal).toBeInTheDocument();
		expect(modalTitle).toBeInTheDocument();
		expect(errorTitle).toBeInTheDocument();
		expect(closeButton).toBeInTheDocument();

		expect(mockGetIncomingOutgoingAris).toHaveBeenCalledTimes(1);
		expect(mockFetchAris).toHaveBeenCalledTimes(2);
		expect(mockHandleResolvedLinkResponse).toHaveBeenCalledTimes(0);
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

		const incomingLinksTitle = await screen.findByText('Found In');
		const outgoingLinksTitle = await screen.findByText('Includes Links To');

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
	});

	it('renders related links modal loading state', async () => {
		setup({ ari });
		const resolvingView = screen.getByTestId('related-links-resolving-view');
		expect(resolvingView).toBeInTheDocument();
		await waitForElementToBeRemoved(resolvingView);
	});

	it('uses the base url to make calls to get relationships', async () => {
		setup({ baseUriWithNoTrailingSlash: 'custom-base-url', ari });
		expect(await screen.findByRole('dialog')).toBeInTheDocument();

		expect(useIncomingOutgoingAri).toHaveBeenCalledWith('custom-base-url');
	});
});
