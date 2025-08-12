import React from 'react';

import { screen } from '@testing-library/react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { renderWithIntl } from '@atlaskit/link-test-helpers';

import { EmbedCardResolvedView, type EmbedCardResolvedViewProps } from './ResolvedView';

const mockAppearanceTestId = 'mocked-appearance-test-id';
jest.mock('../components/ImageIcon', () => ({
	...jest.requireActual('../components/ImageIcon'),
	ImageIcon: jest.fn((props) => {
		const Component = jest.requireActual('../components/ImageIcon').ImageIcon;
		return (
			<>
				<div data-testid={mockAppearanceTestId}>{props.appearance || 'no-appearance'}</div>
				<Component {...props} />
			</>
		);
	}),
}));

const setup = (extraProps?: Partial<EmbedCardResolvedViewProps>) => {
	return renderWithIntl(
		<SmartCardProvider>
			<EmbedCardResolvedView
				link="http://atlassian.com"
				context={{ icon: 'icon-url', text: 'abc' }}
				{...extraProps}
			/>
		</SmartCardProvider>,
	);
};

describe('EmbedCardResolvedView', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = setup();
		await expect(container).toBeAccessible();
	});

	it('should render square icon', () => {
		setup();

		expect(screen.getByTestId(mockAppearanceTestId)).toHaveTextContent('square');
	});

	it('should render round icon', () => {
		setup({ type: ['Document', 'Profile'] });

		expect(screen.getByTestId(mockAppearanceTestId)).toHaveTextContent('round');
	});
});
