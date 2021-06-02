import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import dateformat from 'dateformat'; // ToDo: FIL-3207 | replace dateformat library with native solution
import filesize from 'filesize'; // ToDo: FIL-3208 | replace filesize library with native solution
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import { changeCloudAccountFolder } from '../../../../actions/changeCloudAccountFolder';
import { fetchNextCloudFilesPage } from '../../../../actions/fetchNextCloudFilesPage';
import AkButton from '@atlaskit/button/custom-theme-button';
import Spinner from '@atlaskit/spinner';

/* Actions */
import { fileClick } from '../../../../actions/fileClick';

import {
  isServiceFile,
  isServiceFolder,
  Path,
  SelectedItem,
  ServiceAccountLink,
  ServiceFile,
  ServiceFolder,
  ServiceFolderItem,
  ServiceName,
  State,
} from '../../../../domain';

/* Components */
import Navigation from '../../../navigation/navigation';
import {
  SpinnerWrapper,
  FolderViewerWrapper,
  FolderViewerRow,
  FileMetadataGroup,
  FileIcon,
  FileName,
  FileCreateDate,
  FileSize,
  MoreBtnWrapper,
  FolderViewerContent,
  SelectedFileIconWrapper,
} from './styled';

import { mapMimeTypeToIcon } from '../../../../tools/mimeTypeToIcon';

const getDateString = (timestamp?: number) => {
  if (!timestamp) {
    return '';
  }

  const todayString = new Date().toDateString();
  const itemDate = new Date(timestamp);
  const itemDateString = itemDate.toDateString();

  return dateformat(
    itemDate,
    todayString === itemDateString ? 'H:MM TT' : 'd mmm yyyy',
  );
};

export interface FolderViewerStateProps {
  readonly path: Path;
  readonly service: ServiceAccountLink;
  readonly items: ServiceFolderItem[];
  readonly selectedItems: SelectedItem[];
  readonly isLoading: boolean;

  readonly currentCursor?: string;
  readonly nextCursor?: string;
}

export interface FolderViewDispatchProps {
  readonly onFolderClick: (
    serviceName: ServiceName,
    accountId: string,
    path: Path,
  ) => void;
  readonly onFileClick: (
    serviceName: ServiceName,
    accountId: string,
    file: ServiceFile,
  ) => void;
  readonly onLoadMoreClick: (
    serviceName: ServiceName,
    accountId: string,
    path: Path,
    nextCursor: string,
  ) => void;
}

export type FolderViewerProps = FolderViewerStateProps &
  FolderViewDispatchProps;

const selectedTick = (
  <SelectedFileIconWrapper>
    <CheckCircleIcon label="check" />
  </SelectedFileIconWrapper>
);

/**
 * Routing class that displays view depending on situation.
 */
export class FolderViewer extends Component<FolderViewerProps, {}> {
  render(): JSX.Element {
    return (
      <FolderViewerWrapper>
        <Navigation />
        {this.renderContents()}
      </FolderViewerWrapper>
    );
  }

  private renderContents = () => {
    if (this.isPageInitialLoading) {
      return (
        <SpinnerWrapper>
          <Spinner size="large" />
        </SpinnerWrapper>
      );
    }

    return this.renderFolderContent(this.props.items);
  };

  private get isPageInitialLoading() {
    return this.props.isLoading && !this.props.currentCursor;
  }

  private get isPageMoreLoading() {
    return this.props.isLoading && this.props.currentCursor;
  }

  private renderFolderContent(items: ServiceFolderItem[]): JSX.Element | null {
    if (!items) {
      return null;
    }

    const folderItems = items
      .filter(
        (item) => item.mimeType.indexOf('application/vnd.google-apps.') === -1,
      )
      .map((item) => {
        const itemIcon = mapMimeTypeToIcon(item.mimeType);
        const availableIds = this.props.selectedItems.map(
          (selectedItem) => selectedItem.id,
        );
        const isSelected = availableIds.indexOf(item.id) > -1;

        if (isServiceFile(item)) {
          return this.renderServiceFile(item, itemIcon, isSelected);
        } else {
          return this.renderServiceFolder(item, itemIcon);
        }
      });

    return (
      <FolderViewerContent>
        {[folderItems, this.renderLoadMoreButton()]}
      </FolderViewerContent>
    );
  }

