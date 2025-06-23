import React, { memo, useState, useEffect } from 'react';
import { type VideoTextTracks } from '../react-video-renderer';
import { type WrappedComponentProps, injectIntl } from 'react-intl-next';
import Tooltip from '@atlaskit/tooltip';
import Button, { IconButton, SplitButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import ChevronDownIcon from '@atlaskit/icon/core/migration/chevron-down';
import { messages } from '../../messages';
import { formatLocale } from './captions';

export interface CaptionsSelectControlsProps {
	textTracks: VideoTextTracks;
	onSelected: (selected: number) => void;
	areCaptionsEnabled: boolean;
	onCaptionsEnabledChange: (areCaptionsEnabled: boolean) => void;
	selectedTracksIndex: number;
}

export const _CaptionsSelectControls = memo(
	({
		textTracks,
		onSelected,
		intl,
		areCaptionsEnabled,
		onCaptionsEnabledChange,
		selectedTracksIndex,
	}: CaptionsSelectControlsProps & WrappedComponentProps) => {
		const [selectedIndex, setSelectedIndex] = useState(selectedTracksIndex);

		useEffect(() => {
			setSelectedIndex(selectedTracksIndex);
		}, [selectedTracksIndex]);

		const handleItemClick = (index: number) => {
			onSelected(index);
			setSelectedIndex(index);
			onCaptionsEnabledChange(true);
		};

		const closedCaptions = intl.formatMessage(messages.video_captions_enable);
		const selectCaptions = intl.formatMessage(messages.video_captions_select_captions);

		return (
			<SplitButton>
				<Tooltip content={closedCaptions} position="top">
					<Button
						appearance={areCaptionsEnabled ? 'default' : 'subtle'}
						onClick={() => onCaptionsEnabledChange(!areCaptionsEnabled)}
						aria-label={closedCaptions}
					>
						CC
					</Button>
				</Tooltip>
				<DropdownMenu<HTMLButtonElement>
					placement="top"
					shouldRenderToParent
					trigger={({ triggerRef, ...triggerProps }) => (
						<Tooltip content={selectCaptions} position="top">
							<IconButton
								ref={triggerRef}
								{...triggerProps}
								icon={(iconProps) => <ChevronDownIcon {...iconProps} size="small" />}
								label={selectCaptions}
								appearance="subtle"
							/>
						</Tooltip>
					)}
				>
					<DropdownItemGroup title={selectCaptions}>
						{textTracks.captions?.tracks.map((track, index) => (
							<DropdownItem
								key={`${track.lang}-${index}`}
								onClick={() => handleItemClick(index)}
								isSelected={index === selectedIndex}
							>
								{`${formatLocale(intl.locale, track.lang)}`}
							</DropdownItem>
						)) || <DropdownItem isDisabled>{closedCaptions}</DropdownItem>}
					</DropdownItemGroup>
				</DropdownMenu>
			</SplitButton>
		);
	},
);

export const CaptionsSelectControls = injectIntl(_CaptionsSelectControls);
