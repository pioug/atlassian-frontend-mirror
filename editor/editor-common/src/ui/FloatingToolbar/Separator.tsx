/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const separator = css({
	background: token('color.border'),
	width: '1px',
	height: '20px',
	alignSelf: 'center',
});

const separatorFullHeight = css({
	height: '40px',
});

type SeparatorProps = {
	/**
	 * @private
	 * @deprecated
	 *
	 * This is no longer used and can be removed at a later date
	 */
	fullHeight?: boolean;
};

export default ({ fullHeight }: SeparatorProps): jsx.JSX.Element => (
	<div
		css={[separator, fullHeight && separatorFullHeight]}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className="separator"
	/>
);
