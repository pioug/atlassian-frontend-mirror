/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useEffect, useState } from 'react';

import { css, jsx, keyframes } from '@compiled/react';
import type { IntlShape } from 'react-intl';

import { token } from '@atlaskit/tokens';

import { ExtensionSSRReactContextsProvider } from './ExtensionSSRReactContextsProvider';
import { useNativeEmbedSettled } from './useNativeEmbedSettled';

/*
 * Animates a native embed into the document once it has loaded.
 *
 * 1. `collapsed` — clipped to zero height and `inert`. The embed loads behind it, full size but
 *    unseen, with its own loading overlay hidden.
 * 2. `useNativeEmbedSettled` calls back once the embed has finished loading.
 * 3. `revealing` — the node animates open to its content height (400ms).
 * 4. The embed fades in (200ms), delayed so it follows the opening instead of overlapping it.
 * 5. `open` — on `animationend`, when the content first becomes visible, `inert` is dropped.
 *
 * Failure paths: never settles → `READY_TIMEOUT_MS` opens it and the embed's overlay reappears;
 * fails with no frame → still settles and opens; no `animationend` → `REVEAL_TIMEOUT_MS`. Reduced
 * motion runs the same steps with zero-length animations, so `animationend` still fires.
 *
 * Renders the wrapper span itself, in place of the default one in `ExtensionNodeWrapper`, so the
 * reveal styles sit on the element editor-core reaches through `> span >` chains from the node view
 * root. It therefore carries the default span's `relative` class and hover chrome as well.
 */

/** Long, because a MAUI app has to boot and render first. Reaching it means the signal is broken. */
const READY_TIMEOUT_MS = 30_000;

/** For when no `animationend` arrives. Must exceed the reveal. */
const REVEAL_TIMEOUT_MS = 1000;

const relativeStyles = css({
	position: 'relative',
});

// Mirrors the default span's hover chrome in `ExtensionNodeWrapper`; keep the two in step.
const hoverStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- the chrome is rendered by `Extension`, not here
	'&:has(.extension-label:hover) .extension-container, &:has(.extension-edit-toggle-container:hover) .extension-container':
		{
			boxShadow: `0 0 0 1px ${token('color.border.input')}`,
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- the chrome is rendered by `Extension`, not here
	'&:has(.extension-container:hover) .extension-label, &:has(.extension-edit-toggle-container:hover) .extension-label, & .extension-label:hover':
		{
			opacity: 1,
			backgroundColor: token('color.background.accent.gray.subtlest'),
			boxShadow: 'none',
			cursor: 'pointer',

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.always-hide-label': {
				opacity: 0,
				cursor: 'auto',
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.with-bodied-macro-live-page-styles': {
				backgroundColor: token('color.background.input'),
				boxShadow: `0 0 0 1px ${token('color.border')}`,
			},
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- the chrome is rendered by `Extension`, not here
	'&:has(.extension-label:hover) .extension-icon, &:has(.extension-container:hover) .extension-icon, &:has(.extension-edit-toggle-container:hover) .extension-icon':
		{
			display: 'inline',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- the chrome is rendered by `Extension`, not here
	'&:has(.extension-label:hover) .extension-edit-toggle-container, &:has(.extension-container:hover) .extension-edit-toggle-container, & .extension-edit-toggle-container:hover':
		{
			opacity: 1,
		},
});

const openHeight = keyframes({
	from: { height: 0 },
	to: { height: 'auto' },
});

// `display: block` because `overflow` and `height` do not apply to an inline span.
const clippedStyles = css({
	display: 'block',
	overflow: 'hidden',
});

/**
 * Shut, and with the embed's own loading overlay hidden, so only one loading state shows. Only while
 * closed: once open the embed shows its own progress again, which a node opened by the fail-safe
 * timeout needs. Hiding the overlay here keeps `data-native-embed-loading` set, which is the signal
 * the reveal waits on.
 */
const collapsedStyles = css({
	height: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- the overlay is rendered by native-embeds-core, not here
	'& [data-testid$="--loading-overlay"]': {
		display: 'none',
	},
});

