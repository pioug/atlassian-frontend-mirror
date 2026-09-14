import React, { memo, useMemo } from 'react';

import { type WithIntlProps, type WrappedComponentProps, injectIntl } from 'react-intl';

import { SplitButton } from '@atlaskit/button/split-button/split-button';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import { PopupSelect } from '@atlaskit/select/popup-select';
import type { OptionType, ValueType } from '@atlaskit/select/types';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import MediaButton from '../../MediaButton';
import { messages } from '../../messages';
import { popupCustomStyles, popupSelectComponents } from '../dropdownControlCommon';
import { getPopperPropsForFullscreen } from '../getPopperPropsForFullscreen';
import type { VideoTextTracks } from '../react-video-renderer/text';
import { formatLocale } from './captions/formatLocale';

export interface CaptionsSelectControlsProps {
	textTracks: VideoTextTracks;
	onSelected: (selected: number) => void;
	areCaptionsEnabled: boolean;
	onCaptionsEnabledChange: (areCaptionsEnabled: boolean) => void;
	selectedTracksIndex: number;
	isFullScreen?: boolean;
}

const CaptionsSelectControlsWithIntl = memo(
	({
		textTracks,
		onSelected,
		intl,
		areCaptionsEnabled,
		onCaptionsEnabledChange,
		selectedTracksIndex,
		isFullScreen = false,
	}: CaptionsSelectControlsProps & WrappedComponentProps) => {
		const closedCaptions = useMemo(
			() => intl.formatMessage(messages.video_captions_enable),
			[intl],
		);
		const selectCaptions = useMemo(
			() => intl.formatMessage(messages.video_captions_select_captions),
			[intl],
		);

		const popupSelectOptions = useMemo(
			() => [
				{
					label: selectCaptions,
					options: [
						...(textTracks.captions?.tracks.map((track, index) => ({
							label: `${formatLocale(intl.locale, track.lang)}`,
							value: index,
						})) || []),
					],
				},
			],
			[textTracks, intl.locale, selectCaptions],
		);

		const popupSelectValue = useMemo(
			() => popupSelectOptions[0].options.find((option) => option.value === selectedTracksIndex),
			[popupSelectOptions, selectedTracksIndex],
		);

		const handleItemClick = (option: ValueType<OptionType>) => {
			const value = (option && parseInt(`${option.value}`, 10)) || 0;
			onSelected(value);
			onCaptionsEnabledChange(true);
		};

		return (
			<SplitButton>
				<Tooltip content={closedCaptions} position="top">
					<MediaButton
						testId="custom-media-player-captions-toggle-button"
						appearance={areCaptionsEnabled ? 'primary' : 'default'}
						onClick={() => onCaptionsEnabledChange(!areCaptionsEnabled)}
						aria-label={closedCaptions}
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx
					>
						CC
					</MediaButton>
				</Tooltip>
				<PopupSelect
					searchThreshold={100}
					components={popupSelectComponents}
					maxMenuHeight={400}
					minMenuWidth={140}
					options={popupSelectOptions}
					value={popupSelectValue}
					onChange={handleItemClick}
					target={({ ref, isOpen, onKeyDown }) => (
						<Tooltip content={selectCaptions} position="top">
							<MediaButton
								testId="custom-media-player-captions-select-button"
								buttonRef={ref}
								isSelected={isOpen}
								onKeyDown={onKeyDown}
								iconBefore={
									<ChevronDownIcon size="small" color="currentColor" label={selectCaptions} />
								}
							/>
						</Tooltip>
					)}
					styles={popupCustomStyles}
					popperProps={getPopperPropsForFullscreen(isFullScreen)}
				/>
			</SplitButton>
		);
	},
);

export const CaptionsSelectControls: React.FC<
	WithIntlProps<CaptionsSelectControlsProps & WrappedComponentProps>
> & {
	WrappedComponent: React.ComponentType<CaptionsSelectControlsProps & WrappedComponentProps>;
} = injectIntl(CaptionsSelectControlsWithIntl);
