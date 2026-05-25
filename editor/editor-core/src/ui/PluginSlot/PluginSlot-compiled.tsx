/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Compiled branch of the `platform_editor_core_non_ecc_static_css` experiment.
 * Used via `componentWithCondition` in `index.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
 */
import type { HTMLAttributes } from 'react';

import { cssMap, jsx } from '@compiled/react';

const pluginsComponentsWrapperCompiledStyles = cssMap({
	root: {
		display: 'flex',
	},
});

export const PluginsComponentsWrapperCompiled = ({ children, ...rest }: HTMLAttributes<HTMLDivElement>): React.JSX.Element => (
	// eslint-disable-next-line react/jsx-props-no-spreading
	<div css={pluginsComponentsWrapperCompiledStyles.root} {...rest}>
		{children}
	</div>
);
