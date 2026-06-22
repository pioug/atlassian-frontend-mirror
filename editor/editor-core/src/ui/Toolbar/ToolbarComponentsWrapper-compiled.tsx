/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Compiled branch of the `platform_editor_core_non_ecc_static_css` experiment.
 * Used via `componentWithCondition` in `ToolbarInner.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
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
