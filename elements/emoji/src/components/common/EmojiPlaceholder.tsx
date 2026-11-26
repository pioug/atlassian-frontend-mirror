/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import type { StrictXCSSProp } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import type { EmojiImageRepresentation } from '../../types';
import { defaultDenseEmojiHeight } from '../../util/constants';
import { emojiPlaceholderTestId } from './emojiPlaceholderTestId';
import { placeholder } from './styles';

const placeholderContainer = css({
	position: 'relative',
	margin: '-1px 0',
	display: 'inline-block',
	backgroundColor: token('color.border'),
	borderRadius: token('radius.small', '3px'),
	overflow: 'hidden',
	verticalAlign: 'middle',
	whiteSpace: 'nowrap',
	textAlign: 'center',
});

export interface Props {
	loading?: boolean;
	representation?: EmojiImageRepresentation;
	shortName: string;
	showTooltip?: boolean;
	size?: number;
	xcss?: StrictXCSSProp<'backgroundColor', never>;
}

const EmojiPlaceholder = (props: Props): JSX.Element => {
	const { shortName, showTooltip, loading = false, xcss } = props;
	const style = {
		fill: 'f7f7f7',
		minWidth: `${defaultDenseEmojiHeight}px`,
		minHeight: `${defaultDenseEmojiHeight}px`,
	};

	return (
		<span
			data-testid={emojiPlaceholderTestId(shortName)}
			aria-busy={loading}
			role="status"
			aria-label={shortName}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={[placeholder, xcss].join(' ')}
			css={[placeholderContainer]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={style}
			title={showTooltip ? shortName : ''}
		/>
	);
};

export default EmojiPlaceholder;

/**
 * @deprecated Use `import { emojiPlaceholderTestId } from '@atlaskit/emoji/emoji-placeholder'` instead.
 */
export { emojiPlaceholderTestId } from './emojiPlaceholderTestId';
