/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { defaultEmojiHeight } from '../../util/constants';
import type { EmojiImageRepresentation } from '../../types';
import { placeholder, placeholderContainer, placeholderContainerAnimated } from './styles';

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
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={loading ? [placeholderContainer, placeholderContainerAnimated] : placeholderContainer}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={style}
			title={showTooltip ? shortName : ''}
		/>
	);
};

export default EmojiPlaceholder;
