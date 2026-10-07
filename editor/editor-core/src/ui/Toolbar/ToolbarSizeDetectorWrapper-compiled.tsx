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

interface ToolbarSizeDetectorWrapperCompiledProps {
	children?: ReactNode;
	style?: CSSProperties;
}

export const ToolbarSizeDetectorWrapperCompiled = ({
	children,
	style,
}: ToolbarSizeDetectorWrapperCompiledProps): JSX.Element => (
	<div css={toolbarSizeDetectorWrapperCompiledStyles.root} style={style}>
		{children}
	</div>
);
