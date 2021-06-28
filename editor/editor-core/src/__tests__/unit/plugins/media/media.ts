import { name } from '../../../../version.json';
import { mediaPlugin } from '../../../../plugins';
import { EditorPlugin } from '../../../../types';
import { mediaSingleWithCaption, mediaSingle } from '@atlaskit/adf-schema';

import {
  doc,
  mediaGroup,
  media,
  unsupportedBlock,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { processRawValue } from '../../../../utils/document';
import schema from '@atlaskit/editor-test-helpers/schema';

const getNodeNames = (plugin: EditorPlugin) =>
  plugin.nodes ? plugin.nodes().map((node) => node.name) : [];

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

    it('mediaSingle should be a mediaSingle when captions is off by default', () => {
      const plugin = mediaPlugin({
        provider: Promise.resolve() as any,
        allowMediaSingle: true,
      });

      expect(getNode(plugin, 'mediaSingle')!.node).toBe(mediaSingle);
    });

    it('mediaSingle should be a mediaSingleWithCaption when captions is enabled', () => {
      const plugin = mediaPlugin({
        provider: Promise.resolve() as any,
        allowMediaSingle: true,
        featureFlags: { captions: true },
      });

      expect(getNode(plugin, 'mediaSingle')!.node).toBe(mediaSingleWithCaption);
    });
  });
});

describe('unsupportedBlock', () => {
  describe('mediaGroup', () => {
    it('should not wrap media in unsupportedBlock', () => {
      const result = processRawValue(schema, {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'mediaGroup',
            content: [
              {
                type: 'media',
                attrs: {
                  type: 'file',
                  id: '1234',
                  collection: 'SampleCollection',
                },
              },
            ],
          },
        ],
      });

      expect(result).toEqualDocument(
        doc(
          mediaGroup(
            media({
              type: 'file',
              id: '1234',
              collection: 'SampleCollection',
            })(),
          ),
        ),
      );
    });

    it('should wrap unknown in unsupportedBlock', () => {
      const result = processRawValue(schema, {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'mediaGroup',
            content: [
              {
                type: 'unknown',
                attrs: {
                  type: 'file',
                  id: '1234',
                  collection: 'SampleCollection',
                },
              },
            ],
          },
        ],
      });

      expect(result).toEqualDocument(
        doc(
          mediaGroup(
            unsupportedBlock({
              originalValue: {
                attrs: {
                  type: 'file',
                  id: '1234',
                  collection: 'SampleCollection',
                },
                type: 'unknown',
              },
            })(),
          ),
        ),
      );
    });

    it('should wrap all unknown nodes in unsupportedBlock', () => {
      const result = processRawValue(schema, {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'mediaGroup',
            content: [
              {
                type: 'unknown',
                attrs: {
                  type: 'file',
                  id: '1234',
                  collection: 'SampleCollection',
                },
              },
              {
                type: 'unknown2',
                attrs: {
                  type: 'file',
                  id: '1234',
                  collection: 'SampleCollection',
                },
              },
            ],
          },
        ],
      });

      expect(result).toEqualDocument(
        doc(
          mediaGroup(
            unsupportedBlock({
              originalValue: {
                attrs: {
                  type: 'file',
                  id: '1234',
                  collection: 'SampleCollection',
                },
                type: 'unknown',
              },
            })(),
            unsupportedBlock({
              originalValue: {
                attrs: {
                  type: 'file',
                  id: '1234',
                  collection: 'SampleCollection',
                },
                type: 'unknown2',
              },
            })(),
          ),
        ),
      );
    });

    it('should wrap all unknown nodes in unsupportedBlock and should allow media', () => {
      const result = processRawValue(schema, {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'mediaGroup',
            content: [
              {
                type: 'media',
                attrs: {
                  type: 'file',
                  id: '1234',
                  collection: 'SampleCollection',
                },
              },
              {
                type: 'unknown',
                content: [
                  {
                    type: 'text',
                    text: 'Hello World!',
                  },
                ],
              },
            ],
          },
        ],
      });

      expect(result).toEqualDocument(
        doc(
          mediaGroup(
            media({
              id: '1234',
              type: 'file',
              collection: 'SampleCollection',
            })(),
            unsupportedBlock({
              originalValue: {
                content: [
                  {
                    text: 'Hello World!',
                    type: 'text',
                  },
                ],
                type: 'unknown',
              },
            })(),
          ),
        ),
      );
    });
  });
});
