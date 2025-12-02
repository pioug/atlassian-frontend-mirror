/* eslint-disable @atlaskit/design-system/no-styled-tagged-template-expression -- needs manual remediation */
import React, { type ReactNode, useRef } from 'react';

import { cssMap as cssMapCompiled, keyframes as keyframescompiled } from '@compiled/react';

import { cssMap, cx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

const kudosButtonAnimationTransformationCompiled = keyframescompiled({
	'0%': {
		transform: 'translate(-80px, -50px)',
	},
	'100%': {
		transform: 'translate(90px, -70px)',
	},
});

const styles = cssMap({
	profileImage: {
		position: 'absolute',
		top: token('space.500'),
		left: token('space.300'),
	},
	actionsFlexSpacer: {
		flex: '1 0 auto',
	},
	kudosBlobAnimationStyle: {
		display: 'none',
		height: '150px',
		width: '150px',
		zIndex: -1,
		position: 'absolute',
		top: token('space.400'),
	},
	animationWrapper: {
		clipPath: 'inset(0px 0px 0px 0px round 3px)',
		position: 'absolute',
		top: token('space.0'),
		left: token('space.0'),
		bottom: token('space.0'),
		right: token('space.0'),
	},
	animatedKudosButton: {
		marginLeft: token('space.100'),
	},
	actionButtonGroup: {
		userSelect: 'none',
		marginTop: token('space.200'),
		marginRight: token('space.0'),
		marginLeft: token('space.0'),
		marginBottom: token('space.0'),
		textAlign: 'right',
		justifyContent: 'flex-end',
		gap: token('space.075'),
		display: 'flex',
	},
	overflowActionButtonsWrapper: {
		display: 'inline-block',
		width: '32px',
		height: '32px',
	},
	cardContent: {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '136px',
	},
	detailsGroup: {
		display: 'flex',
		flexDirection: 'column',
		marginLeft: token('space.1000'),
		paddingLeft: token('space.400'),
		width: '228px',
	},

	disabledInfo: {
		font: token('font.body.small'),
		color: token('color.text'),
		marginTop: token('space.150'),
		marginRight: token('space.0'),
		marginLeft: token('space.0'),
		marginBottom: token('space.0'),
	},
	lozengeWrapper: {
		marginTop: token('space.200'),
		display: 'block',
	},
	customLozengeContainer: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
		marginTop: token('space.150'),
	},
	cardContainer: {
		position: 'relative',
		backgroundRepeat: 'no-repeat',
		backgroundSize: '100% 96px',
		paddingTop: token('space.300'),
		paddingLeft: token('space.300'),
		paddingRight: token('space.300'),
		paddingBottom: token('space.300'),
		overflow: 'hidden',
	},
	cardContainerActiveUser: {
		backgroundImage: `linear-gradient(to bottom, ${token('color.background.brand.bold')} 0%, ${token('color.background.brand.bold')} 100%)`,
	},
	cardContainerDisabledUser: {
		backgroundImage: `linear-gradient(to bottom, ${token('color.background.disabled')} 0%, ${token('color.background.disabled')} 100%)`,
	},
	cardContainerWithElevation: {
		boxShadow: token('elevation.shadow.overlay'),
		borderRadius: token('radius.small'),
	},
	detailsLabel: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		marginTop: token('space.150'),
		marginRight: token('space.0'),
		marginLeft: token('space.0'),
		marginBottom: token('space.0'),
		whiteSpace: 'nowrap',
		gap: token('space.100'),
	},
	detailsLabelNext: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		marginTop: token('space.150'),
		marginRight: token('space.0'),
		marginLeft: token('space.0'),
		marginBottom: token('space.0'),
		paddingLeft: token('space.0'),
		whiteSpace: 'nowrap',
		gap: token('space.100'),
	},
	detailsLabelExtraTopSpace: {
		marginTop: token('space.400'),
	},
	detailsLabelIcon: {
		display: 'flex',
		flexShrink: 0,
		color: token('color.text.subtlest'),
		width: '16px',
		height: '16px',
		verticalAlign: 'top',
		marginTop: token('space.0'),
	},
	detailsLabelText: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		color: token('color.text'),
		font: token('font.body.UNSAFE_small'),
		marginTop: token('space.0'),
		marginLeft: token('space.0'),
	},
	kudosBlobAnimation: {
		display: 'none',
		height: '150px',
		width: '150px',
		zIndex: -1,
		position: 'absolute',
		animationName: `${kudosButtonAnimationTransformationCompiled}`,
		animationIterationCount: 1,
		animationDuration: '3s',
		backgroundImage: `radial-gradient(circle, ${token('color.background.information.pressed')} 0%, ${token(
			'color.background.discovery.pressed',
		)} 25%, transparent 50%)`,
	},
	jobTitleLabel: {
		marginTop: token('space.0'),
		marginBottom: token('space.0'),
		marginLeft: token('space.0'),
		marginRight: token('space.0'),
	},
	appTitleLabel: {
		color: token('color.text'),
		borderRadius: token('radius.small'),
		paddingRight: token('space.075'),
		paddingLeft: token('space.075'),
		width: 'fit-content',
		marginTop: token('space.050'),
		marginBottom: token('space.0'),
		marginLeft: token('space.150'),
		marginRight: token('space.0'),
	},
});

const stylesCompiled = cssMapCompiled({
	jobTitleLabel: {
		marginTop: token('space.0'),
		marginBottom: token('space.0'),
		marginLeft: token('space.0'),
		marginRight: token('space.0'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'> #profile-card-job-title-label-text': {
			color: token('color.text.inverse'),
		},
	},
	actionButtonGroup: {
		userSelect: 'none',
		marginTop: token('space.200'),
		marginRight: token('space.0'),
		marginLeft: token('space.0'),
		marginBottom: token('space.0'),
		textAlign: 'right',
		justifyContent: 'flex-end',
		gap: token('space.075'),
		display: 'flex',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&#profile-card-action-button-group span': {
			color: token('color.text.subtle'),
		},
	},
});

