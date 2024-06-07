/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
// Keep PlaybackSpeedControls to use static colors from the new color palette to support the hybrid
// theming in media viewer https://product-fabric.atlassian.net/browse/DSP-6067
import React, { type KeyboardEvent } from 'react';
import { Component } from 'react';
import {
	PopupSelect,
	type OptionType,
	type StylesConfig,
	type ValueType,
	type GroupedOptionsType,
	type ActionMeta,
} from '@atlaskit/select';
import { N600, DN900 } from '@atlaskit/theme/colors';
import { type NumericalCardDimensions } from '@atlaskit/media-common';
import { FormattedMessage, type WrappedComponentProps, injectIntl } from 'react-intl-next';
import Tooltip from '@atlaskit/tooltip';
import MediaButton from '../MediaButton';
import { messages } from '../messages';
import { WidthObserver } from '@atlaskit/width-detector';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

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

	private popupCustomStyles: StylesConfig<OptionType> = {
		container: (styles) => ({
			...styles,
			backgroundColor: '#22272b',
			boxShadow: 'inset 0px 0px 0px 1px #bcd6f00a,0px 8px 12px #0304045c,0px 0px 1px #03040480',
		}),
		// added these overrides to keep the look of the current design
		// however this does not benefit from the DS a11y changes
		menuList: (styles) => ({ ...styles, padding: '4px 0px' }),
		option: (styles, { isFocused, isSelected }) => ({
			...styles,
			color: isSelected ? '#579dff' : DN900,
			backgroundColor: isSelected ? '#082145' : isFocused ? '#a1bdd914' : '#22272b',
			':active': {
				backgroundColor: '#a6c5e229',
			},
		}),
		groupHeading: (styles) => ({
			...styles,
			color: '#9fadbc',
		}),
	};

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

	render() {
		const { playbackSpeed, intl, onClick } = this.props;
		const { popupHeight } = this.state;
		const value = this.speedOptions()[0].options.find((option) => option.value === playbackSpeed);

		const popperProps: PopupSelect['props']['popperProps'] = {
			strategy: 'fixed',
			modifiers: [
				{
					name: 'preventOverflow',
					enabled: true,
				},
				{
					name: 'eventListeners',
					options: {
						scroll: true,
						resize: true,
					},
				},
				{
					name: 'offset',
					enabled: true,
					options: {
						offset: [0, 10],
					},
				},
			],
			placement: 'top',
		};

		return (
			<>
				<WidthObserver setWidth={this.onResize} />
				<PopupSelect
					minMenuWidth={140}
					maxMenuHeight={popupHeight}
					options={this.speedOptions()}
					value={value}
					theme={(theme) => ({
						...theme,
						colors: { ...theme.colors, primary25: N600 },
					})}
					closeMenuOnScroll={true}
					onChange={this.onPlaybackSpeedChange}
					target={({ ref, isOpen, onKeyDown: popupKeydown }) => (
						<Tooltip content={intl.formatMessage(messages.playbackSpeed)} position="top">
							<MediaButton
								testId="custom-media-player-playback-speed-toggle-button"
								buttonRef={ref}
								isSelected={isOpen}
								onClick={onClick}
								onKeyDown={(event) => {
									if (getBooleanFF('platform.editor.a11y_video_controls_keyboard_support_yhcxh')) {
										popupKeydown(event);
									}
								}}
							>
								{playbackSpeed}x
							</MediaButton>
						</Tooltip>
					)}
					styles={this.popupCustomStyles}
					popperProps={popperProps}
				/>
			</>
		);
	}
}

export default injectIntl(PlaybackSpeedControls) as React.FC<PlaybackSpeedControlsProps>;
