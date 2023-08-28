import { name } from '../../../../version-wrapper';
import { mediaPlugin } from '../../../../plugins';
import type { EditorPlugin } from '../../../../types';
import { mediaSingleWithCaption, mediaSingle } from '@atlaskit/adf-schema';

import {
  doc,
  mediaGroup,
  media,
  unsupportedBlock,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { processRawValue } from '@atlaskit/editor-common/utils';
import schema from '@atlaskit/editor-test-helpers/schema';
import { ffTest } from '@atlassian/feature-flags-test-utils';

const getNodeNames = (plugin: EditorPlugin) =>
  plugin.nodes ? plugin.nodes().map((node) => node.name) : [];

const getNode = (plugin: EditorPlugin, nodeName: string) =>
  plugin.nodes && plugin.nodes().find(({ name }) => name === nodeName);

describe(name, () => {
  describe('Plugins -> Media', () => {
    it('should not have mediaSingle node by default', () => {
      const availableNodes = getNodeNames(mediaPlugin({ config: undefined }));
      expect(availableNodes).toHaveLength(2);
      expect(availableNodes).not.toContain('mediaSingle');
    });

    it('should have mediaSingle node when allowMediaSingle is true', () => {
      const availableNodes = getNodeNames(
        mediaPlugin({
          config: {
            provider: Promise.resolve() as any,
            allowMediaSingle: true,
          },
        }),
      );
      expect(availableNodes).toHaveLength(3);
      expect(availableNodes).toContain('mediaSingle');
    });

    it('should not have mediaGroup node when allowMediaGroup is false', () => {
      const availableNodes = getNodeNames(
        mediaPlugin({
          config: {
            allowMediaGroup: false,
            allowMediaSingle: true,
          },
        }),
      );
      expect(availableNodes).toHaveLength(2);
      expect(availableNodes).not.toContain('mediaGroup');
    });

    it('mediaSingle should be a mediaSingle when captions is off by default', () => {
      const plugin = mediaPlugin({
        config: { provider: Promise.resolve() as any, allowMediaSingle: true },
      });
      expect(getNode(plugin, 'mediaSingle')!.node).toEqual(
        expect.objectContaining({
          ...mediaSingle,
          parseDOM: expect.any(Array),
          toDOM: expect.any(Function),
        }),
      );
    });

    it('mediaSingle should be a mediaSingleWithCaption when captions is enabled', () => {
      const plugin = mediaPlugin({
        config: {
          provider: Promise.resolve() as any,
          allowMediaSingle: true,
          featureFlags: { captions: true },
        },
      });

      expect(getNode(plugin, 'mediaSingle')!.node).toEqual(
        expect.objectContaining({
          ...mediaSingleWithCaption,
          parseDOM: expect.any(Array),
          toDOM: expect.any(Function),
        }),
      );
    });

    ffTest(
      'platform.editor.media.extended-resize-experience',
      () => {
        const plugin = mediaPlugin({
          config: {
            provider: Promise.resolve() as any,
            allowMediaSingle: true,
          },
        });

        const mediaNodeSpec = getNode(plugin, 'mediaSingle')!.node;

        expect(mediaNodeSpec.attrs).toMatchObject({
          layout: {
            default: 'center',
          },
          width: {
            default: null,
          },
          widthType: {
            default: null,
          },
        });

        // @ts-ignore
        const domArr = mediaNodeSpec.toDOM({
          attrs: {
            layout: 'center',
            width: 99,
            widthType: 'percentage',
          },
        });
        expect(domArr).toMatchObject([
          'div',
          {
            'data-node-type': 'mediaSingle',
            'data-layout': 'center',
            'data-width': 99,
            'data-width-type': 'percentage',
          },
          0,
        ]);
      },
      () => {
        const plugin = mediaPlugin({
          config: {
            provider: Promise.resolve() as any,
            allowMediaSingle: true,
          },
        });

        const mediaNodeSpec = getNode(plugin, 'mediaSingle')!.node;

        expect(mediaNodeSpec.attrs).toMatchObject({
          layout: {
            default: 'center',
          },
          width: {
            default: null,
          },
        });

        // @ts-ignore
        const domArr = mediaNodeSpec.toDOM({
          attrs: {
            layout: 'center',
            width: 99,
            widthType: 'percentage',
          },
        });
        expect(domArr).toMatchObject([
          'div',
          {
            'data-node-type': 'mediaSingle',
            'data-layout': 'center',
            'data-width': 99,
          },
          0,
        ]);
      },
    );
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
