/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import {
	type CSSProperties,
	type ReactNode,
	type SyntheticEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from 'react';

import { cssMap, cx, jsx } from '@compiled/react';
import { bind } from 'bind-event-listener';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import { type Direction } from '@atlaskit/motion/types';
import { type CURRENT_SURFACE_CSS_VAR, token } from '@atlaskit/tokens';
import { type TAnimationPreset } from '@atlaskit/top-layer/animations';
import { createCloseEvent, Dialog, type TDialogCloseReason } from '@atlaskit/top-layer/dialog';
import { DialogScrollLock } from '@atlaskit/top-layer/dialog-scroll-lock';

import { EnsureIsInsideDrawerContext } from '../ensure-is-inside-drawer-context';
import { OnCloseContext } from '../on-close-context';
import { type DrawerProps, type DrawerWidth } from '../types';
import useDrawerStack from '../use-drawer-stack';

const LOCAL_CURRENT_SURFACE_CSS_VAR: typeof CURRENT_SURFACE_CSS_VAR =
	'--ds-elevation-surface-current';

// Legacy drawer panel uses `SlideIn duration="small"`, which resolves to
// 100ms on enter and 50ms on exit.
const slideEnterDurationMs = 100;
const slideExitDurationMs = 50;

// Legacy drawer blanket is a separate `FadeIn duration="large"`, which resolves
// to 700ms on enter and 350ms on exit. These intentionally differ from the panel
// slide timings to preserve the old visual behavior.
const fadeEnterDurationMs = 700;
const fadeExitDurationMs = 350;

function drawerSlideIn({ from = 'left' }: { from?: Direction } = {}): TAnimationPreset {
	return {
		name: `drawer-slide-${from}`,
		enterDurationMs: slideEnterDurationMs,
		exitDurationMs: slideExitDurationMs,
	};
}

const styles = cssMap({
	root: {
		transitionProperty: 'transform, overlay, display',
		transitionDuration: `${slideExitDurationMs}ms`,
		transitionTimingFunction: 'cubic-bezier(0.2,0,0,1)',
		transitionBehavior: 'allow-discrete',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- the [open] attribute selector targets the dialog's own open state and is required for the open and close animation
		'&[open]': {
			transform: 'none',
			transitionDuration: `${slideEnterDurationMs}ms`,
		},
		'&::backdrop': {
			backgroundColor: 'transparent',
			transitionProperty: 'background-color, overlay, display',
			transitionDuration: `${fadeExitDurationMs}ms`,
			transitionTimingFunction: 'cubic-bezier(0.15,1,0.3,1)',
			transitionBehavior: 'allow-discrete',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- the [open] attribute selector targets the dialog's own open state and is required for the open and close animation
		'&[open]::backdrop': {
			backgroundColor: token('color.blanket', '#050C1F75'),
			transitionDuration: `${fadeEnterDurationMs}ms`,
			'@starting-style': {
				backgroundColor: 'transparent',
			},
		},
		'@media (prefers-reduced-motion: reduce)': {
			transitionDuration: '0s',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- the [open] attribute selector targets the dialog's own open state and is required for the open and close animation
			'&[open]': {
				transitionDuration: '0s',
			},
			'&::backdrop': {
				transitionDuration: '0s',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- the [open] attribute selector targets the dialog's own open state and is required for the open and close animation
			'&[open]::backdrop': {
				transitionDuration: '0s',
			},
		},
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

const drawerAnimationStyles = cssMap({
	left: {
		transform: 'translateX(-100%)',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- starting-style must target the dialog's own open state for entry animation
		'&[open]': {
			'@starting-style': {
				transform: 'translateX(-100%)',
			},
		},
	},
	right: {
		transform: 'translateX(100%)',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- starting-style must target the dialog's own open state for entry animation
		'&[open]': {
			'@starting-style': {
				transform: 'translateX(100%)',
			},
		},
	},
	top: {
		transform: 'translateY(-100%)',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- starting-style must target the dialog's own open state for entry animation
		'&[open]': {
			'@starting-style': {
				transform: 'translateY(-100%)',
			},
		},
	},
	bottom: {
		transform: 'translateY(100%)',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- starting-style must target the dialog's own open state for entry animation
		'&[open]': {
			'@starting-style': {
				transform: 'translateY(100%)',
			},
		},
	},
});

// Width presets mirror the legacy `DrawerPanel`. Applied to the `<dialog>` (the
// sized, edge-pinned element) and clamped to the viewport for mobile safety.
const WIDTH_MAP: Record<DrawerWidth, string> = {
	narrow: '360px',
	medium: '480px',
	wide: '600px',
	extended: '95vw',
	full: '100vw',
};

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
	const stackIndex = useDrawerStack({ isOpen });

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

	// Pin the `<dialog>` full-height to the inline-start edge (overriding the
	// primitive's centred `margin: auto`); width from the preset, clamped to the
	// viewport. `enterFrom` only drives the slide animation, not the pin edge;
	// it matches the legacy panel, which always pins `inset-inline-start`.
	const dialogStyle: CSSProperties = {
		margin: 0,
		insetBlockStart: 0,
		insetInlineStart: 0,
		insetInlineEnd: 'auto',
		height: '100dvh',
		maxHeight: '100dvh',
		width: `min(${WIDTH_MAP[width]}, 100vw)`,
	};

	// Memoized so the animation preset object is rebuilt only when `enterFrom`
	// changes, not on every render.
	const animate = useMemo(() => drawerSlideIn({ from: enterFrom }), [enterFrom]);

	const accessibleName = getAccessibleName({ label, titleId });

	return (
		<Dialog
			isOpen={isOpen}
			onClose={handleDialogClose}
			onEnterFinish={handleEnterFinish}
			onExitFinish={handleExitFinish}
			animate={animate}
			xcss={cx(styles.root, drawerAnimationStyles[enterFrom])}
			shouldHideBackdrop={stackIndex > 0}
			testId={testId}
			{...accessibleName}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={dialogStyle}
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
