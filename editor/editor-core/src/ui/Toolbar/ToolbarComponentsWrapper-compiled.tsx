/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactNode } from 'react';

import { cssMap, jsx } from '@compiled/react';

const toolbarComponentsWrapperCompiledStyles = cssMap({
	root: {
		display: 'flex',
		// it was max-width: akEditorMobileMaxWidth, but it'd fail with compiled css build so inline here.
		'@media (max-width: 0px)': {
			justifyContent: 'space-between',
		},
	},
});

interface ToolbarComponentsWrapperCompiledProps {
	children?: ReactNode;
	'data-vc'?: string;
}

export const ToolbarComponentsWrapperCompiled = ({
	children,
	'data-vc': dataVc,
}: ToolbarComponentsWrapperCompiledProps): JSX.Element => (
	<div css={toolbarComponentsWrapperCompiledStyles.root} data-vc={dataVc}>
		{children}
	</div>
);
