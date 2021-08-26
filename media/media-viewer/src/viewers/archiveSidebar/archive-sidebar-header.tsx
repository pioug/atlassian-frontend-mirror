import React from 'react';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import { Item } from '@atlaskit/navigation-next';
import HomeIcon from '@atlaskit/icon/glyph/home';
import { getFormattedFolderName } from '../../utils';

export type HeaderProps = {
  folderName: string;
  onHeaderClick: () => void;
};

export class ArchiveSidebarHeader extends React.Component<HeaderProps> {
  private getHeaderIcon = () =>
    !!this.props.folderName ? (
      <ArrowLeftIcon label="Back" />
    ) : (
      <HomeIcon label="Home" />
    );

  render() {
    const { folderName, onHeaderClick } = this.props;
    return (
      <Item
        before={this.getHeaderIcon}
        text={getFormattedFolderName(folderName)}
        spacing="compact"
        onClick={onHeaderClick}
      />
    );
  }
}
