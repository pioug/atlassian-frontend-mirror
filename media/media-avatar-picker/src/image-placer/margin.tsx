/**@jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import { marginWrapperSquareStyles, marginWrapperCircleStyles } from './styles';

export interface MarginProps {
	width: number;
	height: number;
	size: number;
	circular: boolean;
}

export interface MarginState {}

export class Margin extends React.Component<MarginProps, MarginState> {
	render() {
		const { width, height, size, circular } = this.props;
		const [id, styles] = circular
			? ['marginWrapperCircle', marginWrapperCircleStyles]
			: ['marginWrapperSquare', marginWrapperSquareStyles];

		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		return <div css={styles({ width, height, size })} id={id} />;
	}
}
