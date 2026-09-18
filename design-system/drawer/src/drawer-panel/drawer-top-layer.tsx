/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode, type SyntheticEvent, useCallback, useEffect, useRef } from 'react';

import { cssMap, cx, jsx, keyframes } from '@compiled/react';
import { bind } from 'bind-event-listener';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import { token } from '@atlaskit/tokens';
import type { CURRENT_SURFACE_CSS_VAR } from '@atlaskit/tokens/constants';
import { createCloseEvent } from '@atlaskit/top-layer/create-close-event';
import { Dialog } from '@atlaskit/top-layer/dialog-content';
import { DialogScrollLock } from '@atlaskit/top-layer/dialog-scroll-lock';
import type { TDialogCloseReason } from '@atlaskit/top-layer/dialog/types';

import { EnsureIsInsideDrawerContext } from '../ensure-is-inside-drawer-context';
import { OnCloseContext } from '../on-close-context';
import { type DrawerProps } from '../types';

const LOCAL_CURRENT_SURFACE_CSS_VAR: typeof CURRENT_SURFACE_CSS_VAR =
	'--ds-elevation-surface-current';

const slideInKeyframes = keyframes({
	from: {
		transform: 'translate(var(--x), var(--y))',
	},
	to: {
		transform: 'translateX(0)',
	},
});

const slideOutKeyframes = keyframes({
	from: {
		transform: 'translateX(0)',
	},
	to: {
		transform: 'translate(var(--x), var(--y))',
	},
});

const styles = cssMap({
	// Pin the `<dialog>` full-height to the inline-start edge (overriding the
	// primitive's centred `margin: auto`); width from the preset, clamped to the
	// viewport.
	root: {
		margin: '0px',
		insetBlockStart: '0px',
		insetInlineStart: '0px',
		insetInlineEnd: 'auto',
		height: '100dvh',
		maxWidth: '100vw',
	},
	enter: {
		animationName: slideInKeyframes,
	},
	exit: {
		animationName: slideOutKeyframes,
	},
	// Visual surface of the panel. The native `<dialog>` (rendered by `Dialog`)
	// owns positioning, sizing, modality and the `::backdrop`; this child only
	// provides the drawer's appearance and fills the dialog.
	surface: {
		display: 'flex',
		width: '100%',
		height: '100%',
		backgroundColor: token('elevation.surface.overlay'),
		[LOCAL_CURRENT_SURFACE_CSS_VAR]: token('elevation.surface.overlay'),
		overflow: 'hidden',
		fontFamily: token('font.family.body'),
	},
});

const widthStyles = cssMap({
	narrow: {
		width: '360px',
	},
	medium: {
		width: '480px',
	},
	wide: {
		width: '600px',
	},
	extended: {
		width: '95vw',
	},
	full: {
		width: '100vw',
	},
});

const enterFromStyles = cssMap({
	left: { '--x': '-100%', '--y': '0%' },
	right: { '--x': '100%', '--y': '0%' },
	top: { '--x': '0%', '--y': '-100%' },
	bottom: { '--x': '0%', '--y': '100%' },
});

/**
 * Resolve the native `<dialog>` accessible name props. Prefer the consumer's
 * `label`, then their `titleId`. If neither is supplied (legacy allowed this),
 * fall back to a generic name so the dialog is never unlabelled. Note:
 * `@atlaskit/drawer` has no i18n setup, so this fallback is English only;
 * consumers should pass a localised `label` or `titleId`.
 */
function getAccessibleName({
	label,
	titleId,
}: {
	label: string | undefined;
	titleId: string | undefined;
}): { label: string } | { labelledBy: string } {
	if (label) {
		return { label };
	}
	if (titleId) {
		return { labelledBy: titleId };
	}
	return { label: 'Drawer' };
}

/**
 * **DrawerTopLayer**
 *
 * Top-layer (`platform-dst-top-layer`) implementation of `Drawer`. Renders a
 * native `<dialog>` via `@atlaskit/top-layer`, replacing Portal, Blanket,
 * react-focus-lock, react-scrolllock and `@atlaskit/layering` with native
 * modality, `::backdrop`, focus trap and return, and `DialogScrollLock`.
 *
 * The `Dialog` primitive owns the entry and exit animation lifecycle (it keeps
 * the host element mounted through the exit transition, then fires
 * `onExitFinish`), so no `ExitingPersistence` wrapper is needed: the drawer
 * renders `<Dialog isOpen={isOpen}>` directly. `useDrawerStack` tracks stack
 * depth so only the foreground drawer shows a `::backdrop`.
 *
 * `isFocusLockEnabled` is intentionally unsupported: a native modal `<dialog>`
 * always traps focus, so `isFocusLockEnabled={false}` is a no-op under this gate.
 */
