import React from 'react';

import ArrowLeftIcon from '@atlaskit/icon/core/arrow-left';
import HomeIcon from '@atlaskit/icon/core/home';

import { getFormattedFolderName } from '../../utils/getFormattedFolderName';
import { CustomButtonItem } from './custom-button-item';
import { SidebarHeaderEntry } from './sidebar-header-entry';
import { SidebarHeaderIcon } from './sidebar-header-icon';
import { SidebarHeaderWrapper } from './sidebar-header-wrapper';

export type HeaderProps = {
	folderName: string;
	onHeaderClick: () => void;
};

export class ArchiveSidebarHeader extends React.Component<HeaderProps> {
	private getHeaderIcon = () =>
		!!this.props.folderName ? (
			<ArrowLeftIcon color="currentColor" spacing="spacious" label="Back" />
		) : (
			<HomeIcon color="currentColor" spacing="spacious" label="Home" />
		);

	render(): React.JSX.Element {
		const { folderName, onHeaderClick } = this.props;
		return (
			<CustomButtonItem onClick={onHeaderClick}>
				<SidebarHeaderWrapper>
					<SidebarHeaderIcon>{this.getHeaderIcon()}</SidebarHeaderIcon>
					<SidebarHeaderEntry>{getFormattedFolderName(folderName)}</SidebarHeaderEntry>
				</SidebarHeaderWrapper>
			</CustomButtonItem>
		);
	}
}
