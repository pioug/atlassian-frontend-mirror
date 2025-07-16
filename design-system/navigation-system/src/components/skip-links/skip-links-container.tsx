/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Text } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { useSortedSkipLinks } from '../../context/skip-links/skip-links-data-context';
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
		borderRadius: token('border.radius'),
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
 * Even though we hide them if you press TAB it will reopen the list and move to the next one...
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

const isOnlyWhitespaceRegex = /^\s*$/;

/**
 * A container element for the skip links
 * The default label will be used when the `skipLinksLabel` attribute is not
 * provided or the attribute is an empty string. If a string comprised only of
 * spaces is provided, the skip link heading element will be removed, but the
 * default label will still be used in `title` attribute of the skip links
 * themselves.
 */
export const SkipLinksContainer = ({ label, testId }: { label: string; testId?: string }) => {
	const sortedSkipLinks = useSortedSkipLinks();
	if (sortedSkipLinks.length === 0) {
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
				{sortedSkipLinks.map(({ id, label, onBeforeNavigate }: SkipLinkData) => (
					<SkipLink key={id} id={id} onBeforeNavigate={onBeforeNavigate}>
						{label}
					</SkipLink>
				))}
			</ol>
		</div>
	);
};
