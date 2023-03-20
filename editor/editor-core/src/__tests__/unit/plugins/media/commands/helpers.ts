import {
  testMediaSingle,
  testMediaGroup,
} from '@atlaskit/editor-test-helpers/media-mock';
import {
  doc,
  media,
  mediaGroup,
  mediaSingle,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  findMediaSingleNode,
  findAllMediaSingleNodes,
} from '../../../../../plugins/media/commands/helpers';
import { mediaEditor, testCollectionName } from '../_utils';
import { MediaPluginState } from '../../../../../plugins/media/pm-plugins/types';

const mediaImageSingle = media({
  id: testMediaSingle.id,
  type: 'file',
  collection: testCollectionName,
})();

const mediaImageGroup = media({
  id: testMediaGroup.id,
  type: 'file',
  collection: testCollectionName,
})();

describe('Media commands helpers', () => {
  let pluginState: MediaPluginState;

  beforeEach(() => {
    ({ pluginState } = mediaEditor(
      doc(
        mediaSingle({
          layout: 'center',
        })(mediaImageSingle),
        mediaSingle({
          layout: 'center',
        })(mediaImageSingle),
        mediaGroup(mediaImageGroup),
      ),
    ));
  });

  describe('Find media node', () => {
    it('should find media single node', () => {
      const node = findMediaSingleNode(pluginState, testMediaSingle.id);

      expect(node).not.toBeNull();
    });

    it('should find first stored media single node (We stored in reverse order)', () => {
      const node = findMediaSingleNode(pluginState, testMediaSingle.id);

      expect(node!.getPos()).toBe(4);
    });

    it('does not support media group node', () => {
      const node = findMediaSingleNode(pluginState, testMediaGroup.id);
      expect(node).toBeNull();
    });
  });

  describe('Find all media single nodes', () => {
    it('should find all two media single nodes', () => {
      const nodes = findAllMediaSingleNodes(pluginState, testMediaSingle.id);

      expect(nodes).toHaveLength(2);
    });

    it('should return it in inverse order', () => {
      const nodes = findAllMediaSingleNodes(pluginState, testMediaSingle.id);

      expect(nodes.map(({ getPos }) => getPos())).toEqual([4, 1]);
    });
  });
});
