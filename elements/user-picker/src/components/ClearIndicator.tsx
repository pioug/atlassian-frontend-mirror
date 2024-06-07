import React from 'react';
import { components, type ClearIndicatorProps } from '@atlaskit/select';

const AsyncTooltip = React.lazy(() =>
	import(/* webpackChunkName: "@atlaskit-internal_@atlaskit/tooltip" */ '@atlaskit/tooltip').then(
		(module) => {
			return {
				default: module.default,
			};
		},
	),
);

export class ClearIndicator extends React.PureComponent<ClearIndicatorProps<any>> {
	private handleMouseDown = (event: React.MouseEvent) => {
		if (event && event.type === 'mousedown' && event.button !== 0) {
			return;
		}
		// Prevent focus when clear on blurred state
		const { clearValue, selectProps } = this.props;
		clearValue();
		if (selectProps && !selectProps.isFocused) {
			event.stopPropagation();
		}
	};

	render() {
		const {
			selectProps: { clearValueLabel },
		} = this.props;
		const Indicator = (
			<components.ClearIndicator
				{...this.props}
				innerProps={{
					...this.props.innerProps,
					onMouseDown: this.handleMouseDown,
				}}
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
