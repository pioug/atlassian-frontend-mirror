import { Identifier } from '@atlaskit/media-client';
import {
  getSelectedIndex,
  extractArchiveFolderName,
  getFolderParent,
  getMediaTypeFromFilename,
  getFormattedFolderName,
  isMacPrivateFile,
  rejectAfter,
} from '../../../../utils';
import { nextTick } from '@atlaskit/media-test-helpers';

describe('utils', () => {
  describe('getSelectedIndex', () => {
    it('should return the right index if item is found', () => {
      const identifier: Identifier = {
        id: 'some-id',
        occurrenceKey: 'some-custom-occurrence-key',
        mediaItemType: 'file',
      };
      const identifier2: Identifier = {
        id: 'some-id-2',
        occurrenceKey: 'some-custom-occurrence-key',
        mediaItemType: 'file',
      };

      const items = [identifier, identifier2];
      expect(getSelectedIndex(items, identifier)).toEqual(0);
    });

    it('should return -1 if item is not found', () => {
      const identifier: Identifier = {
        id: 'some-id',
        occurrenceKey: 'some-custom-occurrence-key',
        mediaItemType: 'file',
      };
      const identifier2: Identifier = {
        id: 'some-id-2',
        occurrenceKey: 'some-custom-occurrence-key',
        mediaItemType: 'file',
      };
      const notFoundIdentifier: Identifier = {
        id: 'some-id-not-found',
        occurrenceKey: 'some-custom-occurrence-key',
        mediaItemType: 'file',
      };

      const items = [identifier, identifier2];
      expect(getSelectedIndex(items, notFoundIdentifier)).toEqual(-1);
    });

    it('should work with external image identifiers', () => {
      const identifier: Identifier = {
        id: 'some-id',
        occurrenceKey: 'some-custom-occurrence-key',
        mediaItemType: 'file',
      };
      const identifier2: Identifier = {
        dataURI: 'some-src-1',
        mediaItemType: 'external-image',
      };
      const identifier3: Identifier = {
        dataURI: 'some-src-2',
        mediaItemType: 'external-image',
      };

      const items = [identifier, identifier3, identifier2];
      expect(getSelectedIndex(items, identifier3)).toEqual(1);
    });
  });
  describe('extractArchiveFolderName', () => {
    it('should extract the folder name', () => {
      const folderName = 'archive.zip';
      expect(extractArchiveFolderName(folderName)).toEqual('archive/');
    });
    it('should extract the folder name without extension', () => {
      const folderName = 'archive';
      expect(extractArchiveFolderName(folderName)).toEqual('archive/');
    });
  });
  describe('getFolderParent', () => {
    it('should get parent folder name', () => {
      const folderName = 'zip_folder/folder_1/';
      expect(getFolderParent(folderName)).toEqual('zip_folder/');
    });
    it('should return empty string if folder is parent', () => {
      const folderName = 'zip_folder/';
      expect(getFolderParent(folderName)).toEqual('');
    });
    it('should return immediate parent of nested folder', () => {
      const folderName = 'another_folder/zip_folder/folder_1/';
      expect(getFolderParent(folderName)).toEqual('zip_folder/');
    });
    it('last character is not a slash, should still return parent folder', () => {
      const folderName = 'zip_folder/folder_1';
      expect(getFolderParent(folderName)).toEqual('zip_folder/');
    });
    it('last character is not a slash, should still return immediate parent folder', () => {
      const folderName = 'another_folder/zip_folder/folder_1/';
      expect(getFolderParent(folderName)).toEqual('zip_folder/');
    });
    it('last character is not a slash, shoild return empty string is folder is parent', () => {
      const folderName = 'zip_folder';
      expect(getFolderParent(folderName)).toEqual('');
    });
  });
  describe('getMediaTypeFromFilename', () => {
    it('should return archive for zip extension', () => {
      const fileName = 'file.zip';
      expect(getMediaTypeFromFilename(fileName)).toEqual('archive');
    });
    it('should return video for mov extension', () => {
      const fileName = 'file.mov';
      expect(getMediaTypeFromFilename(fileName)).toEqual('video');
    });
    it('should return image for jpeg extension', () => {
      const fileName = 'file.jpeg';
      expect(getMediaTypeFromFilename(fileName)).toEqual('image');
    });
    it('should return audio for mp3 extension', () => {
      const fileName = 'file.mp3';
      expect(getMediaTypeFromFilename(fileName)).toEqual('audio');
    });
    it('should return doc for pdf extension', () => {
      const fileName = 'file.pdf';
      expect(getMediaTypeFromFilename(fileName)).toEqual('doc');
    });
    it('should return unknown for empty extension', () => {
      const fileName = 'file';
      expect(getMediaTypeFromFilename(fileName)).toEqual('unknown');
    });
    it('should return unknown for non-real extension', () => {
      const fileName = 'file.xyz';
      expect(getMediaTypeFromFilename(fileName)).toEqual('unknown');
    });
    describe('getFormattedFolderName', () => {
      it('should trim slash at end of folder name', () => {
        const folderName = 'folder/';
        expect(getFormattedFolderName(folderName)).toEqual('folder');
      });
      it('should only return current folder name', () => {
        const folderName = 'folder/nested_folder/';
        expect(getFormattedFolderName(folderName)).toEqual('nested_folder');
      });
      it('should return empty string if folder name is empty', () => {
        const folderName = '';
        expect(getFormattedFolderName(folderName)).toEqual('');
      });
    });
    describe('isMacPrivateFile', () => {
      it('should should return true for file name starting with __MACOSX', () => {
        const fileName = '__MACOSX/abc';
        expect(isMacPrivateFile(fileName)).toBeTruthy();
      });
      it('should should return true for file name containing DS_Store', () => {
        const fileName = '.DS_Store';
        expect(isMacPrivateFile(fileName)).toBeTruthy();
      });
      it('should should return false for file name not containing MAC private file names', () => {
        const fileName = 'file.zip';
        expect(isMacPrivateFile(fileName)).toBeFalsy();
      });
    });
    describe('rejectAfter', () => {
      beforeEach(() => jest.useFakeTimers());
      it('should reject after given delay', async () => {
        try {
          await rejectAfter(jest.fn(), 1);
        } catch (error) {
          expect(error.message).toEqual('timed out');
        }
        await nextTick();
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(clearTimeout).toHaveBeenCalledTimes(1);
      });
      it('should reject with error thrown', async () => {
        expect(
          rejectAfter(() => Promise.reject('rejected'), 500),
        ).rejects.toEqual('rejected');
        await nextTick();
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(clearTimeout).toHaveBeenCalledTimes(1);
      });
      it('should resolve with result', async () => {
        expect(
          rejectAfter(() => Promise.resolve('resolved'), 500),
        ).resolves.toEqual('resolved');
        await nextTick();
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(clearTimeout).toHaveBeenCalledTimes(1);
      });
    });
  });
});
