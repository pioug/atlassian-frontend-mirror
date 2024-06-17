/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { R300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { hideControlsClassName } from '../classNames';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

export interface MutedIndicatorProps {
	isMuted: boolean;
}

type VolumeWrapperProps = {
	showSlider: boolean;
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const VolumeWrapper = styled.div<VolumeWrapperProps>(
	{
		display: 'flex',
		width: '35px',
		overflow: 'hidden',
		transition: 'width 0.3s',
		alignItems: 'center',
		bottom: token('space.0', '0px'),
		left: token('space.500', '40px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
	(props) =>
		props.showSlider
			? `
    &:hover,
    &:active
    ${
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			getBooleanFF('platform.editor.a11y_video_controls_keyboard_support_yhcxh')
				? ', &:focus-within'
				: ''
		}
    {
      width: 150px;
      transition: width 0.3s ease-out;
    }
  `
			: '',
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const CurrentTime = styled.div({
	color: '#c7d1db',
	userSelect: 'none',
	marginRight: token('space.100', '8px'),
	whiteSpace: 'nowrap',
});

interface WithAsActiveProps {
	showAsActive: boolean;
}

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const TimeLine = styled.div({
	width: '100%',
	height: '2px',
	transitionDelay: '1s',
	transition: 'all 0.1s',
	backgroundColor: '#596773',
	borderRadius: '5px',
	position: 'relative',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const CurrentTimeLine = styled.div({
	backgroundColor: '#05c',
	borderRadius: 'inherit',
	height: 'inherit',
	position: 'absolute',
	top: token('space.0', '0px'),
	maxWidth: '100%',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Thumb = styled.div({
	pointerEvents: 'none',
	width: '14px',
	height: '14px',
	borderRadius: '100%',
	backgroundColor: 'white',
	border: '1px solid #666',
	position: 'absolute',
	right: 0,
	top: token('space.025', '2px'),
	transform: 'translate(7px, -50%) scale(0)',
	transition: 'all 0.1s',
	transitionDelay: '1s',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&:hover .current-time-tooltip': {
		opacity: 1,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const CurrentTimeLineThumb = styled.div({
	position: 'absolute',
	display: 'block',
	right: '0',
	top: '50%',
	transform: 'translate(50%, -50%)',
	backgroundColor: '#05c',
	border: 'none',
	height: token('space.150', '13px'),
	width: token('space.150', '13px'),
	pointerEvents: 'none',
	borderRadius: '100%',
	opacity: '0',
	outline: `2px solid ${token('color.border.focused', '#85B8FF')}`,
	outlineOffset: token('space.025', '2px'),

	'&:focus': {
		opacity: '1',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&:hover .current-time-tooltip': {
		opacity: 1,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&:focus .current-time-tooltip': {
		opacity: 1,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const BufferedTime = styled.div({
	backgroundColor: '#8696a7',
	height: 'inherit',
	borderRadius: 'inherit',
	width: 0,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const LeftControls = styled.div({
	display: 'flex',
	marginLeft: token('space.150', '12px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const RightControls = styled.div({
	display: 'flex',
	alignItems: 'center',
	marginRight: token('space.150', '12px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ControlsWrapper = styled.div({
	bottom: 0,
	left: 0,
	width: '100%',
	height: 'auto',
	background: 'linear-gradient(to top, #101214, rgba(14, 22, 36, 0))',
	position: 'absolute',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`:focus-within.${hideControlsClassName}`]: {
		opacity: '1',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const VolumeToggleWrapper = styled.div(
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
	({ isMuted }: MutedIndicatorProps) => `
  position: relative;
  margin-right: 13px;
  button {
    width: 36px !important;
    color: ${isMuted ? '#EF5C48 !important;' : ''}
  }`,
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const VolumeTimeRangeWrapper = styled.div({
	width: '100%',
	marginRight: token('space.250', '20px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const MutedIndicator = styled.div(
	{
		width: '29px',
		height: '2px',
		position: 'absolute',
		top: token('space.100', '8px'),
		left: token('space.100', '8px'),
		zIndex: 2,
		background: R300,
		transform: 'rotate(32deg) translateY(10px)',
		opacity: 0,
		pointerEvents: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
	(props: MutedIndicatorProps) =>
		props.isMuted
			? `
    opacity: 1;
  `
			: '',
);

export interface CurrentTimeTooltipProps {
	isDragging: boolean;
}

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const CurrentTimeTooltip = styled.div(
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
	({ isDragging }: CurrentTimeTooltipProps) => `
  position: absolute;
  user-select: none;
  top: ${token('space.negative.400', '-32px')};
  background-color: #182c4c;
  color: #eff1f3;
  font-size: ${token('space.150', '12px')};
  padding: ${token('space.050', '4px')} ${token('space.100', '8px')};
  border-radius: ${token('space.050', '4px')};
  left: 50%;
  transform: translateX(-50%);
  opacity: ${isDragging ? '1' : '0'};
  transition: opacity 0.3s;
  word-break: keep-all;
`,
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const TimeRangeWrapper = styled.div(
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
	({ showAsActive }: WithAsActiveProps) => `
  display: flex;
  align-items: center;
  height: 22px;

  cursor: pointer;
  width: 100%;

  &:hover ${TimeLine} {
    height: 4px;
    transition: all 0.1s;
  }

  &:hover ${Thumb} {
    transition: all 0.1s;
    transform: translate(7px, -50%) scale(1);
  }

  ${TimeLine} {
    transition-delay: 1s;
    ${showAsActive ? 'height: 4px;' : ''}
  }
  ${Thumb} {
    ${showAsActive ? 'transform: translate(7px, -50%) scale(1);' : ''}
  }

  ${
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		getBooleanFF('platform.editor.a11y_video_controls_keyboard_support_yhcxh')
			? `
    // a11y override default theme colors from '@atlaskit/range' to have better contrast with panel color
    input[type="range"] {
      width:100%;
      cursor: pointer;
      height: 14px;
    }

    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none; /* Override default look */
      appearance: none;
      background: #9FADBC;
      width: 14px;
      height: 14px;
      margin-top: -5px; // smaller thumb requires adjustment for margin
    }

    input[type="range"]::-webkit-slider-runnable-track {
      --webkit-appearance: none; /* Override default look */
      --track-bg: #596773;
      --track-fg: #9FADBC;
    }

    input[type="range"]::-moz-range-progress {
      background-color: #9FADBC;
    }

    input[type="range"]::-moz-range-track {
      background-color: #596773;
    }

    input[type="range"]::-moz-range-thumb {
      background: #9FADBC;
      width: 14px;
      height: 14px;
    }
    `
			: ''
	}
`,
);
