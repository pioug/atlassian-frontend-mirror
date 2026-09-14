import React from 'react';

import { IntlProvider } from 'react-intl';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { ResolvedClient, ResolvedClientUrl } from '@atlaskit/link-test-helpers';
import { Box } from '@atlaskit/primitives/compiled';
import { render, screen } from '@atlassian/testing-library';

import type { CardProps } from '../../../Card';
import { CardWithUrlContent } from '../../component';
import type { CardWithUrlContentProps } from '../../types';
import CardErrorBoundary from '../index';

describe('CardErrorBoundary', () => {
	const setup = (props?: Partial<CardProps>) => {
		const onEvent = jest.fn();

		const cardProps: CardWithUrlContentProps = {
			appearance: 'inline',
			id: 'uid',
			onResolve: () => {
				throw new Error('unexpected error');
			},
			url: ResolvedClientUrl,
			...props,
		};

		const renderResult = render(
			<CardErrorBoundary {...cardProps}>
				<CardWithUrlContent {...cardProps} />
			</CardErrorBoundary>,
			{
				wrapper: ({ children }) => (
					<IntlProvider locale="en">
						<SmartCardProvider client={new ResolvedClient()}>{children}</SmartCardProvider>
					</IntlProvider>
				),
			},
		);

		return { ...renderResult, onEvent };
	};

	it('should capture and report a11y violations', async () => {
		const { container } = setup();
		await expect(container).toBeAccessible();
	});

	it('should render default fallback component', async () => {
		setup();
		const fallback = await screen.findByTestId('lazy-render-placeholder');
		expect(fallback).toBeInTheDocument();
	});

	it('should render custom fallback component', async () => {
		setup({
			fallbackComponent: () => <Box>Hello I am fallback component</Box>,
		});
		const fallback = await screen.findByText('Hello I am fallback component');
		expect(fallback).toBeInTheDocument();
	});
});
