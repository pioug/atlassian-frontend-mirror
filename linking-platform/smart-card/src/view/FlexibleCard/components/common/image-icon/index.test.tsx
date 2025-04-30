import React from 'react';

import { screen } from '@testing-library/react';

import { renderWithIntl } from '@atlaskit/link-test-helpers';
import { fg } from '@atlaskit/platform-feature-flags';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { ImageIconProps } from './types';

import ImageIcon from './index';

jest.mock('react-render-image', () => ({
	...jest.requireActual('react-render-image'),
	__esModule: true,
	default: jest.fn(({ loaded }) => {
		return <>{loaded}</>;
	}),
}));

const setup = (extraProps?: Partial<ImageIconProps>) => {
	return renderWithIntl(
		<ImageIcon url="https://example.com/image.png" testId="image-test" {...extraProps} />,
	);
};

describe('ImageIcon', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = setup();
		await expect(container).toBeAccessible();
	});

	ffTest.both('platform-linking-visual-refresh-v2', '', () => {
		it('should render with round appearance', () => {
			setup({ appearance: 'round' });

			const image = screen.getByRole('presentation');
			const style = window.getComputedStyle(image);

			expect(style.borderRadius).toContain(
				fg('platform-linking-visual-refresh-v2') ? '--ds-border-radius-circle' : '',
			);
		});

		it('should not render with round appearance', () => {
			setup();

			const image = screen.getByRole('presentation');
			const style = window.getComputedStyle(image);

			expect(style.borderRadius).toBe('');
		});
	});
});
