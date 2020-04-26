jest.mock('@atlaskit/media-common');
import { downloadUrl } from '@atlaskit/media-common';
import { ViewAction } from '../../BlockCard/actions/ViewAction';
import { DownloadAction } from '../../BlockCard/actions/DownloadAction';

describe('actions', () => {
  describe('ViewAction', () => {
    it('should open link in a new tab', async () => {
      const action = ViewAction({
        url: 'some-url',
      });
      const openSpy = jest.spyOn(window, 'open');
      await action.promise();

      expect(openSpy).toBeCalledTimes(1);
      expect(openSpy).toBeCalledWith('some-url', '_blank', 'noopener=yes');
    });
  });

  describe('DownloadAction', () => {
    it('should call downloadUrl with the right arguments ', async () => {
      const action = DownloadAction({
        url: 'some-url',
      });

      await action.promise();
      expect(downloadUrl).toBeCalledTimes(1);
      expect(downloadUrl).toBeCalledWith('some-url');
    });
  });
});
