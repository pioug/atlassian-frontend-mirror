import React, { createRef, forwardRef, useLayoutEffect, type ComponentProps } from 'react';

import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import { RovoIcon } from '@atlaskit/logo/rovo/icon';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act } from '@atlassian/testing-library/act';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';
import { within } from '@atlassian/testing-library/within';

import { TopNav } from '../../../page-layout/top-nav/top-nav';
import { TopNavElementContext } from '../../../page-layout/top-nav/top-nav-element-context';
import { useMeasuredTopNavBreakpoints } from '../../../page-layout/top-nav/use-measured-top-nav-breakpoints';
import { CreateButton } from '../../create-button';
import { ResponsiveButton } from '../../responsive-button';
import { Button } from '../../themed/button';
import { HasCustomThemeContext } from '../../themed/has-custom-theme-context';
import { IconButton } from '../../themed/icon-button';

// Exercise a supplied component slot while keeping the real ADS button behavior.
const IconButtonVariant = forwardRef<HTMLButtonElement, ComponentProps<typeof IconButton>>(
	(props, ref) => (
		<IconButton
			{...props}
			ref={ref}
			data-responsive-icon-button={props.shouldShowLabel ? undefined : true}
		/>
	),
);

const originalResizeObserver = global.ResizeObserver;
const observeMock = jest.fn();
const disconnectMock = jest.fn();
const observerMock = { observe: observeMock, disconnect: disconnectMock, unobserve: jest.fn() };
let onResize: ResizeObserverCallback;

beforeEach(() => {
	observeMock.mockClear();
	disconnectMock.mockClear();
	global.ResizeObserver = jest.fn().mockImplementation((callback: ResizeObserverCallback) => {
		onResize = callback;
		return observerMock;
	});
});

afterEach(() => {
	global.ResizeObserver = originalResizeObserver;
	document.documentElement.style.fontSize = '';
	jest.restoreAllMocks();
});

function resizeTopNav(width: number) {
	act(() => {
		onResize(
			[
				{
					target: observeMock.mock.calls[0][0],
					borderBoxSize: [{ inlineSize: width, blockSize: 56 }],
					contentBoxSize: [{ inlineSize: width - 24, blockSize: 56 }],
					devicePixelContentBoxSize: [{ inlineSize: width - 24, blockSize: 56 }],
					contentRect: {
						x: 0,
						y: 0,
						top: 0,
						left: 0,
						right: width - 24,
						bottom: 56,
						width: width - 24,
						height: 56,
						toJSON: () => ({}),
					},
				},
			],
			observerMock,
		);
	});
}

