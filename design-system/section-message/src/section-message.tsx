/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Children, forwardRef, Fragment, type ReactElement, useCallback, useState } from 'react';

import { IconButton } from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import CrossIcon from '@atlaskit/icon/core/cross';
import { fg } from '@atlaskit/platform-feature-flags';
import { Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { getAppearanceIconStyles } from './internal/appearance-icon';
import type { SectionMessageProps } from './types';

const sectionMessageStyles = cssMap({
	container: {
		wordBreak: 'break-word',
		borderRadius: token('radius.small'),
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
	},
	// platform-dst-shape-theme-default TODO: Merge into base after rollout
	containerT26Shape: {
		borderRadius: token('radius.large'),
	},
	iconContainer: {
		display: 'flex',
		marginBlock: token('space.negative.025'),
	},
	contentContainer: {
		flexGrow: 1,
	},
	content: {
		color: token('color.text'),
		font: token('font.body'),
	},
	actionsContainer: {
		font: token('font.body'),
	},
	dismissButtonContainer: {
		marginBlockStart: token('space.negative.025'),
	},
});

const appearanceStyles = cssMap({
	information: {
		backgroundColor: token('color.background.information'),
	},
	warning: {
		backgroundColor: token('color.background.warning'),
	},
	error: {
		backgroundColor: token('color.background.danger'),
	},
	success: {
		backgroundColor: token('color.background.success'),
	},
	discovery: {
		backgroundColor: token('color.background.discovery'),
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
const SectionMessage: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<SectionMessageProps> & React.RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, SectionMessageProps>(function SectionMessage(
	{ children, appearance = 'information', actions, title, icon, isDismissible, onDismiss, testId },
	ref,
) {
	const [dismissed, setDismissed] = useState<boolean>(false);

	const handleDismiss = useCallback(() => {
		onDismiss?.();
		setDismissed(true);
	}, [onDismiss]);

	const {
		primaryIconColor: primaryColor,
		backgroundColor: secondaryColor,
		Icon,
	} = getAppearanceIconStyles(appearance, icon);

	const actionElements =
		actions && (actions as ReactElement).type === Fragment
			? (actions as ReactElement).props.children
			: actions;
	const actionsArray = Children.toArray(actionElements);

	return isDismissible && dismissed ? null : (
		<section
			data-testid={testId}
			ref={ref}
			css={[
				sectionMessageStyles.container,
				fg('platform-dst-shape-theme-default') && sectionMessageStyles.containerT26Shape,
				appearanceStyles[appearance],
			]}
		>
			<Inline space="space.200" alignBlock="stretch">
				<div css={sectionMessageStyles.iconContainer}>
					{/* @ts-ignore - Workaround for typecheck issues with help-center local consumption */}
					<Icon
						size="medium"
						primaryColor={primaryColor}
						secondaryColor={secondaryColor}
						// props for new icon
						color={primaryColor}
						spacing="spacious"
					/>
				</div>
				<Stack
					space="space.100"
					testId={testId && `${testId}--content`}
					xcss={sectionMessageStyles.contentContainer}
				>
					{!!title && (
						<Heading as="h2" size="small">
							{title}
						</Heading>
					)}
					<div css={sectionMessageStyles.content}>{children}</div>
					{actionsArray.length > 0 && (
						<Inline
							shouldWrap
							testId={testId && `${testId}--actions`}
							separator="·"
							space="space.100"
							rowSpace="space.0"
							// Only use a list role if more than one action is present
							role={actionsArray.length > 1 ? 'list' : undefined}
							xcss={sectionMessageStyles.actionsContainer}
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
				{isDismissible && (
					<div css={sectionMessageStyles.dismissButtonContainer}>
						<IconButton
							testId={testId && `${testId}--dismiss-button`}
							label="Dismiss"
							icon={CrossIcon}
							appearance="subtle"
							onClick={handleDismiss}
							spacing="compact"
						/>
					</div>
				)}
			</Inline>
		</section>
	);
});

SectionMessage.displayName = 'SectionMessage';

export default SectionMessage;