  private renderServiceFolder = (
    item: ServiceFolder,
    itemIcon: JSX.Element,
  ): JSX.Element => {
    return (
      <FolderViewerRow onClick={this.itemClicked(item)} key={item.id}>
        <FileMetadataGroup>
          <FileIcon>{itemIcon}</FileIcon>
          <FileName>{item.name}</FileName>
        </FileMetadataGroup>
      </FolderViewerRow>
    );
  };

  private renderServiceFile = (
    serviceFile: ServiceFile,
    itemIcon: JSX.Element,
    isSelected: boolean,
  ): JSX.Element => {
    const tail = isSelected
      ? selectedTick
      : this.renderFileCreateDateAndSize(serviceFile);

    return (
      <FolderViewerRow
        isSelected={isSelected}
        onClick={this.itemClicked(serviceFile)}
        key={serviceFile.id}
      >
        <FileMetadataGroup>
          <FileIcon>{itemIcon}</FileIcon>
          <FileName isSelected={isSelected}>{serviceFile.name}</FileName>
        </FileMetadataGroup>
        {tail}
      </FolderViewerRow>
    );
  };

  private renderFileCreateDateAndSize = ({ date, size }: ServiceFile) => {
    return (
      <FileMetadataGroup>
        <FileCreateDate>{getDateString(date)}</FileCreateDate>
        <FileSize>{filesize(size)}</FileSize>
      </FileMetadataGroup>
    );
  };

  private renderLoadMoreButton(): JSX.Element | null {
    const { nextCursor, isLoading } = this.props;

    if (nextCursor || this.isPageMoreLoading) {
      const label = isLoading ? 'Loading...' : 'Load more';
      return (
        // Key is required as this component is used in array
        <MoreBtnWrapper key="load-more-button-wrapper">
          <AkButton
            className="moreBtn"
            onClick={this.onLoadMoreButtonClick}
            isDisabled={isLoading}
          >
            {label}
          </AkButton>
        </MoreBtnWrapper>
      );
    } else {
      return null;
    }
  }

  private onLoadMoreButtonClick = (): void => {
    const {
      service,
      path,
      nextCursor,
      isLoading,
      onLoadMoreClick,
    } = this.props;
    if (!isLoading) {
      onLoadMoreClick(service.name, service.accountId, path, nextCursor || '');
    }
  };

  private itemClicked(item: ServiceFolderItem): () => void {
    return () => {
      const { service, onFolderClick, onFileClick } = this.props;
      if (isServiceFolder(item)) {
        const path = this.props.path.slice();
        path.push({ id: item.id, name: item.name });
        onFolderClick(service.name, service.accountId, path);
      } else {
        const file: ServiceFile = {
          ...item,
        };
        onFileClick(service.name, service.accountId, file);
      }
    };
  }
}

export default connect<
  FolderViewerStateProps,
  FolderViewDispatchProps,
  {},
  State
>(
  ({ view, selectedItems }) => ({
    path: view.path,
    service: view.service,
    items: view.items,
    selectedItems,
    isLoading: view.isLoading,
    currentCursor: view.currentCursor,
    nextCursor: view.nextCursor,
  }),
  (dispatch) => ({
    onFolderClick: (serviceName, accountId, path) =>
      dispatch(changeCloudAccountFolder(serviceName, accountId, path)),
    onFileClick: (serviceName, accountId, file) =>
      dispatch(fileClick(file, serviceName, accountId)),
    onLoadMoreClick: (serviceName, accountId, path, nextCursor) =>
      dispatch(
        fetchNextCloudFilesPage(serviceName, accountId, path, nextCursor),
      ),
  }),
)(FolderViewer);
