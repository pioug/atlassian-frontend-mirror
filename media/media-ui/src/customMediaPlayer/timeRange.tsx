import React from 'react';
import { Component } from 'react';
import {
	TimeLine,
	CurrentTimeLine,
	BufferedTime,
	CurrentTimeTooltip,
	TimeRangeWrapper,
	CurrentTimeLineThumb,
} from './styled';
import { formatDuration, secondsToTime } from '../formatDuration';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';
import { messages } from '../messages';

export interface TimeRangeProps {
	currentTime: number;
	bufferedTime: number;
	duration: number;
	onChange: (newTime: number) => void;
	disableThumbTooltip: boolean;
	isAlwaysActive: boolean;
	onChanged?: () => void;
	skipBackward?: (skipAmount: number) => void;
	skipForward?: (skipAmount: number) => void;
}

export interface TimeRangeState {
	isDragging: boolean;
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
		dragStartClientX: 0,
	};

	static defaultProps: Partial<TimeRangeProps> = {
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
		document.removeEventListener('mousemove', this.onMouseMove);
		document.removeEventListener('mouseup', this.onMouseUp);
		window.removeEventListener('resize', this.setWrapperWidth);
	}

	private setWrapperWidth = () => {
		if (!this.wrapperElement.current) {
			return;
		}

		this.wrapperElementWidth = this.wrapperElement.current.getBoundingClientRect().width;
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

		const newTimeWithBoundaries = (absolutePosition * duration) / this.wrapperElementWidth;

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

	render() {
		const { isDragging } = this.state;
		const { currentTime, duration, bufferedTime, disableThumbTooltip, isAlwaysActive, intl } =
			this.props;
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

		return (
			<TimeRangeWrapper showAsActive={isAlwaysActive} onMouseDown={this.onThumbMouseDown}>
				<TimeLine ref={this.wrapperElement}>
					<BufferedTime style={{ width: `${bufferedTimePercentage}%` }} />
					<CurrentTimeLine style={{ width: `${currentPosition}%` }}>
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
							aria-valuetext={intl.formatMessage(messages.video_seeker_assistive_text_time_value, {
								currentTimeHours: currentTimeHours
									? this.numberFormatterHours.format(currentTimeHours)
									: '',
								currentTimeMinutes: this.numberFormatterMinutes.format(currentTimeMinutes),
								currentTimeSeconds: this.numberFormatterSeconds.format(currentTimeSeconds),
								videoTotalHours: videoTotalHours
									? this.numberFormatterHours.format(videoTotalHours)
									: '',
								videoTotalMinutes: this.numberFormatterMinutes.format(videoTotalMinutes),
								videoTotalSeconds: this.numberFormatterSeconds.format(videoTotalSeconds),
							})}
						>
							{disableThumbTooltip ? null : (
								<CurrentTimeTooltip
									draggable={false}
									isDragging={isDragging}
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
									className="current-time-tooltip"
								>
									{formatDuration(currentTime)}
								</CurrentTimeTooltip>
							)}
						</CurrentTimeLineThumb>
					</CurrentTimeLine>
				</TimeLine>
			</TimeRangeWrapper>
		);
	}
}

export const TimeRange = injectIntl(TimeRangeBase);