const revealingStyles = css({
	interpolateSize: 'allow-keywords',
	animationName: openHeight,
	// Must match the fade's `animationDelay` below, or they stop being sequential.
	animationDuration: token('motion.duration.xlong'),
	animationTimingFunction: token('motion.easing.out.practical'),
	// Zero-length, so `animationend` still fires and the sequence completes.
	'@media (prefers-reduced-motion: reduce)': {
		animationDuration: '0s',
	},
});

// Two selectors because MAUI renders a bare iframe and others nest theirs in the card wrapper; the
// second excludes that nested case so the same content is not faded twice.
const embedContentEnteringStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- the embed frame is rendered by native-embeds-core, not here
	'& [data-native-embed-card-wrapper="true"], & iframe:not([data-native-embed-card-wrapper="true"] iframe)':
		{
			animationName: token('motion.keyframe.fade.in'),
			animationDuration: token('motion.duration.medium'),
			animationTimingFunction: token('motion.easing.out.practical'),
			// Held until the opening finishes; must match `revealingStyles` above.
			animationDelay: token('motion.duration.xlong'),
			animationFillMode: 'both',
			'@media (prefers-reduced-motion: reduce)': {
				animationDuration: '0s',
				animationDelay: '0s',
			},
		},
});

/** Mirrored onto `data-extension-reveal`. */
type RevealState = 'collapsed' | 'revealing' | 'open';

type Props = {
	children: React.ReactNode;
	intl: IntlShape | undefined;
	showMacroInteractionDesignUpdates: boolean | undefined;
};

export const GeneratedContentReveal = ({
	children,
	intl,
	showMacroInteractionDesignUpdates,
}: Props): React.JSX.Element => {
	// Held in state so the effects below run once the span exists.
	const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(null);
	const [state, setState] = useState<RevealState>('collapsed');

	// Only a collapsed node opens, so whichever of the readiness signal and the fail-safe timer
	// comes second changes nothing.
	const startRevealing = useCallback(() => {
		setState((current) => (current === 'collapsed' ? 'revealing' : current));
	}, []);

	// Step 2 → 3.
	useNativeEmbedSettled(wrapperElement, startRevealing);

	// One timer, set on mount, so the deadline never moves.
	useEffect(() => {
		const timer = setTimeout(startRevealing, READY_TIMEOUT_MS);
		return () => clearTimeout(timer);
	}, [startRevealing]);

	useEffect(() => {
		if (state !== 'revealing') {
			return;
		}

		const timer = setTimeout(() => setState('open'), REVEAL_TIMEOUT_MS);
		return () => clearTimeout(timer);
	}, [state]);

	// Clipped content, and content waiting out the fade's delay, are invisible but still focusable.
	// Set as an attribute because `inert` is absent from the React 18 JSX types.
	useEffect(() => {
		wrapperElement?.toggleAttribute('inert', state !== 'open');
	}, [state, wrapperElement]);

	const onAnimationEnd = useCallback((event: React.AnimationEvent<HTMLElement>) => {
		// The extension's own content animates too, and those events bubble.
		if (event.target === event.currentTarget) {
			setState('open');
		}
	}, []);

	return (
		<ExtensionSSRReactContextsProvider intl={intl}>
			<span
				data-testid="extension-node-wrapper"
				data-extension-reveal={state}
				ref={setWrapperElement}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- the block controls and the SSR cleanup find the wrapper by `span.relative`
				className={showMacroInteractionDesignUpdates ? 'relative' : undefined}
				css={[
					hoverStyles,
					showMacroInteractionDesignUpdates && relativeStyles,
					state !== 'open' && clippedStyles,
					state === 'collapsed' && collapsedStyles,
					state === 'revealing' && revealingStyles,
					state !== 'collapsed' && embedContentEnteringStyles,
				]}
				onAnimationEnd={onAnimationEnd}
			>
				{children}
			</span>
		</ExtensionSSRReactContextsProvider>
	);
};
