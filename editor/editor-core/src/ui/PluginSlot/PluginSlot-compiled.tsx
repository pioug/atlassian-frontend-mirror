/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { HTMLAttributes } from 'react';

import { cssMap, jsx } from '@compiled/react';

const pluginsComponentsWrapperCompiledStyles = cssMap({
	root: {
		display: 'flex',
	},
});

export const PluginsComponentsWrapperCompiled = ({
	children,
	...rest
}: HTMLAttributes<HTMLDivElement>): React.JSX.Element => (
	// eslint-disable-next-line react/jsx-props-no-spreading
	<div css={pluginsComponentsWrapperCompiledStyles.root} {...rest}>
		{children}
	</div>
);
