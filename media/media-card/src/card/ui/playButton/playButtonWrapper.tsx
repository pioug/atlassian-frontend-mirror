/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { playButtonClassName, playButtonWrapperStyles } from './styles';

export const PlayButtonWrapper = (props: any) => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div css={playButtonWrapperStyles} className={playButtonClassName}>
			{props.children}
		</div>
	);
};
