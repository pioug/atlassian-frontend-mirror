/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Component } from 'react';
import { css, jsx } from '@compiled/react';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';
import WarningIcon from '@atlaskit/icon/core/status-warning';
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
	borderRadius: token('radius.small', '3px'),
	backgroundColor: token('color.background.neutral'),
	color: token('color.text.subtle'),
	maxHeight: '100%',
	maxWidth: '100%',
	flexDirection: 'column',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	p: {
		font: token('font.body'),
		textAlign: 'center',
	},
});

const plainButtonStyle = css({
	all: 'unset',
	display: 'block',
});

export class UnhandledErrorCard extends Component<UnhandledErrorCardProps, {}> {
	render(): JSX.Element {
		const { dimensions = defaultImageCardDimensions, onClick } = this.props;
		const convertedDimensions = getConvertedDimension(dimensions);
		const hideText = !shouldShowText(getConvertedDimension(dimensions));
		return fg('platform_media_a11y_suppression_fixes') ? (
			<button
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={convertedDimensions}
				css={[plainButtonStyle, wrapperStyle]}
				onClick={onClick}
				data-testid="unhandled-error-card"
				// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx
				aria-label="Preview unavailable"
			>
				<WarningIcon label="Error" color={token('color.icon.warning')} spacing="spacious" />
				<ContentLoadingErrorMessage isHidden={hideText} />
			</button>
		) : (
			// eslint-disable-next-line @atlassian/a11y/click-events-have-key-events, @atlassian/a11y/interactive-element-not-keyboard-focusable, @atlassian/a11y/no-static-element-interactions
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={convertedDimensions}
				css={wrapperStyle}
				onClick={onClick}
				data-testid="unhandled-error-card"
			>
				<WarningIcon label="Error" color={token('color.icon.warning')} spacing="spacious" />
				<ContentLoadingErrorMessage isHidden={hideText} />
			</div>
		);
	}
}
