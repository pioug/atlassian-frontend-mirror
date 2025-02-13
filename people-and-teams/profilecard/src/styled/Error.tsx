import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { cssMap, cx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { errorIconColor, errorTitleColor } from './constants';

const styles = cssMap({
	errorWrapper: {
		textAlign: 'center',
		paddingTop: token('space.300', '24px'),
		paddingRight: token('space.300', '24px'),
		paddingBottom: token('space.300', '24px'),
		paddingLeft: token('space.300', '24px'),
	},
	errorTitle: {
		font: token('font.body'),
		color: token('color.text'),
		marginTop: token('space.100', '8px'),
	},
	teamErrorText: {
		color: token('color.text.subtlest', N200),
		marginTop: token('space.100', '8px'),
	},
});

export const ErrorWrapper = (props: { children: React.ReactNode; testId?: string }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.errorWrapper)} {...props} />
	) : (
		<ErrorWrapperLegacy data-testId={props.testId}>{props.children}</ErrorWrapperLegacy>
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const ErrorWrapperLegacy = styled.div({
	textAlign: 'center',
	padding: token('space.300', '24px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	color: errorIconColor,
});

export const ErrorTitle = (props: { children: React.ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.errorTitle)}>{props.children}</Box>
	) : (
		<ErrorTitleLegacy>{props.children}</ErrorTitleLegacy>
	);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const ErrorTitleLegacy = styled.p({
	font: token('font.body'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	color: errorTitleColor,
	margin: `${token('space.100', '8px')} 0`,
});

export const TeamErrorText = (props: { children: React.ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.teamErrorText)}>{props.children}</Box>
	) : (
		<TeamErrorTextLegacy>{props.children}</TeamErrorTextLegacy>
	);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const TeamErrorTextLegacy = styled.p({
	color: token('color.text.subtlest', N200),
	marginTop: token('space.100', '8px'),
});