describe.each([false, true])('responsive button (new TopNav theme: %s)', (isNewTopNav) => {
	beforeEach(() => {
		if (isNewTopNav) {
			passGate('platform_dst_nav4_custom_theming_fhs_1');
		} else {
			failGate('platform_dst_nav4_custom_theming_fhs_1');
		}
	});

	it.each([320, 768])('should measure the attached header on initial mount at %spx', (width) => {
		passGate('platform-dst-chat-panel-layout');
		jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
			width,
		} as DOMRect);
		setupComponent();
		const button = screen.getByRole('button', { name: 'Ask Rovo' });
		if (width < 768) {
			expect(button).toHaveAttribute('data-responsive-icon-button');
		} else {
			expect(button).not.toHaveAttribute('data-responsive-icon-button');
		}
		expect(observeMock).toHaveBeenCalledWith(screen.getByRole('banner'), { box: 'border-box' });
	});

	it.each([320, 768])(
		'should hydrate the compact server fallback at %spx without mismatches',
		async (width) => {
			passGate('platform-dst-chat-panel-layout');
			jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
				width,
			} as DOMRect);
			const errors = jest.spyOn(console, 'error').mockImplementation(() => {});
			const recoverableErrors = jest.fn();
			const element = (
				<TopNav>
					<ResponsiveButton
						iconButton={IconButtonVariant}
						icon={() => <RovoIcon label="" size="xxsmall" />}
						label="Ask Rovo"
					/>
					<CreateButton>Create</CreateButton>
				</TopNav>
			);
			const container = document.createElement('div');
			container.innerHTML = renderToString(element);
			document.body.append(container);
			const serverRovo = within(container).getByRole('button', { name: 'Ask Rovo' });
			const serverCreate = within(container).getByRole('button', { name: 'Create' });
			expect(serverRovo).toHaveAttribute('data-responsive-icon-button');
			expect(observeMock).not.toHaveBeenCalled();
			let root: ReturnType<typeof hydrateRoot> | undefined;
			try {
				await act(() => {
					root = hydrateRoot(container, element, { onRecoverableError: recoverableErrors });
				});
				const hydratedRovo = within(container).getByRole('button', { name: 'Ask Rovo' });
				const hydratedCreate = within(container).getByRole('button', { name: 'Create' });
				if (width < 768) {
					expect(hydratedRovo).toHaveAttribute('data-responsive-icon-button');
				} else {
					expect(hydratedRovo).not.toHaveAttribute('data-responsive-icon-button');
				}
				expect(hydratedRovo).toBe(serverRovo);
				expect(hydratedCreate).toBe(serverCreate);
				expect(recoverableErrors).not.toHaveBeenCalled();
				// jsdom loads the client layout-effect implementation even for renderToString.
				expect(
					errors.mock.calls.filter(
						([message]) => !String(message).includes('useLayoutEffect does nothing on the server'),
					),
				).toEqual([]);
			} finally {
				await act(() => root?.unmount());
				container.remove();
			}
		},
	);

	it.each([270, 320, 479, 480, 767])(
		'should render the supplied icon button at top-nav width %spx',
		async (width) => {
			passGate('platform-dst-chat-panel-layout');
			const { container } = setupComponent();
			resizeTopNav(width);
			expect(screen.getByRole('button', { name: 'Ask Rovo' })).toHaveAttribute(
				'data-responsive-icon-button',
			);
			expect(screen.getByRole('button', { name: 'Create' })).not.toHaveAttribute(
				'data-responsive-icon-button',
			);
			expect(screen.getAllByRole('button', { name: 'Ask Rovo' })).toHaveLength(1);
			await expect(container).toBeAccessible();
		},
	);

	it.each([false, true])(
		'should preserve focus, refs and handlers through the 48rem boundary (custom theme: %s)',
		async (hasCustomTheme) => {
			passGate('platform-dst-chat-panel-layout');
			const triggerRef = createRef<HTMLButtonElement>();
			const onClickMock = jest.fn();
			const focusRefs: Array<{ ref: HTMLButtonElement | null; target: EventTarget }> = [];
			setupComponent({
				hasCustomTheme,
				triggerRef,
				onClick: onClickMock,
				onFocus: (event) =>
					focusRefs.push({ ref: triggerRef.current, target: event.currentTarget }),
			});
			resizeTopNav(768);
			let button = screen.getByRole('button', { name: 'Ask Rovo' });
			expect(button).not.toHaveAttribute('data-responsive-icon-button');
			button.focus();
			resizeTopNav(767);
			button = screen.getByRole('button', { name: 'Ask Rovo' });
			expect(button).toHaveAttribute('data-responsive-icon-button');
			expect(button).toHaveFocus();
			expect(triggerRef.current).toBe(button);
			await userEvent.setup().click(button);
			expect(onClickMock).toHaveBeenCalledTimes(1);
			resizeTopNav(768);
			button = screen.getByRole('button', { name: 'Ask Rovo' });
			expect(button).toHaveFocus();
			expect(triggerRef.current).toBe(button);
			expect(button).not.toHaveAttribute('data-responsive-icon-button');
			expect(focusRefs).toHaveLength(1);
			for (const { ref, target } of focusRefs) {
				expect(ref).toBe(target);
			}
		},
	);

	describe.each([false, true])('default compact tooltip (custom theme: %s)', (hasCustomTheme) => {
		it.each([false, true])(
			'should preserve the focused button when tooltip disabling changes (initially disabled: %s)',
			async (initiallyDisabled) => {
				passGate('platform-dst-chat-panel-layout');
				const triggerRef = createRef<HTMLButtonElement>();
				const props = { hasCustomTheme, triggerRef, tooltip: { delay: 0 } };
				const { rerender } = setupComponent({ ...props, isTooltipDisabled: initiallyDisabled });
				resizeTopNav(320);
				const button = screen.getByRole('button', { name: 'Ask Rovo' });
				await userEvent.setup().tab();
				expect(button).toHaveFocus();

				for (const isTooltipDisabled of [!initiallyDisabled, initiallyDisabled]) {
					rerender(getComponent({ ...props, isTooltipDisabled }));
					expect(screen.getByRole('button', { name: 'Ask Rovo' })).toBe(button);
					expect(triggerRef.current).toBe(button);
					expect(button).toHaveFocus();
					await act(() => new Promise((resolve) => setTimeout(resolve, 400)));
					if (isTooltipDisabled) {
						expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
					} else {
						expect(await screen.findByRole('tooltip')).toHaveTextContent('Ask Rovo');
					}
				}
			},
		);

		it.each(['hover', 'focus'])(
			'should suppress the compact tooltip on %s when explicitly disabled',
			async (interaction) => {
				passGate('platform-dst-chat-panel-layout');
				setupComponent({ hasCustomTheme, isTooltipDisabled: true, tooltip: { delay: 0 } });
				resizeTopNav(320);
				const button = screen.getByRole('button', { name: 'Ask Rovo' });
				const user = userEvent.setup();
				if (interaction === 'hover') {
					await user.hover(button);
				} else {
					await user.tab();
					expect(button).toHaveFocus();
				}
				// Allow the tooltip's scheduled show/animation work to run before checking absence.
				await act(() => new Promise((resolve) => setTimeout(resolve, 400)));
				expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
				expect(button).not.toHaveAttribute('isTooltipDisabled');
			},
		);

		it.each(['hover', 'focus'])(
			'should reveal Ask Rovo on %s without tooltip props',
			async (interaction) => {
				passGate('platform-dst-chat-panel-layout');
				setupComponent({ hasCustomTheme });
				resizeTopNav(768);
				resizeTopNav(320);
				const button = screen.getByRole('button', { name: 'Ask Rovo' });
				expect(button).toHaveAttribute('data-responsive-icon-button');
				expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
				const user = userEvent.setup();
				if (interaction === 'hover') {
					await user.hover(button);
				} else {
					await user.tab();
					expect(button).toHaveFocus();
				}
				expect(await screen.findByRole('tooltip')).toHaveTextContent('Ask Rovo');
			},
		);
	});

	it.each([false, true])(
		'should accept tooltip configuration in JSX for the compact button (custom theme: %s)',
		async (hasCustomTheme) => {
			passGate('platform-dst-chat-panel-layout');
			render(
				<TopNav>
					<HasCustomThemeContext.Provider value={hasCustomTheme}>
						<ResponsiveButton
							iconButton={IconButtonVariant}
							icon={() => <RovoIcon label="" size="xxsmall" />}
							label="Ask Rovo"
							isTooltipDisabled={false}
							tooltip={{ content: 'Open Rovo chat', delay: 0 }}
						/>
					</HasCustomThemeContext.Provider>
				</TopNav>,
			);
			resizeTopNav(320);
			const user = userEvent.setup();
			await user.hover(screen.getByRole('button', { name: 'Ask Rovo' }));
			expect(await screen.findByRole('tooltip')).toHaveTextContent('Open Rovo chat');
			await user.unhover(screen.getByRole('button', { name: 'Ask Rovo' }));
			resizeTopNav(768);
			expect(screen.getByRole('button', { name: 'Ask Rovo' })).not.toHaveAttribute('tooltip');
		},
	);

	it.each(['rerender', 'resize'] as const)(
		'should not reclaim focus after the themed tooltip opens and the user tabs away (%s)',
		async (update) => {
			passGate('platform-dst-chat-panel-layout');
			const props = {
				hasCustomTheme: true,
				tooltip: { delay: 0 },
			} satisfies Parameters<typeof getComponent>[0];
			const { rerender } = setupComponent(props);
			resizeTopNav(320);
			const user = userEvent.setup();
			await user.tab();
			expect(screen.getByRole('button', { name: 'Ask Rovo' })).toHaveFocus();
			await screen.findByRole('tooltip');
			await user.tab();
			expect(screen.getByRole('button', { name: 'Create' })).toHaveFocus();
			if (update === 'resize') {
				resizeTopNav(768);
			} else {
				rerender(getComponent(props));
			}
			expect(screen.getByRole('button', { name: 'Create' })).toHaveFocus();
		},
	);

	it.each([false, true])(
		'should make placeholder Create responsive without losing its label, focus or ref (custom theme: %s)',
		async (hasCustomTheme) => {
			passGate('platform-dst-chat-panel-layout');
			const ref = createRef<HTMLButtonElement>();
			const onClick = jest.fn();
			const { container } = render(
				<TopNav>
					<HasCustomThemeContext.Provider value={hasCustomTheme}>
						<CreateButton ref={ref} onClick={onClick} testId="create">
							Create
						</CreateButton>
					</HasCustomThemeContext.Provider>
				</TopNav>,
			);
			resizeTopNav(768);
			const expandedButton = screen.getByRole('button', { name: 'Create' });
			expandedButton.focus();
			let compactButton: HTMLElement | undefined;
			for (const width of [320, 480, 767, 768]) {
				resizeTopNav(width);
				const button = screen.getByRole('button', { name: 'Create' });
				expect(screen.getAllByRole('button', { name: 'Create' })).toHaveLength(1);
				expect(button).toHaveFocus();
				expect(ref.current).toBe(button);
				expect(button).toHaveAttribute('data-testid', 'create');
				if (width === 320) {
					compactButton = button;
					expect(button).toBe(expandedButton);
				} else if (width < 768) {
					expect(button).toBe(compactButton);
				} else {
					expect(button).toBe(compactButton);
					expect(button).toHaveTextContent('Create');
				}
			}
			await userEvent.setup().click(screen.getByRole('button', { name: 'Create' }));
			expect(onClick).toHaveBeenCalledTimes(1);
			resizeTopNav(320);
			await expect(container).toBeAccessible();
		},
	);

	it('should keep placeholder Create unchanged when the layout gate is off', () => {
		failGate('platform-dst-chat-panel-layout');
		render(
			<TopNav>
				<CreateButton>Create</CreateButton>
			</TopNav>,
		);
		expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
		expect(global.ResizeObserver).not.toHaveBeenCalled();
	});

	it('should preserve the disabled state in both presentations', async () => {
		passGate('platform-dst-chat-panel-layout');
		const onClickMock = jest.fn();
		setupComponent({ isDisabled: true, onClick: onClickMock });
		for (const width of [320, 768]) {
			resizeTopNav(width);
			const button = screen.getByRole('button', { name: 'Ask Rovo' });
			expect(button).toBeDisabled();
			await userEvent.setup().click(button);
		}
		expect(onClickMock).not.toHaveBeenCalled();
	});

	it('should update for root font changes while the header remains 800px wide', () => {
		passGate('platform-dst-chat-panel-layout');
		document.documentElement.style.fontSize = '16px';
		const { unmount } = setupComponent();
		resizeTopNav(800);
		expect(screen.getByRole('button', { name: 'Ask Rovo' })).not.toHaveAttribute(
			'data-responsive-icon-button',
		);
		const remProbe = observeMock.mock.calls.find(
			([element]) => element !== screen.getByRole('banner'),
		)?.[0];
		expect(remProbe).toBeDefined();
		for (const fontSize of [20, 16]) {
			document.documentElement.style.fontSize = `${fontSize}px`;
			// Only the rem probe resizes: do not deliver a header resize entry.
			act(() => onResize([{ target: remProbe } as ResizeObserverEntry], observerMock));
			const button = screen.getByRole('button', { name: 'Ask Rovo' });
			if (fontSize === 20) {
				expect(button).toHaveAttribute('data-responsive-icon-button');
			} else {
				expect(button).not.toHaveAttribute('data-responsive-icon-button');
			}
		}
		unmount();
		expect(disconnectMock).toHaveBeenCalledTimes(1);
	});

	it('should honor the rem breakpoint and disconnect when unmounted', () => {
		passGate('platform-dst-chat-panel-layout');
		document.documentElement.style.fontSize = '20px';
		const { unmount } = setupComponent();
		resizeTopNav(959);
		expect(screen.getByRole('button', { name: 'Ask Rovo' })).toHaveAttribute(
			'data-responsive-icon-button',
		);
		resizeTopNav(960);
		expect(screen.getByRole('button', { name: 'Ask Rovo' })).not.toHaveAttribute(
			'data-responsive-icon-button',
		);
		expect(observeMock).toHaveBeenCalledWith(screen.getByRole('banner'), { box: 'border-box' });
		unmount();
		expect(disconnectMock).toHaveBeenCalledTimes(1);
	});

	it('should keep the text button and skip observing the container when chat panel layout is disabled', async () => {
		failGate('platform-dst-chat-panel-layout');
		const triggerRef = createRef<HTMLButtonElement>();
		const onClickMock = jest.fn();
		setupComponent({ triggerRef, onClick: onClickMock });
		const button = screen.getByRole('button', { name: 'Ask Rovo' });
		expect(button).not.toHaveAttribute('data-responsive-icon-button');
		expect(button).toHaveTextContent('Ask Rovo');
		expect(triggerRef.current).toBe(button);
		expect(global.ResizeObserver).not.toHaveBeenCalled();
		await userEvent.setup().click(button);
		expect(onClickMock).toHaveBeenCalledTimes(1);
	});
});

