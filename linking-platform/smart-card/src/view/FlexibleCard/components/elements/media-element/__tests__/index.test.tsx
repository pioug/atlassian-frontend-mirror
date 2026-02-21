/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { MediaType } from '../../../../../../constants';
import MediaElement from '../index';

jest.mock('react-render-image', () => ({ src, errored, onError }: any) => {
	switch (src) {
		case 'src-error':
			if (onError) {
				onError();
			}
			return errored;
		case 'src-loaded':
		default:
			return <img data-testid="smart-element-media-image" src="src-loaded" alt="" />;
	}
});

describe('Element: Media', () => {
	const testId = 'smart-element-media';

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<IntlProvider locale={'en'}>
				<MediaElement type={MediaType.Image} url="src-loaded" />
			</IntlProvider>,
		);

		await expect(container).toBeAccessible();
	});

	it('renders element', async () => {
		render(
			<IntlProvider locale={'en'}>
				<MediaElement type={MediaType.Image} url="src-loaded" />
			</IntlProvider>,
		);

		const element = await screen.findByTestId(testId);
		const image = await screen.findByTestId(`${testId}-image`);

		expect(element).toBeTruthy();
		expect(element.getAttribute('data-smart-element-media')).toBeTruthy();
		expect(image).toBeTruthy();
	});

	it('does not render element when neither type nor url is provided', async () => {
		const { container } = render(<MediaElement />);
		expect(container.children.length).toBe(0);
	});

	it('does not render element when type is not provided', async () => {
		const { container } = render(<MediaElement url="src-loaded" />);
		expect(container.children.length).toBe(0);
	});

	it('does not render element when url is not provided', async () => {
		const { container } = render(<MediaElement type={MediaType.Image} />);
		expect(container.children.length).toBe(0);
	});

	it('renders with override css', async () => {
		const overrideCss = css({
			backgroundColor: 'blue',
		});
		render(
			<IntlProvider locale={'en'}>
				<MediaElement css={overrideCss} type={MediaType.Image} url="src-loaded" />
			</IntlProvider>,
		);

		const element = await screen.findByTestId(testId);

		expect(element).toHaveCompiledCss('background-color', 'blue');
	});

	describe('Image', () => {
		it('should capture and report a11y violations', async () => {
			const { container } = render(
				<IntlProvider locale={'en'}>
					<MediaElement type={MediaType.Image} url="src-error" />
				</IntlProvider>,
			);

			await expect(container).toBeAccessible();
		});

		it('renders nothing on error', async () => {
			render(
				<IntlProvider locale={'en'}>
					<MediaElement type={MediaType.Image} url="src-error" />
				</IntlProvider>,
			);
			await screen.findByTestId(testId);

			expect(screen.queryByTestId(`${testId}-image`)).toBeNull();
		});
	});
});
