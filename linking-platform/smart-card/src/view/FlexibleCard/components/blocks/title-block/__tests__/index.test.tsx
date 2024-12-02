import React, { PureComponent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import type { GlyphProps } from '@atlaskit/icon/types';
import { SmartCardProvider } from '@atlaskit/link-provider';

import {
	makeCustomActionItem,
	makeDeleteActionItem,
} from '../../../../../../../examples/utils/flexible-ui';
import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import {
	ActionName,
	ElementName,
	SmartLinkSize,
	SmartLinkStatus,
	SmartLinkTheme,
} from '../../../../../../constants';
import { messages } from '../../../../../../messages';
import { FlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import { type NamedActionItem } from '../../types';
import TitleBlock from '../index';
import { type TitleBlockProps } from '../types';

class TestIcon extends PureComponent<Omit<GlyphProps, 'primaryColor' | 'secondaryColor'>> {
	render() {
		return <div data-testid={'smart-element-icon-overrideIcon'}>{'test'}</div>;
	}
}

describe('TitleBlock', () => {
	const testId = 'smart-block-title-resolved-view';
	const titleTestId = 'smart-element-link';
	const iconTestId = 'smart-element-icon';
	const regularIconTestId = 'smart-element-icon-icon';
	const overrideIconTestId = 'smart-element-icon-overrideIcon';

	const renderTitleBlock = (props?: TitleBlockProps) => {
		return render(
			<IntlProvider locale="en">
				<SmartCardProvider>
					<FlexibleUiContext.Provider value={context}>
						<TitleBlock status={SmartLinkStatus.Resolved} {...props} />
					</FlexibleUiContext.Provider>
				</SmartCardProvider>
			</IntlProvider>,
		);
	};
	let user: ReturnType<typeof userEvent.setup>;

	beforeEach(() => {
		user = userEvent.setup();
	});

	it('renders block', async () => {
		renderTitleBlock();

		const block = await screen.findByTestId(testId);

		expect(block).toBeDefined();
		expect(block.getAttribute('data-smart-block')).toBeTruthy();
	});

	it('renders its default elements', async () => {
		renderTitleBlock();

		const title = await screen.findByTestId(titleTestId);
		const icon = await screen.findByTestId(iconTestId);

		expect(title).toBeDefined();
		expect(icon).toBeDefined();
	});

	it('renders metadata', async () => {
		renderTitleBlock({
			metadata: [{ name: ElementName.CommentCount, testId: 'metadata-element' }],
		});

		const element = await screen.findByTestId('metadata-element');

		expect(element).toBeDefined();
	});

	it('renders subtitle', async () => {
		renderTitleBlock({
			subtitle: [{ name: ElementName.CommentCount, testId: 'subtitle-element' }],
		});

		const element = await screen.findByTestId('subtitle-element');

		expect(element).toBeDefined();
	});

	describe('with actions', () => {
		// Do not blindly add more actions here (like Download and Preview)
		const nonResolvedAllowedActions = [
			ActionName.EditAction,
			ActionName.DeleteAction,
			ActionName.CustomAction,
		];

		describe.each<[SmartLinkStatus, ActionName[]]>([
			[SmartLinkStatus.Resolved, Object.values(ActionName)],
			[SmartLinkStatus.Resolving, nonResolvedAllowedActions],
			[SmartLinkStatus.Forbidden, nonResolvedAllowedActions],
			[SmartLinkStatus.Errored, nonResolvedAllowedActions],
			[SmartLinkStatus.NotFound, nonResolvedAllowedActions],
			[SmartLinkStatus.Unauthorized, nonResolvedAllowedActions],
			[SmartLinkStatus.Fallback, nonResolvedAllowedActions],
		])('Case: %s', (status, allowedActionNames) => {
			it.each<ActionName>(allowedActionNames)(
				`should render %s action in ${status} view`,
				async (allowedActionName) => {
					const testId = 'smart-element-test';

					const action =
						allowedActionName === ActionName.CustomAction
							? makeCustomActionItem({
									testId: `${testId}-1`,
								})
							: {
									name: allowedActionName,
									testId: `${testId}-1`,
									onClick: () => {},
								};

					renderTitleBlock({
						status,
						actions: [action],
					});

					const element = await screen.findByTestId(`smart-element-test-1`);
					expect(element).toBeDefined();
				},
			);
		});

		// Uncomment and implement when new actions (like Download and preview) are added
		// it('should not render ___ action in non resolved view ___', () => {});

		it('should render only one action when on hover only activated', async () => {
			const testId = 'smart-element-test';
			renderTitleBlock({
				actions: [
					makeDeleteActionItem({ testId: `${testId}-1` }),
					makeCustomActionItem({ testId: `${testId}-2` }),
				],
				showActionOnHover: true,
			});

			const moreButton = await screen.findByTestId('action-group-more-button');
			expect(moreButton).toBeDefined();

			expect(screen.queryByTestId(`smart-element-test-1`)).toBeNull();
			expect(screen.queryByTestId(`smart-element-test-2`)).toBeNull();

			await user.click(moreButton);

			for (let i = 0; i < 2; i++) {
				const element = await screen.findByTestId(`smart-element-test-${i + 1}`);
				expect(element).toBeDefined();
			}
		});

		describe('with onActionMenuOpenChange', () => {
			const actionTestId = 'test-action';
			const onActionMenuOpenChange = jest.fn();

			const getAction = (props?: Partial<NamedActionItem>): NamedActionItem => ({
				name: ActionName.DeleteAction,
				onClick: () => {},
				...props,
			});

			afterEach(() => {
				onActionMenuOpenChange.mockClear();
			});

			it('calls onActionMenuOpenChange when action dropdown menu is present', async () => {
				renderTitleBlock({
					actions: [getAction(), getAction(), getAction()],
					onActionMenuOpenChange,
				});

				// Open the action dropdown menu
				const moreButton = await screen.findByTestId('action-group-more-button');
				await user.click(moreButton);
				expect(onActionMenuOpenChange).toHaveBeenCalledWith({ isOpen: true });

				// Close the action dropdown menu
				await user.click(moreButton);
				expect(onActionMenuOpenChange).toHaveBeenCalledWith({ isOpen: false });
			});

			it('calls onActionMenuOpenChange when action button is clicked', async () => {
				renderTitleBlock({
					actions: [getAction({ testId: actionTestId }), getAction(), getAction()],
					onActionMenuOpenChange,
				});

				// Open the action dropdown menu
				const moreButton = await screen.findByTestId('action-group-more-button');
				await user.click(moreButton);
				expect(onActionMenuOpenChange).toHaveBeenCalledWith({ isOpen: true });

				// Click on the action button outside action dropdown menu
				const action = await screen.findByTestId(actionTestId);
				await user.click(action);
				expect(onActionMenuOpenChange).toHaveBeenCalledWith({ isOpen: false });
			});

			it('calls onActionMenuOpenChange when action dropdown menu item is clicked', async () => {
				renderTitleBlock({
					actions: [getAction(), getAction(), getAction({ testId: actionTestId })],
					onActionMenuOpenChange,
				});

				// Open the action dropdown menu
				const moreButton = await screen.findByTestId('action-group-more-button');
				await user.click(moreButton);
				expect(onActionMenuOpenChange).toHaveBeenCalledWith({ isOpen: true });

				// Click on the action dropdown menu item
				const action = await screen.findByTestId(actionTestId);
				await user.click(action);
				expect(onActionMenuOpenChange).toHaveBeenCalledWith({ isOpen: false });
			});

			it('calls onActionMenuOpenChange when dropdown menu is closed', async () => {
				renderTitleBlock({
					actions: [getAction(), getAction(), getAction()],
					onActionMenuOpenChange,
				});

				// Open the action dropdown menu
				const moreButton = await screen.findByTestId('action-group-more-button');
				await user.click(moreButton);
				expect(onActionMenuOpenChange).toHaveBeenCalledWith({ isOpen: true });

				// Click on the action button outside action dropdown menu
				const title = await screen.findByTestId(titleTestId);
				await user.click(title);
				expect(onActionMenuOpenChange).toHaveBeenCalledWith({ isOpen: false });
			});

			it('does not call onActionMenuOpenChange when there is no dropdown menu', async () => {
				const onActionMenuOpenChange = jest.fn();
				renderTitleBlock({
					actions: [getAction({ testId: actionTestId })],
					onActionMenuOpenChange,
				});

				const action = await screen.findByTestId(actionTestId);
				await user.click(action);
				expect(onActionMenuOpenChange).not.toHaveBeenCalled();
			});
		});
	});

	describe('anchor link', () => {
		it('should render', async () => {
			renderTitleBlock();

			const element = await screen.findByTestId('smart-element-link');

			expect(element).toBeDefined();
			expect(element).toHaveAttribute('target', '_blank');
		});

		it('should have default target attribute', async () => {
			renderTitleBlock();

			const element = await screen.findByTestId('smart-element-link');

			expect(element).toHaveAttribute('target', '_blank');
		});

		it('should have custom target attribute', async () => {
			renderTitleBlock({
				anchorTarget: '_top',
			});

			const element = await screen.findByTestId('smart-element-link');

			expect(element).toHaveAttribute('target', '_top');
		});
	});

	describe('Title', () => {
		it.each([
			[SmartLinkStatus.Resolved],
			[SmartLinkStatus.Resolving],
			[SmartLinkStatus.Forbidden],
			[SmartLinkStatus.Errored],
			[SmartLinkStatus.NotFound],
			[SmartLinkStatus.Unauthorized],
			[SmartLinkStatus.Fallback],
		])(
			'renders title element with parent props including text override in %s view ',
			async (status: SmartLinkStatus) => {
				renderTitleBlock({
					status,
					theme: SmartLinkTheme.Black,
					maxLines: 2,
					text: 'Spaghetti',
				});

				const element = await screen.findByTestId(titleTestId);
				expect(element).toHaveTextContent('Spaghetti');

				expect(element).toHaveStyleDeclaration('color', expect.stringContaining('#44546F'));
			},
		);
	});

	describe('status', () => {
		it.each<[SmartLinkStatus, string]>([
			[SmartLinkStatus.Resolved, 'smart-block-title-resolved-view'],
			[SmartLinkStatus.Resolving, 'smart-block-title-resolving-view'],
			[SmartLinkStatus.Forbidden, 'smart-block-title-errored-view'],
			[SmartLinkStatus.Errored, 'smart-block-title-errored-view'],
			[SmartLinkStatus.NotFound, 'smart-block-title-errored-view'],
			[SmartLinkStatus.Unauthorized, 'smart-block-title-errored-view'],
			[SmartLinkStatus.Fallback, 'smart-block-title-errored-view'],
		])('renders %s view', async (status: SmartLinkStatus, expectedTestId) => {
			renderTitleBlock({ status });

			const element = await screen.findByTestId(expectedTestId);

			expect(element).toBeDefined();
		});

		it('renders formatted message', async () => {
			renderTitleBlock({
				status: SmartLinkStatus.NotFound,
				retry: { descriptor: messages.cannot_find_link },
			});

			const message = await screen.findByTestId('smart-block-title-errored-view-message');

			expect(message).toHaveTextContent("Can't find link");
		});

		it("doesn't renders formatted message", async () => {
			renderTitleBlock({
				status: SmartLinkStatus.NotFound,
				retry: { descriptor: messages.cannot_find_link },
				hideRetry: true,
			});

			const message = screen.queryByTestId('smart-block-title-errored-view-message');

			expect(message).toBeNull();
		});
	});

	describe('Icon', () => {
		it('should show Link Icon when hideIcon is false in resolved state', async () => {
			renderTitleBlock({
				hideIcon: false,
			});

			const element = await screen.findByTestId('smart-element-icon');

			expect(element).toBeDefined();
		});

		it('should show override icon as provided to Link Icon when hideIcon is false in resolved state', async () => {
			renderTitleBlock({
				icon: <TestIcon label="test" />,
				hideIcon: false,
			});

			const element = await screen.findByTestId('smart-element-icon');
			const regularIcon = screen.queryByTestId(regularIconTestId);
			const overrideIcon = await screen.findByTestId(overrideIconTestId);

			expect(element).toBeDefined();
			expect(regularIcon).not.toBeInTheDocument();
			expect(overrideIcon).toBeTruthy();
		});

		it('should show Link Icon when hideIcon is not set in resolved state', async () => {
			renderTitleBlock();

			const element = await screen.findByTestId('smart-element-icon');

			expect(element).toBeDefined();
		});

		it('should not show Link Icon when hideIcon is true in resolved state', async () => {
			renderTitleBlock({
				hideIcon: true,
			});

			const element = screen.queryByTestId('smart-element-icon');

			expect(element).toBeNull();
		});

		it('should show Link Icon when hideIcon is false in loading state', async () => {
			renderTitleBlock({
				hideIcon: false,
				status: SmartLinkStatus.Resolving,
			});

			const element = screen.queryByTestId(`${iconTestId}-icon-loading`);

			expect(element).toBeDefined();
		});

		it('should show Link Icon when hideIcon is not set in loading state', async () => {
			renderTitleBlock({
				status: SmartLinkStatus.Resolving,
			});

			const element = screen.queryByTestId(`${iconTestId}-icon-loading`);

			expect(element).toBeDefined();
		});

		it('should not show Link Icon when hideIcon is true in loading state', async () => {
			renderTitleBlock({
				hideIcon: true,
				status: SmartLinkStatus.Resolving,
			});

			const element = screen.queryByTestId(`${iconTestId}-icon-loading`);

			expect(element).toBeNull();
		});

		it('should show Link Icon when hideIcon is false in error state', async () => {
			renderTitleBlock({
				hideIcon: false,
				status: SmartLinkStatus.Errored,
			});

			const element = screen.queryByTestId('smart-element-icon');

			expect(element).toBeDefined();
		});

		it('should show Link Icon when hideIcon is not set in error state', async () => {
			renderTitleBlock({
				status: SmartLinkStatus.Errored,
			});

			const element = screen.queryByTestId('smart-element-icon');

			expect(element).toBeDefined();
		});

		it('should not show Link Icon when hideIcon is true in error state', async () => {
			renderTitleBlock({
				hideIcon: true,
				status: SmartLinkStatus.Errored,
			});

			const element = screen.queryByTestId('smart-element-icon');

			expect(element).toBeNull();
		});
	});

	describe('renders with tooltip on title', () => {
		beforeEach(() => {
			jest.useFakeTimers({ legacyFakeTimers: true });
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		it('shows tooltip on hover by default', async () => {
			renderTitleBlock();

			const element = await screen.findByTestId(titleTestId);
			fireEvent.mouseOver(element);
			jest.runAllTimers();
			const tooltip = await screen.findByTestId(`${titleTestId}-tooltip`);

			expect(tooltip).toBeInTheDocument();
			expect(tooltip.textContent).toBe(context.title);
		});

		it('shows tooltip on hover when hideTitleTooltip is false', async () => {
			renderTitleBlock({ hideTitleTooltip: false });

			const element = await screen.findByTestId(titleTestId);
			fireEvent.mouseOver(element);
			jest.runAllTimers();
			const tooltip = await screen.findByTestId(`${titleTestId}-tooltip`);

			expect(tooltip).toBeInTheDocument();
			expect(tooltip.textContent).toBe(context.title);
		});

		it('does not show tooltip on hover when hideTitleTooltip is true', async () => {
			renderTitleBlock({
				hideTitleTooltip: true,
			});

			const element = await screen.findByTestId(titleTestId);
			fireEvent.mouseOver(element);
			jest.runAllTimers();
			const tooltip = screen.queryByTestId(`${titleTestId}-tooltip`);

			expect(tooltip).not.toBeInTheDocument();
		});
	});

	describe('with css override', () => {
		it.each<[SmartLinkStatus, string]>([
			[SmartLinkStatus.Errored, 'errored-view'],
			[SmartLinkStatus.Fallback, 'errored-view'],
			[SmartLinkStatus.Forbidden, 'errored-view'],
			[SmartLinkStatus.NotFound, 'errored-view'],
			[SmartLinkStatus.Pending, 'resolving-view'],
			[SmartLinkStatus.Resolved, 'resolved-view'],
			[SmartLinkStatus.Resolving, 'resolving-view'],
			[SmartLinkStatus.Unauthorized, 'errored-view'],
		])(
			'renders %s view with override value',
			async (status: SmartLinkStatus, viewTestId: string) => {
				const overrideCss = css({
					backgroundColor: 'blue',
				});
				renderTitleBlock({
					overrideCss,
					status,
					testId: 'css',
				});

				const block = await screen.findByTestId(`css-${viewTestId}`);

				expect(block).toHaveStyleDeclaration('background-color', 'blue');
			},
		);
	});

	describe('with loading skeleton', () => {
		it.each<[SmartLinkSize, string]>([
			[SmartLinkSize.XLarge, '2rem'],
			[SmartLinkSize.Large, '1.5rem'],
			[SmartLinkSize.Medium, '1rem'],
			[SmartLinkSize.Small, '.75rem'],
		])('renders by size %s', async (size: SmartLinkSize, dimension: string) => {
			renderTitleBlock({
				size,
				status: SmartLinkStatus.Resolving,
			});

			const icon = await screen.findByTestId('smart-block-title-icon');
			const loadingSkeleton = await screen.findByTestId('smart-block-title-icon-loading');

			expect(icon).toHaveStyleDeclaration('width', dimension);
			expect(icon).toHaveStyleDeclaration('height', dimension);
			expect(loadingSkeleton).toBeDefined();
		});
	});
});
