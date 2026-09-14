import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { useSmartLinkDestinationUrl } from '@atlaskit/smart-card/hook/use-smart-link-destination-url';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import SmartLinkCustomClient from '../../../../../examples-helpers/smartLinkCustomClient';

import Link, { LINK_TYPE_TEST_ID } from './index';

jest.mock('@atlaskit/smart-card/hook/use-smart-link-destination-url', () => ({
	useSmartLinkDestinationUrl: jest.fn((url: string) => url),
}));

const mockUseSmartLinkDestinationUrl = useSmartLinkDestinationUrl as jest.MockedFunction<
	typeof useSmartLinkDestinationUrl
>;

mockSimpleIntersectionObserver(); // required to mock smart link internals
describe('Link Type', () => {
	const smartLinkCustomClient = new SmartLinkCustomClient();
	const spyFetchData = jest.spyOn(smartLinkCustomClient, 'fetchData');
	let originalWindowOpen: typeof window.open;
	// Needed to suppress console errors in smart-card
	let consoleErrorFn: jest.SpyInstance;

	beforeEach(() => {
		consoleErrorFn = jest.spyOn(console, 'error').mockImplementation(() => jest.fn());
	});
	afterEach(() => {
		consoleErrorFn.mockRestore();
	});

	beforeAll(() => {
		originalWindowOpen = window.open;
		window.open = jest.fn();
	});

	afterAll(() => {
		window.open = originalWindowOpen;
	});

	const setup = ({ url = '', ...props }) => {
		return render(
			<IntlProvider locale="en">
				<SmartCardProvider client={smartLinkCustomClient}>
					{/* eslint-disable-next-line @atlassian/a11y/anchor-has-content -- See https://go/a11y-anchor-has-content for more details */}
					<Link url={url} {...props} />
				</SmartCardProvider>
			</IntlProvider>,
		);
	};

	it('renders empty dom when url is undefined', async () => {
		const { container } = setup({ url: undefined });
		expect(container).toBeEmptyDOMElement();
	});

	it('renders as a smart link', async () => {
		const { findByTestId } = setup({
			url: 'https://product-fabric.atlassian.net/browse/EDM-5941',
		});

		const card = await findByTestId(`${LINK_TYPE_TEST_ID}-resolved-view`);

		expect(card).toHaveAttribute('href', 'https://product-fabric.atlassian.net/browse/EDM-5941');
	});

	it('opens a smart link in a new tab when clicked', async () => {
		const { findByTestId } = setup({
			url: 'https://product-fabric.atlassian.net/browse/EDM-5941',
		});

		const card = await findByTestId(`${LINK_TYPE_TEST_ID}-resolved-view`);

		fireEvent.click(card);

		expect(window.open).toHaveBeenCalledWith(
			'https://product-fabric.atlassian.net/browse/EDM-5941',
			'_blank',
			'noopener, noreferrer',
		);
	});

	it('renders errored view when smart link does not resolve', async () => {
		const { findByTestId } = setup({
			url: 'https://link-that-does-not-resolve.com',
		});

		await waitFor(() => expect(spyFetchData).toHaveBeenCalled());

		const card = await findByTestId(`${LINK_TYPE_TEST_ID}-errored-view`);

		expect(card).toBeInTheDocument();
		expect(card).toHaveTextContent('https://link-that-does-not-resolve.com');
		expect(card).toHaveAttribute('href', 'https://link-that-does-not-resolve.com');
	});

	it('renders fallback when smart link resolves with ResolveUnsupportedError', async () => {
		const { findByRole, findByTestId } = setup({
			url: 'https://link-that-is-unsupported.com',
		});

		await waitFor(() => expect(spyFetchData).toHaveBeenCalled());

		await findByTestId('link-datasource-render-type--link');
		const anchor = await findByRole('link');

		expect(anchor).toBeInTheDocument();
		expect(anchor).toHaveTextContent('https://link-that-is-unsupported.com');
		expect(anchor).toHaveAttribute('href', 'https://link-that-is-unsupported.com');
		expect(anchor).toHaveAttribute('target', '_blank');
	});

	it('renders with the text passed and has correct attributes', async () => {
		const { queryByRole } = setup({
			url: 'https://www.atlassian.com/',
			text: 'Atlassian Website',
		});

		const anchor = queryByRole('link');

		expect(anchor).toBeInTheDocument();
		expect(anchor).toHaveTextContent('Atlassian Website');
		expect(anchor).toHaveAttribute('href', 'https://www.atlassian.com/');
		expect(anchor).toHaveAttribute('target', '_blank');
	});

	it('renders when linkType is passed', async () => {
		const { queryByRole } = setup({
			url: 'https://www.atlassian.com/',
			text: 'Atlassian Website',
			style: {
				appearance: 'key',
			},
		});

		const anchor = queryByRole('link');

		expect(anchor).toBeInTheDocument();
	});

	describe('cross-product (XPC) URL wrapping', () => {
		beforeEach(() => {
			mockUseSmartLinkDestinationUrl.mockImplementation((url: string) => `${url}?xpis=session-123`);
		});

		it('opens the wrapped URL in a new tab when the smart link is clicked', async () => {
			passGate('electric_issue_like_table_xpc_url_wrapping');
			const url = 'https://product-fabric.atlassian.net/browse/EDM-5941';
			const { queryByTestId, findByText } = setup({ url });

			await findByText('EDM-5941: Implement mapping between data type and visual component');

			const card = queryByTestId(`${LINK_TYPE_TEST_ID}-resolved-view`);
			fireEvent.click(card!);

			expect(mockUseSmartLinkDestinationUrl).toHaveBeenCalledWith(url);
			expect(window.open).toHaveBeenCalledWith(
				`${url}?xpis=session-123`,
				'_blank',
				'noopener, noreferrer',
			);
		});

		it('renders the fallback anchor with the wrapped href when text is provided', async () => {
			passGate('electric_issue_like_table_xpc_url_wrapping');
			const url = 'https://www.atlassian.com/';
			const { queryByRole } = setup({ url, text: 'Atlassian Website' });

			const anchor = queryByRole('link');

			expect(mockUseSmartLinkDestinationUrl).toHaveBeenCalledWith(url);
			expect(anchor).toHaveAttribute('href', `${url}?xpis=session-123`);
		});

		it('does not wrap the URL when the electric gate is off', async () => {
			failGate('electric_issue_like_table_xpc_url_wrapping');
			const url = 'https://www.atlassian.com/';
			const { queryByRole } = setup({ url, text: 'Atlassian Website' });

			const anchor = queryByRole('link');

			// The gate short-circuits to the raw url regardless of the hook's return.
			expect(anchor).toHaveAttribute('href', url);
		});
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<IntlProvider locale="en">
				<SmartCardProvider client={smartLinkCustomClient}>
					{/* eslint-disable-next-line @atlassian/a11y/link-name, @atlassian/a11y/anchor-has-content -- See https://go/a11y-anchor-has-content for more details */}
					<Link url={'https://www.atlassian.com/'} />
				</SmartCardProvider>
			</IntlProvider>,
		);
		await expect(container).toBeAccessible();
	});

	it('renders a hidden "opens in a new tab" hint alongside the visible text', async () => {
		const { queryByRole } = setup({
			url: 'https://www.atlassian.com/',
			text: 'ACT-4',
		});

		const anchor = queryByRole('link');

		expect(anchor).toHaveTextContent('ACT-4');
		expect(anchor).toHaveTextContent('(opens in a new tab)');
	});
});
