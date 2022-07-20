import React from 'react';

import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import { ButtonItem } from '@atlaskit/side-navigation';
import HomeIcon from '@atlaskit/icon/glyph/home';

import { getFormattedFolderName } from '../../utils';
import {
  SidebarHeaderEntry,
  SidebarHeaderIcon,
  SidebarHeaderWrapper,
} from './styleWrappers';
import { itemStyle } from './styles';

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
      <ButtonItem onClick={onHeaderClick} cssFn={() => itemStyle}>
        <SidebarHeaderWrapper>
          <SidebarHeaderIcon>{this.getHeaderIcon()}</SidebarHeaderIcon>
          <SidebarHeaderEntry>
            {getFormattedFolderName(folderName)}
          </SidebarHeaderEntry>
        </SidebarHeaderWrapper>
      </ButtonItem>
    );
  }
}
