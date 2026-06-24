import React from 'react';

import __noop from '@atlaskit/ds-lib/noop';
import { AtlassianIcon } from '@atlaskit/logo';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { act, render, screen, userEvent, within } from '@atlassian/testing-library';

import BreadcrumbsItem from '../../breadcrumbs-item';
import { BreadcrumbsSizeProvider } from '../../internal/breadcrumbs-size-provider';

const TestIcon = <AtlassianIcon label="Test icon" size="small" />;
const createUser = () => userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

ffTest.on('platform_dst_breadcrumbs-refresh', 'BreadcrumbsItem with refresh enabled', () => {
	describe('BreadcrumbsItem', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		it('is accessible', async () => {
			const { container } = render(
				<nav aria-label="Breadcrumbs">
					<ol>
						<BreadcrumbsItem href="/item" text="Item" testId="item-1" />
					</ol>
				</nav>,
			);

			await expect(container).toBeAccessible();
		});

		it('renders item', async () => {
			const user = createUser();
			const onClick = jest.fn();
			render(<BreadcrumbsItem href="/item" text="Item" testId="item-1" onClick={onClick} />);

			const container = screen.getByTestId('item-1');

			expect(container).toBeInTheDocument();
			await user.click(container);

			expect(onClick).toHaveBeenCalled();
		});

		it('renders item with truncated width', () => {
			render(
				<BreadcrumbsItem
					truncationWidth={200}
					href="/item"
					elemBefore={TestIcon}
					iconAfter={TestIcon}
					testId="item-1"
					text="Long content, icons before and after"
				/>,
			);

			const item = screen.getByTestId('item-1');
			expect(item).toBeInTheDocument();

			const text = screen.getByText('Long content, icons before and after');
			expect(text).toBeInTheDocument();

			const icons = screen.getAllByLabelText('Test icon');
			expect(icons.length).toEqual(2);
		});

		it('renders elemBefore outside the breadcrumb link when the refresh flag is enabled', () => {
			render(
				<BreadcrumbsItem
					href="/item"
					elemBefore={<AtlassianIcon label="Leading icon" />}
					testId="item"
					text="Item"
				/>,
			);

			const link = screen.getByTestId('item');
			expect(screen.getByTestId('item--icon-before')).toBeInTheDocument();
			expect(within(link).queryByTestId('item--icon-before')).not.toBeInTheDocument();
		});

		it('still renders iconAfter inside the breadcrumb link when the refresh flag is enabled', () => {
			render(
				<BreadcrumbsItem
					href="/item"
					iconAfter={<span role="img" aria-label="Copy link" />}
					testId="item"
					text="Item"
				/>,
			);

			expect(
				within(screen.getByTestId('item')).getByRole('img', { name: 'Copy link' }),
			).toBeVisible();
		});

		it('still renders deprecated iconBefore', () => {
			render(<BreadcrumbsItem href="/item" text="Item" iconBefore={TestIcon} testId="item" />);

			expect(screen.getByRole('img', { name: 'Test icon' })).toBeInTheDocument();
		});

		it('should call onTooltipShown when tooltip is shown', async () => {
			const user = createUser();
			const onTooltipShown = jest.fn();
			const clientWidthSpy = jest
				.spyOn(HTMLElement.prototype, 'clientWidth', 'get')
				.mockReturnValue(200);

			try {
				render(
					<BreadcrumbsItem
						truncationWidth={200}
						href="/item"
						elemBefore={TestIcon}
						iconAfter={TestIcon}
						testId="item-1"
						text="Long content, icons before and after"
						onTooltipShown={onTooltipShown}
					/>,
				);

				const tooltipTrigger = screen.getByTestId('item-1');
				expect(tooltipTrigger).toBeInTheDocument();
				await user.hover(tooltipTrigger);

				act(() => {
					jest.runAllTimers();
				});
				expect(onTooltipShown).toHaveBeenCalled();
			} finally {
				clientWidthSpy.mockRestore();
			}
		});

		it('passes `target` to the anchor', () => {
			render(
				<BreadcrumbsItem
					truncationWidth={200}
					href="/item"
					target="_blank"
					elemBefore={TestIcon}
					iconAfter={TestIcon}
					testId="item"
					text="Long content, icons before and after"
				/>,
			);

			const item = screen.getByTestId('item');
			expect(item).toHaveAttribute('target', '_blank');
		});

		it('should render an anchor when passed a `href`', () => {
			render(<BreadcrumbsItem href="/item" testId="item" text="Some text" />);
			expect(screen.getByTestId('item')).toBeInstanceOf(HTMLAnchorElement);
		});

		it('should render an anchor when passed both a `href` and `onClick`', () => {
			render(<BreadcrumbsItem onClick={__noop} href="/item" testId="item" text="Some text" />);
			expect(screen.getByTestId('item')).toBeInstanceOf(HTMLAnchorElement);
		});

		it('should render a button when passed a `onClick` with no `href`', () => {
			render(<BreadcrumbsItem onClick={__noop} testId="item" text="Some text" />);
			expect(screen.getByTestId('item')).toBeInstanceOf(HTMLButtonElement);
		});

		it('forwards aria-label to an unnamed button breadcrumb', () => {
			render(<BreadcrumbsItem onClick={__noop} text="" aria-label="Empty Breadcrumbs item" />);
			expect(screen.getByRole('button', { name: 'Empty Breadcrumbs item' })).toBeInTheDocument();
		});
	});

	describe('BreadcrumbsItem small size icon', () => {
		it('renders elemBefore when breadcrumbs size context is small', () => {
			const iconElement = <AtlassianIcon label="Test icon" />;
			render(
				<BreadcrumbsSizeProvider value="small">
					<BreadcrumbsItem href="/item" text="Item" elemBefore={iconElement} testId="item" />
				</BreadcrumbsSizeProvider>,
			);

			const icon = screen.getByRole('img', { name: 'Test icon' });
			expect(icon).toBeInTheDocument();
		});

		it('renders elemBefore when breadcrumbs size context is medium', () => {
			const iconElement = <AtlassianIcon label="Test icon" />;
			render(
				<BreadcrumbsSizeProvider value="medium">
					<BreadcrumbsItem href="/item" text="Item" elemBefore={iconElement} testId="item" />
				</BreadcrumbsSizeProvider>,
			);

			const icon = screen.getByRole('img', { name: 'Test icon' });
			expect(icon).toBeInTheDocument();
		});

		it('renders without elemBefore when no elemBefore is provided', () => {
			render(
				<BreadcrumbsSizeProvider value="small">
					<BreadcrumbsItem href="/item" text="Item" testId="item" />
				</BreadcrumbsSizeProvider>,
			);

			expect(screen.getByTestId('item')).toBeInTheDocument();
			expect(screen.queryByRole('img')).not.toBeInTheDocument();
		});
	});
});

