import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import {
  ANALYTICS_MEDIA_CHANNEL,
  getMediaFeatureFlag,
  withMediaAnalyticsContext,
} from '@atlaskit/media-common';
import { isWebkitSupported } from '@atlaskit/media-ui/browser';
import { getFilesFromItems, getFilesFromFileSystemEntries } from 'flat-files';

import {
  LocalUploadComponentReact,
  LocalUploadComponentBaseProps,
} from '../localUploadReact';

import { getPackageAttributes } from '../../util/analytics';

import {
  DropzoneConfig,
  DropzoneEventAction,
  DropzoneEventPayload,
} from '../../types';

import {
  DropzoneDragEnterEventPayload,
  DropzoneDragLeaveEventPayload,
  DropzoneUploadEventPayloadMap,
} from '../types';

export type DropzoneProps = LocalUploadComponentBaseProps & {
  config: DropzoneConfig;
  onDrop?: () => void;
  onDragEnter?: (payload: DropzoneDragEnterEventPayload) => void;
  onDragLeave?: (payload: DropzoneDragLeaveEventPayload) => void;
  onCancelFn?: (cancel: (uniqueIdentifier: string) => void) => void;
};

function dragContainsFiles(event: DragEvent): boolean {
  if (!event.dataTransfer) {
    return false;
  }
  const { types } = event.dataTransfer;
  return Array.from(types).indexOf('Files') > -1;
}

const COMPONENT_NAME = 'dropzone';

export class DropzoneBase extends LocalUploadComponentReact<
  DropzoneProps,
  DropzoneUploadEventPayloadMap
