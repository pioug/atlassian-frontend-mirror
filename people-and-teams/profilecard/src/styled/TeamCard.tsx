import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { cssMap, cx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { N20, N200 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { bgColor, teamHeaderBgColor } from './constants';

const styles = cssMap({
	cardtriggerwrapper: {
		display: 'inherit',
	},
	cardwrapper: {
		borderRadius: token('border.radius'),
		width: '320px',
		position: 'relative',
	},
	teamforbiddenerrorstatewrapper: {
		width: '320px',
		position: 'relative',
	},
	cardheader: {
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
		backgroundSize: 'cover',
		height: '128px',
	},
	cardcontent: {
		display: 'flex',
		flexDirection: 'column',
		paddingTop: token('space.300', '24px'),
		paddingRight: token('space.300', '24px'),
		paddingBottom: token('space.300', '24px'),
		paddingLeft: token('space.300', '24px'),
		minHeight: '104px',
	},
	teamname: {
		font: token('font.heading.medium'),
		textTransform: 'none',
		overflow: 'hidden',
		maxHeight: '48px',
		display: '-webkit-box',
	},
	membercount: {
		color: token('color.text.subtlest', N200),
		marginTop: token('space.050', '4px'),
	},
	avatarsection: {
		marginTop: token('space.200', '16px'),
		marginLeft: token('space.negative.025', '-2px'),
	},
	descriptionwrapper: {
		marginTop: token('space.200', '16px'),
		alignItems: 'center',
		display: 'flex',
	},
	description: {
		overflow: 'hidden',
		maxHeight: '60px',
		display: '-webkit-box',
	},
	actionbuttons: {
		width: '100%',
		display: 'flex',
		justifyContent: 'space-between',
		marginTop: token('space.300', '24px'),
		marginRight: token('space.negative.300', '-24px'),
		marginBottom: '0',
		marginLeft: token('space.negative.100', '-8px'),
	},
	wrappedbutton: {
		flexBasis: 0,
		flexGrow: 1,
		marginLeft: token('space.100', '8px'),
	},
	morebutton: {
		marginLeft: token('space.100', '8px'),
	},
	loadingwrapper: {
		textAlign: 'center',
		marginTop: token('space.500', '40px'),
		marginBottom: token('space.500', '40px'),
	},
	accesslocksvgwrapper: {
		marginBottom: token('space.300', '24px'),
	},
});

export const CardTriggerWrapper = () =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.cardtriggerwrapper)} />
	) : (
		<CardTriggerWrapperLegacy />
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const CardTriggerWrapperLegacy = styled.div({
	display: 'inherit',
});

export const CardWrapper = ({
	testId,
	children,
}: {
	testId?: string;
	children: React.ReactNode;
}) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.cardwrapper)} backgroundColor="elevation.surface.overlay" testId={testId}>
			{children}
		</Box>
	) : (
		<CardWrapperLegacy data-testid={testId}>{children}</CardWrapperLegacy>
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const CardWrapperLegacy = styled.div({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundColor: bgColor,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: `${borderRadius()}px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: '320px',
	position: 'relative',
	WebkitFontSmoothing: 'antialiased',
	MozOsxFontSmoothing: 'grayscale',
});

export const TeamForbiddenErrorStateWrapper = (props: {
	children: React.ReactNode;
	testId?: string;
}) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.teamforbiddenerrorstatewrapper)} {...props} />
	) : (
		<TeamForbiddenErrorStateWrapperLegacy data-testid={props.testId}>
			{props.children}
		</TeamForbiddenErrorStateWrapperLegacy>
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const TeamForbiddenErrorStateWrapperLegacy = styled.div({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: '320px',
	position: 'relative',
});

export const CardHeader = ({
	image,
	isLoading,
	label,
}: {
	image?: string;
	isLoading?: boolean;
	label?: string;
}) =>
	fg('compiled-migration-profilecard') ? (
		isLoading || !image ? (
			<Box xcss={cx(styles.cardheader)} backgroundColor="color.background.neutral" />
		) : (
			<Box
				as="img"
				alt={label || ''}
				src={image}
				xcss={cx(styles.cardheader)}
				backgroundColor="color.background.neutral"
			/>
		)
	) : (
		<CardHeaderLegacy image={image} isLoading={isLoading} />
	);

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const CardHeaderLegacy = styled.div<{ image?: string; isLoading?: boolean }>`
	background-color: ${(props) =>
		props.isLoading
			? token('color.background.neutral', N20)
			: props.image
				? ''
				: teamHeaderBgColor};
	background-image: ${(props) => (props.image ? `url(${props.image})` : '')};
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
	box-sizing: content-box;
	height: 128px;
`;

export const CardContent = (props: { children: React.ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.cardcontent)} {...props} />
	) : (
		<CardContentLegacy {...props} />
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const CardContentLegacy = styled.div({
	display: 'flex',
	flexDirection: 'column',
	padding: token('space.300', '24px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	minHeight: '104px',
});

export const TeamName = (props: { children: React.ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.teamname)} {...props} />
	) : (
		<TeamNameLegacy {...props} />
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
const TeamNameLegacy = styled.h6({
	font: token('font.heading.medium'),
	textTransform: 'none',
	overflow: 'hidden',
	maxHeight: '48px',
	display: '-webkit-box',
	WebkitLineClamp: 2,
	WebkitBoxOrient: 'vertical',
});

export const MemberCount = (props: { children: React.ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.membercount)} {...props} />
	) : (
		<MemberCountLegacy {...props} />
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const MemberCountLegacy = styled.div({
	color: token('color.text.subtlest', N200),
	marginTop: token('space.050', '4px'),
});

export const AvatarSection = (props: { children: React.ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.avatarsection)} {...props} />
	) : (
		<AvatarSectionLegacy {...props} />
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/use-primitives -- Ignored via go/DSP-18766
const AvatarSectionLegacy = styled.div({
	marginTop: token('space.200', '16px'),
	marginLeft: token('space.negative.025', '-2px'),
});

export const DescriptionWrapper = (props: { children: React.ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.descriptionwrapper)} {...props} />
	) : (
		<DescriptionWrapperLegacy {...props} />
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const DescriptionWrapperLegacy = styled.div({
	marginTop: token('space.200', '16px'),
	alignItems: 'center',
	display: 'flex',
});

export const Description = (props: { children: React.ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.description)}>
			<Text maxLines={3} {...props} />
		</Box>
	) : (
		<DescriptionLegacy {...props} />
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const DescriptionLegacy = styled.span({
	overflow: 'hidden',
	maxHeight: '60px',
	display: '-webkit-box',
	WebkitLineClamp: 3,
	WebkitBoxOrient: 'vertical',
});

export const ActionButtons = (props: { children: React.ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.actionbuttons)} backgroundColor="elevation.surface.overlay" {...props} />
	) : (
		<ActionButtonsLegacy {...props} />
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const ActionButtonsLegacy = styled.div({
	width: 'calc(100% + 8px)',
	display: 'flex',
	justifyContent: 'space-between',
	margin: `${token('space.300', '24px')} ${token(
		'space.negative.300',
		'-24px',
	)} 0 ${token('space.negative.100', '-8px')}`,
	backgroundColor: token('elevation.surface.overlay', 'hsla(0, 100%, 100%, 0.2)'),
});

export const WrappedButton = (props: { children: React.ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.wrappedbutton)} {...props} />
	) : (
		<WrappedButtonLegacy {...props} />
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const WrappedButtonLegacy = styled.div({
	flexBasis: 0,
	flexGrow: 1,
	marginLeft: token('space.100', '8px'),
});

export const MoreButton = (props: { children: React.ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.morebutton)} {...props} />
	) : (
		<MoreButtonLegacy {...props} />
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/use-primitives -- Ignored via go/DSP-18766
const MoreButtonLegacy = styled.div({
	marginLeft: token('space.100', '8px'),
});

export const LoadingWrapper = (props: { testId?: string; children: React.ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.loadingwrapper)} {...props} />
	) : (
		<LoadingWrapperLegacy data-testid={props.testId}>{props.children}</LoadingWrapperLegacy>
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const LoadingWrapperLegacy = styled.div({
	textAlign: 'center',
	marginTop: token('space.500', '40px'),
});

export const AccessLockSVGWrapper = (props: { children: React.ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.accesslocksvgwrapper)} {...props} />
	) : (
		<AccessLockSVGWrapperLegacy {...props} />
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/use-primitives -- Ignored via go/DSP-18766
const AccessLockSVGWrapperLegacy = styled.div({
	marginBottom: token('space.300', '24px'),
});
