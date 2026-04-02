import React from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	errorWrapper: {
		textAlign: 'center',
		paddingTop: token('space.300'),
		paddingRight: token('space.300'),
		paddingBottom: token('space.300'),
		paddingLeft: token('space.300'),
	},
	errorTitle: {
		marginTop: token('space.100'),
	},
	teamErrorText: {
		color: token('color.text.subtlest'),
		marginTop: token('space.100'),
	},
});

export const ErrorWrapper = (props: {
	children: React.ReactNode;
	testId?: string;
}): React.JSX.Element => <Box xcss={cx(styles.errorWrapper)} {...props} />;

export const ErrorTitle = (props: { children: React.ReactNode }): React.JSX.Element => (
	<Box xcss={styles.errorTitle}>
		<Text color="color.text">{props.children}</Text>
	</Box>
);

export const TeamErrorText = (props: { children: React.ReactNode }): React.JSX.Element => (
	<Box xcss={cx(styles.teamErrorText)}>{props.children}</Box>
);
