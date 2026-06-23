import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import OpenMediaViewerButton from '../openMediaViewerButton';

const mockRef = React.createRef<HTMLButtonElement>();

const renderButton = (props = {}) =>
	render(
		<IntlProvider locale="en">
			<OpenMediaViewerButton fileName="photo.jpg" innerRef={mockRef} {...props} />
		</IntlProvider>,
	);

describe('OpenMediaViewerButton', () => {
	describe('gate: create_modernization_ga_fixes_drop_2', () => {
		ffTest.off('create_modernization_ga_fixes_drop_2', 'gate OFF — no aria-label injected', () => {
			it('should not set an aria-label attribute on the button', () => {
				renderButton();
				const button = screen.getByRole('button');
				expect(button).not.toHaveAttribute('aria-label');
			});

			it('should render the button text content with the file name', () => {
				renderButton();
				const button = screen.getByRole('button');
				expect(button).toHaveTextContent('Open photo.jpg');
			});

			it('should not override an aria-label passed via props', () => {
				renderButton({ 'aria-label': 'custom label' });
				const button = screen.getByRole('button');
				expect(button).toHaveAttribute('aria-label', 'custom label');
			});
		});

		ffTest.on('create_modernization_ga_fixes_drop_2', 'gate ON — aria-label injected', () => {
			it('should set aria-label to "Open {fileName} in fullscreen"', () => {
				renderButton();
				const button = screen.getByRole('button');
				expect(button).toHaveAttribute('aria-label', 'Open photo.jpg in fullscreen');
			});

			it('should override any aria-label passed via props with the gate-controlled label', () => {
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
	});
});
