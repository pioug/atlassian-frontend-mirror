import '@atlaskit/link-test-helpers/jest';

import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { cardState, url } from '@atlaskit/media-test-helpers/smart-card-state';

import { Client, Provider } from '../../index';
import { CardSSR, type CardSSRProps } from '../../ssr';
import { ANALYTICS_CHANNEL, context } from '../../utils/analytics';
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
		const spy = jest.fn();
		const storeOptions: any = {
			initialState: {
				[url]: cardState,
			},
		};
		render(
			<AnalyticsListener channel={ANALYTICS_CHANNEL} onEvent={spy}>
				<Provider storeOptions={storeOptions} client={new Client('stg')}>
					<CardSSR {...cardProps} {...props} />
				</Provider>
			</AnalyticsListener>,
		);

		return {
			spy,
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
			const { spy } = setup();

			await screen.findByTestId('inline-card-resolved-view');

			expect(spy).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'renderSuccess',
					actionSubject: 'smartLink',
				},
				context: [context],
			});
		});

		it('should fire link clicked event with attributes from SmartLinkAnalyticsContext', async () => {
			const { spy } = setup({ id: 'some-id' });

			const resolvedCard = await screen.findByTestId('inline-card-resolved-view');

			fireEvent.click(resolvedCard);

			expect(spy).toBeFiredWithAnalyticEventOnce(
				{
					payload: {
						action: 'clicked',
						actionSubject: 'link',
					},
					context: [
						{
							componentName: 'smart-cards',
						},
						{
							attributes: {
								display: 'inline',
								id: 'some-id',
							},
						},
						{
							attributes: {
								status: 'resolved',
							},
						},
					],
				},
				ANALYTICS_CHANNEL,
			);
		});
	});
});
