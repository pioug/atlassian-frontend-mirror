/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { getFormattedMessage, getTruncateStyles } from '../../utils';

import { type TextProps } from './types';

const getStyles = (maxLines: number) =>
	css(
		{
			color: token('color.text.subtlest', '#626F86'),
			font: token('font.body.UNSAFE_small'),
			whiteSpace: 'normal',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		getTruncateStyles(maxLines),
	);

/**
 * A base element that displays some Text.
 * @internal
 * @param {TextProps} TextProps - The props necessary for the Text element.
 * @see Title
 */
const TextOld = ({
	content,
	maxLines = 1,
	message,
	name,
	overrideCss,
	testId = 'smart-element-text',
}: TextProps) => {
	if (!message && !content) {
		return null;
	}

	return (
		<span
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={[getStyles(maxLines), overrideCss]}
			data-separator
			data-smart-element={name}
			data-smart-element-text
			data-testid={testId}
		>
			{getFormattedMessage(message) || content}
		</span>
	);
};

export default TextOld;
