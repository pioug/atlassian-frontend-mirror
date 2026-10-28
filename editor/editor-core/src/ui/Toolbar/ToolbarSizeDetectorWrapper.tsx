/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { CSSProperties, ReactNode } from 'react';

import { cssMap, jsx } from '@compiled/react';

const toolbarSizeDetectorWrapperCompiledStyles = cssMap({
	root: {
		width: '100%',
		position: 'relative',
	},
});

interface ToolbarSizeDetectorWrapperProps {
	children?: ReactNode;
	style?: CSSProperties;
}

export const ToolbarSizeDetectorWrapper = ({
	children,
	style,
}: ToolbarSizeDetectorWrapperProps): JSX.Element => (
	<div css={toolbarSizeDetectorWrapperCompiledStyles.root} style={style}>
		{children}
	</div>
);
