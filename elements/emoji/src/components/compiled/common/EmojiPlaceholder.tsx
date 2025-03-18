/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx, keyframes } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N20A } from '@atlaskit/theme/colors';
import { defaultEmojiHeight } from '../../../util/constants';
import type { EmojiImageRepresentation } from '../../../types';
import { placeholder } from '../../common/styles';

const placeholderContainer = css({
	position: 'relative',
	margin: '-1px 0',
	display: 'inline-block',
	backgroundColor: token('color.border', '#f7f7f7'),
	borderRadius: token('border.radius.100', '3px'),
	overflow: 'hidden',
	verticalAlign: 'middle',
	whiteSpace: 'nowrap',
	textAlign: 'center',
});

const easeSweep = keyframes({
	from: {
		transform: 'translateX(-100%)',
	},
	to: {
		transform: 'translateX(100%)',
	},
});

const placeholderContainerAnimated = css({
	'&::before': {
		content: '""',
		display: 'block',
		position: 'absolute',
		backgroundColor: token('color.background.neutral', N20A),
		height: '100%',
		width: '100%',
		animation: `${easeSweep} 1s cubic-bezier(0.4, 0.0, 0.2, 1) infinite`,
	},
});

export interface Props {
	shortName: string;
	size?: number;
	showTooltip?: boolean;
	representation?: EmojiImageRepresentation;
	loading?: boolean;
}

export const emojiPlaceholderTestId = (shortName: string) => `emoji-placeholder-${shortName}`;

const EmojiPlaceholder = (props: Props) => {
	const {
		shortName,
		size = defaultEmojiHeight,
		showTooltip,
		representation,
		loading = false,
	} = props;

	let scaledWidth;
	let scaledHeight;
	if (representation && size) {
		const width = representation.width;
		const height = representation.height;
		if (width && height) {
			scaledWidth = (size / height) * width;
			scaledHeight = size;
		}
	}
	const width: number = scaledWidth || size;
	const height: number = scaledHeight || size;
	const style = {
		fill: 'f7f7f7',
		minWidth: `${width}px`,
		width: `${width}px`,
		height: `${height}px`,
	};

	return (
		<span
			data-testid={emojiPlaceholderTestId(shortName)}
			aria-busy={loading}
			role="status"
			aria-label={shortName}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={placeholder}
			css={[placeholderContainer, loading && placeholderContainerAnimated]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={style}
			title={showTooltip ? shortName : ''}
		/>
	);
};

export default EmojiPlaceholder;
