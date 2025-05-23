// PLEASE NOTE: This file is sync-loaded with the trigger components. Only add components here that
// are necessary for the main render of the trigger component to help maintain bundle size.

/* eslint-disable @atlaskit/design-system/no-styled-tagged-template-expression -- needs manual remediation */
import React, { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { cssMap, cx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { bgColor } from './constants';

const styles = cssMap({
	cardWrapper: {
		borderRadius: token('border.radius'),
		width: '360px',
	},
	spinnerContainer: {
		alignItems: 'center',
		display: 'flex',
		height: '96px',
		justifyContent: 'center',
		position: 'relative',
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
