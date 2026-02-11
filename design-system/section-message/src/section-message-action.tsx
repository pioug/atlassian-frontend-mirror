/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, memo } from 'react';

import Button from '@atlaskit/button/standard-button';
import { cssMap, cx, jsx } from '@atlaskit/css';
import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { SectionMessageActionProps } from './types';

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
	pressableT26Shape: {
		borderRadius: token('radius.xsmall'),
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
const SectionMessageAction: import("react").NamedExoticComponent<SectionMessageActionProps> = memo(function SectionMessageAction({
	children,
	onClick,
	href,
	testId,
	linkComponent,
	target,
}: SectionMessageActionProps) {
	if (!linkComponent) {
		if (href) {
			return (
				<span css={[styles.common, styles.anchor]}>
					<Link testId={testId} onClick={onClick} href={href} target={target}>
						{children}
					</Link>
				</span>
			);
		}

		if (onClick) {
			return (
				<Pressable
					testId={testId}
					onClick={onClick}
					xcss={cx(
						styles.common,
						styles.pressable,
						fg('platform-dst-shape-theme-default') && styles.pressableT26Shape,
					)}
				>
					{children}
				</Pressable>
			);
		}

		return (
			<Box as="span" testId={testId} xcss={styles.common}>
				{children}
			</Box>
		);
	}

	// TODO: Remove this once the deprecated `linkComponent` prop is removed.
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
