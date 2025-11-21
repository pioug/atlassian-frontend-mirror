import React, { type KeyboardEvent } from 'react';
import { Component } from 'react';

import {
	PopupSelect,
	type OptionType,
	type ValueType,
	type GroupedOptionsType,
	type ActionMeta,
} from '@atlaskit/select';
import { type NumericalCardDimensions } from '@atlaskit/media-common';
import { FormattedMessage, type WrappedComponentProps, injectIntl } from 'react-intl-next';
import Tooltip from '@atlaskit/tooltip';
import MediaButton from '../MediaButton';
import { messages } from '../messages';
import { WidthObserver } from '@atlaskit/width-detector';
import { popperProps, popupCustomStyles, popupSelectComponents } from './dropdownControlCommon';

export interface PlaybackSpeedControlsProps {
	playbackSpeed: number;
	onPlaybackSpeedChange: (playbackSpeed: number) => void;
	originalDimensions?: NumericalCardDimensions;
	onClick?: () => void;
	onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
}

export interface PlaybackSpeedControlsState {
	popupHeight: number;
}

export class PlaybackSpeedControls extends Component<
	PlaybackSpeedControlsProps & WrappedComponentProps,
	PlaybackSpeedControlsState
> {
	state: PlaybackSpeedControlsState = {
		popupHeight: 255,
	};
	private onPlaybackSpeedChange = (
		option: ValueType<OptionType>,
		_actionMeta: ActionMeta<OptionType>,
	) => {
		const { onPlaybackSpeedChange } = this.props;
		if (!option) {
			return;
		}

		const playbackSpeed = parseFloat(`${(option as OptionType).value}`);
		onPlaybackSpeedChange(playbackSpeed);
	};

	private speedOptions: () => GroupedOptionsType<OptionType> = () => [
		{
			// @ts-ignore: FormattedMessage is returning an Element which is a type mismatch with what OptionType wants. This can be fix by using 'intl' object once this packages gets refactor later.
			label: <FormattedMessage {...messages.playbackSpeed} />,
			options: [
				{ label: '0.75x', value: 0.75 },
				{ label: '1x', value: 1 },
				{ label: '1.25x', value: 1.25 },
				{ label: '1.5x', value: 1.5 },
				{ label: '2x', value: 2 },
			],
		},
	];

	private onResize = (width: number) => {
		const { originalDimensions } = this.props;
		if (originalDimensions) {
			const aspectRatio = originalDimensions.height / originalDimensions.width;
			const controlsSize = 60;
			const minimumHeight = 100;
			const popupHeight = Math.max(aspectRatio * width - controlsSize, minimumHeight);

			this.setState({ popupHeight });
		}
		// This is a hacky solution. Please replace with a better one if you find one.
		// There is something inside popper.js that recalc position on scroll.
		// We enable this functionality with `eventListeners` modifier.
		// Here we simulate scroll even to trick popper.js to recalc position.
		window.dispatchEvent(new CustomEvent('scroll'));
	};

	render(): React.JSX.Element {
		const { playbackSpeed, intl, onClick } = this.props;
		const { popupHeight } = this.state;
		const value = this.speedOptions()[0].options.find((option) => option.value === playbackSpeed);

		return (
			<>
				<WidthObserver setWidth={this.onResize} />
				<PopupSelect
					components={popupSelectComponents}
					minMenuWidth={140}
					maxMenuHeight={popupHeight}
					options={this.speedOptions()}
					value={value}
					onChange={this.onPlaybackSpeedChange}
					label={intl.formatMessage(messages.playbackSpeed)}
					target={({ ref, isOpen, onKeyDown: popupKeydown }) => (
						<Tooltip content={intl.formatMessage(messages.playbackSpeed)} position="top">
							<MediaButton
								testId="custom-media-player-playback-speed-toggle-button"
								buttonRef={ref}
								isSelected={isOpen}
								onClick={onClick}
								onKeyDown={popupKeydown}
								aria-expanded={isOpen}
							>
								{/* eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx */}
								{playbackSpeed}x
							</MediaButton>
						</Tooltip>
					)}
					styles={popupCustomStyles}
					popperProps={popperProps}
				/>
			</>
		);
	}
}

export default injectIntl(PlaybackSpeedControls) as React.FC<PlaybackSpeedControlsProps>;
