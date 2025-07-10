/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import type { NewIconProps } from '@atlaskit/icon';
import SearchIcon from '@atlaskit/icon/core/search';
import { Pressable, Show, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { IconButton } from './themed/migration';

const styles = cssMap({
	root: {
		gridTemplateColumns: 'auto 1fr auto',
		alignItems: 'center',
		backgroundColor: token('color.background.input'),
		borderRadius: token('border.radius.100'),
		boxSizing: 'border-box',
		cursor: 'text',
		display: 'none',
		height: '32px',
		maxWidth: '680px',
		paddingBlock: token('space.0'),
		paddingInline: token('space.075'),
		width: '100%',
		'&:hover': {
			backgroundColor: token('color.background.input.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.input.pressed'),
		},
		'@media (min-width: 30rem)': {
			display: 'grid',
		},
	},
	buttonText: {
		gridColumn: '1 / -1',
		gridRow: 1,
	},
	iconBefore: {
		display: 'flex',
		gridColumn: 1,
		gridRow: 1,
	},
	elemAfter: {
		display: 'flex',
		gridColumn: 3,
		gridRow: 1,
	},
});

/**
 * __Search__
 *
 * The search element for the top navigation.
 */
export const Search = ({
	label,
	onClick,
	iconBefore: IconBefore = SearchIcon,
	elemAfter,
	interactionName,
	'aria-haspopup': ariaHaspopup,
}: {
	/**
	 * Provide an accessible label, often used by screen readers.
	 */
	label: React.ReactNode;
	/**
	 * The icon component to render before the search input.
	 */
	iconBefore?: React.ComponentType<NewIconProps & { spacing: 'spacious' }>;
	/**
	 * The component to render after the search input.
	 */
	elemAfter?: React.ReactNode;
	/**
	 * Handler called on click.
	 */
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	/**
	 * An optional name used to identify events for [React UFO (Unified Frontend Observability) press interactions](https://developer.atlassian.com/platform/ufo/react-ufo/react-ufo/getting-started/#quick-start--press-interactions). For more information, see [React UFO integration into Design System components](https://go.atlassian.com/react-ufo-dst-integration).
	 */
	interactionName?: string;
	'aria-haspopup'?: React.AriaAttributes['aria-haspopup'];
}) => (
	<Fragment>
		<Pressable
			style={{
				// To win the specificity war against Emotion we move this into inline styles
				// When Emotion has been stripped from the Design System move this to Compiled.
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				cursor: 'text',
				border: `${token('border.width')} solid ${token('color.border.input')}`,
			}}
			onClick={onClick}
			xcss={styles.root}
			interactionName={interactionName}
			aria-haspopup={ariaHaspopup}
		>
			<span css={styles.iconBefore}>
				<IconBefore color={token('color.icon.subtle')} spacing="spacious" label="" />
			</span>
			<div css={styles.buttonText}>
				<Text color="color.text.subtlest">{label}</Text>
			</div>
			{elemAfter && <span css={styles.elemAfter}>{elemAfter}</span>}
		</Pressable>
		{/* TODO: replace with media query */}
		<Show below="xs">
			<IconButton
				label={label}
				appearance="subtle"
				icon={SearchIcon}
				onClick={onClick}
				interactionName={interactionName}
				aria-haspopup={ariaHaspopup}
			/>
		</Show>
	</Fragment>
);
