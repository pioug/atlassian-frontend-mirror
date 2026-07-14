import React, { useRef } from 'react';

import { doesHydrateWithSsr, doesRenderWithSsr } from '@atlassian/ssr-tests';
import { render, screen, waitFor } from '@atlassian/testing-library';

import { createCloseEvent, Dialog } from '../../src/entry-points/dialog';
import { DialogScrollLock } from '../../src/entry-points/dialog-scroll-lock';
import {
	getFirstFocusable,
	getLastFocusable,
	getNextFocusable,
} from '../../src/entry-points/focus';
import { getAriaForTrigger } from '../../src/entry-points/get-aria-for-trigger';
import { fromLegacyPlacement } from '../../src/entry-points/placement-map';
import { createPopoverCloseEvent, Popover } from '../../src/entry-points/popover';
import { PopoverSurface } from '../../src/entry-points/popover-surface';
import { useAnchorPosition } from '../../src/entry-points/use-anchor-position';
import {
	isAtCurrentMenuLevel,
	useArrowNavigation,
} from '../../src/entry-points/use-arrow-navigation';
import { usePopoverId } from '../../src/entry-points/use-popover-id';
import { useSimpleLightDismiss } from '../../src/entry-points/use-simple-light-dismiss';

function noop() {}

describe('React 19 readiness (top-layer)', () => {
	describe('entry points', () => {
		it('maps legacy placement strings', () => {
			expect(fromLegacyPlacement({ legacy: 'bottom-start' })).toEqual({
				axis: 'block',
				edge: 'end',
				align: 'start',
			});
		});

		it('creates close events', () => {
			expect(createCloseEvent({ reason: 'escape' })).toBeInstanceOf(KeyboardEvent);
			expect(createPopoverCloseEvent({ reason: 'light-dismiss' })).toBeInstanceOf(MouseEvent);
		});

		it('returns trigger ARIA attributes', () => {
			expect(getAriaForTrigger({ role: 'menu', isOpen: true, popoverId: 'menu-id' })).toEqual({
				'aria-haspopup': 'menu',
				'aria-expanded': true,
				'aria-controls': 'menu-id',
			});
		});
	});

	describe('Popover', () => {
		it('is accessible when open', async () => {
			const { container } = render(
				<Popover isOpen={true} onClose={noop} role="dialog" label="a11y-popover">
					accessible content
				</Popover>,
			);

			await expect(container).toBeAccessible();
		});

		it('renders children only when open', () => {
			const { rerender } = render(
				<Popover isOpen={false} onClose={noop} role="dialog" label="visibility">
					<span data-testid="popover-child">visible</span>
				</Popover>,
			);

			expect(screen.queryByTestId('popover-child')).not.toBeInTheDocument();

			rerender(
				<Popover isOpen={true} onClose={noop} role="dialog" label="visibility">
					<span data-testid="popover-child">visible</span>
				</Popover>,
			);

			expect(screen.getByTestId('popover-child')).toHaveTextContent('visible');
		});

		it('renders PopoverSurface children', () => {
			render(
				<PopoverSurface>
					<span data-testid="surface-child">surface content</span>
				</PopoverSurface>,
			);

			expect(screen.getByTestId('surface-child')).toHaveTextContent('surface content');
		});

		it('renders on the server', async () => {
			await expect(
				doesRenderWithSsr(
					<Popover isOpen={false} onClose={noop} role="dialog" label="ssr-popover">
						content
					</Popover>,
				),
			).resolves.toBe(true);
		});
	});

	describe('Dialog', () => {
		it('is accessible when open', async () => {
			const { container } = render(
				<Dialog isOpen={true} onClose={noop} label="a11y-dialog">
					accessible content
				</Dialog>,
			);

			await expect(container).toBeAccessible();
		});

		it('sets ARIA attributes on dialog element', () => {
			render(
				<Dialog isOpen={true} onClose={noop} label="aria-dialog">
					content
				</Dialog>,
			);

			const dialog = screen.getByRole('dialog', { hidden: true });
			expect(dialog).toHaveAttribute('aria-label', 'aria-dialog');
			expect(dialog).toHaveAttribute('id');
		});

		it('restores body overflow when DialogScrollLock unmounts in StrictMode', () => {
			document.body.style.overflow = 'auto';

			const { unmount } = render(
				<React.StrictMode>
					<Dialog isOpen={true} onClose={noop} label="scroll-lock">
						<DialogScrollLock isOpen={true} />
						<span>locked</span>
					</Dialog>
				</React.StrictMode>,
			);

			expect(document.body).toHaveStyle({ overflow: 'hidden' });

			unmount();

			expect(document.body).toHaveStyle({ overflow: 'auto' });
		});

		it('renders on the server', async () => {
			await expect(
				doesRenderWithSsr(
					<Dialog isOpen={false} onClose={noop} label="ssr-dialog">
						content
					</Dialog>,
				),
			).resolves.toBe(true);
		});
	});

	describe('hooks and helpers', () => {
		function AnchorStrictHarness() {
			const anchorRef = useRef<HTMLButtonElement>(null);
			const popoverRef = useRef<HTMLDivElement>(null);
			useAnchorPosition({
				anchorRef,
				popoverRef,
				placement: { edge: 'end' },
				forceFallbackPositioning: true,
				isOpen: true,
			});
			return (
				<>
					<button ref={anchorRef} type="button">
						anchor
					</button>
					<div ref={popoverRef}>popover</div>
				</>
			);
		}

		function AnchorIdHarness() {
			const popoverId = usePopoverId();
			return <span data-testid="anchor-id">{popoverId}</span>;
		}

		function LightDismissHarness({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
			const popoverRef = useRef<HTMLDivElement>(null);
			useSimpleLightDismiss({ popoverRef, isOpen, onClose });
			return <div ref={popoverRef}>manual content</div>;
		}

		it('runs useAnchorPosition in StrictMode', () => {
			expect(() =>
				render(
					<React.StrictMode>
						<AnchorStrictHarness />
					</React.StrictMode>,
				),
			).not.toThrow();
		});

		it('returns a stable anchor id', () => {
			const { rerender } = render(<AnchorIdHarness />);
			const first = screen.getByTestId('anchor-id').textContent;

			rerender(<AnchorIdHarness />);

			expect(screen.getByTestId('anchor-id')).toHaveTextContent(first ?? '');
		});

		it('fires light dismiss on Escape', () => {
			const onClose = jest.fn();
			render(<LightDismissHarness isOpen={true} onClose={onClose} />);

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('finds focusable elements', () => {
			const { container } = render(
				<div>
					<button type="button">first</button>
					<button type="button">second</button>
				</div>,
			);

			const first = screen.getByRole('button', { name: 'first' });
			const second = screen.getByRole('button', { name: 'second' });
			first.focus();

			expect(getFirstFocusable({ container })).toBe(first);
			expect(getLastFocusable({ container })).toBe(second);
			expect(getNextFocusable({ container, direction: 'forwards' })).toBe(second);
		});
	});

	describe('useArrowNavigation', () => {
		function ArrowNavHarness() {
			const containerRef = useRef<HTMLDivElement>(null);
			useArrowNavigation({
				containerRef,
				onClose: noop,
				onNestedOpen: noop,
				onNestedClose: noop,
			});
			return (
				<div ref={containerRef} role="menu">
					<button type="button" role="menuitem">
						item
					</button>
				</div>
			);
		}

		it('mounts useArrowNavigation', () => {
			render(<ArrowNavHarness />);
			expect(screen.getByRole('menuitem', { name: 'item' })).toBeInTheDocument();
		});

		it('isAtCurrentMenuLevel returns true for a direct menuitem', () => {
			render(
				<div role="menu" data-testid="menu">
					<button type="button" role="menuitem">
						i
					</button>
				</div>,
			);
			const menu = screen.getByTestId('menu');
			const item = screen.getByRole('menuitem', { name: 'i' });
			expect(isAtCurrentMenuLevel(item, menu)).toBe(true);
		});

		it('passes strict mode', async () => {
			await expect(() => <ArrowNavHarness />).toPassStrictMode();
		});
	});

	describe('StrictMode: toPassStrictMode', () => {
		it('Popover passes strict mode', async () => {
			await expect(() => (
				<Popover isOpen={true} onClose={noop} role="dialog" label="strict-popover">
					inside
				</Popover>
			)).toPassStrictMode();
		});

		it('Dialog with DialogScrollLock passes strict mode', async () => {
			await expect(() => (
				<Dialog isOpen={true} onClose={noop} label="strict-dialog">
					<DialogScrollLock isOpen={true} />
					<span>x</span>
				</Dialog>
			)).toPassStrictMode();
		});

		it('useSimpleLightDismiss passes strict mode', async () => {
			function SimpleDismissStrictHarness() {
				const popoverRef = useRef<HTMLDivElement>(null);
				useSimpleLightDismiss({
					popoverRef,
					isOpen: true,
					onClose: noop,
				});
				return <div ref={popoverRef}>strict popover</div>;
			}

			await expect(() => <SimpleDismissStrictHarness />).toPassStrictMode();
		});

		it('useAnchorPosition passes strict mode', async () => {
			function AnchorStrictHarness() {
				const anchorRef = useRef<HTMLButtonElement>(null);
				const popoverRef = useRef<HTMLDivElement>(null);
				useAnchorPosition({
					anchorRef,
					popoverRef,
					placement: { edge: 'end' },
					forceFallbackPositioning: true,
					isOpen: true,
				});
				return (
					<>
						<button ref={anchorRef} type="button">
							anchor
						</button>
						<div ref={popoverRef}>popover</div>
					</>
				);
			}

			await expect(() => <AnchorStrictHarness />).toPassStrictMode();
		});
	});

	describe('Open→close→open lifecycle', () => {
		it('Popover handles open→close→open without errors', async () => {
			const onClose = jest.fn();
			const { rerender } = render(
				<Popover isOpen={true} onClose={onClose} role="dialog" label="lifecycle">
					body
				</Popover>,
			);
			expect(screen.getByRole('dialog', { name: 'lifecycle' })).toBeVisible();

			rerender(
				<Popover isOpen={false} onClose={onClose} role="dialog" label="lifecycle">
					body
				</Popover>,
			);
			// Host element unmounts when closed, so the dialog is no longer in the DOM.
			await waitFor(() =>
				expect(screen.queryByRole('dialog', { name: 'lifecycle' })).not.toBeInTheDocument(),
			);

			rerender(
				<Popover isOpen={true} onClose={onClose} role="dialog" label="lifecycle">
					body
				</Popover>,
			);
			expect(screen.getByRole('dialog', { name: 'lifecycle' })).toBeVisible();
		});

		it('Dialog handles open→close→open without errors', async () => {
			const onClose = jest.fn<void, [{ reason: 'escape' | 'overlay-click' }]>();
			const { rerender } = render(
				<Dialog isOpen={true} onClose={onClose} label="lifecycle">
					content
				</Dialog>,
			);
			expect(screen.getByRole('dialog', { hidden: true })).toBeVisible();

			rerender(
				<Dialog isOpen={false} onClose={onClose} label="lifecycle">
					content
				</Dialog>,
			);
			// Host element unmounts when closed.
			await waitFor(() =>
				expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument(),
			);

			rerender(
				<Dialog isOpen={true} onClose={onClose} label="lifecycle">
					content
				</Dialog>,
			);
			expect(screen.getByRole('dialog', { hidden: true })).toBeVisible();
		});

		it('Popover handles open→close→open under StrictMode without onClose firing', async () => {
			const onClose = jest.fn();
			const { rerender } = render(
				<React.StrictMode>
					<Popover isOpen={true} onClose={onClose} role="dialog" label="sm-lifecycle">
						body
					</Popover>
				</React.StrictMode>,
			);
			expect(screen.getByRole('dialog', { name: 'sm-lifecycle' })).toBeVisible();

			rerender(
				<React.StrictMode>
					<Popover isOpen={false} onClose={onClose} role="dialog" label="sm-lifecycle">
						body
					</Popover>
				</React.StrictMode>,
			);
			await waitFor(() =>
				expect(screen.queryByRole('dialog', { name: 'sm-lifecycle' })).not.toBeInTheDocument(),
			);

			rerender(
				<React.StrictMode>
					<Popover isOpen={true} onClose={onClose} role="dialog" label="sm-lifecycle">
						body
					</Popover>
				</React.StrictMode>,
			);
			expect(screen.getByRole('dialog', { name: 'sm-lifecycle' })).toBeVisible();
			expect(onClose).not.toHaveBeenCalled();
		});

		it('Dialog handles open→close→open under StrictMode without onClose firing', async () => {
			const onClose = jest.fn<void, [{ reason: 'escape' | 'overlay-click' }]>();
			const { rerender } = render(
				<React.StrictMode>
					<Dialog isOpen={true} onClose={onClose} label="sm-lifecycle">
						content
					</Dialog>
				</React.StrictMode>,
			);
			expect(screen.getByRole('dialog', { hidden: true })).toBeVisible();

			rerender(
				<React.StrictMode>
					<Dialog isOpen={false} onClose={onClose} label="sm-lifecycle">
						content
					</Dialog>
				</React.StrictMode>,
			);
			await waitFor(() =>
				expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument(),
			);

			rerender(
				<React.StrictMode>
					<Dialog isOpen={true} onClose={onClose} label="sm-lifecycle">
						content
					</Dialog>
				</React.StrictMode>,
			);
			expect(screen.getByRole('dialog', { hidden: true })).toBeVisible();
			expect(onClose).not.toHaveBeenCalled();
		});
	});

	describe('Ref forwarding', () => {
		it('forwards ref to Popover div element while open', () => {
			const ref = React.createRef<HTMLDivElement>();
			render(
				<Popover ref={ref} isOpen={true} onClose={noop} role="dialog" label="ref-test">
					ref body
				</Popover>,
			);
			expect(ref.current).toBeInstanceOf(HTMLDivElement);
			expect(ref.current).toHaveAttribute('role', 'dialog');
		});

		it('ref is null when Popover is closed (host element is not rendered)', () => {
			const ref = React.createRef<HTMLDivElement>();
			render(
				<Popover ref={ref} isOpen={false} onClose={noop} role="dialog" label="ref-test">
					ref body
				</Popover>,
			);
			expect(ref.current).toBeNull();
		});

		it('forwards ref to Dialog element while open', () => {
			const ref = React.createRef<HTMLDialogElement>();
			render(
				<Dialog ref={ref} isOpen={true} onClose={noop} label="ref-test">
					ref body
				</Dialog>,
			);
			expect(ref.current).toBeInstanceOf(HTMLDialogElement);
		});

		it('ref is null when Dialog is closed (host element is not rendered)', () => {
			const ref = React.createRef<HTMLDialogElement>();
			render(
				<Dialog ref={ref} isOpen={false} onClose={noop} label="ref-test">
					ref body
				</Dialog>,
			);
			expect(ref.current).toBeNull();
		});
	});

	describe('onClose correctness under StrictMode', () => {
		it('Popover onClose is not called by effect double-fire alone', () => {
			const onClose = jest.fn();
			render(
				<React.StrictMode>
					<Popover isOpen={true} onClose={onClose} role="dialog" label="no-double">
						body
					</Popover>
				</React.StrictMode>,
			);
			expect(onClose).not.toHaveBeenCalled();
		});

		it('Dialog onClose is not called by effect double-fire alone', () => {
			const onClose = jest.fn<void, [{ reason: 'escape' | 'overlay-click' }]>();
			render(
				<React.StrictMode>
					<Dialog isOpen={true} onClose={onClose} label="no-double">
						body
					</Dialog>
				</React.StrictMode>,
			);
			expect(onClose).not.toHaveBeenCalled();
		});

		it('Dialog fires onClose with reason "escape" on native cancel event', () => {
			const onClose = jest.fn<void, [{ reason: 'escape' | 'overlay-click' }]>();
			render(
				<Dialog isOpen={true} onClose={onClose} label="cancel">
					content
				</Dialog>,
			);
			const dialog = screen.getByRole('dialog', { hidden: true });
			dialog.dispatchEvent(new Event('cancel'));
			expect(onClose).toHaveBeenCalledWith({ reason: 'escape' });
		});
	});

	describe('useAnimatedVisibility StrictMode exit', () => {
		it('does not double-fire onExitFinish during non-animated close', () => {
			const onExitFinish = jest.fn();
			const onClose = jest.fn();

			const { rerender } = render(
				<React.StrictMode>
					<Popover
						isOpen={true}
						onClose={onClose}
						onExitFinish={onExitFinish}
						role="dialog"
						label="exit"
					>
						body
					</Popover>
				</React.StrictMode>,
			);

			rerender(
				<React.StrictMode>
					<Popover
						isOpen={false}
						onClose={onClose}
						onExitFinish={onExitFinish}
						role="dialog"
						label="exit"
					>
						body
					</Popover>
				</React.StrictMode>,
			);

			expect(onExitFinish).toHaveBeenCalledTimes(1);
		});
	});

	describe('Popover core behaviors', () => {
		it('is visible when open and unmounted when closed', async () => {
			const { rerender } = render(
				<Popover isOpen={true} onClose={noop} role="dialog" label="api">
					content
				</Popover>,
			);
			expect(screen.getByRole('dialog', { name: 'api' })).toBeVisible();

			rerender(
				<Popover isOpen={false} onClose={noop} role="dialog" label="api">
					content
				</Popover>,
			);
			// Host element unmounts after close so no empty role-bearing
			// element is left in the accessibility tree.
			await waitFor(() =>
				expect(screen.queryByRole('dialog', { name: 'api' })).not.toBeInTheDocument(),
			);
		});

		it('renders the popover element with the native popover attribute and id', () => {
			render(
				<Popover isOpen={true} onClose={noop} role="dialog" label="popover-attr">
					content
				</Popover>,
			);
			const popover = screen.getByRole('dialog', { name: 'popover-attr' });
			expect(popover).toHaveAttribute('popover');
			expect(popover).toHaveAttribute('id');
		});
	});

	describe('Dialog core behaviors', () => {
		it('is visible when open and unmounted when closed', async () => {
			const { rerender } = render(
				<Dialog isOpen={true} onClose={noop} label="api">
					content
				</Dialog>,
			);
			expect(screen.getByRole('dialog', { hidden: true })).toBeVisible();

			rerender(
				<Dialog isOpen={false} onClose={noop} label="api">
					content
				</Dialog>,
			);
			// Host element unmounts after close.
			await waitFor(() =>
				expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument(),
			);
		});

		it('uses the native dialog element', () => {
			render(
				<Dialog isOpen={true} onClose={noop} label="native">
					content
				</Dialog>,
			);
			const dialog = screen.getByRole('dialog', { hidden: true });
			expect(dialog).toBeInstanceOf(HTMLDialogElement);
		});
	});

	describe('DialogScrollLock core behaviors', () => {
		it('does not set overflow when Dialog is closed', () => {
			document.body.style.overflow = 'visible';
			render(
				<Dialog isOpen={false} onClose={noop} label="no-lock">
					<DialogScrollLock isOpen={false} />
					<span>not locked</span>
				</Dialog>,
			);
			expect(document.body).toHaveStyle({ overflow: 'visible' });
		});
	});

	describe('useSimpleLightDismiss core behaviors', () => {
		function LightDismissHarness({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
			const popoverRef = useRef<HTMLDivElement>(null);
			useSimpleLightDismiss({ popoverRef, isOpen, onClose });
			return (
				<div ref={popoverRef} data-testid="manual-popover">
					manual content
				</div>
			);
		}

		it('does not fire onClose on Escape when closed', () => {
			const onClose = jest.fn();
			render(<LightDismissHarness isOpen={false} onClose={onClose} />);

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
			expect(onClose).not.toHaveBeenCalled();
		});

		it('fires onClose on click outside the popover', () => {
			const onClose = jest.fn();
			render(
				<div>
					<LightDismissHarness isOpen={true} onClose={onClose} />
					<button type="button" data-testid="outside">
						outside
					</button>
				</div>,
			);

			const outside = screen.getByTestId('outside');
			outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('does not fire onClose on click inside the popover', () => {
			const onClose = jest.fn();
			render(<LightDismissHarness isOpen={true} onClose={onClose} />);

			const popover = screen.getByTestId('manual-popover');
			popover.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			expect(onClose).not.toHaveBeenCalled();
		});
	});

	describe('SSR: hydration and animation presets', () => {
		it('Popover can be hydrated', async () => {
			await expect(
				doesHydrateWithSsr(
					<Popover isOpen={false} onClose={noop} role="dialog" label="ssr-hydrate">
						body
					</Popover>,
				),
			).resolves.toBe(true);
		});

		it('Dialog can be hydrated', async () => {
			await expect(
				doesHydrateWithSsr(
					<Dialog isOpen={false} onClose={noop} label="ssr-hydrate">
						content
					</Dialog>,
				),
			).resolves.toBe(true);
		});

		it('Dialog with DialogScrollLock can be rendered on the server', async () => {
			await expect(
				doesRenderWithSsr(
					<Dialog isOpen={false} onClose={noop} label="ssr-lock">
						<DialogScrollLock isOpen={false} />
						<span>locked</span>
					</Dialog>,
				),
			).resolves.toBe(true);
		});

		it('Popover with animation preset can be rendered on the server', async () => {
			await expect(
				doesRenderWithSsr(
					<Popover isOpen={false} onClose={noop} animate role="dialog" label="ssr-anim">
						animated
					</Popover>,
				),
			).resolves.toBe(true);
		});
	});
});
