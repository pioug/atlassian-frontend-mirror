/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

const compiledTextClass = css({
	color: 'red',
	fontSize: 20,
});

/**
 * Simple example to test hydration of compiled styles works under rspack.
 * It should be run with this command:
 *
 * yarn start:rspack:ssr editor-core --hydrate --extractCompiled --verbose
 *
 * @returns example component
 */
const BasicCompiledHydration = () => {
	return (
		<div
			// @ts-ignore @ts-expect-error
			css={compiledTextClass}
		>
			This text should be red and 20px
		</div>
	);
};

export default BasicCompiledHydration;
