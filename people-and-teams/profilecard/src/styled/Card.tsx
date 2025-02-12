/* eslint-disable @atlaskit/design-system/no-styled-tagged-template-expression -- needs manual remediation */
import React, { type ReactNode } from 'react';

import { keyframes as keyframescompiled } from '@compiled/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { keyframes } from '@emotion/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { cssMap, cx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { B200, N50A, N60A } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import {
	appLabelBgColor,
	appLabelTextColor,
	bgColor,
	headerBgColor,
	headerBgColorDisabledUser,
	headerTextColor,
	labelIconColor,
	labelTextColor,
} from './constants';

const kudosButtonAnimationTransformationCompiled = keyframescompiled({
	'0%': {
		transform: 'translate(-80px, -50px)',
	},
	'100%': {
		transform: 'translate(90px, -70px)',
	},
});

const styles = cssMap({
	cardWrapper: {
		borderRadius: token('border.radius'),
		width: '360px',
	},
	profileImage: {
		position: 'absolute',
		top: token('space.300'),
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
	spinnerContainer: {
		alignItems: 'center',
		display: 'flex',
		height: '96px',
		justifyContent: 'center',
		position: 'relative',
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
		borderRadius: token('border.radius'),
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
		marginLeft: token('space.150'),
		marginRight: token('space.0'),
	},
	appTitleLabel: {
		color: token('color.text'),
		borderRadius: token('border.radius'),
		paddingRight: token('space.075'),
		paddingLeft: token('space.075'),
		width: 'fit-content',
		marginTop: token('space.050'),
		marginBottom: token('space.0'),
		marginLeft: token('space.150'),
		marginRight: token('space.0'),
	},
});

export const CardWrapper = ({
	children,
	role,
	testId,
	labelledBy,
}: {
	children: ReactNode;
	role?: string;
	testId?: string;
	labelledBy?: string;
}) =>
	fg('compiled-migration-profilecard') ? (
		<Box
			xcss={cx(styles.cardWrapper)}
			backgroundColor={'elevation.surface.overlay'}
			role={role}
			testId={testId}
			aria-labelledby={labelledBy}
		>
			{children}
		</Box>
	) : (
		<CardWrapperLegacy data-testid={testId} role={role} aria-labelledby={labelledBy}>
			{children}
		</CardWrapperLegacy>
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const CardWrapperLegacy = styled.div`
	background-color: ${bgColor};
	border-radius: ${token('border.radius', '3px')};
	width: 360px;
`;

export const ProfileImage = ({ children }: { children: ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.profileImage)}>{children}</Box>
	) : (
		<ProfileImageLegacy>{children}</ProfileImageLegacy>
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const ProfileImageLegacy = styled.div`
	position: absolute;
	top: ${token('space.300', '24px')};
	left: ${token('space.300', '24px')};
`;

export const ActionsFlexSpacer = () =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.actionsFlexSpacer)} />
	) : (
		<ActionsFlexSpacerLegacy />
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const ActionsFlexSpacerLegacy = styled.div`
	flex: 1 0 auto;
`;

// eslint-disable-next-line @atlaskit/design-system/no-keyframes-tagged-template-expression -- needs manual remediation
const kudosButtonAnimationTransformation = keyframes`
  0%   { transform: translate(-80px, -50px); }
  100% { transform: translate(90px, -70px); }
`;

export const KudosBlobAnimationStyle = () =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.kudosBlobAnimationStyle)} />
	) : (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		<KudosBlobAnimationStyleLegacy className="kudos-blob-animation" />
	);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const KudosBlobAnimationStyleLegacy = styled.div`
	display: none;
	height: 150px;
	width: 150px;
	z-index: -1;
	position: absolute;
	top: ${32 / 14}em;
	animation-name: ${kudosButtonAnimationTransformation};
	animation-iteration-count: 1;
	animation-duration: 3s;
	background-image: radial-gradient(
		circle,
		${token('color.background.information.pressed', '#85B8FF')} 0%,
		${token('color.background.discovery.pressed', '#B8ACF6')} 25%,
		transparent 50%
	);
	overflow: hidden;
`;

export const KudosBlobAnimation = () =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.kudosBlobAnimationStyle)} />
	) : (
		<KudosBlobAnimationLegacy />
	);
const KudosBlobAnimationLegacy: React.FC = () => <KudosBlobAnimationStyle />;

export const AnimationWrapper = ({ children }: { children: ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.animationWrapper)}>{children}</Box>
	) : (
		<AnimationWrapperLegacy>{children}</AnimationWrapperLegacy>
	);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const AnimationWrapperLegacy = styled.div`
	clip-path: inset(0px 0px 0px 0px round ${borderRadius()}px);
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
`;

