/**
 * Some utilities and types around this API -
 * https://developer.mozilla.org/en-US/docs/Web/API/File_and_Directory_Entries_API/Introduction
 */

// These APIs are experimental, so such not defined in TS core libraries.

// Based on https://developer.mozilla.org/en-US/docs/Web/API/FileSystemEntry
interface FileSystemEntry {
  isDirectory: boolean;
  isFile: boolean;
  name: string;
  fullPath: string;
}

// Based on https://developer.mozilla.org/en-US/docs/Web/API/FileSystemEntry
interface FileSystemFileEntry extends FileSystemEntry {
  file: (resolve: (file: File) => void) => void;
}

// Based on https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryEntry
interface FileSystemDirectoryEntry extends FileSystemEntry {
  createReader: () => FileSystemDirectoryReader;
}

// Represents https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryReader
interface FileSystemDirectoryReader {
  readEntries: (
    successCallback: (fileSystemEntries: FileSystemEntry[]) => void,
  ) => void;
}

const createDataTransferItem = (
  webkitGetAsEntryResult: FileSystemEntry,
): DataTransferItem =>
  // Using DataTransferItem constructor is illegal
  ({
    getAsFile: () => null,
    getAsString() {
      return '';
    },
    kind: 'file',
    type: '',
    webkitGetAsEntry: () => webkitGetAsEntryResult,
  });

const createFileList = (filesArray: File[]): FileList =>
  // Using FileList constructor is illegal
  ({
    ...filesArray,
    length: filesArray.length,
    item: (index: number) => filesArray[index],
  });

const createDataTransferItemList = (
  itemsArray: DataTransferItem[],
): DataTransferItemList =>
  // Using DataTransferItemList constructor is illegal
  ({
    ...itemsArray,
    length: itemsArray.length,
    add: () => null,
    clear: () => null,
    item: (index: number) => itemsArray[index],
    remove: () => null,
  });

const createDataTransfer = (
  files: FileList,
  items: DataTransferItemList,
): DataTransfer => {
  const dataTransfer = new DataTransfer();

  // Since `files` and `items` are readonly - this is the only way assigning these values
  Object.defineProperty(dataTransfer, 'files', {
    value: files,
  });
  Object.defineProperty(dataTransfer, 'items', {
    value: items,
  });

  return dataTransfer;
};

export const createFileSystemFileEntry = (
  name: string,
  fullPath: string,
  imageFile: File,
): FileSystemFileEntry => ({
  isDirectory: false,
  isFile: true,
  name,
  fullPath,
  file: (resolve: (file: File) => void) => resolve(imageFile),
});

export const createFileSystemDirectoryEntry = (
  name: string,
  fullPath: string,
  fileEntries: FileSystemEntry[],
): FileSystemDirectoryEntry => ({
  isDirectory: true,
  isFile: false,
  name,
  fullPath,
  createReader: () => {
    const reader: FileSystemDirectoryReader = {
      readEntries: (resolver) => resolver(fileEntries),
    };
    return reader;
  },
});

export const createDropEventWithFiles = (
  fileSystemEntry: FileSystemEntry,
  files: File[],
) => {
  const dataTransferItem = createDataTransferItem(fileSystemEntry);
  const fileList = createFileList(files);
  const dataTransferItemList = createDataTransferItemList([dataTransferItem]);
  const dataTransfer = createDataTransfer(fileList, dataTransferItemList);

  const event = new DragEvent('drop');
  // Way around assigning readonly value
  Object.defineProperty(event, 'dataTransfer', {
    value: dataTransfer,
  });
  return event;
};
