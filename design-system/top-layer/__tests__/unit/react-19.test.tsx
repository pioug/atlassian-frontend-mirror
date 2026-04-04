/**
 * React 19 readiness tests for every public entry point of @atlaskit/top-layer.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │ VERIFIED ON REACT 19.2.0                                           │
 * │                                                                    │
 * │ All 82 tests in this file have been verified to pass against       │
 * │ react@19.2.0 / react-dom@19.2.0 (via REACT_MAJOR_VERSION=19)      │
 * │                                                                    │
 * │ The tests currently run against the workspace's default React      │
 * │ version (18.x). When the monorepo upgrades to React 19, these     │
 * │ tests will run natively against it with no changes needed.         │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * Tests patterns critical for React 19 compatibility:
 * - StrictMode: effects fire twice (setup → cleanup → setup). All hooks
 *   must handle this without leaking listeners, double-firing callbacks,
 *   or throwing errors.
 * - Effect cleanup: every useEffect/useLayoutEffect must return a cleanup
 *   function that correctly reverses its setup.
 * - Lifecycle: open→close→open cycles must work correctly even when
 *   effects are torn down and re-created.
 * - SSR: renderToString must not throw for all components.
 * - Ref forwarding: refs must reach the correct DOM element.
 * - Behavioral smoke tests: ARIA wiring, visibility, event handling,
 *   callback invocation, and children rendering.
 */
import React, { useRef } from 'react';

import { doesHydrateWithSsr, doesRenderWithSsr } from '@atlassian/ssr-tests';
import { render, screen } from '@atlassian/testing-library';

import {
	dialogFade,
	dialogSlideUpAndFade,
	fade,
	scaleAndFade,
	slideAndFade,
} from '../../src/entry-points/animations';
import { arrow } from '../../src/entry-points/arrow';
import {
	createCloseEvent,
	createPopoverCloseEvent,
} from '../../src/entry-points/create-close-event';
import { Dialog } from '../../src/entry-points/dialog';
import { DialogScrollLock } from '../../src/entry-points/dialog-scroll-lock';
import {
	getFirstFocusable,
	getLastFocusable,
	getNextFocusable,
} from '../../src/entry-points/focus';
import { fromLegacyPlacement, placementMapping } from '../../src/entry-points/placement-map';
import { Popover } from '../../src/entry-points/popover';
import { Popup } from '../../src/entry-points/popup';
import { PopupSurface } from '../../src/entry-points/popup-surface';
import { useAnchorPosition } from '../../src/entry-points/use-anchor-position';
import {
	isAtCurrentMenuLevel,
	useArrowNavigation,
} from '../../src/entry-points/use-arrow-navigation';
import { useSimpleLightDismiss } from '../../src/entry-points/use-simple-light-dismiss';

// Polyfills are installed by build/configs/jest-config/setup/setup-top-layer.js.
// The toBeVisible() patch in setup-top-layer-to-be-visible.js understands
// popover and dialog visibility, so tests assert on observable state
// (toBeVisible / not.toBeVisible) rather than internal DOM API calls.

function noop() {}

