import React, { memo } from 'react';

import Button from '@atlaskit/button/standard-button';
import { cssMap, cx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Anchor, Box, Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { SectionMessageActionProps } from './types';

const styles = cssMap({
	common: {
		color: token('color.link'),
		font: token('font.body'),
		fontWeight: token('font.weight.medium'),

		'&:hover': {
			color: token('color.link'),
		},

		'&:active': {
			color: token('color.link.pressed'),
		},
	},
	anchor: {
		'&:hover': {
			textDecoration: 'underline',
		},

		'&:visited': {
			color: token('color.link.visited'),
		},

		// @ts-expect-error - chained pseudos are not supported properly
		'&:visited:hover': {
			color: token('color.link.visited'),
		},
		'&:visited:active': {
			color: token('color.link.visited.pressed'),
		},
	},
	pressable: {
		backgroundColor: token('color.background.neutral.subtle'),
		paddingTop: token('space.0'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),

		'&:hover': {
			textDecoration: 'underline',
		},
	},
});

/**
 * __Section message action__
 *
 * A section message action is designed to work with the `action` prop from
 * `SectionMessage`. It renders either a button or a link depending on whether
 * an `onClick` or `href` prop is supplied, with a dot separator in between actions.
 *
 * - [Examples](https://atlassian.design/components/section-message/examples#actions)
 */
const SectionMessageAction = memo(function SectionMessageAction({
	children,
	onClick,
	href,
	testId,
	linkComponent,
}: SectionMessageActionProps) {
	if (!linkComponent && fg('platform_section_message_action_migration')) {
		if (href) {
			return (
				<Anchor
					testId={testId}
					onClick={onClick}
					href={href}
					xcss={cx(styles.common, styles.anchor)}
				>
					{children}
				</Anchor>
			);
		}

		if (onClick) {
			return (
				<Pressable testId={testId} onClick={onClick} xcss={cx(styles.common, styles.pressable)}>
					{children}
				</Pressable>
			);
		}

		return (
			<Box as="span" testId={testId}>
				{children}
			</Box>
		);
	}

	return onClick || href ? (
		<Button
			testId={testId}
			appearance="link"
			spacing="none"
			onClick={onClick}
			href={href}
			component={href ? linkComponent : undefined}
		>
			{children}
		</Button>
	) : (
		<>{children}</>
	);
});

export default SectionMessageAction;
