import React from 'react';
import { Component } from 'react';
import {
  TimeLine,
  CurrentTimeLine,
  Thumb,
  BufferedTime,
  CurrentTimeTooltip,
  TimeRangeWrapper,
} from './styled';
import { formatDuration } from '../formatDuration';

export interface TimeRangeProps {
  currentTime: number;
  bufferedTime: number;
  duration: number;
  onChange: (newTime: number) => void;
  disableThumbTooltip: boolean;
  isAlwaysActive: boolean;
  onChanged?: () => void;
}

export interface TimeRangeState {
  isDragging: boolean;
  dragStartClientX: number; // clientX value at the beginning of a slider
}

export class TimeRange extends Component<TimeRangeProps, TimeRangeState> {
  wrapperElement?: HTMLElement;
  thumbElement?: HTMLElement;

  wrapperElementWidth: number = 0;

  state: TimeRangeState = {
    isDragging: false,
    dragStartClientX: 0,
  };

  static defaultProps: Partial<TimeRangeProps> = {
    disableThumbTooltip: false,
    isAlwaysActive: false,
  };

  componentDidMount() {
    window.addEventListener('resize', this.setWrapperWidth);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('resize', this.setWrapperWidth);
  }

  private setWrapperWidth = () => {
    if (!this.wrapperElement) {
      return;
    }

    this.wrapperElementWidth = this.wrapperElement.getBoundingClientRect().width;
  };

  onMouseMove = (e: MouseEvent) => {
    const { isDragging, dragStartClientX } = this.state;
    if (!isDragging) {
      return;
    }
    e.stopPropagation();

    const { onChange, duration, currentTime } = this.props;
    const { clientX } = e;

    let absolutePosition = clientX - dragStartClientX;

    const isOutsideToRight = absolutePosition > this.wrapperElementWidth;
    const isOutsideToLeft = absolutePosition < 0;

    // Next to conditions take care of situation where user moves mouse very quickly out to the side
    // left or right. It's very easy to leave thumb not at the end/beginning of a timeline.
    // This will guarantee that in this case thumb will move to appropriate extreme.
    if (isOutsideToRight) {
      absolutePosition = this.wrapperElementWidth;
    }
    if (isOutsideToLeft) {
      absolutePosition = 0;
    }

    const newTimeWithBoundaries =
      (absolutePosition * duration) / this.wrapperElementWidth;

    if (currentTime !== newTimeWithBoundaries) {
      // If value hasn't changed we don't want to call "change"
      onChange(newTimeWithBoundaries);
    }
  };

  onMouseUp = () => {
    const { onChanged } = this.props;
    // As soon as user finished dragging, we should clean up events.
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);

    if (onChanged) {
      onChanged();
    }

    this.setState({
      isDragging: false,
    });
  };

  onThumbMouseDown = (e: React.SyntheticEvent<HTMLDivElement>) => {
    e.preventDefault();

    // We need to recalculate every time, because width can change (thanks, editor ;-)
    this.setWrapperWidth();

    // We are implementing drag and drop here. There is no reason to start listening for mouseUp or move
    // before that. Also if we start listening for mouseup before that we could pick up someone else's event
    // For example editors resizing of a inline video player.
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousemove', this.onMouseMove);

    const { duration, onChange } = this.props;
    const event = e.nativeEvent as MouseEvent;
    const x = event.offsetX;
    const currentTime = (x * duration) / this.wrapperElementWidth;

    this.setState({
      isDragging: true,
      dragStartClientX: event.clientX - x,
    });

    // As soon as user clicks timeline we want to move thumb over to that place.
    onChange(currentTime);
  };

  private saveWrapperElement = (el?: HTMLElement) => {
    if (el) {
      this.wrapperElement = el;
      this.setWrapperWidth();
    }
  };

  private saveThumbElement = (el?: HTMLElement) => {
    if (el) {
      this.thumbElement = el;
    }
  };

  render() {
    const { isDragging } = this.state;
    const {
      currentTime,
      duration,
      bufferedTime,
      disableThumbTooltip,
      isAlwaysActive,
    } = this.props;
    const currentPosition = (currentTime * 100) / duration;
    const bufferedTimePercentage = (bufferedTime * 100) / duration;

    return (
      <TimeRangeWrapper
        showAsActive={isAlwaysActive}
        onMouseDown={this.onThumbMouseDown}
      >
        <TimeLine innerRef={this.saveWrapperElement}>
          <BufferedTime style={{ width: `${bufferedTimePercentage}%` }} />
          <CurrentTimeLine style={{ width: `${currentPosition}%` }}>
            <Thumb innerRef={this.saveThumbElement}>
              {disableThumbTooltip ? null : (
                <CurrentTimeTooltip
                  draggable={false}
                  isDragging={isDragging}
                  className="current-time-tooltip"
                >
                  {formatDuration(currentTime)}
                </CurrentTimeTooltip>
              )}
            </Thumb>
          </CurrentTimeLine>
        </TimeLine>
      </TimeRangeWrapper>
    );
  }
}
