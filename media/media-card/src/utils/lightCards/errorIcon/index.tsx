/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { Component } from 'react';
import WarningIcon from '@atlaskit/icon/core/status-warning';

import { errorIconWrapperStyles } from './styles';

export class ErrorIcon extends Component {
	render(): React.JSX.Element {
		return (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			<div css={errorIconWrapperStyles}>
				<WarningIcon color="currentColor" label="Error" />
			</div>
		);
	}
}
