/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N0 } from '@atlaskit/theme/colors';

import { playButtonClassName } from './styles';

const playButtonWrapperStyles = css({
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	color: token('color.icon.inverse', N0),

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	span: {
		position: 'absolute',
	},
});

export const PlayButtonWrapper = (props: any) => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		<div css={playButtonWrapperStyles} className={playButtonClassName}>
			{props.children}
		</div>
	);
};
