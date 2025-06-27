/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import type { StrictXCSSProp } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';
import { defaultEmojiHeight } from '../../util/constants';
import type { EmojiImageRepresentation } from '../../types';
import { placeholder } from './styles';

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

export interface Props {
	shortName: string;
	size?: number;
	showTooltip?: boolean;
	representation?: EmojiImageRepresentation;
	loading?: boolean;
	xcss?: StrictXCSSProp<'backgroundColor', never>;
}

export const emojiPlaceholderTestId = (shortName: string) => `emoji-placeholder-${shortName}`;

const EmojiPlaceholder = (props: Props) => {
	const {
		shortName,
		size = defaultEmojiHeight,
		showTooltip,
		representation,
		loading = false,
		xcss,
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
			className={[
				placeholder,
				fg('platform_reactions_placeholder_custom_background') ? xcss : '',
			].join(' ')}
			css={[placeholderContainer]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={style}
			title={showTooltip ? shortName : ''}
		/>
	);
};

export default EmojiPlaceholder;
