import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import AIStateIndicator from '../ai-state-indicator';
import { type AIStateIndicatorProps } from '../ai-state-indicator/types';
import { CONTENT_URL_AI_TROUBLESHOOTING } from '../../../../../../constants';

describe('AIStateIndicator', () => {
	const testId = 'indicator-test';

	const setup = (props?: AIStateIndicatorProps) =>
		render(
			<IntlProvider locale="en">
				<AIStateIndicator state="ready" testId={testId} {...props} />
			</IntlProvider>,
		);

	describe('ready state', () => {
		it('does not render', () => {
			const { container } = setup();
			expect(container.firstChild).toBeNull();
		});
	});

	describe('loading state', () => {
		const state = 'loading';

		it('renders default appearance by default', async () => {
			const { findByTestId } = setup({ state });
			const icon = await findByTestId(`${testId}-loading-icon`);
			const msg = await findByTestId(`${testId}-loading-message`);

			expect(icon).toBeInTheDocument();
			expect(msg).toBeInTheDocument();
		});

		it('renders default appearance', async () => {
			const { findByTestId } = setup({ state, appearance: 'default' });
			const icon = await findByTestId(`${testId}-loading-icon`);
			const msg = await findByTestId(`${testId}-loading-message`);

			expect(icon).toBeInTheDocument();
			expect(msg).toBeInTheDocument();
			expect(msg.textContent).toBe('Atlassian Intelligence is working...');
		});

		it('does not render icon-only appearance', async () => {
			const { container } = setup({
				state,
				appearance: 'icon-only',
			});
			expect(container.firstChild).toBeNull();
		});
	});

	describe('done', () => {
		const state = 'done';

		it('renders default appearance by default', async () => {
			const { findByTestId } = setup({ state });
			const icon = await findByTestId(`${testId}-done-icon`);
			const msg = await findByTestId(`${testId}-done-message`);

			expect(icon).toBeInTheDocument();
			expect(msg).toBeInTheDocument();
		});

		describe('renders default appearance', () => {
			ffTest(
				'platform.linking-platform.smart-card.hover-card-ai-summaries-release-stable',
				async () => {
					const user = userEvent.setup();
					const { findByRole, findByTestId, queryByTestId } = setup({
						state,
						appearance: 'default',
					});
					const icon = await findByTestId(`${testId}-done-icon`);
					const msg = await findByTestId(`${testId}-done-message`);
					const beta = queryByTestId(`${testId}-beta`);
					const tooltipTrigger = await findByTestId(`${testId}-done-info`);

					expect(icon).toBeInTheDocument();
					expect(msg).toBeInTheDocument();
					expect(msg.textContent).toBe('Summarized by Atlassian Intelligence');
					expect(beta).not.toBeInTheDocument();
					expect(tooltipTrigger).toBeInTheDocument();

					await user.hover(tooltipTrigger);

					const tooltip = await findByRole('tooltip');
					const tooltipContent = await within(tooltip).findByTestId(`${testId}-done-tooltip`);
					expect(tooltipContent).toBeInTheDocument();
				},
				async () => {
					const user = userEvent.setup();
					const { findByRole, findByTestId } = setup({
						state,
						appearance: 'default',
					});
					const icon = await findByTestId(`${testId}-done-icon`);
					const msg = await findByTestId(`${testId}-done-message`);
					const beta = await findByTestId(`${testId}-beta`);
					const tooltipTrigger = await findByTestId(`${testId}-done-info`);

					expect(icon).toBeInTheDocument();
					expect(msg).toBeInTheDocument();
					expect(msg.textContent).toBe('Summarized by AI');
					expect(beta).toBeInTheDocument();
					expect(tooltipTrigger).toBeInTheDocument();

					await user.hover(tooltipTrigger);

					const tooltip = await findByRole('tooltip');
					const tooltipContent = await within(tooltip).findByTestId(`${testId}-done-tooltip`);
					expect(tooltipContent).toBeInTheDocument();
				},
			);
		});

		describe('renders icon-only appearance', () => {
			ffTest(
				'platform.linking-platform.smart-card.hover-card-ai-summaries-release-stable',
				async () => {
					const user = userEvent.setup();
					const { findByRole, findByTestId, queryByTestId } = setup({
						state,
						appearance: 'icon-only',
					});
					const icon = await findByTestId(`${testId}-done-icon`);
					const msg = queryByTestId(`${testId}-done-message`);
					const tooltipTrigger = icon.closest('div');

					expect(icon).toBeInTheDocument();
					expect(msg).not.toBeInTheDocument();

					expect(tooltipTrigger).toBeInTheDocument();

					if (tooltipTrigger) {
						await user.hover(tooltipTrigger);
					}

					const tooltip = await findByRole('tooltip');
					const tooltipMsg = await within(tooltip).findByTestId(`${testId}-done-message`);
					const beta = within(tooltip).queryByTestId(`${testId}-beta`);

					expect(tooltipMsg.textContent).toBe('Summarized by Atlassian Intelligence');
					expect(beta).not.toBeInTheDocument();
				},
				async () => {
					const user = userEvent.setup();
					const { findByRole, findByTestId, queryByTestId } = setup({
						state,
						appearance: 'icon-only',
					});
					const icon = await findByTestId(`${testId}-done-icon`);
					const msg = queryByTestId(`${testId}-done-message`);
					const tooltipTrigger = icon.closest('div');

					expect(icon).toBeInTheDocument();
					expect(msg).not.toBeInTheDocument();
					expect(queryByTestId(`${testId}-beta`)).not.toBeInTheDocument();
					expect(tooltipTrigger).toBeInTheDocument();

					if (tooltipTrigger) {
						await user.hover(tooltipTrigger);
					}

					const tooltip = await findByRole('tooltip');
					const tooltipMsg = await within(tooltip).findByTestId(`${testId}-done-message`);
					const beta = await within(tooltip).findByTestId(`${testId}-beta`);

					expect(tooltipMsg.textContent).toBe('Summarized by AI');
					expect(beta).toBeInTheDocument();
				},
			);
		});
	});

	describe('error state', () => {
		const state = 'error';

		it('renders default appearance by default', async () => {
			const { findByTestId } = setup({ state });
			const icon = await findByTestId(`${testId}-error-icon`);
			const msg = await findByTestId(`${testId}-error-message`);

			expect(icon).toBeInTheDocument();
			expect(msg).toBeInTheDocument();
		});

		it('renders default appearance', async () => {
			const { findByRole, findByTestId } = setup({
				state,
				appearance: 'default',
			});
			const icon = await findByTestId(`${testId}-error-icon`);
			const msg = await findByTestId(`${testId}-error-message`);
			const anchor = await findByRole('link');

			expect(icon).toBeInTheDocument();
			expect(msg).toBeInTheDocument();
			expect(msg.textContent).toBe(
				'Atlassian Intelligence (AI) isn’t responding. Try again later or check the status of AI.',
			);
			expect(anchor).toHaveAttribute('href', CONTENT_URL_AI_TROUBLESHOOTING);
		});

		it('does not render icon-only appearance', async () => {
			const { container } = setup({
				state,
				appearance: 'icon-only',
			});
			expect(container.firstChild).toBeNull();
		});
	});
});
