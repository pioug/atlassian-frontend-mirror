/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N90A } from '@atlaskit/theme/colors';

import { bkgClassName } from './styles';
const discSize = 48;

const backgroundStyles = css({
	transitionProperty: 'width, height',
	transitionDuration: '0.1s',
	position: 'absolute',
	width: `${discSize}px`,
	height: `${discSize}px`,
	backgroundColor: token('color.background.neutral.bold', N90A),
	borderRadius: token('radius.full'),
});

export const PlayButtonBackground = () => {
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
	return <div css={backgroundStyles} className={bkgClassName} />;
};
