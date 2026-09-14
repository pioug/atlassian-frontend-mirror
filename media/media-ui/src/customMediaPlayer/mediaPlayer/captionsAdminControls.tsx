import React, { useMemo } from 'react';

import { type WithIntlProps, type WrappedComponentProps, injectIntl } from 'react-intl';

import DeleteIcon from '@atlaskit/icon/core/delete';
import SettingsIcon from '@atlaskit/icon/core/settings';
import UploadIcon from '@atlaskit/icon/core/upload';
import type { OptionType, ValueType } from '@atlaskit/select/types';
import { PopupSelect } from '@atlaskit/select/popup-select';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import MediaButton from '../../MediaButton';
import { messages } from '../../messages';
import { createPopupSelectComponentsWithIcon } from '../createPopupSelectComponentsWithIcon';
import { popupCustomStyles } from '../dropdownControlCommon';
import { getPopperPropsForFullscreen } from '../getPopperPropsForFullscreen';
import type { VideoTextTracks } from '../react-video-renderer/text';
import { formatLocale } from './captions/formatLocale';

export interface CaptionsAdminControlsProps {
	textTracks?: VideoTextTracks;
	onUpload: () => void;
	onDelete: (artifactName: string) => void;
	isFullScreen?: boolean;
}

const ADD_CAPTIONS_VALUE = 'add-captions';

const OptionIcon = ({ value }: { value: string }) => {
	if (value === ADD_CAPTIONS_VALUE) {
		return <UploadIcon spacing="spacious" label="" />;
	}
	return <DeleteIcon spacing="spacious" label="" color={token('color.icon.danger')} />;
};

const popupSelectComponents = createPopupSelectComponentsWithIcon(OptionIcon);

export const _CaptionsAdminControls = ({
	intl,
	textTracks = {},
	onUpload,
	onDelete,
	isFullScreen = false,
}: CaptionsAdminControlsProps & WrappedComponentProps): React.JSX.Element => {
	const manageCaptions = intl.formatMessage(messages.manage_captions);
	const addCaptions = intl.formatMessage(messages.add_captions);

	const popupSelectOptions = useMemo(
		() => [
			{
				label: manageCaptions,
				options: [
					...(textTracks.captions?.tracks.map((track) => ({
						label: formatLocale(intl.locale, track.lang),
						value: track.artifactName,
					})) || []),
					{
						label: addCaptions,
						value: ADD_CAPTIONS_VALUE,
					},
				],
			},
		],
		[textTracks, intl.locale, manageCaptions, addCaptions],
	);

	const handleItemClick = (option: ValueType<OptionType>) => {
		if (option?.value) {
			if (option.value === ADD_CAPTIONS_VALUE) {
				onUpload();
			} else {
				onDelete(`${option.value}`);
			}
		}
	};

	return (
		<PopupSelect
			searchThreshold={100}
			maxMenuHeight={500}
			minMenuWidth={140}
			options={popupSelectOptions}
			onChange={handleItemClick}
			components={popupSelectComponents}
			target={({ ref, isOpen, onKeyDown }) => (
				<Tooltip content={manageCaptions} position="top">
					<MediaButton
						testId="custom-media-player-captions-select-button"
						buttonRef={ref}
						isSelected={isOpen}
						onKeyDown={onKeyDown}
						iconBefore={<SettingsIcon size="medium" color="currentColor" label={manageCaptions} />}
					/>
				</Tooltip>
			)}
			styles={popupCustomStyles}
			popperProps={getPopperPropsForFullscreen(isFullScreen)}
		/>
	);
};

export const CaptionsAdminControls: React.FC<
	WithIntlProps<CaptionsAdminControlsProps & WrappedComponentProps>
> & {
	WrappedComponent: React.ComponentType<CaptionsAdminControlsProps & WrappedComponentProps>;
} = injectIntl(_CaptionsAdminControls);
