/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { cssMap, cx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		display: 'flex',
		alignItems: 'center',
		gap: token('space.050'),
	},
});

const separator = css({
	marginInline: token('space.100'),
	height: '20px',
	width: '1px',
	backgroundColor: token('color.border'),
});

type ToolbarSectionProps = {
	children?: ReactNode;
	/**
	 * Whether to add a separator at the start of the section
	 */
	hasSeparator?: boolean;
	testId?: string;
};

export const ToolbarSection = ({ children, testId, hasSeparator }: ToolbarSectionProps) => {
	return (
		<Box xcss={cx(styles.container)} testId={testId} data-toolbar-component="section">
			{hasSeparator && <div css={separator} />}
			{children}
		</Box>
	);
};
