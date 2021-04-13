import { testMediaSingle } from '@atlaskit/editor-test-helpers/media-mock';
import {
  doc,
  media,
  mediaGroup,
  mediaSingle,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  findMediaNode,
  findAllMediaSingleNodes,
} from '../../../../../plugins/media/commands/helpers';
import { mediaEditor, testCollectionName } from '../_utils';
import { MediaPluginState } from '../../../../../plugins/media/pm-plugins/types';

const mediaImage = media({
  id: testMediaSingle.id,
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
        })(mediaImage),
        mediaSingle({
          layout: 'center',
        })(mediaImage),
        mediaGroup(mediaImage),
      ),
    ));
  });

  describe('Find media node', () => {
    it('should find media single node', () => {
      const node = findMediaNode(pluginState, testMediaSingle.id, true);

      expect(node).not.toBeNull();
    });

    it('should find first stored media single node (We stored in reverse order)', () => {
      const node = findMediaNode(pluginState, testMediaSingle.id, true);

      expect(node!.getPos()).toBe(4);
    });

    it('should find first media group node', () => {
      const node = findMediaNode(pluginState, testMediaSingle.id, false);

      expect(node).not.toBeNull();
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
