/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { getFormattedMessage } from '../../utils';

import TextOld from './TextOld';
import { type TextProps } from './types';

// TODO: Remove on fg cleanup: platform-linking-visual-refresh-v1
const baseStyleOld = css({
	color: token('color.text.subtlest', '#626F86'),
	font: token('font.body.UNSAFE_small'),
	whiteSpace: 'normal',
	display: '-webkit-box',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	wordBreak: 'break-word',
	WebkitBoxOrient: 'vertical',
});

const baseStyle = css({
	color: token('color.text.subtle'),
	font: token('font.body.small'),
	whiteSpace: 'normal',
	display: '-webkit-box',
	minWidth: 0,
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	wordBreak: 'break-word',
	WebkitBoxOrient: 'vertical',
});

/**
 * A base element that displays some Text.
 * @internal
 * @param {TextProps} TextProps - The props necessary for the Text element.
 * @see Title
 */
const TextNew = ({
	content,
	maxLines = 1,
	message,
	name,
	className,
	testId = 'smart-element-text',
}: TextProps) => {
	if (!message && !content) {
		return null;
	}

	const dynamicCss = css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		WebkitLineClamp: maxLines,
		'@supports not (-webkit-line-clamp: 1)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			maxHeight: `calc(${maxLines} * 1rem)`,
		},
	});

	return (
		<span
			css={[
				!fg('platform-linking-visual-refresh-v1') && baseStyleOld,
				fg('platform-linking-visual-refresh-v1') && baseStyle,
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
				dynamicCss,
			]}
			data-separator
			data-smart-element={name}
			data-smart-element-text
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
		>
			{getFormattedMessage(message) || content}
		</span>
	);
};

const Text = (props: TextProps): JSX.Element => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <TextNew {...props} />;
	} else {
		return <TextOld {...props} />;
	}
};

export default Text;
