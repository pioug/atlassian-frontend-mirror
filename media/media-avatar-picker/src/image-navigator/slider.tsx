/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { Component } from 'react';
import FieldRange from '@atlaskit/range';
import { messages } from '@atlaskit/media-ui';
import ScaleLargeIcon from '@atlaskit/icon/core/image';
import ScaleSmallIcon from '@atlaskit/icon/core/image';
import Button from '@atlaskit/button/standard-button';
import { injectIntl } from 'react-intl-next';
import type { WrappedComponentProps } from 'react-intl-next';

export interface SliderProps {
	value: number;
	onChange: (value: number) => void;
}

export const defaultProps = {
	value: 0,
};

const sliderWrapperStyles = css({
	display: 'flex',
	alignItems: 'center',
	width: '100%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.zoom_button svg': {
		position: 'relative',
		left: token('space.negative.025', '-2px'),
	},
});

export class Slider extends Component<SliderProps & WrappedComponentProps, {}> {
	static defaultProps = defaultProps;

	render() {
		const {
			value,
			onChange,
			intl: { formatMessage },
		} = this.props;
		return (
			<div data-testid="slider" css={sliderWrapperStyles}>
				<Button
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="zoom_button zoom_button_small"
					iconAfter={<ScaleSmallIcon label="scale-small-icon" size="small" spacing="spacious" />}
					onClick={() => onChange(0)}
					aria-label={formatMessage(messages.image_cropper_zoom_out)}
				/>
				<FieldRange
					value={value}
					onChange={onChange}
					aria-label={formatMessage(messages.image_cropper_zoom_slider)}
				/>
				<Button
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="zoom_button zoom_button_large"
					iconAfter={<ScaleLargeIcon label="scale-large-icon" spacing="spacious" />}
					onClick={() => onChange(100)}
					aria-label={formatMessage(messages.image_cropper_zoom_in)}
				/>
			</div>
		);
	}
}

export default injectIntl<'intl', SliderProps & WrappedComponentProps>(Slider);
