// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { N0, N90A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const playButtonClassName = 'media-card-play-button';

export const bkgClassName = 'play-icon-background';

const discSize = 48;
const discSizeHover = 56;

export const fixedPlayButtonStyles = `
  .${bkgClassName} {
    width: ${discSizeHover}px;
    height: ${discSizeHover}px;
  }
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const playButtonWrapperStyles = css({
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

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const backgroundStyles = css({
	transitionProperty: 'width, height',
	transitionDuration: '0.1s',
	position: 'absolute',
	width: `${discSize}px`,
	height: `${discSize}px`,
	background: token('color.background.neutral.bold', N90A),
	borderRadius: token('radius.full'),
});
