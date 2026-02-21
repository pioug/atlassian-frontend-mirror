/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { cssMap, cx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

export enum SeparatorPosition {
	START = 'start',
	END = 'end',
}

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

const marginInlineOverridden = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries
	'@container toolbar-container (max-width: 422px)': {
		marginInline: token('space.025'),
	},
});

type ToolbarSectionProps = {
	children?: ReactNode;
	/**
	 * Whether to add a separator at the start or end of the section
	 */
	hasSeparator?: SeparatorPosition | boolean;
	testId?: string;
};

const ToolbarSeparator = () => {
	return (
		<div
			css={[separator, marginInlineOverridden]}
			data-toolbar-component="separator"
			role="separator"
			aria-orientation="vertical"
		/>
	);
};

export const ToolbarSection = ({ children, testId, hasSeparator }: ToolbarSectionProps) => {
	return (
		<Box xcss={cx(styles.container)} testId={testId} data-toolbar-component="section">
			{hasSeparator === SeparatorPosition.START && <ToolbarSeparator />}
			{children}
			{hasSeparator === SeparatorPosition.END && <ToolbarSeparator />}
		</Box>
	);
};
