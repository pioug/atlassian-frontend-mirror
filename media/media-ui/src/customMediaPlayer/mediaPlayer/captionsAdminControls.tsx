import React from 'react';
import { type VideoTextTracks } from '../react-video-renderer';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import UploadIcon from '@atlaskit/icon/core/upload';
import DeleteIcon from '@atlaskit/icon/core/delete';
import { IconButton } from '@atlaskit/button/new';
import SettingsIcon from '@atlaskit/icon/core/settings';
import { messages } from '../../messages';
import Tooltip from '@atlaskit/tooltip';
import { type WrappedComponentProps, injectIntl } from 'react-intl-next';
import { formatLocale } from './captions';
import { token } from '@atlaskit/tokens';

export interface CaptionsAdminControlsProps {
	textTracks?: VideoTextTracks;
	onUpload: () => void;
	onDelete: (artifactName: string) => void;
}

export const _CaptionsAdminControls = ({
	intl,
	textTracks = {},
	onUpload,
	onDelete,
}: CaptionsAdminControlsProps & WrappedComponentProps) => {
	const videoSettings = intl.formatMessage(messages.video_settings);
	return (
		<DropdownMenu<HTMLButtonElement>
			shouldRenderToParent
			placement="top-end"
			trigger={({ triggerRef, ...triggerProps }) => (
				<Tooltip content={videoSettings} position="top">
					<IconButton
						ref={triggerRef}
						{...triggerProps}
						icon={SettingsIcon}
						label={videoSettings}
						appearance="subtle"
					/>
				</Tooltip>
			)}
		>
			<DropdownItemGroup title={videoSettings}>
				{textTracks.captions?.tracks.map((track, index) => (
					<DropdownItem
						key={`${track.lang}-${index}`}
						onClick={() => onDelete(track.artifactName)}
						elemAfter={
							<DeleteIcon spacing="spacious" label="" color={token('color.icon.danger')} />
						}
					>
						{`${formatLocale(intl.locale, track.lang)}`}
					</DropdownItem>
				))}
				<DropdownItem elemBefore={<UploadIcon spacing="spacious" label="" />} onClick={onUpload}>
					Add Captions
				</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

export const CaptionsAdminControls = injectIntl(_CaptionsAdminControls);
