/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect, useState } from 'react';

import { keyframes } from '@compiled/react';

import { css, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

/**
 * Only `collapsed` and `revealing` size and clip the content. `open` drops back to plain
 * block layout, so the reveal leaves nothing behind for selection outlines, resize handles
 * or badges to collide with.
 */
type RevealState = 'collapsed' | 'revealing' | 'open';

/** Which path opened the node. Surfaced as a data attribute for debugging. */
type RevealTrigger = 'ready' | 'timeout';

// A `0fr -> 1fr` grid row opens out to the content's natural height without anyone having to
// measure it, which matters because the card's height comes from an aspect-ratio padding
// further down the tree.
const openRow = keyframes({
	from: { gridTemplateRows: '0fr' },
	to: { gridTemplateRows: '1fr' },
});

const collapsedStyles = css({
	display: 'grid',
	gridTemplateRows: '0fr',
});

const revealStyles = css({
	display: 'grid',
	gridTemplateRows: '1fr',
	animationName: openRow,
	// Must match the preview fade's `animationDelay` in media-card's
	// `imageContainer-compiled.tsx`, or the two stop being sequential.
	animationDuration: token('motion.duration.xlong'),
	animationTimingFunction: token('motion.easing.out.practical'),
	animationFillMode: 'backwards',
	'@media (prefers-reduced-motion: reduce)': {
		animation: 'none',
	},
});

const clippedStyles = css({
	overflow: 'hidden',
	minHeight: 0,
});

/**
 * Fail-safe, not a normal path: opens the node even if the preview never reports itself
 * rendered, so a failed or hanging image still ends up visible rather than staying collapsed.
 * Also covers lazy loading, where a card collapsed to zero height may never satisfy the
 * IntersectionObserver that triggers its fetch.
 *
 * Deliberately generous, because opening early is worse than opening late — the space then
 * reveals the card's own loading treatment instead of the image, and an AI-generated image has
 * to be generated, uploaded, processed and fetched first. `data-media-reveal-trigger` shows
 * which path fired; `timeout` in normal use means the readiness signal is broken.
 */
const READY_TIMEOUT_MS = 30_000;

// Backstop for reduced motion and browsers that don't interpolate grid-template-rows, where no
// animationend fires. Must stay comfortably longer than the reveal, or it cuts it off part way.
const REVEAL_TIMEOUT_MS = 1000;

type GeneratedMediaRevealProps = {
	children: React.ReactNode;
	isEnabled: boolean;
	/** The node is held closed until this is true, so the wait happens before the document moves. */
	isReady: boolean;
	/**
	 * Identity of the media being revealed. Changing it restarts the reveal, so media replaced
	 * in place waits for its own preview instead of inheriting the previous file's open state.
	 */
	mediaKey?: string;
};

/**
 * Opens the document out to make room for a media node once its preview is ready, rather than
 * having the node snap into place at full height. For AI-generated media in the Create with
 * Rovo preview, where images are inserted after the surrounding content has streamed in:
 * holding the node closed until the preview has rendered means the space opens exactly once,
 * with the image already fading in, so there is no placeholder to look at in between.
 */
export const GeneratedMediaReveal = ({
	children,
	isEnabled,
	isReady,
	mediaKey,
}: GeneratedMediaRevealProps): React.JSX.Element => {
	const [state, setState] = useState<RevealState>('collapsed');
	const [trigger, setTrigger] = useState<RevealTrigger>();

	// Reset during render rather than remounting on a `key`, which would also remount the card
	// below and restart its fetch. The reveal's effect only runs while `collapsed`, so without
	// this a replacement would appear at once, having inherited the previous file's `open`.
	const [renderedMediaKey, setRenderedMediaKey] = useState(mediaKey);
	if (mediaKey !== renderedMediaKey) {
		setRenderedMediaKey(mediaKey);
		setState('collapsed');
		setTrigger(undefined);
	}

	useEffect(() => {
		if (!isEnabled || state !== 'collapsed') {
			return;
		}

		if (isReady) {
			setTrigger('ready');
			setState('revealing');
			return;
		}

		const timer = setTimeout(() => {
			setTrigger('timeout');
			setState('revealing');
		}, READY_TIMEOUT_MS);

		return () => clearTimeout(timer);
	}, [isEnabled, isReady, state]);

	useEffect(() => {
		if (state !== 'revealing') {
			return;
		}

		const timer = setTimeout(() => setState('open'), REVEAL_TIMEOUT_MS);
		return () => clearTimeout(timer);
	}, [state]);

	if (!isEnabled) {
		return <React.Fragment>{children}</React.Fragment>;
	}

	return (
		<div
			data-media-reveal={state}
			data-media-reveal-trigger={trigger}
			css={[state === 'collapsed' && collapsedStyles, state === 'revealing' && revealStyles]}
			onAnimationEnd={(event) => {
				// The media card runs animations of its own, which bubble through here.
				if (event.target === event.currentTarget) {
					setState('open');
				}
			}}
		>
			<div css={state !== 'open' && clippedStyles}>{children}</div>
		</div>
	);
};
