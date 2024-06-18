/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { EmojiDescription } from '../../types';
import CachingEmoji from './CachingEmoji';
import { emojiName, emojiShortName, preview, previewImg, previewText } from './styles';

type Props = {
	emoji: EmojiDescription;
};

export const EmojiPreviewComponent = ({ emoji }: Props) => {
	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div css={preview}>
			{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
			<span css={previewImg}>
				<CachingEmoji key={emoji.id || emoji.shortName} emoji={emoji} />
			</span>
			{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
			<div css={previewText}>
				{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
				{emoji.name && <div css={emojiName}>{emoji.name}</div>}
				{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
				<div css={emojiShortName}>{emoji.shortName}</div>
			</div>
		</div>
	);
};
