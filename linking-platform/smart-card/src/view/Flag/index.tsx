/**
 * Smart Link flag module — imperative singleton pattern.
 *
 * ## Why not a React context provider?
 *
 * The natural approach would be to render a `<FlagProvider>` inside the Card
 * component tree, managing flag state via React context. This was the original
 * implementation. However, it caused a critical bug:
 *
 * When a parent component of smart card changed, either swap or unmount,
 * it unmounts the entire card subtree including `FlagsProvider`.
 * Any flag that was visible at that moment is instantly destroyed and lost.
 *
 * ## Why an injected React root?
 *
 * This module manages a persistent `FlagGroup` at `document.body` via its own
 * `createRoot` — completely independent of any card component tree. The root is created
 * lazily on the first `showFlag` call and kept alive indefinitely, re-rendering with
 * the current flags array on every change.
 *
 * Benefits:
 * - Flags survive any card unmount/remount cycle
 * - No provider needed anywhere in the component tree
 * - Works identically for all card paths (Card, CardSSR)
 * - Same pattern as `EmbedModal/utils.tsx` but for a persistent group
 *
 * Usage: import `showFlag` and call it directly — no provider needed.
 */
import React from 'react';

import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';
import { IntlProvider } from 'react-intl';

import { FlagGroup, type FlagProps } from '@atlaskit/flag';
import AutoDismissFlag from '@atlaskit/flag/auto-dismiss-flag';
import { fg } from '@atlaskit/platform-feature-flags';

import AIPrism from '../common/ai-prism';

const FLAG_GROUP_MOUNT_POINT_ID = 'smart-link-flags-mount';

// ---------------------------------------------------------------------------
// Module-level singleton state
// Lives for the entire page session — independent of any React component tree.
//
// The sequence:
// 1. ensureRoot()
//    └── flushSync(() => root.render(<empty FlagGroup>))
//        └── ExitingPersistence mounts with appear=false
//        └── pendingFirstRender = true
//
// 2. showFlag() detects pendingFirstRender=true
//    └── pendingFirstRender = false
//    └── setTimeout(0, () => renderToRoot())
//        ← deferred: runs AFTER useEffect fires
//
// 3. [async] ExitingPersistence's useEffect fires
//    └── appear flips false → true
//
// 4. [async] setTimeout(0) fires → renderToRoot()
//    └── FlagGroup receives flag as new child
//    └── ExitingPersistence sees new child with appear=true → ANIMATES
// ---------------------------------------------------------------------------
let flagGroupState: FlagProps[] = [];
let root: Root | null = null;
// True after ensureRoot() creates a new root but before ExitingPersistence's useEffect
// has flipped `appear` to true. While pending, the first renderToRoot is deferred via
// setTimeout so that the enter animation fires correctly.
let pendingFirstRender = false;

const removeFlag = (id: string | number) => {
	flagGroupState = flagGroupState.filter((f: FlagProps) => f.id !== id);
	renderToRoot();
};

const renderToRoot = () => {
	if (!root) {
		return;
	}

	root.render(
		<IntlProvider locale="en">
			<FlagGroup onDismissed={removeFlag}>
				{flagGroupState.map((flagProps) => {
					return (
						<AIPrism
							borderRadius={fg('platform-dst-shape-theme-default') ? 'large' : 'small'}
							isVisible={true}
							key={flagProps.id}
						>
							<AutoDismissFlag {...flagProps} key={flagProps.id} />
						</AIPrism>
					);
				})}
			</FlagGroup>
		</IntlProvider>,
	);
};

