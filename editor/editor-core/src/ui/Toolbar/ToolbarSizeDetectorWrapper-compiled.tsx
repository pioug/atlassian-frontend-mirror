/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Compiled branch of the `platform_editor_core_non_ecc_static_css` experiment.
 * Used via `componentWithCondition` in `ToolbarWithSizeDetector.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
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