ffTest.off('platform_dst_breadcrumbs-refresh', 'BreadcrumbsItem with refresh disabled', () => {
	it('forwards aria-label to an unnamed button breadcrumb', () => {
		render(<BreadcrumbsItem onClick={__noop} text="" aria-label="Empty Breadcrumbs item" />);
		expect(screen.getByRole('button', { name: 'Empty Breadcrumbs item' })).toBeInTheDocument();
	});

	it('forwards custom HTML attributes to the interactive breadcrumb control', () => {
		render(
			<BreadcrumbsItem
				href="/item"
				text="Item"
				testId="item"
				{...{
					'aria-describedby': 'breadcrumb-description',
					'data-custom-attribute': 'custom value',
					id: 'breadcrumb-item',
				}}
			/>,
		);

		expect(screen.getByTestId('item')).toHaveAttribute(
			'aria-describedby',
			'breadcrumb-description',
		);
		expect(screen.getByTestId('item')).toHaveAttribute('data-custom-attribute', 'custom value');
		expect(screen.getByTestId('item')).toHaveAttribute('id', 'breadcrumb-item');
	});

	it('renders elemBefore without the refresh wrapper', () => {
		render(
			<BreadcrumbsItem
				href="/item"
				elemBefore={<AtlassianIcon label="Leading icon" />}
				testId="item"
				text="Item"
			/>,
		);

		expect(screen.queryByTestId('item--icon-before')).not.toBeInTheDocument();
		expect(
			within(screen.getByTestId('item')).getByRole('img', { name: 'Leading icon' }),
		).toBeVisible();
	});
});