it('should use the text presentation outside TopNav', () => {
	setupComponent({ inTopNav: false });
	expect(screen.getByRole('button', { name: 'Ask Rovo' })).not.toHaveAttribute(
		'data-responsive-icon-button',
	);
	expect(observeMock).not.toHaveBeenCalled();
});
function getComponent({
	hasCustomTheme = false,
	triggerRef,
	inTopNav = true,
	...props
}: Partial<ComponentProps<typeof ResponsiveButton>> & {
	hasCustomTheme?: boolean;
	triggerRef?: React.Ref<HTMLButtonElement>;
	inTopNav?: boolean;
} = {}) {
	const contents = (
		<HasCustomThemeContext.Provider value={hasCustomTheme}>
			<ResponsiveButton
				iconButton={IconButtonVariant}
				icon={() => <RovoIcon label="" size="xxsmall" />}
				label="Ask Rovo"
				ref={triggerRef}
				{...props}
			/>
			<Button iconBefore={() => <RovoIcon label="" size="xxsmall" />}>Create</Button>
		</HasCustomThemeContext.Provider>
	);
	return inTopNav ? <TopNav>{contents}</TopNav> : contents;
}

it('should keep placeholder Create as text outside TopNav even with the gate on', () => {
	passGate('platform-dst-chat-panel-layout');
	render(<CreateButton>Create</CreateButton>);
	expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
	expect(observeMock).not.toHaveBeenCalled();
});

// Verify measurement runs in the layout phase, not merely by the time RTL flushes effects.
it('should measure an available container before ancestor layout effects', () => {
	const topNavElement = document.createElement('header');
	const measure = jest
		.spyOn(topNavElement, 'getBoundingClientRect')
		.mockReturnValue({ width: 320 } as DOMRect);
	let measuredDuringLayout = false;
	function LayoutProbe() {
		const breakpoints = useMeasuredTopNavBreakpoints(topNavElement, null);
		useLayoutEffect(() => {
			measuredDuringLayout = measure.mock.calls.length > 0;
		}, []);
		return (
			<TopNavElementContext.Provider value={breakpoints}>
				<ResponsiveButton
					iconButton={IconButtonVariant}
					icon={() => <RovoIcon label="" size="xxsmall" />}
					label="Ask Rovo"
				/>
			</TopNavElementContext.Provider>
		);
	}
	render(<LayoutProbe />);
	expect(measuredDuringLayout).toBe(true);
	expect(screen.getByRole('button', { name: 'Ask Rovo' })).toHaveAttribute(
		'data-responsive-icon-button',
	);
});

function setupComponent(props: Parameters<typeof getComponent>[0] = {}) {
	return render(getComponent(props));
}
