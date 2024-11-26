/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import React from 'react';

export interface MarginProps {
	width: number;
	height: number;
	size: number;
	circular: boolean;
}

export interface MarginState {}

const marginWrapperSquareBaseStyles = css({
	position: 'absolute',
	left: 0,
	top: 0,
	borderStyle: 'solid',
	borderColor: token('elevation.surface.overlay', 'rgba(255, 255, 255)'),
	opacity: token('opacity.disabled', '0.3'),
});

const marginWrapperCircleBaseStyles = css({
	position: 'absolute',
	overflow: 'hidden',
	left: 0,
	top: 0,
});

const marginWrapperCircleAfterBaseStyles = css({
	content: "''",
	position: 'absolute',
	borderRadius: '100%',
	opacity: token('opacity.disabled', '0.3'),
});

export class Margin extends React.Component<MarginProps, MarginState> {
	render() {
		const { width, height, size, circular } = this.props;
		const id = circular ? 'marginWrapperCircle' : 'marginWrapperSquare';

		return circular ? (
			<div>
				<div
					css={marginWrapperCircleBaseStyles}
					style={{ width: `${width + size * 2}px`, height: `${height + size * 2}px` }}
					id={id}
				/>
				<div
					css={marginWrapperCircleAfterBaseStyles}
					style={{
						left: `${size}px`,
						top: `${size}px`,
						width: `${width}px`,
						height: `${height}px`,
						boxShadow: `0px 0px 0px ${Math.max(width, height)}px ${token(
							'elevation.surface.overlay',
							'rgba(255, 255, 255)',
						)}`,
					}}
				/>
			</div>
		) : (
			<div
				css={marginWrapperSquareBaseStyles}
				style={{
					borderWidth: `${size}px`,
					width: `${width}px`,
					height: `${height}px`,
				}}
				id={id}
			/>
		);
	}
}
