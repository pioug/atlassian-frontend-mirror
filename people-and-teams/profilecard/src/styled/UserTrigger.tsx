// PLEASE NOTE: This file is sync-loaded with the trigger components. Only add components here that
// are necessary for the main render of the trigger component to help maintain bundle size.

/* eslint-disable @atlaskit/design-system/no-styled-tagged-template-expression -- needs manual remediation */
import React, { type ReactNode } from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	cardWrapper: {
		borderRadius: token('radius.small'),
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
}) => (
	<Box
		xcss={cx(styles.cardWrapper)}
		backgroundColor={'elevation.surface.overlay'}
		role={role}
		testId={testId}
		aria-labelledby={labelledBy}
	>
		{children}
	</Box>
);

export const SpinnerContainer = ({
	children,
	testId,
}: {
	children: ReactNode;
	testId?: string;
}) => (
	<Box testId={testId} xcss={cx(styles.spinnerContainer)}>
		{children}
	</Box>
);
