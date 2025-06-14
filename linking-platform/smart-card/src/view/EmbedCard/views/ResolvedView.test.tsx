import React from 'react';

import { screen } from '@testing-library/react';

import { renderWithIntl } from '@atlaskit/link-test-helpers';
import { fg } from '@atlaskit/platform-feature-flags';
import { ffTest } from '@atlassian/feature-flags-test-utils';

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
		<EmbedCardResolvedView
			link="http://atlassian.com"
			context={{ icon: 'icon-url', text: 'abc' }}
			{...extraProps}
		/>,
	);
};

describe('EmbedCardResolvedView', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = setup();
		await expect(container).toBeAccessible();
	});

	ffTest.both('platform-linking-visual-refresh-v2', '', () => {
		it('should render square icon', () => {
			setup();

			expect(screen.getByTestId(mockAppearanceTestId)).toHaveTextContent(
				fg('platform-linking-visual-refresh-v2') ? 'square' : 'no-appearance',
			);
		});

		it('should render round icon', () => {
			setup({ type: ['Document', 'Profile'] });

			expect(screen.getByTestId(mockAppearanceTestId)).toHaveTextContent(
				fg('platform-linking-visual-refresh-v2') ? 'round' : 'no-appearance',
			);
		});
	});
});
