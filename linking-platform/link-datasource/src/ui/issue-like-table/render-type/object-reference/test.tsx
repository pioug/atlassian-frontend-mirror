import React from 'react';

import { IntlProvider } from 'react-intl';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers/intersection-observer';
import { useSmartLinkDestinationUrl } from '@atlaskit/smart-card/hook/use-smart-link-destination-url';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import SmartLinkCustomClient from '../../../../../examples-helpers/smartLinkCustomClient';
import ObjectReference, { OBJECT_REFERENCE_TYPE_TEST_ID } from './index';

jest.mock('@atlaskit/smart-card/hook/use-smart-link-destination-url', () => ({
	useSmartLinkDestinationUrl: jest.fn((url: string) => url),
}));

const mockUseSmartLinkDestinationUrl = useSmartLinkDestinationUrl as jest.MockedFunction<
	typeof useSmartLinkDestinationUrl
>;

mockSimpleIntersectionObserver(); // required to mock smart link internals

describe('ObjectReference Type', () => {
	const smartLinkCustomClient = new SmartLinkCustomClient();
	const url = 'https://product-fabric.atlassian.net/browse/EDM-5941';
	const text = 'Design System Team';

	const setup = (props: Partial<React.ComponentProps<typeof ObjectReference>> = {}) =>
		render(
			<IntlProvider locale="en">
				<SmartCardProvider client={smartLinkCustomClient}>
					<ObjectReference url={url} text={text} {...props} />
				</SmartCardProvider>
			</IntlProvider>,
		);

	beforeEach(() => {
		mockUseSmartLinkDestinationUrl.mockClear();
		mockUseSmartLinkDestinationUrl.mockImplementation((inputUrl: string) => inputUrl);
	});

	it('renders empty dom when url is undefined', () => {
		const { container } = setup({ url: undefined });
		expect(container).toBeEmptyDOMElement();
	});

	it('renders an avatar tag linking to the url with the provided text', () => {
		setup();

		expect(screen.getByTestId(OBJECT_REFERENCE_TYPE_TEST_ID)).toBeInTheDocument();

		const anchor = screen.getByRole('link');
		expect(anchor).toHaveTextContent(text);
		expect(anchor).toHaveAttribute('href', url);
		expect(anchor).toHaveAttribute('target', '_blank');
		expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('uses the provided testId for the tag, link and avatar', () => {
		setup({ testId: 'custom-test-id' });

		expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
		expect(screen.getByTestId('custom-test-id--link')).toBeInTheDocument();
		expect(screen.getByTestId('custom-test-id--avatar--image')).toBeInTheDocument();
		expect(screen.queryByTestId(OBJECT_REFERENCE_TYPE_TEST_ID)).not.toBeInTheDocument();
	});

	it('renders the avatar with the provided avatarUrl', () => {
		setup({ avatarUrl: 'https://example.com/avatar.png' });

		const image = screen.getByTestId(`${OBJECT_REFERENCE_TYPE_TEST_ID}--avatar--image`);
		expect(image).toHaveAttribute('src', 'https://example.com/avatar.png');
	});

	it('still renders an avatar when avatarUrl is not provided', () => {
		setup();

		expect(
			screen.getByTestId(`${OBJECT_REFERENCE_TYPE_TEST_ID}--avatar--image`),
		).toBeInTheDocument();
	});

	it('is not removable', () => {
		setup();

		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});

	it('wraps the tag in a smart link hover card', () => {
		setup();

		expect(screen.getByTestId('hover-card-trigger-wrapper')).toBeInTheDocument();
	});

	it('renders a hidden "opens in a new tab" hint alongside the visible text', () => {
		setup();

		const anchor = screen.getByRole('link');
		expect(anchor).toHaveTextContent(text);
		expect(anchor).toHaveTextContent('(opens in a new tab)');
	});

	describe('destination url', () => {
		it('resolves the href through useSmartLinkDestinationUrl', () => {
			setup();

			expect(mockUseSmartLinkDestinationUrl).toHaveBeenCalledWith(url);
		});

		it('uses the destination url returned by the hook as the href', () => {
			mockUseSmartLinkDestinationUrl.mockImplementation(
				(inputUrl: string) => `${inputUrl}?xpis=session-123`,
			);
			setup();

			expect(screen.getByRole('link')).toHaveAttribute('href', `${url}?xpis=session-123`);
		});
	});

	it('should capture and report a11y violations', async () => {
		const { container } = setup();
		await expect(container).toBeAccessible();
	});
});
