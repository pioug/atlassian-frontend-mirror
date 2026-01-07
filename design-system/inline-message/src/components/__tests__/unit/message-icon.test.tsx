import React from 'react';

import { render, screen } from '@testing-library/react';

import { typesMapping } from '../../../constants';
import MessageIcon from '../../message-icon';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('MessageIcon component', () => {
	describe('props', () => {
		// These will be updated once we have the actual icons.
		// See https://ecosystem.atlassian.net/browse/AK-1416
		describe('type', () => {
			it('connectivity type produces connectivity icon', () => {
				render(<MessageIcon isOpen={false} appearance="connectivity" spacing="spacious" />);

				expect(screen.getByRole('presentation')).toBeInTheDocument();
				expect(screen.getByLabelText(typesMapping.connectivity.defaultLabel)).toBeInTheDocument();
			});

			it('confirmation appearance produces confirmation icon', () => {
				render(<MessageIcon isOpen={false} appearance="confirmation" spacing="spacious" />);

				expect(screen.getByRole('presentation')).toBeInTheDocument();
				expect(screen.getByLabelText(typesMapping.confirmation.defaultLabel)).toBeInTheDocument();
			});

			it('info appearance produces info icon', () => {
				render(<MessageIcon isOpen={false} appearance="info" spacing="spacious" />);

				expect(screen.getByRole('presentation')).toBeInTheDocument();
				expect(screen.getByLabelText(typesMapping.info.defaultLabel)).toBeInTheDocument();
			});

			it('warning appearance produces warning icon', () => {
				render(<MessageIcon isOpen={false} appearance="warning" spacing="spacious" />);

				expect(screen.getByRole('presentation')).toBeInTheDocument();
				expect(screen.getByLabelText(typesMapping.warning.defaultLabel)).toBeInTheDocument();
			});

			it('error appearance produces error icon', () => {
				render(<MessageIcon isOpen={false} appearance="error" spacing="spacious" />);

				expect(screen.getByRole('presentation')).toBeInTheDocument();
				expect(screen.getByLabelText(typesMapping.error.defaultLabel)).toBeInTheDocument();
			});
		});

		describe('label', () => {
			describe('default labels', () => {
				(['connectivity', 'confirmation', 'info', 'warning', 'error'] as const).forEach(
					(appearance) => {
						it(`should set defaultLabel for icon with type = ${appearance}`, () => {
							render(<MessageIcon isOpen={false} appearance={appearance} spacing="spacious" />);

							const icon = screen.getByLabelText(`${appearance} inline message`);
							expect(icon).toBeInTheDocument();
						});
					},
				);
			});

			it('should set received label as aria-label of icon', () => {
				render(
					<MessageIcon
						isOpen={false}
						appearance="connectivity"
						label="test label"
						spacing="spacious"
					/>,
				);

				const icon = screen.getByTestId('inline-message-icon');
				expect(icon).toHaveAttribute('aria-label', 'test label');
			});
		});

		describe('isOpen', () => {
			it('should apply iconColorStyles if isOpen prop is true', () => {
				const { container } = render(
					<MessageIcon appearance="info" isOpen={true} spacing="spacious" />,
				);
				// eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
				expect(container.querySelector('span')).toHaveCompiledCss(
					'color',
					'var(--icon-accent-color)',
				);
			});

			it('should not apply iconColorStyles if isOpen prop is false', () => {
				const { container } = render(
					<MessageIcon appearance="info" isOpen={false} spacing="spacious" />,
				);

				// eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
				expect(container.querySelector('span')).toHaveCompiledCss('color', 'var(--icon-color)');
			});
		});
	});
});