const ensureRoot = () => {
	if (root !== null || typeof document === 'undefined') {
		return;
	}

	let container = document.getElementById(FLAG_GROUP_MOUNT_POINT_ID);
	if (!container) {
		container = document.createElement('div');
		container.id = FLAG_GROUP_MOUNT_POINT_ID;
		document.body.appendChild(container);
	}

	root = createRoot(container);

	const locale = typeof navigator !== 'undefined' ? navigator.language || 'en' : 'en';

	// Render an empty FlagGroup immediately so React has a "before" state to diff against.
	// Without this, the first flag has no previous render to compare to — React mounts it
	// directly and the FlagGroup animation library sees it as "already present" rather than
	// "just entered", skipping the slide-in animation.
	// Subsequent flags always have the previous (possibly empty) render to diff against,
	// which is why they animate correctly.
	const renderEmptyFlagGroup = () =>
		root!.render(
			<IntlProvider locale={locale}>
				<FlagGroup onDismissed={removeFlag} />
			</IntlProvider>,
		);

	// Use flushSync to synchronously commit an empty FlagGroup before any flag is added.
	// This mounts ExitingPersistence (inside FlagGroup) in an empty state so that when the
	// first flag arrives (deferred via setTimeout below), ExitingPersistence recognises it
	// as a genuinely new child and runs the slide-in animation.
	try {
		flushSync(renderEmptyFlagGroup);
	} catch {
		// flushSync cannot be called during React rendering or from a lifecycle (e.g. useEffect).
		// We try it and fall back to a regular async render if React throws — in that case the
		// first flag may appear without a slide-in animation, but all subsequent flags will
		// animate correctly (ExitingPersistence will have mounted and flipped appear=true by then).
		renderEmptyFlagGroup();
	}
	// After flushSync commits the empty FlagGroup, ExitingPersistence's useEffect runs
	// asynchronously to flip `appear` from false → true (enabling enter animations).
	// We store a pending flag to signal that the first renderToRoot should be deferred.
	pendingFirstRender = true;
};

/**
 * Show a flag notification. The FlagGroup root is created lazily on first call
 * and persists for the lifetime of the page — it is never torn down by card unmounts.
 *
 * If a flag with the same `id` already exists it is replaced in-place (idempotent).
 */
type ShowFlagOptions = Omit<FlagProps, 'id'> & { id?: FlagProps['id'] };
export const showFlag = (options: ShowFlagOptions): void => {
	const flagProps: FlagProps = {
		...options,
		id: options.id || crypto.randomUUID(),
	};

	const index = flagGroupState.findIndex((f: FlagProps) => f.id === flagProps.id);
	if (index === -1) {
		flagGroupState = [flagProps, ...flagGroupState];
	} else {
		flagGroupState = flagGroupState.map((f: FlagProps, i: number) => (i === index ? flagProps : f));
	}

	ensureRoot();

	if (pendingFirstRender) {
		// ensureRoot() just created a new root and committed an empty FlagGroup via flushSync.
		// ExitingPersistence's useEffect (which flips `appear` false→true) runs asynchronously
		// after the commit. We defer renderToRoot via setTimeout(0) to ensure that useEffect
		// has already fired before the flag is added — only then will ExitingPersistence
		// treat it as a new entering child and run the slide-in animation.
		pendingFirstRender = false;
		setTimeout(() => {
			renderToRoot();
		}, 0);
	} else {
		renderToRoot();
	}
};

/**
 * Resets all module-level singleton state and removes the DOM container.
 *
 * Only intended for use in tests — do not call in production code.
 * The `_` prefix signals this is a test-only utility.
 *
 * Why exported from this file rather than a separate test helper:
 * This module manages private `let` variables (`flagsState`, `root`, etc.) that cannot
 * be accessed from outside the module closure. Exporting a reset function is the only
 * clean way to reset them without using `jest.resetModules()` (which requires all tests
 * to use `require()` instead of top-level imports and is significantly slower).
 */
export const _resetFlagsForTesting = (): void => {
	flagGroupState = [];
	pendingFirstRender = false;
	if (root) {
		root.unmount();
		root = null;
	}
	if (typeof document !== 'undefined') {
		document.getElementById(FLAG_GROUP_MOUNT_POINT_ID)?.remove();
	}
};
