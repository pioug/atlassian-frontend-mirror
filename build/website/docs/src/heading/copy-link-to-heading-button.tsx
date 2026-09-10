/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { Pressable } from '@atlaskit/primitives/compiled';
import Tooltip from '@atlaskit/tooltip';
import { cssMap, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import LinkIcon from '@atlaskit/icon/core/link';

const COPY_CONFIRM_TIMEOUT = 3000;

const pressableStyles = cssMap({
	root: {
		display: 'flex',
		alignItems: 'center',
		backgroundColor: token('color.background.neutral.subtle'),
		// Always shown on mobile
		opacity: '1',
		'&:focus-within': {
			// Show the button when the user focuses on it.
			opacity: '1',
		},
		'@media (min-width: 64rem)': {
			// On desktop, position the button in front of the heading
			position: 'absolute',
			marginInlineStart: token('space.negative.400'),
			paddingInlineEnd: 0,
			paddingInlineStart: 0,
			// CSS variables are set in the `HeadingWithSectionLink` component,
			// so that the button can appear when the heading is hovered over.
			opacity: 'var(--btn-opacity)',
			transform: 'var(--btn-transform)',
		},
		'@media (prefers-reduced-motion: no-preference)': {
			transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
		},
	},
});

function extractURLWithHash(window: Window, newHash: string): string {
	const fullURLWithHash = window.location.href;
	const existingHashIfAny = window.location.hash;
	const urlWithHash = fullURLWithHash.replace(existingHashIfAny, '') + newHash;
	return urlWithHash;
}

/**
 * Allows a user to copy a URL to their clipboard.
 *
 * This component is mostly copied from the `ClickCopyAnchor` component in the `design-system-docs-ui` package.
 * packages/design-system/design-system-docs-ui/src/click-copy-anchor/index.tsx
 */
export function CopyLinkToHeadingButton({ headingId }: { headingId: string }): JSX.Element {
	const [isCopied, setIsCopied] = useState(false);
	const updateTooltip = useRef<() => void>();

	const handleClick = useCallback(async () => {
		const urlToCopy = extractURLWithHash(window, `#${headingId}`);
		await navigator.clipboard.writeText(urlToCopy);
		setIsCopied(true);
	}, [headingId]);

	// Required for keeping tooltip position aligned when the content changes
	useLayoutEffect(() => {
		updateTooltip.current?.();
	}, [isCopied]);

	// Dismiss copy confirm popup in 3s
	useEffect(() => {
		if (!isCopied) {
			return;
		}

		const timeoutId = window.setTimeout(() => {
			setIsCopied(false);
		}, COPY_CONFIRM_TIMEOUT);

		return function cleanup() {
			window.clearTimeout(timeoutId);
		};
	}, [isCopied]);

	return (
		<Tooltip
			content={({ update }) => {
				updateTooltip.current = update;
				return isCopied ? 'Copied!' : 'Copy link to heading';
			}}
			position="top"
		>
			{(tooltipProps) => (
				<Pressable
					{...tooltipProps}
					onClick={handleClick}
					// @ts-ignore
					// eslint-disable-next-line @compiled/no-suppress-xcss
					xcss={pressableStyles.root}
					aria-label="Copy link to heading"
					// The aria-describedby attribute is used to announce the heading content to screen readers, after the label
					aria-describedby={headingId}
				>
					<LinkIcon spacing="spacious" label="" color={token('color.link')} />
				</Pressable>
			)}
		</Tooltip>
	);
}
