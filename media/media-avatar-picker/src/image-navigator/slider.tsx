/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { Component } from 'react';
import FieldRange from '@atlaskit/range';
import ScaleLargeIcon from '@atlaskit/icon/glyph/media-services/scale-large';
import ScaleSmallIcon from '@atlaskit/icon/glyph/media-services/scale-small';
import Button from '@atlaskit/button/standard-button';

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

export class Slider extends Component<SliderProps, {}> {
	static defaultProps = defaultProps;

	render() {
		const { value, onChange } = this.props;
		return (
			<div data-testid="slider" css={sliderWrapperStyles}>
				<Button
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="zoom_button zoom_button_small"
					// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-20874
					iconAfter={<ScaleSmallIcon label="scale-small-icon" />}
					onClick={() => onChange(0)}
				/>
				<FieldRange value={value} onChange={onChange} />
				<Button
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="zoom_button zoom_button_large"
					// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-20874
					iconAfter={<ScaleLargeIcon label="scale-large-icon" />}
					onClick={() => onChange(100)}
				/>
			</div>
		);
	}
}