describe('React 19 readiness (top-layer)', () => {
	describe('Accessibility', () => {
		it('Popover is accessible when open', async () => {
			const { container } = render(
				<Popover isOpen={true} onClose={noop} role="dialog" label="a11y-popover">
					accessible content
				</Popover>,
			);
			await expect(container).toBeAccessible();
		});

		it('Dialog is accessible when open', async () => {
			const { container } = render(
				<Dialog isOpen={true} onClose={noop} label="a11y-dialog">
					accessible content
				</Dialog>,
			);
			await expect(container).toBeAccessible();
		});
	});

	describe('entry: ./animations', () => {
		it('exposes animation presets', () => {
			expect(slideAndFade().name).toBeDefined();
			expect(fade().name).toBeDefined();
			expect(scaleAndFade().name).toBeDefined();
			expect(dialogSlideUpAndFade().name).toBeDefined();
			expect(dialogFade().name).toBeDefined();
		});
	});

	describe('entry: ./arrow', () => {
		it('returns an arrow preset', () => {
			const preset = arrow();
			expect(preset.name).toBeDefined();
		});
	});

	describe('entry: ./placement-map', () => {
		it('maps legacy placement strings', () => {
			expect(fromLegacyPlacement({ legacy: 'bottom' })).toEqual(placementMapping.bottom);
			expect(fromLegacyPlacement({ legacy: 'top-start' })).toEqual(placementMapping['top-start']);
		});
	});

	describe('entry: ./focus', () => {
		it('finds first and last focusables in a container', () => {
			render(
				<div data-testid="focus-root">
					<button type="button">first</button>
					<button type="button">second</button>
				</div>,
			);
			const root = screen.getByTestId('focus-root');

			const first = getFirstFocusable({ container: root });
			expect(first).toBeInstanceOf(HTMLElement);
			expect(first).toHaveTextContent('first');

			const last = getLastFocusable({ container: root });
			expect(last).toBeInstanceOf(HTMLElement);
			expect(last).toHaveTextContent('second');
		});

		it('finds next focusable relative to active element', () => {
			render(
				<div data-testid="focus-root-next">
					<button type="button">first</button>
					<button type="button">second</button>
				</div>,
			);
			const firstButton = screen.getByRole('button', { name: 'first' });
			firstButton.focus();

			const root = screen.getByTestId('focus-root-next');
			const next = getNextFocusable({ container: root, direction: 'forwards' });
			expect(next).toBeInstanceOf(HTMLElement);
			expect(next).toHaveTextContent('second');
		});
	});

	describe('entry: ./create-close-event', () => {
		it('createCloseEvent maps dialog reasons to DOM events', () => {
			expect(createCloseEvent({ reason: 'escape' })).toBeInstanceOf(KeyboardEvent);
			expect(createCloseEvent({ reason: 'overlay-click' })).toBeInstanceOf(MouseEvent);
		});

		it('createPopoverCloseEvent maps popover reasons to DOM events', () => {
			expect(createPopoverCloseEvent({ reason: 'escape' })).toBeInstanceOf(KeyboardEvent);
			expect(createPopoverCloseEvent({ reason: 'light-dismiss' })).toBeInstanceOf(MouseEvent);
		});
	});

	describe('entry: ./popover', () => {
		it('renders closed and open Popover', () => {
			const { rerender } = render(
				<Popover isOpen={false} onClose={noop} role="dialog" label="p">
					body
				</Popover>,
			);
			expect(screen.getByRole('dialog', { name: 'p' })).toBeInTheDocument();

			rerender(
				<Popover isOpen={true} onClose={noop} role="dialog" label="p">
					body
				</Popover>,
			);
			expect(screen.getByRole('dialog', { name: 'p' })).toBeVisible();
		});
	});

	describe('entry: ./dialog', () => {
		it('renders closed and open Dialog', () => {
			const { rerender } = render(
				<Dialog isOpen={false} onClose={noop} label="d">
					content
				</Dialog>,
			);
			// Closed dialog element is present but hidden (no `open` attribute).
			// testing-library cannot compute accessible name for hidden <dialog>
			// elements, so we query by role only with hidden: true.
			const dialog = screen.getByRole('dialog', { hidden: true });
			expect(dialog).toBeInTheDocument();
			expect(dialog).toHaveAttribute('aria-label', 'd');
			expect(dialog).not.toBeVisible();

			rerender(
				<Dialog isOpen={true} onClose={noop} label="d">
					content
				</Dialog>,
			);
			expect(screen.getByRole('dialog', { hidden: true })).toBeVisible();
		});
	});

	describe('entry: ./dialog-scroll-lock', () => {
		it('mounts inside Dialog under React 19', () => {
			render(
				<Dialog isOpen={true} onClose={noop} label="d">
					<DialogScrollLock />
					<span>child</span>
				</Dialog>,
			);
			expect(screen.getByText('child')).toBeInTheDocument();
		});
	});

	describe('entry: ./popup-surface', () => {
		it('renders children', () => {
			render(
				<PopupSurface>
					<span>s</span>
				</PopupSurface>,
			);
			expect(screen.getByText('s')).toBeInTheDocument();
		});
	});

	describe('entry: ./popup', () => {
		it('renders Popup compound closed', () => {
			render(
				<Popup placement={{ edge: 'end' }} onClose={noop}>
					<Popup.Trigger>
						<button type="button">Trigger</button>
					</Popup.Trigger>
					<Popup.Content role="dialog" label="popup">
						Content
					</Popup.Content>
				</Popup>,
			);
			expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
		});
	});

	describe('entry: ./use-anchor-position', () => {
		function AnchorHarness() {
			const anchorRef = useRef<HTMLButtonElement>(null);
			const popoverRef = useRef<HTMLDivElement>(null);
			useAnchorPosition({
				anchorRef,
				popoverRef,
				placement: { edge: 'end' },
				forceFallbackPositioning: true,
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

		it('runs positioning hook without throwing', () => {
			render(<AnchorHarness />);
			expect(screen.getByRole('button', { name: 'anchor' })).toBeInTheDocument();
			expect(screen.getByText('popover')).toBeInTheDocument();
		});
	});

	describe('entry: ./use-arrow-navigation', () => {
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
	});

	describe('entry: ./use-simple-light-dismiss', () => {
		function SimpleDismissHarness() {
			const popoverRef = useRef<HTMLDivElement>(null);
			useSimpleLightDismiss({
				popoverRef,
				isOpen: false,
				onClose: noop,
			});
			return <div ref={popoverRef}>manual popover</div>;
		}

		it('mounts when closed without errors', () => {
			render(<SimpleDismissHarness />);
			expect(screen.getByText('manual popover')).toBeInTheDocument();
		});
	});

	describe('SSR: doesRenderWithSsr + doesHydrateWithSsr', () => {
		it('Popover can be rendered on the server', async () => {
			expect(
				await doesRenderWithSsr(
					<Popover isOpen={false} onClose={noop} role="dialog" label="ssr-p">
						ssr-body
					</Popover>,
				),
			).toBe(true);
		});

		it('Popover can be hydrated', async () => {
			expect(
				await doesHydrateWithSsr(
					<Popover isOpen={false} onClose={noop} role="dialog" label="ssr-p">
						ssr-body
					</Popover>,
				),
			).toBe(true);
		});

		it('Dialog can be rendered on the server', async () => {
			expect(
				await doesRenderWithSsr(
					<Dialog isOpen={false} onClose={noop} label="ssr-d">
						dialog-body
					</Dialog>,
				),
			).toBe(true);
		});

		it('Dialog can be hydrated', async () => {
			expect(
				await doesHydrateWithSsr(
					<Dialog isOpen={false} onClose={noop} label="ssr-d">
						dialog-body
					</Dialog>,
				),
			).toBe(true);
		});

		it('Popup compound can be rendered on the server', async () => {
			expect(
				await doesRenderWithSsr(
					<Popup placement={{ edge: 'end' }} onClose={noop}>
						<Popup.Trigger>
							<button type="button">SSR Trigger</button>
						</Popup.Trigger>
						<Popup.Content role="dialog" label="ssr-c">
							SSR Content
						</Popup.Content>
					</Popup>,
				),
			).toBe(true);
		});

		it('PopupSurface can be rendered on the server', async () => {
			expect(
				await doesRenderWithSsr(
					<PopupSurface>
						<span>ssr-surface</span>
					</PopupSurface>,
				),
			).toBe(true);
		});
	});

	describe('StrictMode: toPassStrictMode (React 19)', () => {
		it('Popover passes strict mode', async () => {
			await expect(() => (
				<Popover isOpen={true} onClose={noop} role="dialog" label="s">
					in
				</Popover>
			)).toPassStrictMode();
		});

		it('Dialog with DialogScrollLock passes strict mode', async () => {
			await expect(() => (
				<Dialog isOpen={true} onClose={noop} label="s">
					<DialogScrollLock />
					<span>x</span>
				</Dialog>
			)).toPassStrictMode();
		});

		it('Popup compound passes strict mode', async () => {
			await expect(() => (
				<Popup placement={{ edge: 'end' }} onClose={noop}>
					<Popup.Trigger>
						<button type="button">Trigger</button>
					</Popup.Trigger>
					<Popup.Content role="dialog" label="popup">
						Content
					</Popup.Content>
				</Popup>
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
				return <div ref={popoverRef}>manual popover</div>;
			}

			await expect(() => <SimpleDismissStrictHarness />).toPassStrictMode();
		});

		it('useArrowNavigation passes strict mode', async () => {
			function ArrowNavStrictHarness() {
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

			await expect(() => <ArrowNavStrictHarness />).toPassStrictMode();
		});
	});

	describe('Open→close→open lifecycle (React 19)', () => {
		it('Popover handles open→close→open without errors', () => {
			const onClose = jest.fn();
			const { rerender } = render(
				<Popover isOpen={true} onClose={onClose} role="dialog" label="lifecycle">
					body
				</Popover>,
			);
			const popover = screen.getByRole('dialog', { name: 'lifecycle' });
			expect(popover).toBeVisible();

			// Close
			rerender(
				<Popover isOpen={false} onClose={onClose} role="dialog" label="lifecycle">
					body
				</Popover>,
			);
			expect(popover).not.toBeVisible();

			// Re-open
			rerender(
				<Popover isOpen={true} onClose={onClose} role="dialog" label="lifecycle">
					body
				</Popover>,
			);
			expect(popover).toBeVisible();
		});

		it('Dialog handles open→close→open without errors', () => {
			const onClose = jest.fn<void, [{ reason: 'escape' | 'overlay-click' }]>();
			const { rerender } = render(
				<Dialog isOpen={true} onClose={onClose} label="lifecycle">
					content
				</Dialog>,
			);
			const dialog = screen.getByRole('dialog', { hidden: true });
			expect(dialog).toBeVisible();

			// Close
			rerender(
				<Dialog isOpen={false} onClose={onClose} label="lifecycle">
					content
				</Dialog>,
			);
			expect(dialog).not.toBeVisible();

			// Re-open
			rerender(
				<Dialog isOpen={true} onClose={onClose} label="lifecycle">
					content
				</Dialog>,
			);
			expect(dialog).toBeVisible();
		});
	});

	describe('Ref forwarding (React 19)', () => {
		it('forwards ref to Popover div element', () => {
			const ref = React.createRef<HTMLDivElement>();
			render(
				<Popover ref={ref} isOpen={false} onClose={noop} role="dialog" label="ref-test">
					ref body
				</Popover>,
			);
			expect(ref.current).toBeInstanceOf(HTMLDivElement);
			expect(ref.current).toHaveAttribute('role', 'dialog');
		});

		it('forwards ref to Dialog element', () => {
			const ref = React.createRef<HTMLDialogElement>();
			render(
				<Dialog ref={ref} isOpen={false} onClose={noop} label="ref-test">
					ref body
				</Dialog>,
			);
			expect(ref.current).toBeInstanceOf(HTMLDialogElement);
		});
	});

	describe('SSR: Dialog with DialogScrollLock', () => {
		it('Dialog with DialogScrollLock can be rendered on the server', async () => {
			expect(
				await doesRenderWithSsr(
					<Dialog isOpen={false} onClose={noop} label="ssr-lock">
						<DialogScrollLock />
						<span>locked</span>
					</Dialog>,
				),
			).toBe(true);
		});
	});

	describe('onClose correctness under StrictMode (React 19)', () => {
		it('Popover onClose is not called by effect double-fire alone', () => {
			const onClose = jest.fn();
			render(
				<React.StrictMode>
					<Popover isOpen={true} onClose={onClose} role="dialog" label="no-double">
						body
					</Popover>
				</React.StrictMode>,
			);
			// Effects double-fire in StrictMode, but onClose should NOT be called.
			// onClose is only called when the browser initiates a dismiss (toggle event).
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
	});

	describe('useAnimatedVisibility StrictMode exit (React 19)', () => {
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
						anim body
					</Popover>
				</React.StrictMode>,
			);

			// Close without animation (animate is undefined → non-animated path)
			rerender(
				<React.StrictMode>
					<Popover
						isOpen={false}
						onClose={onClose}
						onExitFinish={onExitFinish}
						role="dialog"
						label="exit"
					>
						anim body
					</Popover>
				</React.StrictMode>,
			);

			// onExitFinish should fire exactly once despite StrictMode double-fire
			expect(onExitFinish).toHaveBeenCalledTimes(1);
		});
	});

	describe('StrictMode lifecycle: open→close→open (React 19)', () => {
		it('Popover handles open→close→open under StrictMode without errors', () => {
			const onClose = jest.fn();
			const { rerender } = render(
				<React.StrictMode>
					<Popover isOpen={true} onClose={onClose} role="dialog" label="sm-lifecycle">
						body
					</Popover>
				</React.StrictMode>,
			);
			// StrictMode double-fires effects: setup → cleanup → setup.
			// The popover should still end up visible.
			const popover = screen.getByRole('dialog', { name: 'sm-lifecycle' });
			expect(popover).toBeVisible();

			// Close
			rerender(
				<React.StrictMode>
					<Popover isOpen={false} onClose={onClose} role="dialog" label="sm-lifecycle">
						body
					</Popover>
				</React.StrictMode>,
			);
			expect(popover).not.toBeVisible();

			// Re-open — the cleanup→setup cycle must leave the component in a valid state
			rerender(
				<React.StrictMode>
					<Popover isOpen={true} onClose={onClose} role="dialog" label="sm-lifecycle">
						body
					</Popover>
				</React.StrictMode>,
			);
			expect(popover).toBeVisible();
			// onClose should never fire from effect double-fire alone
			expect(onClose).not.toHaveBeenCalled();
		});

		it('Dialog handles open→close→open under StrictMode without errors', () => {
			const onClose = jest.fn<void, [{ reason: 'escape' | 'overlay-click' }]>();
			const { rerender } = render(
				<React.StrictMode>
					<Dialog isOpen={true} onClose={onClose} label="sm-lifecycle">
						content
					</Dialog>
				</React.StrictMode>,
			);
			const dialog = screen.getByRole('dialog', { hidden: true });
			expect(dialog).toBeVisible();

			// Close
			rerender(
				<React.StrictMode>
					<Dialog isOpen={false} onClose={onClose} label="sm-lifecycle">
						content
					</Dialog>
				</React.StrictMode>,
			);
			expect(dialog).not.toBeVisible();

			// Re-open
			rerender(
				<React.StrictMode>
					<Dialog isOpen={true} onClose={onClose} label="sm-lifecycle">
						content
					</Dialog>
				</React.StrictMode>,
			);
			expect(dialog).toBeVisible();
			// onClose should never fire from effect double-fire alone
			expect(onClose).not.toHaveBeenCalled();
		});
	});

	describe('Popup.TriggerFunction (React 19)', () => {
		it('renders trigger via render-prop and receives ref callback', () => {
			const triggerRefSpy = jest.fn();

			render(
				<Popup placement={{ edge: 'end' }} onClose={noop}>
					<Popup.TriggerFunction>
						{({ ref, ariaAttributes, toggle }) => (
							<button
								ref={(node) => {
									ref(node);
									triggerRefSpy(node);
								}}
								type="button"
								onClick={toggle}
								{...ariaAttributes}
							>
								TriggerFn
							</button>
						)}
					</Popup.TriggerFunction>
					<Popup.Content role="dialog" label="tf-popup">
						TF Content
					</Popup.Content>
				</Popup>,
			);

			const trigger = screen.getByRole('button', { name: 'TriggerFn' });
			expect(trigger).toBeInTheDocument();
			expect(trigger).toHaveAttribute('aria-haspopup');
			expect(trigger).toHaveAttribute('aria-controls');
			// ref callback should have been called with the DOM node
			expect(triggerRefSpy).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
		});

		it('passes strict mode', async () => {
			await expect(() => (
				<Popup placement={{ edge: 'end' }} onClose={noop}>
					<Popup.TriggerFunction>
						{({ ref, ariaAttributes, toggle }) => (
							<button ref={ref} type="button" onClick={toggle} {...ariaAttributes}>
								SM TriggerFn
							</button>
						)}
					</Popup.TriggerFunction>
					<Popup.Content role="dialog" label="tf-sm">
						SM TF Content
					</Popup.Content>
				</Popup>
			)).toPassStrictMode();
		});
	});

	describe('DialogScrollLock StrictMode restoration (React 19)', () => {
		it('correctly restores body overflow after StrictMode double-mount/unmount', () => {
			// Set a known initial overflow value
			document.body.style.overflow = 'auto';

			const { unmount } = render(
				<React.StrictMode>
					<Dialog isOpen={true} onClose={noop} label="scroll-lock-sm">
						<DialogScrollLock />
						<span>locked</span>
					</Dialog>
				</React.StrictMode>,
			);

			// While mounted, overflow should be hidden
			expect(document.body).toHaveStyle({ overflow: 'hidden' });

			// After unmount, overflow should be restored to original value
			unmount();
			expect(document.body).toHaveStyle({ overflow: 'auto' });
		});
	});

	describe('useAnchorPosition StrictMode (React 19)', () => {
		function AnchorStrictHarness() {
			const anchorRef = useRef<HTMLButtonElement>(null);
			const popoverRef = useRef<HTMLDivElement>(null);
			useAnchorPosition({
				anchorRef,
				popoverRef,
				placement: { edge: 'end' },
				forceFallbackPositioning: true,
			});
			return (
				<>
					<button ref={anchorRef} type="button">
						sm-anchor
					</button>
					<div ref={popoverRef}>sm-popover</div>
				</>
			);
		}

		it('passes strict mode', async () => {
			await expect(() => <AnchorStrictHarness />).toPassStrictMode();
		});
	});

	describe('SSR: animation presets and TriggerFunction', () => {
		it('Popover with animation preset can be rendered on the server', async () => {
			expect(
				await doesRenderWithSsr(
					<Popover isOpen={false} onClose={noop} animate={fade()} role="dialog" label="ssr-anim">
						animated
					</Popover>,
				),
			).toBe(true);
		});

		it('Popup with TriggerFunction can be rendered on the server', async () => {
			expect(
				await doesRenderWithSsr(
					<Popup placement={{ edge: 'end' }} onClose={noop}>
						<Popup.TriggerFunction>
							{({ ref, ariaAttributes, toggle }) => (
								<button ref={ref} type="button" onClick={toggle} {...ariaAttributes}>
									SSR TriggerFn
								</button>
							)}
						</Popup.TriggerFunction>
						<Popup.Content role="dialog" label="ssr-tf">
							SSR TF Content
						</Popup.Content>
					</Popup>,
				),
			).toBe(true);
		});
	});

	// ──────────────────────────────────────────────────────────────────────
	// Behavioral smoke tests
	//
	// The tests above verify that things "don't throw" and "don't crash".
	// The tests below verify that the core *behaviors* actually work
	// correctly under React 19: ARIA wiring, visibility, event handling,
	// callback invocation, and children rendering.
	// ──────────────────────────────────────────────────────────────────────

	describe('Popover: core behaviors', () => {
		it('renders children only when open', () => {
			const { rerender } = render(
				<Popover isOpen={false} onClose={noop} role="dialog" label="vis">
					<span data-testid="popover-child">visible?</span>
				</Popover>,
			);
			// When closed, children should not be in the DOM
			expect(screen.queryByTestId('popover-child')).not.toBeInTheDocument();

			// Open
			rerender(
				<Popover isOpen={true} onClose={noop} role="dialog" label="vis">
					<span data-testid="popover-child">visible?</span>
				</Popover>,
			);
			expect(screen.getByTestId('popover-child')).toBeInTheDocument();
			expect(screen.getByTestId('popover-child')).toHaveTextContent('visible?');
		});

		it('is visible when open and hidden when closed', () => {
			const { rerender } = render(
				<Popover isOpen={true} onClose={noop} role="dialog" label="api">
					content
				</Popover>,
			);
			const popover = screen.getByRole('dialog', { name: 'api' });
			expect(popover).toBeVisible();

			rerender(
				<Popover isOpen={false} onClose={noop} role="dialog" label="api">
					content
				</Popover>,
			);
			expect(popover).not.toBeVisible();
		});

		it('sets correct ARIA attributes on the popover element', () => {
			render(
				<Popover isOpen={true} onClose={noop} role="dialog" label="aria-test">
					content
				</Popover>,
			);
			const popover = screen.getByRole('dialog', { name: 'aria-test' });
			expect(popover).toHaveAttribute('role', 'dialog');
			expect(popover).toHaveAttribute('aria-label', 'aria-test');
			expect(popover).toHaveAttribute('popover');
			expect(popover).toHaveAttribute('id');
		});

		it('renders the popover element with the native popover attribute', () => {
			render(
				<Popover isOpen={true} onClose={noop} role="dialog" label="popover-attr">
					content
				</Popover>,
			);
			const popover = screen.getByRole('dialog', { name: 'popover-attr' });
			expect(popover).toHaveAttribute('popover');
		});
	});

	describe('Dialog: core behaviors', () => {
		it('is visible when open and hidden when closed', () => {
			const { rerender } = render(
				<Dialog isOpen={true} onClose={noop} label="api">
					content
				</Dialog>,
			);
			const dialog = screen.getByRole('dialog', { hidden: true });
			expect(dialog).toBeVisible();

			rerender(
				<Dialog isOpen={false} onClose={noop} label="api">
					content
				</Dialog>,
			);
			expect(dialog).not.toBeVisible();
		});

		it('sets correct ARIA attributes on dialog element', () => {
			render(
				<Dialog isOpen={true} onClose={noop} label="aria-dialog">
					content
				</Dialog>,
			);
			const dialog = screen.getByRole('dialog', { hidden: true });
			expect(dialog).toHaveAttribute('aria-label', 'aria-dialog');
			// Verify the element is a native <dialog> element
			expect(dialog).toBeInstanceOf(HTMLDialogElement);
			expect(dialog).toHaveAttribute('id');
		});

		it('renders children only when open', () => {
			const { rerender } = render(
				<Dialog isOpen={false} onClose={noop} label="child-vis">
					<span data-testid="dialog-child">hello</span>
				</Dialog>,
			);
			expect(screen.queryByTestId('dialog-child')).not.toBeInTheDocument();

			rerender(
				<Dialog isOpen={true} onClose={noop} label="child-vis">
					<span data-testid="dialog-child">hello</span>
				</Dialog>,
			);
			expect(screen.getByTestId('dialog-child')).toHaveTextContent('hello');
		});

		it('fires onClose with reason "escape" on native cancel event', () => {
			const onClose = jest.fn();
			render(
				<Dialog isOpen={true} onClose={onClose} label="cancel-test">
					content
				</Dialog>,
			);
			const dialog = screen.getByRole('dialog', { hidden: true });
			dialog.dispatchEvent(new Event('cancel', { bubbles: false }));
			expect(onClose).toHaveBeenCalledTimes(1);
			expect(onClose).toHaveBeenCalledWith(expect.objectContaining({ reason: 'escape' }));
		});
	});

	describe('Popup compound: core behaviors', () => {
		it('wires trigger aria-controls to popover id', () => {
			render(
				<Popup placement={{ edge: 'end' }} onClose={noop}>
					<Popup.Trigger>
						<button type="button">T</button>
					</Popup.Trigger>
					<Popup.Content role="dialog" label="wired">
						C
					</Popup.Content>
				</Popup>,
			);
			const trigger = screen.getByRole('button', { name: 'T' });
			const ariaControls = trigger.getAttribute('aria-controls');
			expect(ariaControls).toBeTruthy();
			// The popover element should have the matching id and popover attribute
			const popover = screen.getByRole('dialog', { name: 'wired', hidden: true });
			expect(popover).toHaveAttribute('id', ariaControls);
			expect(popover).toHaveAttribute('popover');
		});

		it('sets aria-expanded=false when popup is closed', () => {
			render(
				<Popup placement={{ edge: 'end' }} onClose={noop}>
					<Popup.Trigger>
						<button type="button">Exp</button>
					</Popup.Trigger>
					<Popup.Content role="dialog" label="expanded">
						C
					</Popup.Content>
				</Popup>,
			);
			const trigger = screen.getByRole('button', { name: 'Exp' });
			expect(trigger).toHaveAttribute('aria-expanded', 'false');
		});

		it('sets aria-haspopup based on content role', () => {
			render(
				<Popup placement={{ edge: 'end' }} onClose={noop}>
					<Popup.Trigger>
						<button type="button">Has</button>
					</Popup.Trigger>
					<Popup.Content role="menu" label="menu-popup">
						<div role="menuitem">Item</div>
					</Popup.Content>
				</Popup>,
			);
			const trigger = screen.getByRole('button', { name: 'Has' });
			expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
		});

		it('trigger click opens the popover', () => {
			render(
				<Popup placement={{ edge: 'end' }} onClose={noop}>
					<Popup.Trigger>
						<button type="button">Toggle</button>
					</Popup.Trigger>
					<Popup.Content role="dialog" label="toggle-popup">
						C
					</Popup.Content>
				</Popup>,
			);

			const popover = screen.getByRole('dialog', { name: 'toggle-popup', hidden: true });
			expect(popover).not.toBeVisible();

			const trigger = screen.getByRole('button', { name: 'Toggle' });
			trigger.click();

			expect(popover).toBeVisible();
		});

		it('popover element is in the DOM when closed', () => {
			render(
				<Popup placement={{ edge: 'end' }} onClose={noop}>
					<Popup.Trigger>
						<button type="button">T</button>
					</Popup.Trigger>
					<Popup.Content role="dialog" label="content-check">
						<span data-testid="popup-inner">inner content</span>
					</Popup.Content>
				</Popup>,
			);
			const trigger = screen.getByRole('button', { name: 'T' });
			expect(trigger).toHaveAttribute('aria-controls');

			const popover = screen.getByRole('dialog', { name: 'content-check', hidden: true });
			expect(popover).toHaveAttribute('popover');
			expect(popover).not.toBeVisible();
		});
	});

	describe('Popup.TriggerFunction: core behaviors', () => {
		it('provides toggle callback that opens the popover', () => {
			render(
				<Popup placement={{ edge: 'end' }} onClose={noop}>
					<Popup.TriggerFunction>
						{({ ref, ariaAttributes, toggle }) => (
							<button ref={ref} type="button" onClick={toggle} {...ariaAttributes}>
								FnToggle
							</button>
						)}
					</Popup.TriggerFunction>
					<Popup.Content role="dialog" label="fn-toggle">
						C
					</Popup.Content>
				</Popup>,
			);

			const popover = screen.getByRole('dialog', { name: 'fn-toggle', hidden: true });
			expect(popover).not.toBeVisible();

			screen.getByRole('button', { name: 'FnToggle' }).click();
			expect(popover).toBeVisible();
		});

		it('provides correct ariaAttributes matching content role', () => {
			render(
				<Popup placement={{ edge: 'end' }} onClose={noop}>
					<Popup.TriggerFunction>
						{({ ref, ariaAttributes, toggle }) => (
							<button ref={ref} type="button" onClick={toggle} {...ariaAttributes}>
								FnAria
							</button>
						)}
					</Popup.TriggerFunction>
					<Popup.Content role="listbox" label="fn-aria">
						<div role="option" aria-selected="false">
							Opt
						</div>
					</Popup.Content>
				</Popup>,
			);
			const trigger = screen.getByRole('button', { name: 'FnAria' });
			expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
			expect(trigger).toHaveAttribute('aria-expanded', 'false');
			expect(trigger).toHaveAttribute('aria-controls');
		});
	});

	describe('DialogScrollLock: core behaviors', () => {
		it('locks body overflow on mount and restores it on unmount', () => {
			document.body.style.overflow = 'scroll';
			const { unmount } = render(
				<Dialog isOpen={true} onClose={noop} label="lock-test">
					<DialogScrollLock />
					<span>locked</span>
				</Dialog>,
			);
			expect(document.body).toHaveStyle({ overflow: 'hidden' });

			unmount();
			expect(document.body).toHaveStyle({ overflow: 'scroll' });
		});

		it('does not set overflow when Dialog is closed', () => {
			document.body.style.overflow = 'visible';
			render(
				<Dialog isOpen={false} onClose={noop} label="no-lock">
					<DialogScrollLock />
					<span>not locked</span>
				</Dialog>,
			);
			// Children (including DialogScrollLock) don't mount when dialog is closed
			expect(document.body).toHaveStyle({ overflow: 'visible' });
		});
	});

	describe('useSimpleLightDismiss: core behaviors', () => {
		function LightDismissHarness({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
			const popoverRef = useRef<HTMLDivElement>(null);
			useSimpleLightDismiss({ popoverRef, isOpen, onClose });
			return (
				<div ref={popoverRef} data-testid="manual-popover">
					manual content
				</div>
			);
		}

		it('fires onClose on Escape key when open', () => {
			const onClose = jest.fn();
			render(<LightDismissHarness isOpen={true} onClose={onClose} />);

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
			expect(onClose).toHaveBeenCalledTimes(1);
		});

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

	describe('PopupSurface: core behaviors', () => {
		it('renders children', () => {
			render(
				<PopupSurface>
					<span data-testid="surface-child">surface content</span>
				</PopupSurface>,
			);
			expect(screen.getByTestId('surface-child')).toHaveTextContent('surface content');
		});
	});

	describe('Animation presets: core behaviors', () => {
		it('fade() returns a preset with name, css, and exitDurationMs', () => {
			const preset = fade();
			expect(preset).toHaveProperty('name', 'fade');
			expect(preset).toHaveProperty('css');
			expect(preset).toHaveProperty('exitDurationMs');
			expect(typeof preset.css).toBe('string');
			expect(preset.exitDurationMs).toBeGreaterThan(0);
		});

		it('scaleAndFade() returns a preset with name and css', () => {
			const preset = scaleAndFade();
			expect(preset).toHaveProperty('name', 'scale-and-fade');
			expect(preset).toHaveProperty('css');
			expect(preset).toHaveProperty('exitDurationMs');
		});

		it('slideAndFade() returns a preset with getProperties for placement', () => {
			const preset = slideAndFade({ distance: 8 });
			expect(preset).toHaveProperty('name', 'slide-and-fade');
			expect(preset).toHaveProperty('css');
			expect(preset).toHaveProperty('exitDurationMs');
			expect(preset).toHaveProperty('getProperties');
			expect(typeof preset.getProperties).toBe('function');
		});

		it('dialogFade() returns a preset with name and css', () => {
			const preset = dialogFade();
			expect(preset).toHaveProperty('name', 'dialog-fade');
			expect(preset).toHaveProperty('css');
			expect(preset).toHaveProperty('exitDurationMs');
		});

		it('dialogSlideUpAndFade() returns a preset with name and css', () => {
			const preset = dialogSlideUpAndFade();
			expect(preset).toHaveProperty('name', 'dialog-slide-up-and-fade');
			expect(preset).toHaveProperty('css');
			expect(preset).toHaveProperty('exitDurationMs');
		});

		it('dialogSlideUpAndFade() custom distance changes the CSS', () => {
			const defaultPreset = dialogSlideUpAndFade();
			const customPreset = dialogSlideUpAndFade({ distance: 24 });
			expect(customPreset.name).toBe('dialog-slide-up-and-fade-24');
			expect(customPreset.css).toContain('24px');
			expect(defaultPreset.css).toContain('12px');
		});
	});

	describe('Placement map: core behaviors', () => {
		it('maps all legacy placement strings to new format', () => {
			const legacyPlacements = [
				'top',
				'top-start',
				'top-end',
				'bottom',
				'bottom-start',
				'bottom-end',
				'left',
				'left-start',
				'left-end',
				'right',
				'right-start',
				'right-end',
			] as const;

			for (const legacy of legacyPlacements) {
				const result = fromLegacyPlacement({ legacy });
				expect(result).toHaveProperty('edge');
				expect(result).toHaveProperty('axis');
			}
		});

		it('placementMapping contains all expected keys', () => {
			expect(Object.keys(placementMapping)).toContain('top');
			expect(Object.keys(placementMapping)).toContain('bottom');
			expect(Object.keys(placementMapping)).toContain('left');
			expect(Object.keys(placementMapping)).toContain('right');
		});

		it('maps "bottom-start" to block-end with start alignment', () => {
			const result = fromLegacyPlacement({ legacy: 'bottom-start' });
			expect(result).toEqual({ axis: 'block', edge: 'end', align: 'start' });
		});
	});

	describe('createCloseEvent: core behaviors', () => {
		it('escape reason produces a KeyboardEvent with key "Escape"', () => {
			const event = createCloseEvent({ reason: 'escape' });
			expect(event).toBeInstanceOf(KeyboardEvent);
			expect((event as KeyboardEvent).key).toBe('Escape');
		});

		it('overlay-click reason produces a MouseEvent', () => {
			const event = createCloseEvent({ reason: 'overlay-click' });
			expect(event).toBeInstanceOf(MouseEvent);
		});

		it('popover escape reason produces a KeyboardEvent', () => {
			const event = createPopoverCloseEvent({ reason: 'escape' });
			expect(event).toBeInstanceOf(KeyboardEvent);
			expect((event as KeyboardEvent).key).toBe('Escape');
		});

		it('popover light-dismiss reason produces a MouseEvent', () => {
			const event = createPopoverCloseEvent({ reason: 'light-dismiss' });
			expect(event).toBeInstanceOf(MouseEvent);
		});
	});

	describe('Arrow: core behaviors', () => {
		it('arrow() returns a config object', () => {
			const config = arrow();
			expect(typeof config).toBe('object');
		});

		it('arrow() returns the same instance (memoised)', () => {
			const config1 = arrow();
			const config2 = arrow();
			expect(config1).toBe(config2);
		});
	});
});
