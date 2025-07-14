import React from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

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

export const ErrorWrapper = (props: { children: React.ReactNode; testId?: string }) => (
	<Box xcss={cx(styles.errorWrapper)} {...props} />
);

export const ErrorTitle = (props: { children: React.ReactNode }) => (
	<Box xcss={cx(styles.errorTitle)}>{props.children}</Box>
);

export const TeamErrorText = (props: { children: React.ReactNode }) => (
	<Box xcss={cx(styles.teamErrorText)}>{props.children}</Box>
);