export const AnimatedKudosButton = ({ children }: { children: ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.animatedKudosButton)}>{children}</Box>
	) : (
		<AnimatedKudosButtonLegacy>{children}</AnimatedKudosButtonLegacy>
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const AnimatedKudosButtonLegacy = styled.div`
	margin-left: ${token('space.100', '8px')};

	/* Need babel-plugin-emotion to use component selector */
	/* Previously with styled-components: &:hover {KudosBlobAnimation} { */
	&:focus-within .kudos-blob-animation,
	&:focus .kudos-blob-animation,
	&:hover .kudos-blob-animation {
		display: block;
	}
`;

export const ActionButtonGroup = ({
	children,
	testId,
}: {
	children: ReactNode;
	testId?: string;
}) =>
	fg('compiled-migration-profilecard') ? (
		<Box testId={testId} xcss={cx(styles.actionButtonGroup)}>
			{children}
		</Box>
	) : (
		<ActionButtonGroupLegacy data-testid={testId}>{children}</ActionButtonGroupLegacy>
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const ActionButtonGroupLegacy = styled.div`
	user-select: none;
	margin: ${token('space.200', '16px')} 0 0 0;
	text-align: right;
	display: flex;
	justify-content: flex-end;

	button,
	a {
		position: relative;
	}

	button,
	a,
	span {
		margin-left: ${token('space.100', '8px')};

		&:first-child {
			margin-left: ${token('space.0', '0px')};
		}
	}

	a,
	button {
		&:focus {
			outline-color: ${token('color.border.focused', B200)};
			outline-offset: ${token('border.width', '2px')};
			outline-style: solid;
			outline-width: ${token('border.width', '2px')};
		}
	}
`;

export const OverflowActionButtonsWrapper = ({
	children,
	testId,
}: {
	children: ReactNode;
	testId?: string;
}) =>
	fg('compiled-migration-profilecard') ? (
		<Box testId={testId} xcss={cx(styles.overflowActionButtonsWrapper)}>
			{children}
		</Box>
	) : (
		<OverflowActionButtonsWrapperLegacy data-testid={testId}>
			{children}
		</OverflowActionButtonsWrapperLegacy>
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const OverflowActionButtonsWrapperLegacy = styled.div`
	display: inline-block;
	width: ${token('space.400', '32px')};
	height: ${token('space.400', '32px')};
	margin-left: ${token('space.100', '8px')};

	button {
		&:focus {
			outline-color: ${token('color.border.focused', B200)};
			outline-offset: ${token('border.width', '2px')};
			outline-style: solid;
			outline-width: ${token('border.width', '2px')};
		}
	}
`;

export const CardContent = ({ children }: { children: ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.cardContent)}>{children}</Box>
	) : (
		<CardContentLegacy>{children}</CardContentLegacy>
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const CardContentLegacy = styled.div`
	display: flex;
	flex-direction: column;
	min-height: 136px;
`;

export const DetailsGroup = ({ children }: { children: ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.detailsGroup)}>{children}</Box>
	) : (
		<DetailsGroupLegacy>{children}</DetailsGroupLegacy>
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const DetailsGroupLegacy = styled.div`
	display: flex;
	flex-direction: column;
	margin-left: 116px;
	width: 196px;
`;

export const DisabledInfo = ({ children }: { children: ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.disabledInfo)}>{children}</Box>
	) : (
		<DisabledInfoLegacy>{children}</DisabledInfoLegacy>
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const DisabledInfoLegacy = styled.div`
	font: ${token('font.body.small')};
	color: ${labelTextColor};
	margin: ${token('space.150', '12px')} 0 0 0;
	line-height: 16px;
`;

export const LozengeWrapper = ({ children }: { children: ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.lozengeWrapper)}>{children}</Box>
	) : (
		<LozengeWrapperLegacy>{children}</LozengeWrapperLegacy>
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const LozengeWrapperLegacy = styled.div`
	margin-top: ${token('space.200', '16px')};
	text-transform: uppercase;
	display: block;
`;

export const CustomLozengeContainer = ({ children }: { children: ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.customLozengeContainer)}>{children}</Box>
	) : (
		<CustomLozengeContainerLegacy>{children}</CustomLozengeContainerLegacy>
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const CustomLozengeContainerLegacy = styled(LozengeWrapper)`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: flex-start;
	margin-top: ${token('space.150', '12px')};
	> * {
		margin-top: ${token('space.050', '4px')};
		&:not(:last-child) {
			margin-right: ${token('space.050', '4px')};
		}
	}
`;

export const JobTitleLabel = ({ children }: { children: ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.jobTitleLabel)}>
			<Text maxLines={1} color="color.text.inverse">
				{children}
			</Text>
		</Box>
	) : (
		<JobTitleLabelLegacy>{children}</JobTitleLabelLegacy>
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const JobTitleLabelLegacy = styled.span`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

	font: ${token('font.body')};
	color: ${headerTextColor};
	margin: 0 0 ${token('space.150', '12px')} 0;
`;

export const AppTitleLabel = ({ children }: { children: ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.appTitleLabel)} backgroundColor="color.background.neutral">
			<Text color="color.text" size="UNSAFE_small" weight="bold">
				{children}
			</Text>
		</Box>
	) : (
		<AppTitleLabelLegacy>{children}</AppTitleLabelLegacy>
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const AppTitleLabelLegacy = styled.span`
	background: ${appLabelBgColor};
	color: ${appLabelTextColor};
	border-radius: ${borderRadius()};
	padding: 0 ${token('space.075', '6px')};
	width: fit-content;
	font-weight: ${token('font.weight.bold')};
	text-transform: uppercase;

	font: ${token('font.body.UNSAFE_small')};
	margin: ${token('space.050', '4px')} 0 ${token('space.150', '12px')} 0;
`;

export const SpinnerContainer = ({ children, testId }: { children: ReactNode; testId?: string }) =>
	fg('compiled-migration-profilecard') ? (
		<Box testId={testId} xcss={cx(styles.spinnerContainer)}>
			{children}
		</Box>
	) : (
		<SpinnerContainerLegacy data-testid={testId}>{children}</SpinnerContainerLegacy>
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const SpinnerContainerLegacy = styled.div`
	align-items: center;
	display: flex;
	height: 96px;
	justify-content: center;
	position: relative;
`;

interface CardContainerProps {
	isDisabledUser?: boolean;
	withoutElevation?: boolean;
	children: ReactNode;
}

export const CardContainer = ({
	children,
	isDisabledUser,
	withoutElevation,
}: CardContainerProps) =>
	fg('compiled-migration-profilecard') ? (
		<Box
			xcss={cx(
				styles.cardContainer,
				isDisabledUser ? styles.cardContainerDisabledUser : styles.cardContainerActiveUser,
				!withoutElevation && styles.cardContainerWithElevation,
			)}
		>
			{children}
		</Box>
	) : (
		<CardContainerLegacy isDisabledUser={isDisabledUser} withoutElevation={withoutElevation}>
			{children}
		</CardContainerLegacy>
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const CardContainerLegacy = styled.div`
	position: relative;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	background-image: linear-gradient(
		to bottom,
		${(props: CardContainerProps) =>
				props.isDisabledUser ? headerBgColorDisabledUser : headerBgColor}
			0%,
		${(props) => (props.isDisabledUser ? headerBgColorDisabledUser : headerBgColor)} 100%
	);
	background-repeat: no-repeat;
	background-size: 100% 96px;
	box-sizing: content-box;
	padding: ${token('space.300', '24px')};
	box-shadow: ${(props: CardContainerProps) =>
		props.withoutElevation
			? ''
			: `${token('elevation.shadow.overlay', `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`)}`};
	border-radius: ${(props: CardContainerProps) =>
		props.withoutElevation ? '' : `${borderRadius()}px`};

	overflow: hidden;
`;

export const DetailsLabel = ({
	children,
	extraTopSpace = false,
}: {
	children: ReactNode;
	extraTopSpace?: boolean;
}) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.detailsLabel, extraTopSpace && styles.detailsLabelExtraTopSpace)}>
			{children}
		</Box>
	) : (
		<DetailsLabelLegacy>{children}</DetailsLabelLegacy>
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const DetailsLabelLegacy = styled.div`
	display: flex;
	align-items: center;
	margin: ${token('space.200', '16px')} 0 0 0;
	white-space: nowrap;

	& + & {
		margin-top: ${token('space.025', '2px')};
	}
`;

export const DetailsLabelIcon = ({ children }: { children: ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box as="dt" xcss={cx(styles.detailsLabelIcon)}>
			{children}
		</Box>
	) : (
		<DetailsLabelIconLegacy>{children}</DetailsLabelIconLegacy>
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const DetailsLabelIconLegacy = styled.dt`
	display: flex;
	flex-shrink: 0;
	color: ${labelIconColor};
	width: ${token('space.200', '16px')};
	height: ${token('space.200', '16px')};
	padding: ${token('space.050', '4px')};
	vertical-align: top;

	svg {
		width: 100%;
		height: 100%;
	}
`;

export const DetailsLabelText = ({ children }: { children: ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box as="dd" xcss={cx(styles.detailsLabelText)}>
			{children}
		</Box>
	) : (
		<DetailsLabelTextLegacy>{children}</DetailsLabelTextLegacy>
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const DetailsLabelTextLegacy = styled.dd`
	overflow: hidden;
	text-overflow: ellipsis;
	color: ${labelTextColor};
	font: ${token('font.body.UNSAFE_small')};
	padding-block: ${token('space.050')};
	padding-left: ${token('space.050', '4px')};
	margin-inline-start: 0;
	margin-top: 0;
`;
