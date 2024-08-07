/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { Component } from 'react';
import FieldRange from '@atlaskit/range';
import ScaleLargeIcon from '@atlaskit/icon/glyph/media-services/scale-large';
import ScaleSmallIcon from '@atlaskit/icon/glyph/media-services/scale-small';
import Button from '@atlaskit/button/standard-button';
import { sliderWrapperStyles } from './styles';

export interface SliderProps {
	value: number;
	onChange: (value: number) => void;
}

export const defaultProps = {
	value: 0,
};

export class Slider extends Component<SliderProps, {}> {
	static defaultProps = defaultProps;

	render() {
		const { value, onChange } = this.props;
		return (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			<div data-testid="slider" css={sliderWrapperStyles}>
				<Button
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="zoom_button zoom_button_small"
					iconAfter={<ScaleSmallIcon label="scale-small-icon" />}
					onClick={() => onChange(0)}
				/>
				<FieldRange value={value} onChange={onChange} />
				<Button
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="zoom_button zoom_button_large"
					iconAfter={<ScaleLargeIcon label="scale-large-icon" />}
					onClick={() => onChange(100)}
				/>
			</div>
		);
	}
}
