import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { PopupSelect } from '@atlaskit/select';
import React from 'react';
import { type PopupUserPickerProps } from '../types';
import { getPopupComponents } from './components';
import { getPopupStyles } from './styles';
import { getPopupProps } from './popup';
import { BaseUserPickerWithoutAnalytics } from './BaseUserPicker';
import { fg } from '@atlaskit/platform-feature-flags';

interface State {
	flipped: boolean;
}

export class PopupUserPickerWithoutAnalytics extends React.Component<PopupUserPickerProps, State> {
	static defaultProps: Partial<PopupUserPickerProps> = {
		boundariesElement: 'viewport',
		width: 300,
		isMulti: false,
		offset: [0, 0],
		placement: 'auto',
		rootBoundary: 'viewport',
		shouldFlip: true,
		strategy: 'fixed',
	};
	state = {
		flipped: false,
	};

	handleFlipStyle = (data: {
		flipped: boolean;
		popper: any;
		styles: any;
	}): {
		flipped: boolean;
		popper: any;
		styles: any;
	} => {
		const {
			flipped,
			styles: { transform },
			popper: { height },
		} = data;
		this.setState({ flipped });
		if (!flipped) {
			return data;
		}

		data.styles.transform = transform + `translate(0, ${height}px) translate(0, -100%)`;
		return data;
	};

	render(): React.JSX.Element {
		const {
			target,
			popupTitle,
			boundariesElement,
			isMulti,
			offset,
			placement,
			rootBoundary,
			shouldFlip,
			styles,
			strategy,
		} = this.props;
		const width = this.props.width as string | number;

		const selectStyles = getPopupStyles(
			width,
			isMulti,
			styles,
			fg('platform-component-visual-refresh'),
		);

		const pickerProps = {
			...getPopupProps(
				width,
				target,
				this.handleFlipStyle,
				boundariesElement,
				offset,
				placement,
				rootBoundary,
				shouldFlip,
				popupTitle,
				strategy,
			),
			...(this.props.popupSelectProps || {}),
		};

		return (
			<BaseUserPickerWithoutAnalytics
				{...this.props}
				SelectComponent={PopupSelect}
				width={width}
				styles={selectStyles}
				components={getPopupComponents(!!popupTitle)}
				pickerProps={pickerProps}
			/>
		);
	}
}

export const PopupUserPicker = withAnalyticsEvents()(PopupUserPickerWithoutAnalytics);
