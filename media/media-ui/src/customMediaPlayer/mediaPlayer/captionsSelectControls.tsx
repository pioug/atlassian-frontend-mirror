import React, { memo, useMemo } from 'react';
import { type VideoTextTracks } from '../react-video-renderer';
import { type WrappedComponentProps, injectIntl } from 'react-intl-next';
import Tooltip from '@atlaskit/tooltip';
import { SplitButton } from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/core/migration/chevron-down';
import { messages } from '../../messages';
import { formatLocale } from './captions';
import { PopupSelect, type OptionType, type ValueType } from '@atlaskit/select';
import MediaButton from '../../MediaButton';
import { popperProps, popupCustomStyles, popupSelectComponents } from '../dropdownControlCommon';

export interface CaptionsSelectControlsProps {
	textTracks: VideoTextTracks;
	onSelected: (selected: number) => void;
	areCaptionsEnabled: boolean;
	onCaptionsEnabledChange: (areCaptionsEnabled: boolean) => void;
	selectedTracksIndex: number;
}

const CaptionsSelectControlsWithIntl = memo(
	({
		textTracks,
		onSelected,
		intl,
		areCaptionsEnabled,
		onCaptionsEnabledChange,
		selectedTracksIndex,
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
					popperProps={popperProps}
				/>
			</SplitButton>
		);
	},
);

export const CaptionsSelectControls = injectIntl(CaptionsSelectControlsWithIntl);
