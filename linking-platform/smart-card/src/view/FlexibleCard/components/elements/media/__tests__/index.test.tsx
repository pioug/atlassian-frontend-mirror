import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { render, screen } from '@testing-library/react';

import { MediaType } from '../../../../../../constants';
import Media from '../index';

jest.mock('react-render-image', () => ({ src, errored, onError }: any) => {
	switch (src) {
		case 'src-error':
			if (onError) {
				onError();
			}
			return errored;
		case 'src-loaded':
		default:
			return <img data-testid="smart-element-media-image" src="src-loaded" />;
	}
});

describe('Element: Media', () => {
	const testId = 'smart-element-media';

	it('renders element', async () => {
		render(<Media type={MediaType.Image} url="src-loaded" />);

		const element = await screen.findByTestId(testId);
		const image = await screen.findByTestId(`${testId}-image`);

		expect(element).toBeTruthy();
		expect(element.getAttribute('data-smart-element-media')).toBeTruthy();
		expect(image).toBeTruthy();
	});

	it('does not render element when neither type nor url is provided', async () => {
		const { container } = render(<Media />);
		expect(container.children.length).toBe(0);
	});

	it('does not render element when type is not provided', async () => {
		const { container } = render(<Media url="src-loaded" />);
		expect(container.children.length).toBe(0);
	});

	it('does not render element when url is not provided', async () => {
		const { container } = render(<Media type={MediaType.Image} />);
		expect(container.children.length).toBe(0);
	});

	it('renders with override css', async () => {
		const overrideCss = css({
			backgroundColor: 'blue',
		});
		render(<Media overrideCss={overrideCss} type={MediaType.Image} url="src-loaded" />);

		const element = await screen.findByTestId(testId);

		expect(element).toHaveStyleDeclaration('background-color', 'blue');
	});

	describe('Image', () => {
		it('renders nothing on error', async () => {
			render(<Media type={MediaType.Image} url="src-error" />);
			await screen.findByTestId(testId);

			expect(screen.queryByTestId(`${testId}-image`)).toBeNull();
		});
	});
});
