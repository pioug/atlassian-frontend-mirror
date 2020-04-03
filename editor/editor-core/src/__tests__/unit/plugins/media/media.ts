import { name } from '../../../../version.json';
import { mediaPlugin } from '../../../../plugins';
import { EditorPlugin } from '../../../../types';

const getNodeNames = (plugin: EditorPlugin) =>
  plugin.nodes ? plugin.nodes().map(node => node.name) : [];

describe(name, () => {
  describe('Plugins -> Media', () => {
    it('should not have mediaSingle node by default', () => {
      const availableNodes = getNodeNames(mediaPlugin());
      expect(availableNodes).toHaveLength(2);
      expect(availableNodes).not.toContain('mediaSingle');
    });

    it('should have mediaSingle node when allowMediaSingle is true', () => {
      const availableNodes = getNodeNames(
        mediaPlugin({
          provider: Promise.resolve() as any,
          allowMediaSingle: true,
        }),
      );
      expect(availableNodes).toHaveLength(3);
      expect(availableNodes).toContain('mediaSingle');
    });

    it('should not have mediaGroup node when allowMediaGroup is false', () => {
      const availableNodes = getNodeNames(
        mediaPlugin({
          allowMediaGroup: false,
          allowMediaSingle: true,
        }),
      );
      expect(availableNodes).toHaveLength(2);
      expect(availableNodes).not.toContain('mediaGroup');
    });
  });
});
