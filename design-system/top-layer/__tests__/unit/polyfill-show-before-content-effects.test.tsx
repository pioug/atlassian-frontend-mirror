/**
 * A layer can show (`showPopover()`, `showModal()`) before its content effects run. Content effects
 * are what React runs for new content in the same commit, once it is in the DOM: `autoFocus`, ref
 * callbacks and layout effects. React finishes a sibling, and everything inside it, before the next
 * sibling. So a component that renders nothing, rendered before the content in the host, can show
 * the layer in its layout effect, and the content effects then find a visible layer.
 *
 * These tests check that the polyfill models this as browsers do. They use a minimal layer, not
 * `Popover` or `Dialog`, and compare two show orders:
 * - `before-content-effects`: `FirstSibling`, rendered before the content, shows the layer.
 * - `after-content-effects`: the host's own layout effect shows the layer, after the content effects.
 *
 * Browser facts that are modelled:
 * - `focus()` on content that is not rendered (in a closed popover or dialog) does nothing. Once the
 *   layer is open, its content can take focus.
 * - `showPopover()` runs the popover focusing steps, and `showModal()` the dialog focusing steps.
 * - `beforetoggle` is synchronous. `toggle` is a later task.
 * - In strict mode, React runs the layout effects again, but not `autoFocus`. React 18 does not
 *   run ref callbacks again either.
 */
import React, { Fragment, type ReactNode, StrictMode, useLayoutEffect, useRef } from 'react';

import { bind, type UnbindFn } from 'bind-event-listener';

import { screen } from '@atlassian/testing-library/screen';
import { act, cleanup, render } from '@atlassian/testing-library/testing-library/react';

import { isNativeElementOpen } from '../../src/internal/is-native-element-open';
import '../../src/testing/polyfill';

type TShowOrder = 'before-content-effects' | 'after-content-effects';
type TLayerKind = 'popover' | 'dialog';
type TPopoverMode = 'auto' | 'manual';
type TFocusCall = 'autoFocus' | 'ref callback' | 'useLayoutEffect';

const showOrders: TShowOrder[] = ['before-content-effects', 'after-content-effects'];
const layerKinds: TLayerKind[] = ['popover', 'dialog'];
const focusCalls: TFocusCall[] = ['autoFocus', 'ref callback', 'useLayoutEffect'];

function showLayer({ element }: { element: HTMLElement }) {
	if (element instanceof HTMLDialogElement) {
		element.showModal();
		return;
	}
	element.showPopover();
}

function hideLayer({ element }: { element: HTMLElement }) {
	if (element instanceof HTMLDialogElement) {
		element.close();
		return;
	}
	element.hidePopover();
}

/**
 * Renders nothing. The host renders it before the content, so its layout effect runs before the
 * content effects. It finds the host by its test id, as the host ref is not attached yet.
 */
function FirstSibling({ label }: { label: string }): ReactNode {
	useLayoutEffect(() => {
		showLayer({ element: screen.getByTestId(label) });
	}, [label]);
	return null;
}

function TestLayer({
	kind,
	showOrder,
	label,
	mode = 'manual',
	children,
}: {
	kind: TLayerKind;
	showOrder: TShowOrder;
	label: string;
	mode?: TPopoverMode;
	children?: ReactNode;
}): ReactNode {
	useLayoutEffect(() => {
		const host = screen.getByTestId(label);
		if (showOrder === 'after-content-effects') {
			showLayer({ element: host });
		}
		return () => hideLayer({ element: host });
	}, [label, showOrder]);

	const firstSibling =
		showOrder === 'before-content-effects' ? <FirstSibling label={label} /> : null;
	if (kind === 'dialog') {
		return (
			<dialog data-testid={label} aria-label={label}>
				{firstSibling}
				{children}
			</dialog>
		);
	}
	// A spread, as the React 18 types do not have `popover`.
	const popoverAttributes = { popover: mode };
	return (
		<div {...popoverAttributes} data-testid={label} role="dialog" aria-label={label}>
			{firstSibling}
			{children}
		</div>
	);
}

