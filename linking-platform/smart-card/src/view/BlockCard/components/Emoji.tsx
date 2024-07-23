/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import React from 'react';
import { token } from '@atlaskit/tokens';
import { gs } from '../../common/utils';

const styles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: gs(2.5),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: gs(2),
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	marginTop: token('space.negative.025', '-2px'),
});

export interface EmojiProps {
	/* Element to be displayed as an icon. We naively render this if it is provided. Allows us to pass in AK icons */
	emoji?: React.ReactNode;
}

export const Emoji = ({ emoji }: EmojiProps) => {
	return <span css={styles}>{emoji}</span>;
};
