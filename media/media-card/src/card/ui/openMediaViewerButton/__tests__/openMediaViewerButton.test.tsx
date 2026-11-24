import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import OpenMediaViewerButton from '../openMediaViewerButton';

const mockRef = React.createRef<HTMLButtonElement>();

const renderButton = (props = {}) =>
	render(
		<IntlProvider locale="en">
			<OpenMediaViewerButton fileName="photo.jpg" innerRef={mockRef} {...props} />
		</IntlProvider>,
	);

describe('OpenMediaViewerButton', () => {
	it('should set aria-label to "Open {fileName} in fullscreen"', async () => {
		const { container } = renderButton();
		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('aria-label', 'Open photo.jpg in fullscreen');

		await expect(container).toBeAccessible();
	});

	it('should render the button text content with the file name', () => {
		renderButton();
		const button = screen.getByRole('button');
		expect(button).toHaveTextContent('Open photo.jpg');
	});

	it('should override any aria-label passed via props', () => {
		renderButton({ 'aria-label': 'should be overridden' });
		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('aria-label', 'Open photo.jpg in fullscreen');
	});

	it('should interpolate the fileName into the aria-label', () => {
		renderButton({ fileName: 'document.pdf' });
		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('aria-label', 'Open document.pdf in fullscreen');
	});
});
