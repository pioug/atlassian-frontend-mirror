import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { cssMap, cx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { N20 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { bgColor, teamHeaderBgColor } from './constants';
import { CoverImage } from './CoverImage';

const styles = cssMap({
	cardtriggerwrapper: {
		display: 'inherit',
	},
	cardwrapper: {
		borderRadius: token('border.radius'),
		width: '320px',
		position: 'relative',
	},
	cardheader: {
		height: '128px',
		width: '100%',
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
	loadingwrapper: {
		textAlign: 'center',
		marginTop: token('space.500', '40px'),
		marginBottom: token('space.500', '40px'),
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
			<CoverImage alt={label || ''} src={image} />
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