> {
  private uiActive: boolean = false;

  constructor(props: DropzoneProps) {
    super(props, COMPONENT_NAME);
  }

  private getContainer(): HTMLElement {
    const {
      config: { container },
    } = this.props;
    return container || document.body;
  }

  public componentDidMount() {
    const { onCancelFn } = this.props;
    this.addContainerListeners(this.getContainer());
    if (onCancelFn) {
      onCancelFn(this.cancel);
    }
  }

  public componentWillUnmount(): void {
    this.removeContainerListeners(this.getContainer());
  }

  public UNSAFE_componentWillReceiveProps(nextProps: DropzoneProps): void {
    const {
      config: { container: newContainer },
    } = nextProps;

    const {
      config: { container: oldContainer },
    } = this.props;

    if (newContainer !== oldContainer) {
      this.removeContainerListeners(oldContainer);
      this.addContainerListeners(newContainer);
    }
  }

  private addContainerListeners = (
    container: HTMLElement = this.getContainer(),
  ) => {
    container.addEventListener('dragover', this.onDragOver, false);
    container.addEventListener('dragleave', this.onDragLeave, false);
    container.addEventListener('drop', this.onFileDropped);
  };

  private removeContainerListeners = (
    container: HTMLElement = this.getContainer(),
  ) => {
    container.removeEventListener('dragover', this.onDragOver, false);
    container.removeEventListener('dragleave', this.onDragLeave, false);
    container.removeEventListener('drop', this.onFileDropped);
  };

  private onDragOver = (event: DragEvent): void => {
    event.preventDefault();
    if (event.dataTransfer && dragContainsFiles(event)) {
      const dataTransfer = event.dataTransfer;
      let allowed;

      try {
        allowed = dataTransfer.effectAllowed;
      } catch (e) {} // the error is expected in IE11

      dataTransfer.dropEffect =
        'move' === allowed || 'linkMove' === allowed ? 'move' : 'copy';
      const length = this.getDraggedItemsLength(dataTransfer);
      // [EDM-1636]: needed in order to make multiple dropzones in the page to work
      event.stopPropagation();
      this.emitDragOver({ length });
    }
  };

  private onDragLeave = (e: DragEvent): void => {
    if (e.dataTransfer) {
      e.preventDefault();
      let length = 0;
      if (dragContainsFiles(e)) {
        const dataTransfer = e.dataTransfer;
        length = this.getDraggedItemsLength(dataTransfer);
      }
      this.emitDragLeave({ length });
    }
  };

  private readonly onFileDropped = async (dragEvent: DragEvent) => {
    if (!dragEvent.dataTransfer) {
      return;
    }

    dragEvent.preventDefault();
    dragEvent.stopPropagation();

    /*
     * Only enable support for folders if (1) the browser is supported (2) feature flag is enabled
     * The file flattening library used to add support for Folders uses a function called webkitEntry.
     * Some browser types are not supported https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitEntries
     */
    if (
      isWebkitSupported() &&
      getMediaFeatureFlag('folderUploads', this.props.featureFlags)
    ) {
      this.fireAnalyticsForFolders(dragEvent.dataTransfer.items);
      const flattenedDirectoryFiles = await this.getFilesFromDragEvent(
        dragEvent.dataTransfer.items,
      );

      this.onDropFolders(flattenedDirectoryFiles.length);
      this.uploadService.addFiles(flattenedDirectoryFiles);
    } else {
      this.onDrop(dragEvent);

      const files = Array.from(dragEvent.dataTransfer.files);

      this.uploadService.addFiles(files);
    }
  };

  /*
   * Checks how many folders are uploaded in a single drag and drop. Then, fires an analytic event in accordance to this.
   */
  private fireAnalyticsForFolders = (items: DataTransferItemList): void => {
    //convert DataTransferItemList into an array of DataTransferItem(s)
    const toArray = Array.from(items);

    //function to check if a file entry is a folder
    const hasFolder = (item: DataTransferItem) =>
      item.webkitGetAsEntry().isDirectory;

    //how many folders are in a single drag and drop event
    var folderCount = toArray.filter((item) => hasFolder(item)).length;

    // fires analytic events if number of folders is more than 0
    if (folderCount > 0) {
      this.fireAnalyticsEvent('folderDroppedInto', folderCount);
    }
  };

  /*
   * Files dropped contains a directory. Thus, flatten the directory to return an array of Files.
   */
  private getFilesFromDragEvent = async (
    dragEventItemList: DataTransferItemList,
  ): Promise<File[]> => {
    const items: DataTransferItemList = dragEventItemList;

    //If items consist of directory or directories, flatten it to grab the files only. Else, just get the files
    const fileSystemEntries = await getFilesFromItems(items);

    //files are of filetype 'fileSystemEntry'. We convert the files to be of the 'File' type format.
    const files = await getFilesFromFileSystemEntries(fileSystemEntries);

    // Return all the files we will upload
    return this.filterFilesAgainstBlacklist(files);
  };

  private filterFilesAgainstBlacklist = (files: File[]) => {
    // We don't want these files in our final File list
    const blacklist = ['.DS_Store', 'thumbs.db', 'desktop.ini'];

    // Filter Files using our defined blacklist
    return files.filter((file: File) => !blacklist.includes(file.name));
  };

  // Cross-browser way of getting dragged items length, we prioritize "items" if present
  // https://www.w3.org/TR/html51/editing.html#the-datatransfer-interface
  // This method is used on 'dragover' and we have no way to retrieve FileSystemFileEntry,
  // which contains info about if the dropped item is a file or directory. That info is only
  // available on 'drop'
  private getDraggedItemsLength(dataTransfer: DataTransfer): number {
    if (dataTransfer.items) {
      const items = Array.from(dataTransfer.items);
      return items.filter((i: DataTransferItem) => i.kind === 'file').length;
    }
    // This is required for IE11
    return dataTransfer.files.length;
  }

  // Similar to the onDrop event, but for folders.
  private onDropFolders = (fileCount: number) => {
    if (fileCount > 0) {
      this.sendAnalyticsAndEmitDragLeave(fileCount);
    }
  };

  private onDrop = (e: DragEvent): void => {
    if (e.dataTransfer && dragContainsFiles(e)) {
      const dataTransfer = e.dataTransfer;
      const fileCount = this.getDraggedItemsLength(dataTransfer);

      this.sendAnalyticsAndEmitDragLeave(fileCount);
    }
  };

  private sendAnalyticsAndEmitDragLeave = (fileCount: number): void => {
    this.fireAnalyticsEvent('droppedInto', fileCount);

    if (this.props.onDrop) {
      this.props.onDrop();
    }
    this.emitDragLeave({ length: fileCount });
  };

  private emitDragOver(payload: DropzoneDragEnterEventPayload): void {
    if (!this.uiActive) {
      const { onDragEnter } = this.props;
      this.uiActive = true;

      this.fireAnalyticsEvent('draggedInto', payload.length);

      if (onDragEnter) {
        onDragEnter(payload);
      }
    }
  }

  private emitDragLeave(payload: DropzoneDragLeaveEventPayload): void {
    if (this.uiActive) {
      this.uiActive = false;
      /*
       when drag over child elements, container will issue dragleave and then dragover immediately.
       The 50ms timeout will prevent from issuing that "false" dragleave event
       */
      window.setTimeout(() => {
        if (!this.uiActive) {
          const { onDragLeave } = this.props;

          this.fireAnalyticsEvent('draggedOut', payload.length);

          if (onDragLeave) {
            onDragLeave(payload);
          }
        }
      }, 50);
    }
  }

  private fireAnalyticsEvent(
    action: DropzoneEventAction,
    fileCount: number,
  ): void {
    const { createAnalyticsEvent } = this.props;

    if (createAnalyticsEvent) {
      const payload: DropzoneEventPayload = {
        eventType: 'ui',
        actionSubject: 'dropzone',
        action,
        attributes: {
          fileCount,
        },
      };

      const analyticsEvent = createAnalyticsEvent(payload);
      analyticsEvent.fire(ANALYTICS_MEDIA_CHANNEL);
    }
  }

  render() {
    return null;
  }
}

export const Dropzone = withMediaAnalyticsContext(
  getPackageAttributes(COMPONENT_NAME),
  {
    filterFeatureFlags: ['folderUploads', 'newCardExperience'],
  },
)(withAnalyticsEvents()(DropzoneBase));
