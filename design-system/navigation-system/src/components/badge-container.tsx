/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ComponentType, ReactNode } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		position: 'relative',
		display: 'flex',
	},
	badgeContainer: {
		position: 'absolute',
		whiteSpace: 'nowrap',
		insetBlockStart: token('space.negative.050'),
		insetInlineStart: token('space.150'),
		// Since the badge has a chance to overlap with the button next to it we disable
		// it from having pointer events so if the button next to it is hovered it gets the event
		// and not the badge.
		pointerEvents: 'none',
	},
});

type BadgeContainerProps = {
	/* The id of the badge */
	id: string;

	/* The component to render as the badge */
	badge: ComponentType;

	/**
	 * The children to render inside the container that the badge overlays.
	 */
	children: ReactNode;

	/**
	 * Can be used to disable the default `listitem` role.
	 *
	 * As `BadgeContainer` is used internally to wrap `EndItem`, this prop is used to respect
	 * the `isListItem` prop value set in `EndItem`.
	 *
	 * See the prop description in `EndItem` for more information.
	 *
	 * @default true
	 */
	isListItem?: boolean;
};

/**
 * __Badge container__
 *
 * Adds a badge to the top right corner of the child element.
 * Example of usage is showing the number of notifications in the top navigation bar.
 */
export const BadgeContainer = ({
	children,
	id: badgeId,
	badge: Badge,
	isListItem = true,
}: BadgeContainerProps) => (
	<div css={styles.root} role={isListItem ? 'listitem' : undefined}>
		{children}
		<div css={styles.badgeContainer} id={badgeId} aria-hidden>
			<Badge />
		</div>
	</div>
);
