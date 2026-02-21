import React from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	tableWrapper: {
		marginInline: 'auto',
		marginTop: token('space.200'),
		width: '90%',
		borderRadius: token('radius.large'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
	},
	hasOverflow: {
		overflow: 'hidden',
	},
});

export const FakeModalDialogContainer = ({
	children,
	hasOverflow = true,
}: {
	children: React.ReactNode;
	hasOverflow?: boolean;
}): React.JSX.Element => {
	return <Box xcss={cx(styles.tableWrapper, hasOverflow && styles.hasOverflow)}>{children}</Box>;
};
