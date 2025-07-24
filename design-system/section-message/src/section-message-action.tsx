/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, memo } from 'react';

import Button from '@atlaskit/button/standard-button';
import { cssMap, cx, jsx } from '@atlaskit/css';
import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';
import { Anchor, Box, Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { SectionMessageActionProps } from './types';

const stylesOld = cssMap({
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

const styles = cssMap({
	common: {
		font: token('font.body'),
	},
	anchor: {
		fontWeight: token('font.weight.regular'),
	},
	pressable: {
		color: token('color.link'),
		fontWeight: token('font.weight.medium'),
		backgroundColor: 'transparent',
		paddingTop: token('space.0'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),

		'&:hover': {
			textDecoration: 'underline',
			color: token('color.link'),
		},

		'&:active': {
			color: token('color.link.pressed'),
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
	target,
}: SectionMessageActionProps) {
	if (!linkComponent && fg('platform_section_message_action_migration')) {
		if (href) {
			if (fg('platform_dst_section_message_actions_as_link')) {
				return (
					<span css={[styles.common, styles.anchor]}>
						<Link testId={testId} onClick={onClick} href={href} target={target}>
							{children}
						</Link>
					</span>
				);
			}

			return (
				<Anchor
					testId={testId}
					onClick={onClick}
					href={href}
					xcss={cx(stylesOld.common, stylesOld.anchor)}
				>
					{children}
				</Anchor>
			);
		}

		if (onClick) {
			return (
				<Pressable
					testId={testId}
					onClick={onClick}
					xcss={cx(
						fg('platform_dst_section_message_actions_as_link') ? styles.common : stylesOld.common,
						fg('platform_dst_section_message_actions_as_link')
							? styles.pressable
							: stylesOld.pressable,
					)}
				>
					{children}
				</Pressable>
			);
		}

		return (
			<Box
				as="span"
				testId={testId}
				xcss={fg('platform_dst_section_message_actions_as_link') && styles.common}
			>
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
		<Fragment>{children}</Fragment>
	);
});

export default SectionMessageAction;
