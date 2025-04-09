import React, { forwardRef } from 'react';

import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { getAppearanceIconStyles } from './internal/appearance-icon';
import type { SectionMessageProps } from './types';

const sectionMessageStyles = cssMap({
	container: {
		wordBreak: 'break-word',
		borderRadius: token('border.radius'),
	},
	bleed: {
		display: 'flex',
		marginBlock: token('space.negative.025'),
	},
	content: {
		color: token('color.text'),
		font: token('font.body'),
	},
	actionsContainer: {
		font: token('font.body'),
	},
});

/**
 * __Section message__
 *
 * A section message is used to alert users to a particular section of the screen.
 *
 * - [Examples](https://atlassian.design/components/section-message/examples)
 * - [Code](https://atlassian.design/components/section-message/code)
 * - [Usage](https://atlassian.design/components/section-message/usage)
 */
const SectionMessage = forwardRef<HTMLElement, SectionMessageProps>(function SectionMessage(
	{ children, appearance = 'information', actions, title, icon, testId },
	ref,
) {
	const {
		primaryIconColor: primaryColor,
		backgroundColor: secondaryColor,
		Icon,
	} = getAppearanceIconStyles(appearance, icon);

	const actionElements =
		actions && (actions as React.ReactElement).type === React.Fragment
			? (actions as React.ReactElement).props.children
			: actions;
	const actionsArray = React.Children.toArray(actionElements);

	return (
		<Box
			as="section"
			backgroundColor={appearanceMap[appearance]}
			padding="space.200"
			testId={testId}
			ref={ref}
			xcss={sectionMessageStyles.container}
		>
			<Inline space="space.200" alignBlock="stretch">
				<Box xcss={sectionMessageStyles.bleed}>
					<Icon
						size="medium"
						primaryColor={primaryColor}
						secondaryColor={secondaryColor}
						// props for new icon
						LEGACY_size="medium"
						color={primaryColor}
						spacing="spacious"
					/>
				</Box>
				<Stack space="space.100" testId={testId && `${testId}--content`}>
					{!!title && (
						<Heading as="h2" size="small">
							{title}
						</Heading>
					)}
					<Box xcss={sectionMessageStyles.content}>{children}</Box>
					{actionsArray.length > 0 && (
						<Inline
							shouldWrap
							testId={testId && `${testId}--actions`}
							separator="·"
							space="space.100"
							rowSpace="space.0"
							// Only use a list role if more than one action is present
							role={actionsArray.length > 1 ? 'list' : undefined}
							xcss={
								fg('platform_ads_explicit_font_styles') && sectionMessageStyles.actionsContainer
							}
						>
							{actionsArray.map((action, id) => (
								// Only use a listitem role if more than one action is present
								<Inline role={actionsArray.length > 1 ? 'listitem' : undefined} key={id}>
									{action}
								</Inline>
							))}
						</Inline>
					)}
				</Stack>
			</Inline>
		</Box>
	);
});

const appearanceMap = {
	information: 'color.background.information',
	warning: 'color.background.warning',
	error: 'color.background.danger',
	success: 'color.background.success',
	discovery: 'color.background.discovery',
} as const;

SectionMessage.displayName = 'SectionMessage';

export default SectionMessage;
