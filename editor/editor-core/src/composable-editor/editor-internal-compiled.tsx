/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Compiled branch of the `platform_editor_core_non_ecc_static_css` experiment.
 * Used via `componentWithCondition` in `editor-internal.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
 */
import type { ReactNode } from 'react';

import { cssMap, jsx } from '@compiled/react';

const editorContainerCompiledStyles = cssMap({
	root: {
		position: 'relative',
		width: '100%',
		height: '100%',
	}
});

export const EditorInternalContainerCompiled = ({ children }: { children?: ReactNode }): React.JSX.Element => (
	<div css={editorContainerCompiledStyles.root}>
		{children}
	</div>
);
