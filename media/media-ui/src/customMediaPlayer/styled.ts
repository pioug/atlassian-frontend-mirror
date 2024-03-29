/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import styled from '@emotion/styled';
import { R300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export interface MutedIndicatorProps {
  isMuted: boolean;
}

type VolumeWrapperProps = {
  showSlider: boolean;
};

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
  (props) =>
    props.showSlider
      ? `
    &:hover,
    &:active {
      width: 150px;
      transition: width 0.3s ease-out;
    }
  `
      : '',
);

export const CurrentTime = styled.div({
  color: '#c7d1db',
  userSelect: 'none',
  marginRight: token('space.100', '8px'),
  whiteSpace: 'nowrap',
});

interface WithAsActiveProps {
  showAsActive: boolean;
}

export const TimeLine = styled.div({
  width: '100%',
  height: '2px',
  transitionDelay: '1s',
  transition: 'all 0.1s',
  backgroundColor: '#596773',
  borderRadius: '5px',
  position: 'relative',
});

export const CurrentTimeLine = styled.div({
  backgroundColor: '#05c',
  borderRadius: 'inherit',
  height: 'inherit',
  position: 'absolute',
  top: token('space.0', '0px'),
  maxWidth: '100%',
  display: 'flex',
  alignItems: 'center',
});

export const Thumb = styled.div({
  pointerEvents: 'none',
  width: '14px',
  height: '14px',
  borderRadius: '100%',
  backgroundColor: 'white',
  border: '1px solid #666',
  position: 'absolute',
  right: 0,
  transform: 'translate(7px, -50%) scale(0)',
  transition: 'all 0.1s',
  transitionDelay: '1s',
  '&:hover .current-time-tooltip': {
    opacity: 1,
  },
});

export const BufferedTime = styled.div({
  backgroundColor: '#8696a7',
  height: 'inherit',
  borderRadius: 'inherit',
  width: 0,
});

export const LeftControls = styled.div({
  display: 'flex',
  marginLeft: token('space.150', '12px'),
});

export const RightControls = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginRight: token('space.150', '12px'),
});

export const ControlsWrapper = styled.div({
  bottom: 0,
  left: 0,
  width: '100%',
  height: 'auto',
  background: 'linear-gradient(to top, #101214, rgba(14, 22, 36, 0))',
  position: 'absolute',
});

export const VolumeToggleWrapper = styled.div(
  ({ isMuted }: MutedIndicatorProps) => `
  position: relative;
  margin-right: 13px;
  button {
    width: 36px !important;
    color: ${isMuted ? '#EF5C48 !important;' : ''}
  }`,
);

export const VolumeTimeRangeWrapper = styled.div({
  width: '100%',
  marginRight: token('space.250', '20px'),
});

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

export const CurrentTimeTooltip = styled.div(
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

export const TimeRangeWrapper = styled.div(
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
`,
);