export function DrawerTopLayer({
	width = 'narrow',
	isOpen,
	shouldReturnFocus = true,
	onKeyDown,
	testId,
	children,
	onClose,
	onCloseComplete,
	onOpenComplete,
	label,
	titleId,
	enterFrom = 'left',
}: DrawerProps): ReactNode {
	/**
	 * Points to the panel surface. Passed to `onOpenComplete` / `onCloseComplete`.
	 */
	const contentRef = useRef<HTMLDivElement | null>(null);
	// Cache the last content element so `onCloseComplete` still receives a node
	// after children unmount (with reduced motion `contentRef` can clear before
	// `onExitFinish` fires).
	const lastContentElRef = useRef<HTMLDivElement | null>(null);
	// Callback ref runs at commit (not during render), so both refs stay
	// populated without a render-time side effect. `lastContentElRef` only
	// overwrites with a non-null node, preserving it across the unmount.
	const setContentEl = useCallback((el: HTMLDivElement | null) => {
		contentRef.current = el;
		if (el) {
			lastContentElRef.current = el;
		}
	}, []);

	// Analytics-wrapped close handlers, one per legacy trigger.
	const handleEscapeClose = usePlatformLeafEventHandler({
		fn: (evt: SyntheticEvent<HTMLElement>, analyticsEvent) => onClose?.(evt, analyticsEvent),
		action: 'dismissed',
		componentName: 'drawer',
		packageName: process.env._PACKAGE_NAME_ as string,
		packageVersion: process.env._PACKAGE_VERSION_ as string,
		analyticsData: {
			trigger: 'escKey',
		},
	});

	const handleBlanketClose = usePlatformLeafEventHandler({
		fn: (evt: SyntheticEvent<HTMLElement>, analyticsEvent) => onClose?.(evt, analyticsEvent),
		action: 'dismissed',
		componentName: 'drawer',
		packageName: process.env._PACKAGE_NAME_ as string,
		packageVersion: process.env._PACKAGE_VERSION_ as string,
		analyticsData: {
			trigger: 'blanket',
		},
	});

	const handleBackButtonClose = usePlatformLeafEventHandler({
		fn: (evt: SyntheticEvent<HTMLElement>, analyticsEvent) => onClose?.(evt, analyticsEvent),
		action: 'dismissed',
		componentName: 'drawer',
		packageName: process.env._PACKAGE_NAME_ as string,
		packageVersion: process.env._PACKAGE_VERSION_ as string,
		analyticsData: {
			trigger: 'backButton',
		},
	});

	// Bridge the Dialog primitive's `onClose({ reason })` to the legacy
	// `onClose(event, analyticsEvent)` contract via a synthetic event. Drawer
	// has no `shouldCloseOn*` props, so both reasons always forward.
	const handleDialogClose = useCallback(
		({ reason }: { reason: TDialogCloseReason }) => {
			const event = createCloseEvent({ reason }) as unknown as SyntheticEvent<HTMLElement>;
			if (reason === 'escape') {
				handleEscapeClose(event);
			} else {
				handleBlanketClose(event);
			}
		},
		[handleEscapeClose, handleBlanketClose],
	);

	// Mirror the legacy window `keydown` listener so `onKeyDown` still fires
	// while the drawer is open.
	const handleKeyDown = useCallback(
		(evt: KeyboardEvent) => {
			onKeyDown?.(evt as unknown as SyntheticEvent);
		},
		[onKeyDown],
	);
	useEffect(() => {
		if (!isOpen) {
			return;
		}
		return bind(window, { type: 'keydown', listener: handleKeyDown });
	}, [isOpen, handleKeyDown]);

	// `onOpenComplete` once the entry animation settles (via `Dialog`'s
	// `onEnterFinish`, which the underlying hook fires for animated,
	// non-animated and reduced-motion paths).
	const handleEnterFinish = useCallback(() => {
		onOpenComplete?.(contentRef.current);
	}, [onOpenComplete]);

	// `onCloseComplete` once the exit animation settles (via `Dialog`'s
	// `onExitFinish`). This is also where a custom `shouldReturnFocus={ref}` is
	// honoured: native `<dialog>` restores focus to the trigger at the start of
	// close, so the consumer's ref is focused now that the exit is done.
	// `shouldReturnFocus={false}` is a documented best-effort limitation; native
	// always restores focus to the trigger.
	const handleExitFinish = useCallback(() => {
		onCloseComplete?.(contentRef.current ?? lastContentElRef.current);
		lastContentElRef.current = null;
		if (typeof shouldReturnFocus === 'object' && shouldReturnFocus?.current) {
			shouldReturnFocus.current.focus();
		}
	}, [onCloseComplete, shouldReturnFocus]);

	const accessibleName = getAccessibleName({ label, titleId });

	return (
		<Dialog
			isOpen={isOpen}
			onClose={handleDialogClose}
			onEnterFinish={handleEnterFinish}
			onExitFinish={handleExitFinish}
			shouldAnimate
			xcss={cx(styles.root, widthStyles[width], enterFromStyles[enterFrom])}
			enteringAnimationXcss={styles.enter}
			exitingAnimationXcss={styles.exit}
			testId={testId}
			{...accessibleName}
		>
			{/*
			 * Native modality makes the background inert but does not lock body
			 * scroll, so `DialogScrollLock` fills that gap. `isOpen={true}` holds the
			 * lock for the full visible lifetime; the `Dialog` keeps this subtree
			 * mounted through the exit animation and unmounts it once the exit
			 * settles, releasing the lock.
			 */}
			<DialogScrollLock isOpen={true} />
			{/*
			 * No `tabIndex` / `role` / `aria-modal` here: the native `<dialog>`
			 * conveys modal semantics and `showModal()` picks the first focusable
			 * descendant as initial focus. A `tabIndex` would steal that focus.
			 */}
			<div ref={setContentEl} css={styles.surface}>
				<EnsureIsInsideDrawerContext.Provider value={true}>
					<OnCloseContext.Provider value={handleBackButtonClose}>
						{children}
					</OnCloseContext.Provider>
				</EnsureIsInsideDrawerContext.Provider>
			</div>
		</Dialog>
	);
}
