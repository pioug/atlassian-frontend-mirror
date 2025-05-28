/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import { components, type ClearIndicatorProps } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';
import { cssMap, jsx } from '@compiled/react';

const AsyncTooltip = React.lazy(() =>
	import(/* webpackChunkName: "@atlaskit-internal_@atlaskit/tooltip" */ '@atlaskit/tooltip').then(
		(module) => {
			return {
				default: module.default,
			};
		},
	),
);

const clearIndicatorStyles = cssMap({
	root: {
		opacity: 1,
		'@media (hover: hover) and (pointer: fine)': {
			opacity: 0,
		},
		transition: 'color 150ms, opacity 150ms',
		paddingTop: token('space.0'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),
		'&:hover': {
			color: token('color.icon.danger'),
		},
	},
});

export class ClearIndicator extends React.PureComponent<ClearIndicatorProps<any>> {
	private handleMouseDown = (event: React.MouseEvent) => {
		if (event && event.type === 'mousedown' && event.button !== 0) {
			return;
		}
		// Prevent focus when clear on blurred state
		const { clearValue, selectProps } = this.props;
		clearValue();
		//@ts-ignore react-select unsupported props
		if (selectProps && !selectProps.isFocused) {
			event.stopPropagation();
		}
	};

	render() {
		const {
			//@ts-ignore react-select unsupported props
			selectProps: { clearValueLabel },
		} = this.props;
		const Indicator = (
			<components.ClearIndicator
				{...this.props}
				innerProps={{
					...this.props.innerProps,
					onMouseDown: this.handleMouseDown,
				}}
				xcss={clearIndicatorStyles.root}
			/>
		);
		return clearValueLabel ? (
			<React.Suspense fallback={Indicator}>
				<AsyncTooltip content={clearValueLabel}>{Indicator}</AsyncTooltip>
			</React.Suspense>
		) : (
			Indicator
		);
	}
}
