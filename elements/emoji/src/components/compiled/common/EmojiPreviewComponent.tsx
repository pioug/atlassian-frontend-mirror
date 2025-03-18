/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N200, N900 } from '@atlaskit/theme/colors';
import type { EmojiDescription } from '../../../types';
import CachingEmoji from '../../common/CachingEmoji';

const emojiName = css({
	display: 'block',
	color: token('color.text', N900),
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:first-letter': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		textTransform: 'uppercase',
	},
});

const emojiShortName = css({
	display: 'block',
	color: token('color.text.subtle', N200),
	font: token('font.body.UNSAFE_small'),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 1,
	marginBottom: token('space.negative.025', '-2px'),
	overflow: 'hidden',
	paddingBottom: token('space.025', '2px'),
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:first-of-type': {
		color: token('color.text', N900),
		font: token('font.body'),
	},
});

const preview = css({
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'nowrap',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	padding: '10px',
	height: '32px',
	alignItems: 'center',
});

const previewImg = css({
	display: 'inline-block',
	flex: 'initial',
	width: '32px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& .emoji-common-emoji-sprite, span[role="img"]': {
		width: '32px',
		height: '32px',
		padding: 0,
		maxHeight: 'inherit',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& span[role="img"] > img': {
		position: 'relative',
		left: '50%',
		top: '50%',
		transform: 'translateX(-50%) translateY(-50%)',
		maxHeight: '32px',
		maxWidth: '32px',
		padding: 0,
		display: 'block',
	},
});

const previewText = css({
	display: 'flex',
	flexDirection: 'column',
	alignSelf: 'center',
	marginTop: token('space.negative.025', '-2px'),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginLeft: '10px',
	maxWidth: '285px',
	width: '285px' /* IE */,
	flexGrow: 1,
	flexShrink: 1,
});

type Props = {
	emoji: EmojiDescription;
};

export const EmojiPreviewComponent = ({ emoji }: Props) => {
	return (
		<div css={preview}>
			<span css={previewImg}>
				<CachingEmoji key={emoji.id || emoji.shortName} emoji={emoji} />
			</span>
			<div css={previewText}>
				{emoji.name && <div css={emojiName}>{emoji.name}</div>}
				<div css={emojiShortName}>{emoji.shortName}</div>
			</div>
		</div>
	);
};
