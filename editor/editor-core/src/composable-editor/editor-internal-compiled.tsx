/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { CSSProperties, ReactNode } from 'react';

import { cssMap, jsx } from '@compiled/react';

const editorContainerCompiledStyles = cssMap({
	root: {
		position: 'relative',
		width: '100%',
		height: '100%',
	},
});

export const EditorInternalContainerCompiled = ({
	children,
	fontSize,
}: {
	children?: ReactNode;
	fontSize?: number;
}): React.JSX.Element => (
	<div
		css={editorContainerCompiledStyles.root}
		style={
			{
				'--ak-editor-base-font-size': `${fontSize}px`,
			} as CSSProperties
		}
	>
		{children}
	</div>
);
