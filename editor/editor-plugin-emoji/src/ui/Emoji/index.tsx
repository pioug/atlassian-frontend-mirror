/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { Emoji, type EmojiProps } from '@atlaskit/editor-common/emoji';

// eslint-disable-next-line
const clickSelectWrapperStyle = css`
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
	user-select: all;
`;

export default function EmojiNode(props: EmojiProps) {
	return (
		<span css={clickSelectWrapperStyle}>
			<Emoji
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...props}
			/>
		</span>
	);
}
