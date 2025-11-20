import React from 'react';
import { Component } from 'react';
import {
	CurrentTimeTooltip as CompiledCurrentTimeTooltip,
	TimeRangeWrapper as CompiledTimeRangeWrapper,
} from './styled-compiled';
import { formatDuration, secondsToTime } from '../formatDuration';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';
import { messages } from '../messages';
import { BufferedTime, CurrentTimeLine, CurrentTimeLineThumb, TimeLine } from './styled';

export interface TimeRangeProps {
	currentTime: number;
	bufferedTime: number;
	duration: number;
	onChange: (newTime: number) => void;
	disableThumbTooltip: boolean;
	isAlwaysActive: boolean;
	onChanged?: () => void;
	skipBackward?: (skipAmount?: number) => void;
	skipForward?: (skipAmount?: number) => void;
}

export interface TimeRangeState {
	isDragging: boolean;
	timeLineThumbIsHover: boolean;
	timeLineThumbIsFocus: boolean;
	dragStartClientX: number; // clientX value at the beginning of a slider
}

export class TimeRangeBase extends Component<
	TimeRangeProps & WrappedComponentProps<'intl'>,
	TimeRangeState
> {
	thumbElement = React.createRef<HTMLDivElement>();
	wrapperElement = React.createRef<HTMLDivElement>();

	wrapperElementWidth: number = 0;

	state: TimeRangeState = {
		isDragging: false,
		timeLineThumbIsHover: false,
		timeLineThumbIsFocus: false,
		dragStartClientX: 0,
	};

	static defaultProps = {
		disableThumbTooltip: false,
		isAlwaysActive: false,
	};

	private numberFormatterHours: Intl.NumberFormat;
	private numberFormatterMinutes: Intl.NumberFormat;
	private numberFormatterSeconds: Intl.NumberFormat;

	constructor(props: TimeRangeProps & WrappedComponentProps<'intl'>) {
		super(props);
		this.numberFormatterHours = new Intl.NumberFormat(this.props.intl.locale, {
			style: 'unit',
			unit: 'hour',
		});
		this.numberFormatterMinutes = new Intl.NumberFormat(this.props.intl.locale, {
			style: 'unit',
			unit: 'minute',
		});
		this.numberFormatterSeconds = new Intl.NumberFormat(this.props.intl.locale, {
			style: 'unit',
			unit: 'second',
		});
	}

	componentDidMount() {
		window.addEventListener('resize', this.setWrapperWidth);
	}

	componentDidUpdate(prevProps: TimeRangeProps & WrappedComponentProps) {
		if (this.props.intl.locale !== prevProps.intl.locale) {
			this.numberFormatterHours = new Intl.NumberFormat(this.props.intl.locale, {
				style: 'unit',
				unit: 'hour',
			});
			this.numberFormatterMinutes = new Intl.NumberFormat(this.props.intl.locale, {
				style: 'unit',
				unit: 'minute',
			});
			this.numberFormatterSeconds = new Intl.NumberFormat(this.props.intl.locale, {
				style: 'unit',
				unit: 'second',
			});
		}
	}

	componentWillUnmount() {
		document.removeEventListener('pointermove', this.onPointerMove);
		document.removeEventListener('pointerup', this.onPointerUp);
		window.removeEventListener('resize', this.setWrapperWidth);
	}

	private setWrapperWidth = () => {
		if (!this.wrapperElement.current) {
			return;
		}

		this.wrapperElementWidth = this.wrapperElement.current.getBoundingClientRect().width;
	};

	onPointerMove = (e: PointerEvent) => {
		const { isDragging, dragStartClientX } = this.state;
		if (!isDragging) {
			return;
		}
		e.preventDefault();
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

		const newTimeWithBoundaries = (absolutePosition * duration) / this.wrapperElementWidth;

		if (currentTime !== newTimeWithBoundaries) {
			// If value hasn't changed we don't want to call "change"
			onChange(newTimeWithBoundaries);
		}
	};

	onPointerUp = () => {
		const { onChanged } = this.props;
		// As soon as user finished dragging, we should clean up events.
		document.removeEventListener('pointerup', this.onPointerUp);
		document.removeEventListener('pointermove', this.onPointerMove);

		if (onChanged) {
			onChanged();
		}

		this.setState({
			isDragging: false,
		});
	};

	onPointerDown = (e: React.SyntheticEvent<HTMLDivElement>) => {
		e.preventDefault();

		// We need to recalculate every time, because width can change (thanks, editor ;-)
		this.setWrapperWidth();

		// We are implementing drag and drop here. There is no reason to start listening for pointerUp or move
		// before that. Also if we start listening for pointerup before that we could pick up someone else's event
		// For example editors resizing of a inline video player.
		document.addEventListener('pointerup', this.onPointerUp);
		document.addEventListener('pointermove', this.onPointerMove);

		const { duration, onChange } = this.props;
		const event = e.nativeEvent as PointerEvent;
		const x = event.offsetX;
		const currentTime = (x * duration) / this.wrapperElementWidth;

		this.setState({
			isDragging: true,
			dragStartClientX: event.clientX - x,
		});

		// As soon as user clicks timeline we want to move thumb over to that place.
		onChange(currentTime);
	};

	onTimeLineThumbKeydown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (!this.props.skipBackward || !this.props.skipForward) {
			return;
		}

		if (event.key === 'ArrowRight') {
			event.preventDefault();
			event.stopPropagation();

			if (event.shiftKey) {
				this.props.skipForward(10);
			} else {
				this.props.skipForward(1);
			}
		}

		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			event.stopPropagation();

			if (event.shiftKey) {
				this.props.skipBackward(10);
			} else {
				this.props.skipBackward(1);
			}
		}
	};

	render(): React.JSX.Element {
		const { isDragging, timeLineThumbIsHover, timeLineThumbIsFocus } = this.state;
		const { currentTime, duration, bufferedTime, disableThumbTooltip, intl } = this.props;
		const currentPosition = (currentTime * 100) / duration;
		const bufferedTimePercentage = (bufferedTime * 100) / duration;

		const {
			seconds: currentTimeSeconds,
			minutes: currentTimeMinutes,
			hours: currentTimeHours,
		} = secondsToTime(currentTime);
		const {
			seconds: videoTotalSeconds,
			minutes: videoTotalMinutes,
			hours: videoTotalHours,
		} = secondsToTime(duration);

		const timelineThumbText = intl.formatMessage(messages.video_seeker_assistive_text_time_value, {
			currentTimeHours: currentTimeHours ? this.numberFormatterHours.format(currentTimeHours) : '',
			currentTimeMinutes: this.numberFormatterMinutes.format(currentTimeMinutes),
			currentTimeSeconds: this.numberFormatterSeconds.format(currentTimeSeconds),
			videoTotalHours: videoTotalHours ? this.numberFormatterHours.format(videoTotalHours) : '',
			videoTotalMinutes: this.numberFormatterMinutes.format(videoTotalMinutes),
			videoTotalSeconds: this.numberFormatterSeconds.format(videoTotalSeconds),
		});

		const currentTimeTooltip = (
			<CompiledCurrentTimeTooltip
				draggable={false}
				isDragging={isDragging}
				timeLineThumbIsHover={timeLineThumbIsHover}
				timeLineThumbIsFocus={timeLineThumbIsFocus}
			>
				{formatDuration(currentTime)}
			</CompiledCurrentTimeTooltip>
		);

		const timeline = (
			<TimeLine ref={this.wrapperElement}>
				<BufferedTime style={{ width: `${bufferedTimePercentage}%` }} data-testid="buffered-time" />
				<CurrentTimeLine style={{ width: `${currentPosition}%` }} data-testid="current-timeline">
					<CurrentTimeLineThumb
						role="slider"
						ref={this.thumbElement}
						onKeyDown={this.onTimeLineThumbKeydown}
						tabIndex={0}
						aria-orientation="horizontal"
						aria-label={intl.formatMessage(messages.video_seeker_label_assistive_text)}
						aria-valuemin={0}
						aria-valuemax={Math.floor(duration)}
						aria-valuenow={Math.floor(currentTime)}
						aria-valuetext={timelineThumbText}
						onMouseOver={() => this.setState({ timeLineThumbIsHover: true })}
						onMouseOut={() => this.setState({ timeLineThumbIsHover: false })}
						onFocus={() => this.setState({ timeLineThumbIsFocus: true })}
						onBlur={() => this.setState({ timeLineThumbIsFocus: false })}
					>
						{disableThumbTooltip ? null : currentTimeTooltip}
					</CurrentTimeLineThumb>
				</CurrentTimeLine>
			</TimeLine>
		);

		return (
			<CompiledTimeRangeWrapper onPointerDown={this.onPointerDown} data-testid="time-range-wrapper">
				{timeline}
			</CompiledTimeRangeWrapper>
		);
	}
}

export const TimeRange = injectIntl(TimeRangeBase) as React.ComponentType<TimeRangeProps>;
