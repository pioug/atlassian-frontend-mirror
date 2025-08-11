/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Component } from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import WarningIcon from '@atlaskit/icon/core/migration/status-warning--editor-warning';
import { N20, N800, Y500 } from '@atlaskit/theme/colors';
import { type CardDimensions } from '../../../types';
import { type UnhandledErrorCardProps } from './types';
import { defaultImageCardDimensions } from '../../../utils';
import { ContentLoadingErrorMessage } from './contentLoadingErrorMessage';

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

const wrapperStyle = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('border.radius.100', '3px'),
	backgroundColor: token('color.background.neutral', N20),
	color: token('color.text.subtle', N800),
	maxHeight: '100%',
	maxWidth: '100%',
	flexDirection: 'column',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	p: {
		font: token('font.body'),
		textAlign: 'center',
	},
});

export class UnhandledErrorCard extends Component<UnhandledErrorCardProps, {}> {
	render() {
		const { dimensions = defaultImageCardDimensions, onClick } = this.props;
		const convertedDimensions = getConvertedDimension(dimensions);
		const hideText = !shouldShowText(getConvertedDimension(dimensions));
		return (
			// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, @atlaskit/ui-styling-standard/enforce-style-prop, @atlassian/a11y/interactive-element-not-keyboard-focusable
			<div style={convertedDimensions} css={wrapperStyle} onClick={onClick}>
				<WarningIcon
					label="Error"
					color={token('color.icon.warning', Y500)}
					LEGACY_size="medium"
					spacing="spacious"
				/>
				<ContentLoadingErrorMessage isHidden={hideText} />
			</div>
		);
	}
}
