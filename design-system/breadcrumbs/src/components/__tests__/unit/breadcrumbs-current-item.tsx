import React from 'react';

import { AtlassianIcon } from '@atlaskit/logo';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { act, render, screen, userEvent, within } from '@atlassian/testing-library';

import BreadcrumbsCurrentItem from '../../breadcrumbs-current-item';
import { BreadcrumbsSizeProvider } from '../../internal/breadcrumbs-size-provider';

const createUser = () => userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

ffTest.on('platform_dst_breadcrumbs-refresh', 'BreadcrumbsCurrentItem with refresh enabled', () => {
	describe('BreadcrumbsCurrentItem', () => {
		it('is accessible', async () => {
			const { container } = render(
				<nav aria-label="Breadcrumbs">
					<ol>
						<BreadcrumbsCurrentItem
							href="/current-page"
							text="Current page"
							testId="current-item"
						/>
					</ol>
				</nav>,
			);

			await expect(container).toBeAccessible();
		});

		it('renders with text', () => {
			render(
				<BreadcrumbsCurrentItem href="/current-page" text="Current page" testId="current-item" />,
			);
			expect(screen.getByTestId('current-item')).toBeInstanceOf(HTMLAnchorElement);
			expect(screen.getByText('Current page')).toBeInTheDocument();
		});

		it('renders with elemBefore', () => {
			render(
				<BreadcrumbsCurrentItem
					href="/current-page"
					text="Current page"
					elemBefore={<AtlassianIcon label="Page icon" />}
					testId="current-item"
				/>,
			);
			expect(screen.getByRole('img', { name: 'Page icon' })).toBeInTheDocument();
		});

		it('renders elemBefore outside the current item link when the refresh flag is enabled', () => {
			render(
				<BreadcrumbsCurrentItem
					href="/current-page"
					text="Current page"
					elemBefore={<AtlassianIcon label="Page icon" />}
					testId="current-item"
				/>,
			);

			const link = screen.getByTestId('current-item');
			expect(screen.getByTestId('current-item--icon-before')).toBeInTheDocument();
			expect(within(link).queryByTestId('current-item--icon-before')).not.toBeInTheDocument();
		});

		it('still renders deprecated iconBefore', () => {
			render(
				<BreadcrumbsCurrentItem
					href="/current-page"
					text="Current page"
					iconBefore={<AtlassianIcon label="Page icon" />}
					testId="current-item"
				/>,
			);

			expect(screen.getByRole('img', { name: 'Page icon' })).toBeInTheDocument();
		});

		it('renders with aria-current="page"', () => {
			render(
				<BreadcrumbsCurrentItem href="/current-page" text="Current page" testId="current-item" />,
			);
			expect(screen.getByTestId('current-item')).toHaveAttribute('aria-current', 'page');
		});

		it('renders the copy link button as a sibling of the anchor', () => {
			render(
				<BreadcrumbsCurrentItem href="/current-page" text="Current page" testId="current-item" />,
			);

			const link = screen.getByTestId('current-item');
			expect(screen.getByTestId('current-item--copy-link')).toBeInTheDocument();
			expect(within(link).queryByTestId('current-item--copy-link')).not.toBeInTheDocument();
		});

		it('does not throw when clipboard API is unavailable', async () => {
			const user = userEvent.setup();
			const clipboard = navigator.clipboard;
			const onCopyLink = jest.fn();

			Object.defineProperty(navigator, 'clipboard', {
				configurable: true,
				value: undefined,
			});

			try {
				render(
					<BreadcrumbsCurrentItem
						href="/current-page"
						text="Current page"
						testId="current-item"
						onCopyLink={onCopyLink}
					/>,
				);

				await user.click(screen.getByTestId('current-item--copy-link'));

				expect(onCopyLink).not.toHaveBeenCalled();
			} finally {
				Object.defineProperty(navigator, 'clipboard', {
					configurable: true,
					value: clipboard,
				});
			}
		});

		it('shows a tooltip when the current item is truncated', async () => {
			jest.useFakeTimers();
			const user = createUser();
			const onTooltipShown = jest.fn();
			const clientWidthSpy = jest
				.spyOn(HTMLElement.prototype, 'clientWidth', 'get')
				.mockReturnValue(200);

			try {
				render(
					<BreadcrumbsCurrentItem
						href="/current-page"
						text="Current page with a very long label"
						truncationWidth={200}
						testId="current-item"
						onTooltipShown={onTooltipShown}
					/>,
				);

				await user.hover(screen.getByTestId('current-item'));

				act(() => {
					jest.runAllTimers();
				});

				expect(onTooltipShown).toHaveBeenCalled();
			} finally {
				clientWidthSpy.mockRestore();
				jest.useRealTimers();
			}
		});
	});

	describe('BreadcrumbsCurrentItem small size icon', () => {
		it('renders elemBefore when breadcrumbs size context is small', () => {
			render(
				<BreadcrumbsSizeProvider value="small">
					<BreadcrumbsCurrentItem
						href="/current-page"
						text="Current page"
						elemBefore={<AtlassianIcon label="Page icon" />}
						testId="current-item"
					/>
				</BreadcrumbsSizeProvider>,
			);

			const icon = screen.getByRole('img', { name: 'Page icon' });
			expect(icon).toBeInTheDocument();
		});

		it('renders elemBefore when breadcrumbs size context is medium', () => {
			render(
				<BreadcrumbsSizeProvider value="medium">
					<BreadcrumbsCurrentItem
						href="/current-page"
						text="Current page"
						elemBefore={<AtlassianIcon label="Page icon" />}
						testId="current-item"
					/>
				</BreadcrumbsSizeProvider>,
			);

			const icon = screen.getByRole('img', { name: 'Page icon' });
			expect(icon).toBeInTheDocument();
		});

		it('renders without error when no elemBefore is provided in small mode', () => {
			render(
				<BreadcrumbsSizeProvider value="small">
					<BreadcrumbsCurrentItem href="/current-page" text="Current page" testId="current-item" />
				</BreadcrumbsSizeProvider>,
			);

			expect(screen.getByText('Current page')).toBeInTheDocument();
			expect(screen.queryByRole('img')).not.toBeInTheDocument();
		});

		it('does not render an icon wrapper when no elemBefore is provided', () => {
			render(
				<BreadcrumbsSizeProvider value="medium">
					<BreadcrumbsCurrentItem href="/current-page" text="Current page" testId="current-item" />
				</BreadcrumbsSizeProvider>,
			);

			expect(screen.queryByRole('img')).not.toBeInTheDocument();
			// The container span should be the only span wrapping the text
			const container = screen.getByTestId('current-item');
			expect(container).toBeInTheDocument();
		});
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.off(
	'platform_dst_breadcrumbs-refresh',
	'BreadcrumbsCurrentItem with refresh disabled',
	() => {
		it('renders the copy link button as a sibling of the anchor', () => {
			render(
				<BreadcrumbsCurrentItem href="/current-page" text="Current page" testId="current-item" />,
			);

			const link = screen.getByTestId('current-item');
			expect(screen.getByTestId('current-item--copy-link')).toBeInTheDocument();
			expect(within(link).queryByTestId('current-item--copy-link')).not.toBeInTheDocument();
		});
	},
);
