import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import noop from '@atlaskit/ds-lib/noop';
import { Box, Text } from '@atlaskit/primitives';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import Flag from '../../flag';
import FlagGroup from '../../flag-group';
import { type FlagProps } from '../../types';

describe('Flag', () => {
	const generateFlag = (extraProps?: Partial<FlagProps>) => (
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		<Flag id="" icon={<Box />} title="Flag" {...extraProps} />
	);

	describe('description prop', () => {
		it('description element should not be rendered if description prop is empty', () => {
			render(generateFlag({ description: '', testId: 'flag-test' }));

			expect(screen.queryByTestId('flag-test-description')).not.toBeInTheDocument();
		});

		it('description element should not be rendered if description prop not passed', () => {
			render(generateFlag({ testId: 'flag-test' }));

			expect(screen.queryByTestId('flag-test-description')).not.toBeInTheDocument();
		});

		it('description prop text should be rendered to correct location', () => {
			render(generateFlag({ description: 'Oh hi!' }));

			expect(screen.getByText('Oh hi!')).toBeInTheDocument();
		});

		it('should accept JSX in description', () => {
			render(
				generateFlag({
					description: <Text testId="description-jsx">Atlassian</Text>,
					testId: 'flag-test',
				}),
			);

			expect(screen.getByTestId('description-jsx')).toBeInTheDocument();
		});
	});

	describe('appearance prop', () => {
		describe('non-bold (normal) appearance', () => {
			it('should not render dismiss icon if isDismissAllowed is false or if no onDismissed callback is provided', () => {
				render(generateFlag({ testId: 'flag-test' }));

				expect(screen.queryByTestId('flag-test-toggle')).not.toBeInTheDocument();
				expect(screen.queryByTestId('flag-test-dismiss')).not.toBeInTheDocument();
			});

			it('should render dismiss icon if first element in a FlagGroup', () => {
				render(
					<FlagGroup onDismissed={noop}>
						{generateFlag({
							testId: 'flag-test',
						})}
					</FlagGroup>,
				);
				expect(screen.getByTestId('flag-test-dismiss')).toBeInTheDocument();
			});
		});

		describe('bold appearances', () => {
			it('should set aria-expanded to false if not expanded', () => {
				render(
					generateFlag({
						appearance: 'info',
						description: 'Hello',
						testId: 'flag-test',
					}),
				);

				expect(screen.getByTestId('flag-test-toggle')).toHaveAttribute('aria-expanded', 'false');
			});

			it('should set aria-expanded to true if expanded', async () => {
				const user = userEvent.setup();

				render(
					generateFlag({
						appearance: 'info',
						description: 'Hello',
						testId: 'flag-test',
					}),
				);
				const toggleButton = screen.getByTestId('flag-test-toggle');

				await user.click(toggleButton);

				expect(screen.getByTestId('flag-test-toggle')).toHaveAttribute('aria-expanded', 'true');
			});

			it('should only render an expand button if either description or actions props are set', () => {
				const { rerender } = render(
					generateFlag({
						appearance: 'info',
						testId: 'flag-test',
					}),
				);
				expect(screen.queryByTestId('flag-test-toggle')).not.toBeInTheDocument();

				rerender(
					generateFlag({
						appearance: 'info',
						testId: 'flag-test',
						actions: [],
						description: 'Hello',
					}),
				);
				expect(screen.getByTestId('flag-test-toggle')).toBeInTheDocument();

				rerender(
					generateFlag({
						appearance: 'info',
						testId: 'flag-test',
						actions: [{ content: 'Hello', onClick: noop }],
					}),
				);
				expect(screen.getByTestId('flag-test-toggle')).toBeInTheDocument();
			});

			it('should un-expand an expanded bold flag when the description and actions props are removed', async () => {
				const user = userEvent.setup();

				const { rerender } = render(
					generateFlag({
						appearance: 'info',
						testId: 'flag-test',
						description: 'Hello',
						actions: [{ content: 'Hello', onClick: noop }],
					}),
				);

				await user.click(screen.getByTestId('flag-test-toggle'));

				expect(screen.getByTestId('flag-test-expander')).toHaveAttribute('aria-hidden', 'false');

				rerender(
					generateFlag({
						appearance: 'info',
						testId: 'flag-test',
						actions: [{ content: 'Hello', onClick: noop }],
					}),
				);

				expect(screen.getByTestId('flag-test-expander')).toHaveAttribute('aria-hidden', 'false');

				rerender(
					generateFlag({
						appearance: 'info',
						testId: 'flag-test',
						description: 'Hello',
					}),
				);

				expect(screen.getByTestId('flag-test-expander')).toHaveAttribute('aria-hidden', 'false');

				rerender(
					generateFlag({
						appearance: 'info',
						testId: 'flag-test',
					}),
				);
				expect(screen.getByTestId('flag-test-expander')).toHaveAttribute('aria-hidden', 'true');
			});
		});

		describe('flag actions', () => {
			it('onDismissed should be called with flag id as param when dismiss icon clicked', async () => {
				const user = userEvent.setup();

				const spy = jest.fn();
				render(
					<FlagGroup onDismissed={spy}>
						{generateFlag({
							id: 'a',
							testId: 'flag-test',
						})}
					</FlagGroup>,
				);

				await user.click(screen.getByTestId('flag-test-dismiss'));

				expect(spy).toHaveBeenCalledTimes(1);
				expect(spy).toHaveBeenCalledWith('a', expect.anything());
			});

			it('Dismiss button should not be rendered if isDismissAllowed is omitted', () => {
				const spy = jest.fn();
				render(
					generateFlag({
						id: 'a',
						testId: 'flag-test',
					}),
				);

				expect(screen.queryByTestId('flag-test-dismiss')).not.toBeInTheDocument();
				expect(spy).not.toHaveBeenCalled();
			});
		});
	});

	ffTest.off(
		'platform_ads_component_no_icon_spacing_support',
		'icon spacing support is disabled',
		() => {
			describe('icons', () => {
				test('do not render by default, if not provided', () => {
					render(<Flag id="" title="Flag" testId="flag-test" />);

					const iconContainer = screen.getByTestId('flag-test-icon-container');

					expect(iconContainer).toBeInTheDocument();
					expect(iconContainer).toBeEmptyDOMElement();
				});
			});
		},
	);

	ffTest.on(
		'platform_ads_component_no_icon_spacing_support',
		'icon spacing support is enabled',
		() => {
			describe('icons', () => {
				test('render by default, if not provided', () => {
					render(<Flag id="" title="Flag" testId="flag-test" />);

					const iconContainer = screen.getByTestId('flag-test-icon-container');

					expect(iconContainer).toBeInTheDocument();
					expect(iconContainer).not.toBeEmptyDOMElement();
				});
			});
		},
	);
});
