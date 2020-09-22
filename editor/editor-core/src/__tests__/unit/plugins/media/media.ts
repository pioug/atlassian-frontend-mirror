import { name } from '../../../../version.json';
import { mediaPlugin } from '../../../../plugins';
import { EditorPlugin } from '../../../../types';
import { mediaSingleWithCaption, mediaSingle } from '@atlaskit/adf-schema';

const getNodeNames = (plugin: EditorPlugin) =>
  plugin.nodes ? plugin.nodes().map(node => node.name) : [];

const getNode = (plugin: EditorPlugin, nodeName: string) =>
  plugin.nodes && plugin.nodes().find(({ name }) => name === nodeName);

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

    it('mediaSingle should be a mediaSingle when UNSAFE_allowImageCaptions isnt present', () => {
      const plugin = mediaPlugin({
        provider: Promise.resolve() as any,
        allowMediaSingle: true,
      });

      expect(getNode(plugin, 'mediaSingle')!.node).toBe(mediaSingle);
    });

    it('mediaSingle should be a mediaSingleWithCaption when UNSAFE_allowImageCaptions is true', () => {
      const plugin = mediaPlugin({
        provider: Promise.resolve() as any,
        allowMediaSingle: true,
        UNSAFE_allowImageCaptions: true,
      });

      expect(getNode(plugin, 'mediaSingle')!.node).toBe(mediaSingleWithCaption);
    });
  });
});
