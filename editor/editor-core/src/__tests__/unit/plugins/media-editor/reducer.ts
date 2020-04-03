import { FileIdentifier } from '@atlaskit/media-client';
import { getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers';
import { reducer } from '../../../../plugins/media/pm-plugins/media-editor-plugin-factory';
import { MediaEditorState } from '../../../../plugins/media/types';

describe('media editor', () => {
  describe('reducer', () => {
    const mediaClientConfig = getDefaultMediaClientConfig();
    const identifier: FileIdentifier = {
      id: 'abc',
      mediaItemType: 'file',
      collectionName: 'xyz',
    };

    it('can set the mediaClientConfig to a value', () => {
      expect(
        reducer(
          {},
          {
            type: 'setMediaClientConfig',
            mediaClientConfig,
          },
        ),
      ).toEqual({ mediaClientConfig });
    });

    it('can unset the mediaClientConfig', () => {
      expect(
        reducer(
          { mediaClientConfig },
          { type: 'setMediaClientConfig', mediaClientConfig: undefined },
        ),
      ).toEqual({});
    });

    it('can open the media editor', () => {
      expect(
        reducer(
          { mediaClientConfig },
          { type: 'setMediaClientConfig', mediaClientConfig: undefined },
        ),
      ).toEqual({});
    });

    describe('when media editor is open', () => {
      const pluginState: MediaEditorState = {
        mediaClientConfig,
        editor: { pos: 123, identifier },
      };

      it('closes it on close event', () => {
        expect(
          reducer(pluginState, {
            type: 'close',
          }),
        ).toEqual({ mediaClientConfig });
      });

      it('closes it on upload event', () => {
        expect(
          reducer(pluginState, {
            type: 'upload',
            newIdentifier: {
              id: 'newid',
              mediaItemType: 'file',
              collectionName: 'newCollection',
            },
          }),
        ).toEqual({ mediaClientConfig });
      });
    });
  });
});
