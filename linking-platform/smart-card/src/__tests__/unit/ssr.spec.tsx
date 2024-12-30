import '@atlaskit/link-test-helpers/jest';

import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { cardState, url } from '@atlaskit/media-test-helpers/smart-card-state';

import { CardSSR, type CardSSRProps } from '../../ssr';
import { CardWithUrlContent } from '../../view/CardWithUrl/component';

jest.mock('../../view/CardWithUrl/component', () => {
	const originalModule = jest.requireActual('../../view/CardWithUrl/component');
	return {
		...originalModule,
		CardWithUrlContent: jest.fn((props) => <originalModule.CardWithUrlContent {...props} />),
	};
});

describe('<CardSSR />', () => {
	const cardWithUrlContentMock = jest.mocked(CardWithUrlContent);
	const cardProps: CardSSRProps = {
		appearance: 'inline',
		url,
	};

	const setup = (props?: Partial<CardSSRProps>) => {
		const mockAnalyticsClient = {
			sendUIEvent: jest.fn().mockResolvedValue(undefined),
			sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
			sendTrackEvent: jest.fn().mockResolvedValue(undefined),
			sendScreenEvent: jest.fn().mockResolvedValue(undefined),
		} satisfies AnalyticsWebClient;

		const storeOptions: any = {
			initialState: {
				[url]: cardState,
			},
		};
		render(
			<FabricAnalyticsListeners client={mockAnalyticsClient}>
				<Provider storeOptions={storeOptions} client={new Client('stg')}>
					<CardSSR {...cardProps} {...props} />
				</Provider>
			</FabricAnalyticsListeners>,
		);

		return {
			mockAnalyticsClient,
		};
	};

	beforeEach(() => {
		jest.clearAllMocks();
		// Reset the implementation
		const originalModule = jest.requireActual('../../view/CardWithUrl/component');
		cardWithUrlContentMock.mockImplementation((props) => (
			<originalModule.CardWithUrlContent {...props} />
		));
	});

	it('should render CardWithUrlContent with provided props', async () => {
		setup();
		const resolvedCard = await screen.findByTestId('inline-card-resolved-view');
		expect(resolvedCard).toBeVisible();
		expect(resolvedCard).toHaveAttribute('href', url);
	});

	it('should render error fallback component with correct props', async () => {
		cardWithUrlContentMock.mockImplementation(() => {
			throw new Error();
		});

		setup();
		expect(await screen.findByTestId('lazy-render-placeholder')).toBeVisible();
	});

	describe('props', () => {
		it('should pass down id prop if there is one', () => {
			const id = 'abc';

			setup({
				id,
			});

			expect(cardWithUrlContentMock).toHaveBeenCalledWith(
				expect.objectContaining({ id }),
				expect.anything(),
			);
		});

		it('should provide random uuid for id prop if there is not one provided', () => {
			setup();

			expect(cardWithUrlContentMock).toHaveBeenCalledWith(
				expect.objectContaining({ id: expect.any(String) }),
				expect.anything(),
			);
		});
	});

	describe('analytics', () => {
		it('should fire analytics events', async () => {
			const { mockAnalyticsClient } = setup();

			await screen.findByTestId('inline-card-resolved-view');
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'renderSuccess',
					actionSubject: 'smartLink',
					attributes: expect.objectContaining({}),
				}),
			);
		});

		it('should fire link clicked event with attributes from SmartLinkAnalyticsContext', async () => {
			const { mockAnalyticsClient } = setup({ id: 'some-id' });

			const resolvedCard = await screen.findByTestId('inline-card-resolved-view');

			fireEvent.click(resolvedCard);
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'link',
					attributes: expect.objectContaining({
						display: 'inline',
						id: 'some-id',
						componentName: 'smart-cards',
						status: 'resolved',
					}),
				}),
			);
		});
	});
});
