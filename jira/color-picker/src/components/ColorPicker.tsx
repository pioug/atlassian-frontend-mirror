/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import { PopupSelect, type PopupSelectProps, type ValueType } from '@atlaskit/select';
import Trigger from './Trigger';
import { type Color, type Palette, type SwatchSize, type ColorCardVariant } from '../types';
import * as components from './components';
import { KEY_ARROW_DOWN, KEY_ARROW_UP, KEY_TAB, KEY_ESCAPE } from '../constants';
import {
	createAndFireEvent,
	withAnalyticsContext,
	withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { getOptions } from '../utils';
import { css, jsx } from '@atlaskit/css';
import { injectIntl } from 'react-intl-next';
import type { IntlShape, WrappedComponentProps } from 'react-intl-next';
import messages from '../messages';
export interface Props {
	/** color picker button label */
	label?: string;
	/** trigger id for accessability labelling */
	triggerId?: string;
	/** list of available colors */
	palette: Palette;
	/** selected color */
	selectedColor?: string;
	/** maximum column length */
	cols?: number;
	/** color of checkmark on selected color */
	checkMarkColor?: string;
	/** props for react-popper */
	popperProps?: PopupSelectProps['popperProps'];
	/** onChange handler */
	onChange: (value: string, analyticsEvent?: object) => void;
	/** You should not be accessing this prop under any circumstances. It is provided by @atlaskit/analytics-next. */
	createAnalyticsEvent?: any;
	/** swatch button size */
	selectedColourSwatchSize?: SwatchSize;
	/** swatch button default color */
	showDefaultSwatchColor?: boolean;
	/** diasble swatch button */
	isDisabledSelectedSwatch?: boolean;
	/** onMenuOpen handler */
	onMenuOpen?: () => void;
	/** Display filled or outline variant of the color */
	variant?: ColorCardVariant;
	/** Test ID  */
	testId?: string;
}

const defaultPopperProps: Partial<PopupSelectProps['popperProps']> = {
	strategy: 'fixed',
	modifiers: [{ name: 'offset', options: { offset: [0, 8] } }],
	placement: 'bottom-start',
};

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

class ColorPickerWithoutAnalyticsBase extends React.Component<Props & WrappedComponentProps> {
	createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

	state = { isTabbing: false };

	changeAnalyticsCaller = () => {
		const { createAnalyticsEvent } = this.props;

		if (createAnalyticsEvent) {
			return this.createAndFireEventOnAtlaskit({
				action: 'clicked',
				actionSubject: 'color-picker',

				attributes: {
					componentName: 'color-picker',
					packageName,
					packageVersion,
				},
			})(createAnalyticsEvent);
		}
		return undefined;
	};

	onChangeSelect = (option: ValueType<Color>) => {
		this.props.onChange((option as Color).value, this.changeAnalyticsCaller());
	};

	onOptionKeyDown = (value: string) => {
		this.props.onChange(value, this.changeAnalyticsCaller());
	};

	onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
		const key = e.key;
		if (key === KEY_TAB) {
			this.setState({ isTabbing: true });
		} else if (key === KEY_ARROW_UP || key === KEY_ARROW_DOWN) {
			this.setState({ isTabbing: false });
		} else if (key === KEY_ESCAPE) {
			e.stopPropagation();
		}
	};

	getFullLabel = (intl: IntlShape, value: Color, label: string): string => {
		if (value && value.label) {
			return intl.formatMessage(messages.colorPickerAriaLabel, {
				color: value.label,
				message: label,
			});
		} else {
			return label;
		}
	};

	render() {
		const {
			palette,
			selectedColor,
			checkMarkColor,
			cols,
			popperProps = defaultPopperProps,
			label = 'Color picker',
			triggerId,
			selectedColourSwatchSize,
			showDefaultSwatchColor = true,
			isDisabledSelectedSwatch,
			intl,
			variant = 'fill',
			testId,
		} = this.props;
		const { options, value } = getOptions(palette, selectedColor, showDefaultSwatchColor);
		const fullLabel = this.getFullLabel(intl, value, label);

		return (
			<PopupSelect<Color>
				target={({ ref, isOpen }) => (
					<div css={colorCardWrapperStyles} ref={ref}>
						<Trigger
							{...value}
							label={fullLabel}
							expanded={isOpen}
							swatchSize={selectedColourSwatchSize}
							isDisabled={isDisabledSelectedSwatch}
							id={triggerId}
							variant={variant}
						/>
					</div>
				)}
				popperProps={popperProps}
				maxMenuWidth="auto"
				minMenuWidth="auto"
				options={options}
				label={fullLabel}
				value={value}
				components={components}
				onChange={this.onChangeSelect}
				// never show search input
				searchThreshold={Number.MAX_VALUE}
				// palette props
				//@ts-ignore react-select unsupported props
				cols={cols}
				checkMarkColor={checkMarkColor}
				variant={variant}
				onKeyDown={this.onKeyDown}
				isTabbing={this.state.isTabbing}
				onOptionKeyDown={this.onOptionKeyDown}
				testId={testId}
				onMenuOpen={this.props.onMenuOpen}
			/>
		);
	}
}

export const ColorPickerWithoutAnalytics = injectIntl(ColorPickerWithoutAnalyticsBase);

export default withAnalyticsContext({
	componentName: 'color-picker',
	packageName,
	packageVersion,
})(withAnalyticsEvents()(ColorPickerWithoutAnalytics));

const colorCardWrapperStyles = css({
	display: 'inline-block',
});