function LayoutEffectProbe({ onLayoutEffect }: { onLayoutEffect: () => void }): ReactNode {
	useLayoutEffect(() => {
		onLayoutEffect();
	}, [onLayoutEffect]);
	return null;
}

// `componentDidMount` runs at the same point in the commit as a layout effect.
function FocusOnLayoutEffect(): ReactNode {
	const buttonRef = useRef<HTMLButtonElement>(null);
	useLayoutEffect(() => {
		buttonRef.current?.focus();
	}, []);
	return (
		<button type="button" data-testid="content" ref={buttonRef}>
			Content
		</button>
	);
}

function focusOnAttach(element: HTMLButtonElement | null) {
	element?.focus();
}

function FocusContent({ focusCall }: { focusCall: TFocusCall }): ReactNode {
	if (focusCall === 'autoFocus') {
		return (
			<button type="button" data-testid="content" autoFocus>
				Content
			</button>
		);
	}
	if (focusCall === 'ref callback') {
		return (
			<button type="button" data-testid="content" ref={focusOnAttach}>
				Content
			</button>
		);
	}
	return <FocusOnLayoutEffect />;
}

// A dialog content whose first focusable element is not the one that the content focuses.
function DialogFocusContent({ focusCall }: { focusCall: TFocusCall }): ReactNode {
	return (
		<>
			<button type="button" data-testid="first">
				First
			</button>
			<FocusContent focusCall={focusCall} />
		</>
	);
}

function Page({ isOpen, children }: { isOpen: boolean; children: ReactNode }): ReactNode {
	return (
		<>
			<button type="button" data-testid="trigger">
				Trigger
			</button>
			{isOpen ? children : null}
		</>
	);
}

/**
 * Renders the page and focuses the trigger, then opens `layer` in a later commit, as a user action
 * does.
 */
function openFromTrigger({
	layer,
	isStrictMode = false,
}: {
	layer: ReactNode;
	isStrictMode?: boolean;
}) {
	const Wrapper = isStrictMode ? StrictMode : Fragment;
	const { rerender } = render(
		<Wrapper>
			<Page isOpen={false}>{layer}</Page>
		</Wrapper>,
	);
	screen.getByTestId('trigger').focus();
	rerender(
		<Wrapper>
			<Page isOpen>{layer}</Page>
		</Wrapper>,
	);
}

// Runs the queued tasks: `toggle`, and the focus fixup.
async function runTasks() {
	await act(async () => {
		// The focus fixup observes attribute changes with a `MutationObserver`, after a microtask.
		await Promise.resolve();
		jest.runOnlyPendingTimers();
	});
}

function getOpenStates({ element }: { element: HTMLElement }) {
	return {
		matchesPopoverOpen: element.matches(':popover-open'),
		matchesModal: element.matches(':modal'),
		isNativeElementOpen: isNativeElementOpen({ element }),
	};
}

type TToggleEvent = Event & { oldState?: string; newState?: string };

