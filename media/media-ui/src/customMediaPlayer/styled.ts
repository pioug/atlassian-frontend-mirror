import styled from 'styled-components';
import { R300 } from '@atlaskit/theme/colors';

export interface MutedIndicatorProps {
  isMuted: boolean;
}

export const CustomVideoWrapper = styled.div`
  width: 100%;
  height: 100%;
  user-select: none;
`;

export const VideoWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const TimebarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  position: absolute;
  width: 100%;
  bottom: 10px;
`;

export const VolumeWrapper = styled.div`
  display: flex;
  width: 35px;
  overflow: hidden;
  transition: width 0.3s;
  align-items: center;
  position: absolute;
  bottom: 0px;
  left: 43px;

  &:hover,
  &:active {
    width: 155px;
    transition: width 0.3s ease-out;
  }
`;

export const TimeWrapper = styled.div`
  margin: 0 20px 10px 20px;
  margin-bottom: 44px;
`;

export const CurrentTime = styled.div`
  color: #a4b4cb;
  user-select: none;
  margin-right: 10px;
`;

interface WithAsActiveProps {
  showAsActive: boolean;
}

export const TimeLine = styled.div`
  width: 100%;
  height: 2px;
  transition-delay: 1s;
  transition: all 0.1s;
  background-color: #5d646f;
  border-radius: 5px;
  position: relative;
`;

export const CurrentTimeLine = styled.div`
  background-color: #3383ff;
  border-radius: inherit;
  height: inherit;
  position: absolute;
  top: 0;
  max-width: 100%;
`;

export const Thumb = styled.div`
  pointer-events: none;
  width: 14px;
  height: 14px;
  border-radius: 100%;
  background-color: white;
  border: 1px solid #666;
  position: absolute;
  right: 0;
  top: 50%;

  transform: translate(7px, -50%) scale(0);
  transition: all 0.1s;
  transition-delay: 1s;

  &:hover .current-time-tooltip {
    opacity: 1;
  }
`;

export const BufferedTime = styled.div`
  background-color: #aeb1b7;
  height: inherit;
  border-radius: inherit;
  width: 0;
`;

export const LeftControls = styled.div`
  display: flex;
  margin-left: 10px;
`;

export const RightControls = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

export const ControlsWrapper = styled.div`
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto;
  background: linear-gradient(to top, #0e1624, rgba(14, 22, 36, 0));
  position: absolute;
`;

export const VolumeToggleWrapper = styled.div`
  position: relative;
  margin-right: 13px;

  button {
    width: 36px;
    color: ${({ isMuted }: MutedIndicatorProps) =>
      isMuted ? `${R300} !important;` : ''};
  }
`;

export const VolumeTimeRangeWrapper = styled.div`
  width: 100%;
  margin-right: 20px;
`;

export const MutedIndicator = styled.div`
  width: 29px;
  height: 2px;
  position: absolute;
  top: 5px;
  left: 9px;
  background: ${R300};
  transform: rotate(32deg) translateY(10px);
  opacity: 0;
  pointer-events: none;

  ${(props: MutedIndicatorProps) =>
    props.isMuted
      ? `
    opacity: 1;
  `
      : ''};
`;

export interface CurrentTimeTooltipProps {
  isDragging: boolean;
}

export const CurrentTimeTooltip = styled.div`
  position: absolute;
  user-select: none;
  top: -28px;
  background-color: #182c4c;
  color: #eff1f3;
  font-size: 12px;
  padding: 3px 7px;
  border-radius: 3px;
  left: 50%;
  transform: translateX(-50%);
  opacity: ${(props: CurrentTimeTooltipProps) =>
    props.isDragging ? '1' : '0'};
  transition: opacity 0.3s;
  word-break: keep-all;
`;

export const TimeRangeWrapper = styled.div`
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
    ${({ showAsActive }: WithAsActiveProps) =>
      showAsActive ? 'height: 4px;' : ''}
  }
  ${Thumb} {
    ${({ showAsActive }: WithAsActiveProps) =>
      showAsActive ? 'transform: translate(7px, -50%) scale(1);' : ''}
  }
`;

export const SpinnerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
