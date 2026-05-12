/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { backgroundStyles, bkgClassName } from './styles';

export const PlayButtonBackground = (): React.JSX.Element => {
	return (
		<div
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={backgroundStyles}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={bkgClassName}
			data-testid="media-card-play-button-background"
		/>
	);
};