// The hooks are in a describe block, so that they run before the automatic accessibility check.
describe('a layer that shows before its content effects', () => {
	const log: string[] = [];
	const focusLog: string[] = [];
	const unbinds: UnbindFn[] = [];

	function recordToggleEvents({ type }: { type: 'beforetoggle' | 'toggle' }): UnbindFn {
		return bind(document, {
			type,
			listener(event: Event) {
				const target = event.target instanceof HTMLElement ? event.target : null;
				const toggleEvent: TToggleEvent = event;
				const states =
					type === 'toggle'
						? `${toggleEvent.oldState} ${toggleEvent.newState}`
						: `${toggleEvent.newState}`;
				log.push(`${type} ${target?.getAttribute('data-testid')} ${states}`);
			},
			// `beforetoggle` and `toggle` do not bubble, but the capture phase sees them.
			options: { capture: true },
		});
	}

	beforeEach(() => {
		jest.useFakeTimers();
		log.length = 0;
		focusLog.length = 0;
		unbinds.push(
			recordToggleEvents({ type: 'beforetoggle' }),
			recordToggleEvents({ type: 'toggle' }),
			bind(document, {
				type: 'focus',
				listener(event: Event) {
					const target = event.target instanceof HTMLElement ? event.target : null;
					focusLog.push(`${target?.getAttribute('data-testid')}`);
				},
				// `focus` does not bubble, but the capture phase sees it.
				options: { capture: true },
			}),
		);
	});

	afterEach(() => {
		cleanup();
		jest.runAllTimers();
		unbinds.splice(0).forEach((unbind) => unbind());
		jest.useRealTimers();
	});

	describe('focus calls in the content, in the commit that opens the layer', () => {
		it.each(focusCalls)(
			'popover shown before the content effects: the content takes focus (%s)',
			(focusCall) => {
				openFromTrigger({
					layer: (
						<TestLayer kind="popover" showOrder="before-content-effects" label="layer">
							<FocusContent focusCall={focusCall} />
						</TestLayer>
					),
				});

				expect(screen.getByTestId('content')).toHaveFocus();
				expect(focusLog).toEqual(['trigger', 'content']);
			},
		);

		it.each(focusCalls)(
			'popover shown after the content effects: focus stays on the trigger (%s)',
			(focusCall) => {
				openFromTrigger({
					layer: (
						<TestLayer kind="popover" showOrder="after-content-effects" label="layer">
							<FocusContent focusCall={focusCall} />
						</TestLayer>
					),
				});

				expect(screen.getByTestId('trigger')).toHaveFocus();
				expect(focusLog).toEqual(['trigger']);
			},
		);

		it.each(focusCalls)(
			'modal dialog shown before the content effects: the content takes focus from the dialog focusing steps (%s)',
			(focusCall) => {
				openFromTrigger({
					layer: (
						<TestLayer kind="dialog" showOrder="before-content-effects" label="layer">
							<DialogFocusContent focusCall={focusCall} />
						</TestLayer>
					),
				});

				expect(screen.getByTestId('content')).toHaveFocus();
				expect(focusLog).toEqual(['trigger', 'first', 'content']);
			},
		);

		it.each(focusCalls)(
			'modal dialog shown after the content effects: only the dialog focusing steps move focus (%s)',
			(focusCall) => {
				openFromTrigger({
					layer: (
						<TestLayer kind="dialog" showOrder="after-content-effects" label="layer">
							<DialogFocusContent focusCall={focusCall} />
						</TestLayer>
					),
				});

				expect(screen.getByTestId('first')).toHaveFocus();
				expect(focusLog).toEqual(['trigger', 'first']);
			},
		);
	});

	describe('focusing steps at show time, before the content effects', () => {
		it('popover: focuses the autofocus delegate, and skips the autofocus elements that cannot take focus', () => {
			openFromTrigger({
				layer: (
					<TestLayer kind="popover" showOrder="before-content-effects" label="layer">
						{/* Markup, as React does not render the `autofocus` attribute on the client. */}
						<div
							dangerouslySetInnerHTML={{
								__html: [
									'<button type="button" autofocus hidden>Hidden</button>',
									'<button type="button" autofocus disabled>Disabled</button>',
									'<div popover="manual"><button type="button" autofocus>In a closed popover</button></div>',
									'<button type="button" autofocus data-testid="delegate">Delegate</button>',
								].join(''),
							}}
						/>
						<LayoutEffectProbe onLayoutEffect={() => focusLog.push('content layout effect')} />
					</TestLayer>
				),
			});

			expect(focusLog).toEqual(['trigger', 'delegate', 'content layout effect']);
			expect(screen.getByTestId('delegate')).toHaveFocus();
		});

		it('modal dialog: focuses the first sequentially focusable element that can take focus', () => {
			const closedPopoverAttributes = { popover: 'manual' };

			openFromTrigger({
				layer: (
					<TestLayer kind="dialog" showOrder="before-content-effects" label="layer">
						<div {...closedPopoverAttributes}>
							<button type="button">In a closed popover</button>
						</div>
						<button type="button" tabIndex={-1}>
							Not sequentially focusable
						</button>
						<button type="button" disabled>
							Disabled
						</button>
						<button type="button" hidden>
							Hidden
						</button>
						<button type="button" data-testid="delegate">
							Delegate
						</button>
						<LayoutEffectProbe onLayoutEffect={() => focusLog.push('content layout effect')} />
					</TestLayer>
				),
			});

			expect(focusLog).toEqual(['trigger', 'delegate', 'content layout effect']);
			expect(screen.getByTestId('delegate')).toHaveFocus();
		});
	});

	describe('beforetoggle and toggle', () => {
		it.each(layerKinds)(
			'shown before the content effects: beforetoggle fires before the content effects, and toggle is a later task (%s)',
			async (kind) => {
				openFromTrigger({
					layer: (
						<TestLayer kind={kind} showOrder="before-content-effects" label="layer">
							<LayoutEffectProbe onLayoutEffect={() => log.push('content layout effect')} />
						</TestLayer>
					),
				});

				expect(log).toEqual(['beforetoggle layer open', 'content layout effect']);

				await runTasks();

				expect(log).toEqual([
					'beforetoggle layer open',
					'content layout effect',
					'toggle layer closed open',
				]);
			},
		);

		it.each(layerKinds)(
			'shown after the content effects: beforetoggle fires after the content effects, and toggle is a later task (%s)',
			async (kind) => {
				openFromTrigger({
					layer: (
						<TestLayer kind={kind} showOrder="after-content-effects" label="layer">
							<LayoutEffectProbe onLayoutEffect={() => log.push('content layout effect')} />
						</TestLayer>
					),
				});

				expect(log).toEqual(['content layout effect', 'beforetoggle layer open']);

				await runTasks();

				expect(log).toEqual([
					'content layout effect',
					'beforetoggle layer open',
					'toggle layer closed open',
				]);
			},
		);
	});

	describe('open state in the content effects', () => {
		it.each(showOrders)('popover (%s)', (showOrder) => {
			const seen: Array<ReturnType<typeof getOpenStates>> = [];

			openFromTrigger({
				layer: (
					<TestLayer kind="popover" showOrder={showOrder} label="layer">
						<LayoutEffectProbe
							onLayoutEffect={() =>
								seen.push(getOpenStates({ element: screen.getByTestId('layer') }))
							}
						/>
					</TestLayer>
				),
			});

			const isOpen = showOrder === 'before-content-effects';
			expect(seen).toEqual([
				{ matchesPopoverOpen: isOpen, matchesModal: false, isNativeElementOpen: isOpen },
			]);
		});

		it.each(showOrders)('modal dialog (%s)', (showOrder) => {
			const seen: Array<ReturnType<typeof getOpenStates>> = [];

			openFromTrigger({
				layer: (
					<TestLayer kind="dialog" showOrder={showOrder} label="layer">
						<LayoutEffectProbe
							onLayoutEffect={() =>
								seen.push(getOpenStates({ element: screen.getByTestId('layer') }))
							}
						/>
					</TestLayer>
				),
			});

			const isOpen = showOrder === 'before-content-effects';
			expect(seen).toEqual([
				{ matchesPopoverOpen: false, matchesModal: isOpen, isNativeElementOpen: isOpen },
			]);
		});
	});

	describe('focus fixup', () => {
		it.each(layerKinds)('does not move focus to <body> after the early show (%s)', async (kind) => {
			openFromTrigger({
				layer: (
					<TestLayer kind={kind} showOrder="before-content-effects" label="layer">
						<FocusContent focusCall="useLayoutEffect" />
					</TestLayer>
				),
			});
			const content = screen.getByTestId('content');
			const onBlur = jest.fn();
			unbinds.push(bind(content, { type: 'blur', listener: onBlur }));

			await runTasks();

			expect(content).toHaveFocus();
			expect(onBlur).not.toHaveBeenCalled();
		});
	});

	describe('nested layers that open in one commit', () => {
		it('auto popover in an auto popover, shown before the content effects: the parent shows first, and both stay open', () => {
			openFromTrigger({
				layer: (
					<TestLayer kind="popover" mode="auto" showOrder="before-content-effects" label="outer">
						<button type="button">Outer item</button>
						<TestLayer kind="popover" mode="auto" showOrder="before-content-effects" label="inner">
							<FocusContent focusCall="useLayoutEffect" />
						</TestLayer>
					</TestLayer>
				),
			});

			expect(log).toEqual(['beforetoggle outer open', 'beforetoggle inner open']);
			expect(isNativeElementOpen({ element: screen.getByTestId('outer') })).toBe(true);
			expect(isNativeElementOpen({ element: screen.getByTestId('inner') })).toBe(true);
			expect(screen.getByTestId('content')).toHaveFocus();
		});

		it('auto popover in an auto popover, shown after the content effects: the child shows first, and the parent show closes it', () => {
			openFromTrigger({
				layer: (
					<TestLayer kind="popover" mode="auto" showOrder="after-content-effects" label="outer">
						<button type="button">Outer item</button>
						<TestLayer kind="popover" mode="auto" showOrder="after-content-effects" label="inner">
							<FocusContent focusCall="useLayoutEffect" />
						</TestLayer>
					</TestLayer>
				),
			});

			expect(log).toEqual([
				'beforetoggle inner open',
				'beforetoggle outer open',
				'beforetoggle inner closed',
			]);
			expect(isNativeElementOpen({ element: screen.getByTestId('outer') })).toBe(true);
			expect(isNativeElementOpen({ element: screen.getByTestId('inner') })).toBe(false);
			expect(screen.getByTestId('trigger')).toHaveFocus();
		});

		it('auto popover in a modal dialog, shown before the content effects: the dialog shows first, and the popover content can take focus', () => {
			openFromTrigger({
				layer: (
					<TestLayer kind="dialog" showOrder="before-content-effects" label="dialog">
						<button type="button">Dialog item</button>
						<TestLayer
							kind="popover"
							mode="auto"
							showOrder="before-content-effects"
							label="popover"
						>
							<FocusContent focusCall="useLayoutEffect" />
						</TestLayer>
					</TestLayer>
				),
			});

			expect(log).toEqual(['beforetoggle dialog open', 'beforetoggle popover open']);
			expect(isNativeElementOpen({ element: screen.getByTestId('dialog') })).toBe(true);
			expect(isNativeElementOpen({ element: screen.getByTestId('popover') })).toBe(true);
			expect(screen.getByTestId('content')).toHaveFocus();
		});

		it('auto popover in a modal dialog, shown after the content effects: the popover shows first, and showModal() closes it', () => {
			openFromTrigger({
				layer: (
					<TestLayer kind="dialog" showOrder="after-content-effects" label="dialog">
						<button type="button" data-testid="dialog-item">
							Dialog item
						</button>
						<TestLayer kind="popover" mode="auto" showOrder="after-content-effects" label="popover">
							<FocusContent focusCall="useLayoutEffect" />
						</TestLayer>
					</TestLayer>
				),
			});

			expect(log).toEqual([
				'beforetoggle popover open',
				'beforetoggle dialog open',
				'beforetoggle popover closed',
			]);
			expect(isNativeElementOpen({ element: screen.getByTestId('dialog') })).toBe(true);
			expect(isNativeElementOpen({ element: screen.getByTestId('popover') })).toBe(false);
			expect(screen.getByTestId('dialog-item')).toHaveFocus();
		});
	});

	describe('React strict mode: show, hide and show again on the same host', () => {
		it.each(layerKinds)(
			'a layout effect focus runs again after the second show, and toggle coalesces (%s)',
			async (kind) => {
				openFromTrigger({
					isStrictMode: true,
					layer: (
						<TestLayer kind={kind} showOrder="before-content-effects" label="layer">
							<FocusContent focusCall="useLayoutEffect" />
						</TestLayer>
					),
				});
				const content = screen.getByTestId('content');
				const onBlur = jest.fn();
				unbinds.push(bind(content, { type: 'blur', listener: onBlur }));

				expect(log).toEqual([
					'beforetoggle layer open',
					'beforetoggle layer closed',
					'beforetoggle layer open',
				]);
				expect(isNativeElementOpen({ element: screen.getByTestId('layer') })).toBe(true);
				expect(content).toHaveFocus();

				await runTasks();

				expect(log).toEqual([
					'beforetoggle layer open',
					'beforetoggle layer closed',
					'beforetoggle layer open',
					'toggle layer closed open',
				]);
				expect(content).toHaveFocus();
				expect(onBlur).not.toHaveBeenCalled();
			},
		);

		it('manual popover: `autoFocus` keeps focus, as the hide does not move it and the fixup runs after the second show', async () => {
			openFromTrigger({
				isStrictMode: true,
				layer: (
					<TestLayer kind="popover" showOrder="before-content-effects" label="layer">
						<FocusContent focusCall="autoFocus" />
					</TestLayer>
				),
			});

			expect(screen.getByTestId('content')).toHaveFocus();

			await runTasks();

			expect(screen.getByTestId('content')).toHaveFocus();
		});

		it('auto popover: the hide returns focus to the trigger, and React does not run `autoFocus` again', () => {
			openFromTrigger({
				isStrictMode: true,
				layer: (
					<TestLayer kind="popover" mode="auto" showOrder="before-content-effects" label="layer">
						<FocusContent focusCall="autoFocus" />
					</TestLayer>
				),
			});

			expect(isNativeElementOpen({ element: screen.getByTestId('layer') })).toBe(true);
			expect(screen.getByTestId('trigger')).toHaveFocus();
			expect(focusLog).toEqual(['trigger', 'content', 'trigger']);
		});

		it('modal dialog: the close returns focus to the trigger, and the second show runs the dialog focusing steps', () => {
			openFromTrigger({
				isStrictMode: true,
				layer: (
					<TestLayer kind="dialog" showOrder="before-content-effects" label="layer">
						<DialogFocusContent focusCall="autoFocus" />
					</TestLayer>
				),
			});

			expect(isNativeElementOpen({ element: screen.getByTestId('layer') })).toBe(true);
			expect(screen.getByTestId('first')).toHaveFocus();
			expect(focusLog).toEqual(['trigger', 'first', 'content', 'trigger', 'first']);
		});

		it('auto popover in an auto popover: the parent shows first both times, and the child content keeps focus', () => {
			openFromTrigger({
				isStrictMode: true,
				layer: (
					<TestLayer kind="popover" mode="auto" showOrder="before-content-effects" label="outer">
						<button type="button">Outer item</button>
						<TestLayer kind="popover" mode="auto" showOrder="before-content-effects" label="inner">
							<FocusContent focusCall="useLayoutEffect" />
						</TestLayer>
					</TestLayer>
				),
			});

			// The strict mode cleanup runs child first, so the inner popover hides first.
			expect(log).toEqual([
				'beforetoggle outer open',
				'beforetoggle inner open',
				'beforetoggle inner closed',
				'beforetoggle outer closed',
				'beforetoggle outer open',
				'beforetoggle inner open',
			]);
			expect(isNativeElementOpen({ element: screen.getByTestId('outer') })).toBe(true);
			expect(isNativeElementOpen({ element: screen.getByTestId('inner') })).toBe(true);
			expect(screen.getByTestId('content')).toHaveFocus();
		});
	});
});
