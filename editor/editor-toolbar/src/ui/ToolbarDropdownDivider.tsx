/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	divider: {
		borderBottomColor: token('color.border'),
		borderBottomStyle: 'solid',
		borderBottomWidth: token('border.width'),
	},
});

export const ToolbarDropdownDivider = () => {
	return <div css={styles.divider} />;
};
