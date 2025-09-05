/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useMemo } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type SkipLinkData } from '../../context/skip-links/types';

import { SkipLink } from './skip-link';

const styles = cssMap({
	root: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.050'),
		paddingBlock: token('space.150'),
		paddingInline: token('space.150'),
		position: 'fixed',
		insetInlineStart: token('space.250'),
		insetBlockStart: token('space.250'),
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.small'),
		boxShadow: token('elevation.shadow.overlay'),
		/**
		 * Hiding the element while it has no focus within
		 */
		zIndex: -1,
		opacity: 0,
		pointerEvents: 'none', // Prevent clicks just in case
		'&:focus-within': {
			// @ts-expect-error - should be over any other element
			// We _could_ explore using the popover API to guarantee this without z-index hacks
			// Alternatively, if all slots + portal container are separate stacking contexts, then `zIndex: 1` should be safe
			zIndex: 'calc(infinity)',
			opacity: 1,
			pointerEvents: 'auto',
		},
	},
	skipLinkList: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.050'),
		listStylePosition: 'outside',
		listStyleType: 'none',
		marginBlockStart: token('space.0'),
		paddingInlineStart: token('space.0'),
	},
});

/**
 * Keydown handler to hide the skip links when escape is pressed.
 *
 * TODO: consider removing this, it doesn't make a lot of sense.
 * The skip links look like a popup but in reality they aren't.
 * Even though we hide them when the user presses Escape, when
 * they press TAB it will reopen the list and move to the next one...
 *
 * One potential option is to use a tree walker to focus on the
 * next focusable element in the DOM (outside the skip links
 * container).
 */
const closeOnEscape = (event: React.KeyboardEvent) => {
	if (event.key !== 'Escape') {
		return;
	}

	const activeElement = document.activeElement;
	if (activeElement instanceof HTMLElement) {
		activeElement.blur();
	}
};

const assignIndex = (num: number, arr: number[]): number => {
	if (!arr.includes(num)) {
		return num;
	}
	return assignIndex(num + 1, arr);
};

/**
 * Sorts an array of skip links by list indexes.
 *
 * Skip links with custom list indexes are positioned first, followed by regular skip links,
 * which are automatically assigned available index positions to avoid conflicts.
 */
function sortSkipLinks(arr: Array<SkipLinkData>): Array<SkipLinkData> {
	const customLinks = arr.filter((link: SkipLinkData) => Number.isInteger(link.listIndex));
	if (customLinks.length === 0) {
		return arr;
	}

	const usedIndexes = customLinks.map((a) => a.listIndex) as number[];

	const regularLinksWithIndex = arr
		.filter((link) => link.listIndex === undefined)
		.map((link, index) => {
			const listIndex = assignIndex(index, usedIndexes);
			usedIndexes.push(listIndex);
			return {
				...link,
				listIndex,
			};
		});
	return [...customLinks, ...regularLinksWithIndex].sort((a, b) => a.listIndex! - b.listIndex!);
}

const isOnlyWhitespaceRegex = /^\s*$/;

/**
 * A container element for the skip links.
 *
 * The container element is always rendered in the DOM, but is only visible when
 * focus is within the container.
 *
 * The label is used as the heading of the skip links container. If the provided label is a string
 * comprised only of only whitespace (e.g. '' or ' '), the skip link heading element will be removed.
 *
 * The links prop is only used when the feature flag is enabled.
 */
export function SkipLinksContainer({
	label,
	testId,
	links,
}: {
	label: string;
	testId?: string;
	links: Array<SkipLinkData>;
}) {
	const sortedLinks = useMemo(() => {
		return sortSkipLinks(links);
	}, [links]);

	if (sortedLinks.length === 0) {
		return null;
	}

	const isEmptyLabel = isOnlyWhitespaceRegex.test(label);

	return (
		// Capturing bubbled events, element itself is not interactive
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			onKeyDown={closeOnEscape}
			css={[styles.root]}
			data-testid={testId ? `${testId}--skip-links-container` : undefined}
		>
			{!isEmptyLabel && (
				<Text weight="bold" testId={testId ? `${testId}--skip-links-container--label` : undefined}>
					{label}
				</Text>
			)}
			<ol css={[styles.skipLinkList]}>
				{sortedLinks.map(({ id, label, onBeforeNavigate }: SkipLinkData) => (
					<SkipLink key={id} id={id} onBeforeNavigate={onBeforeNavigate}>
						{label}
					</SkipLink>
				))}
			</ol>
		</div>
	);
}