export const ProfileImage = ({ children }: { children: ReactNode }): React.JSX.Element => (
	<Box xcss={cx(styles.profileImage)}>{children}</Box>
);

export const ActionsFlexSpacer = (): React.JSX.Element => (
	<Box xcss={cx(styles.actionsFlexSpacer)} />
);

export const KudosBlobAnimationStyle = (): React.JSX.Element => (
	<Box xcss={cx(styles.kudosBlobAnimationStyle)} />
);

export const KudosBlobAnimation = (): React.JSX.Element => (
	<Box xcss={cx(styles.kudosBlobAnimationStyle)} />
);

export const AnimationWrapper = ({ children }: { children: ReactNode }): React.JSX.Element => (
	<Box xcss={cx(styles.animationWrapper)}>{children}</Box>
);

export const AnimatedKudosButton = ({ children }: { children: ReactNode }): React.JSX.Element => (
	<Box xcss={cx(styles.animatedKudosButton)}>{children}</Box>
);

export const ActionButtonGroup = ({
	children,
	testId,
}: {
	children: ReactNode;
	testId?: string;
}): React.JSX.Element => (
	<Box
		testId={testId}
		xcss={cx(
			fg('enable_absolute_positioning_profile_card')
				? stylesCompiled.actionButtonGroup
				: styles.actionButtonGroup,
		)}
		id="profile-card-action-button-group"
	>
		{children}
	</Box>
);

export const OverflowActionButtonsWrapper = ({
	children,
	testId,
}: {
	children: ReactNode;
	testId?: string;
}): React.JSX.Element => (
	<Box testId={testId} xcss={cx(styles.overflowActionButtonsWrapper)}>
		{children}
	</Box>
);

export const CardContent = ({ children }: { children: ReactNode }): React.JSX.Element => (
	<Box xcss={cx(styles.cardContent)}>{children}</Box>
);

export const DetailsGroup = ({ children }: { children: ReactNode }): React.JSX.Element => (
	<Box xcss={cx(styles.detailsGroup)}>{children}</Box>
);

export const DisabledInfo = ({ children }: { children: ReactNode }): React.JSX.Element => (
	<Box xcss={cx(styles.disabledInfo)}>{children}</Box>
);

export const LozengeWrapper = ({ children }: { children: ReactNode }): React.JSX.Element => (
	<Box xcss={cx(styles.lozengeWrapper)}>{children}</Box>
);

export const CustomLozengeContainer = ({
	children,
}: {
	children: ReactNode;
}): React.JSX.Element => <Box xcss={cx(styles.customLozengeContainer)}>{children}</Box>;

export const JobTitleLabel = ({ children }: { children: ReactNode }): React.JSX.Element => {
	const textRef = useRef<HTMLElement>(null);

	return (
		<Box
			xcss={cx(
				fg('enable_absolute_positioning_profile_card')
					? stylesCompiled.jobTitleLabel
					: styles.jobTitleLabel,
			)}
		>
			{fg('enable_profilecard_text_truncation_tooltip') ? (
				<Tooltip
					content={children}
					position="bottom"
					isScreenReaderAnnouncementDisabled
					canAppear={() => {
						if (!textRef.current) {
							return false;
						}
						// Only showing the tooltip when the element has been truncated (ellipsis)
						return textRef.current.scrollHeight > textRef.current.clientHeight;
					}}
				>
					<Text
						ref={textRef}
						maxLines={1}
						color="color.text.inverse"
						id="profile-card-job-title-label-text"
					>
						{children}
					</Text>
				</Tooltip>
			) : (
				<Text
					maxLines={1}
					color="color.text.inverse"
					id="profile-card-job-title-label-text"
				>
					{children}
				</Text>
			)}
		</Box>
	);
};

export const AppTitleLabel = ({ children }: { children: ReactNode }): React.JSX.Element => (
	<Box xcss={cx(styles.appTitleLabel)} backgroundColor="color.background.neutral">
		<Text color="color.text" size="UNSAFE_small" weight="bold">
			{children}
		</Text>
	</Box>
);

interface CardContainerProps {
	isDisabledUser?: boolean;
	withoutElevation?: boolean;
	children: ReactNode;
}

export const CardContainer = ({
	children,
	isDisabledUser,
	withoutElevation,
}: CardContainerProps): React.JSX.Element => (
	<Box
		xcss={cx(
			styles.cardContainer,
			isDisabledUser ? styles.cardContainerDisabledUser : styles.cardContainerActiveUser,
			!withoutElevation && styles.cardContainerWithElevation,
		)}
	>
		{children}
	</Box>
);

export const DetailsLabel = ({
	children,
	extraTopSpace = false,
}: {
	children: ReactNode;
	extraTopSpace?: boolean;
}): React.JSX.Element => (
	<Box
		as="dl"
		xcss={cx(styles.detailsLabelNext, extraTopSpace && styles.detailsLabelExtraTopSpace)}
	>
		{children}
	</Box>
);

export const DetailsLabelIcon = ({ children }: { children: ReactNode }): React.JSX.Element => (
	<Box as="dt" xcss={cx(styles.detailsLabelIcon)}>
		{children}
	</Box>
);

export const DetailsLabelText = ({ children }: { children: ReactNode }): React.JSX.Element => (
	<Box as="dd" xcss={cx(styles.detailsLabelText)}>
		{children}
	</Box>
);
