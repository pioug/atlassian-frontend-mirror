import React from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';
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
		marginTop: token('space.100', '8px'),
	},
	teamErrorText: {
		color: token('color.text.subtlest', N200),
		marginTop: token('space.100', '8px'),
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
