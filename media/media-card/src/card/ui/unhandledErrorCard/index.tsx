/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Component } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import WarningIcon from '@atlaskit/icon/glyph/editor/warning';
import { N20, N800, Y500 } from '@atlaskit/theme/colors';
import { center, borderRadius } from '@atlaskit/media-ui';
import { type CardDimensions } from '../../../types';
import { type UnhandledErrorCardProps } from './types';
import { defaultImageCardDimensions } from '../../../utils';

type ConvertedDimensions = {
	width: string;
	height: string;
};
const isPercentage = (value: string) => /^\d+(\.\d+)?%$/.test(value);

const shouldShowText = ({ width, height }: ConvertedDimensions) => {
	if (isPercentage(width) || isPercentage(height)) {
		return false;
	}
	return parseInt(width, 10) >= 240 && parseInt(height, 10) >= 90;
};

const normalizeDimension = (value: number | string, defaultValue: number) => {
	const sValue = value.toString();
	return isPercentage(sValue)
		? sValue
		: isNaN(parseInt(sValue, 10))
			? defaultValue + 'px'
			: parseInt(sValue, 10) + 'px';
};

const getConvertedDimension = (dimensions: CardDimensions): ConvertedDimensions => {
	const { width = defaultImageCardDimensions.width, height = defaultImageCardDimensions.height } =
		dimensions;

	return {
		width: normalizeDimension(width, defaultImageCardDimensions.width),
		height: normalizeDimension(height, defaultImageCardDimensions.height),
	};
};

const wrapperStyles = (dimensions: CardDimensions = defaultImageCardDimensions) => {
	try {
		return css(
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			center,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			borderRadius,
			{
				background: token('color.background.neutral', N20),
				color: token('color.text.subtle', N800),
				maxHeight: '100%',
				maxWidth: '100%',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			getConvertedDimension(dimensions),
			{
				display: 'flex',
				flexDirection: 'column',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				p: {
					font: token('font.body'),
					textAlign: 'center',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					display: shouldShowText(getConvertedDimension(dimensions)) ? 'block' : 'none',
				},
			},
		);
	} catch (e) {
		return null;
	}
};
export class UnhandledErrorCard extends Component<UnhandledErrorCardProps, {}> {
	render() {
		const { dimensions, onClick } = this.props;
		return (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			<div css={wrapperStyles(dimensions)} onClick={onClick}>
				<WarningIcon label="Error" primaryColor={token('color.icon.warning', Y500)} size="medium" />
				<p>We couldn't load this content</p>
			</div>
		);
	}
}
