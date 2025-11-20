import React from 'react';

import ArrowLeftIcon from '@atlaskit/icon/core/migration/arrow-left';
import HomeIcon from '@atlaskit/icon/core/migration/home';

import { getFormattedFolderName } from '../../utils';
import { SidebarHeaderEntry, SidebarHeaderIcon, SidebarHeaderWrapper } from './styleWrappers';
import { CustomButtonItem } from './custom-button-item';

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
