/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Compiled branch of the `platform_editor_core_non_ecc_static_css` experiment.
 * Used via `componentWithCondition` in `index.tsx`.
 */
import type { HTMLAttributes } from 'react';

import { cssMap, jsx } from '@compiled/react';

const clickWrapperCompiledStyles = cssMap({
	root: {
		flexGrow: 1,
		height: '100%',
	},
});

export const ClickAreaBlockContainerCompiled = ({ children, ...rest }: HTMLAttributes<HTMLDivElement>): React.JSX.Element => (
	// eslint-disable-next-line react/jsx-props-no-spreading
	<div css={clickWrapperCompiledStyles.root} {...rest}>
		{children}
	</div>
);
