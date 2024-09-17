import React from 'react';

import ArrowLeftIcon from '@atlaskit/icon/core/migration/arrow-left';
import { ButtonItem } from '@atlaskit/side-navigation';
import HomeIcon from '@atlaskit/icon/core/migration/home';

import { getFormattedFolderName } from '../../utils';
import { SidebarHeaderEntry, SidebarHeaderIcon, SidebarHeaderWrapper } from './styleWrappers';
import { itemStyle } from './styles';

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

	render() {
		const { folderName, onHeaderClick } = this.props;
		return (
			// eslint-disable-next-line @atlaskit/design-system/no-deprecated-apis
			<ButtonItem onClick={onHeaderClick} cssFn={() => itemStyle}>
				<SidebarHeaderWrapper>
					<SidebarHeaderIcon>{this.getHeaderIcon()}</SidebarHeaderIcon>
					<SidebarHeaderEntry>{getFormattedFolderName(folderName)}</SidebarHeaderEntry>
				</SidebarHeaderWrapper>
			</ButtonItem>
		);
	}
}
