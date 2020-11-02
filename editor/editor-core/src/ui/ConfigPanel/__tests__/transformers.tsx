import {
  FieldDefinition,
  ExtensionManifest,
} from '@atlaskit/editor-common/extensions';

import { serialize, deserialize } from '../transformers';

describe('Config panel', () => {
  describe('transformers', () => {
    const fieldsDefinitions: FieldDefinition[] = [
      {
        label: 'Title',
        name: 'title',
        type: 'string',
      },
      {
        label: 'My settings',
        name: 'settings',
        type: 'fieldset',
        options: {
          isDynamic: true,
          transformer: {
            type: 'piped-group',
          },
        },
        fields: [
          {
            name: 'Q',
            label: 'Search term',
            type: 'string',
          },
          {
            name: 'depth',
            label: 'Depth',
            type: 'number',
          },
          {
            name: 'USER',
            label: 'User',
            type: 'custom',
            options: {
              resolver: {
                type: 'userpicker',
              },
            },
          },
        ],
      },
    ];

    const manifest: ExtensionManifest = {
      title: 'Editor test extensions',
      type: 'twp.editor.test',
      key: 'just-for-tests',
      description: 'Extensions generated for testing purposes.',
      documentationUrl: 'http://atlassian.com',
      icons: {
        '48': () => import('@atlaskit/icon/glyph/editor/code'),
      },
      modules: {
        quickInsert: [],
        nodes: {
          'test-item': {
            type: 'extension',
            render: () => Promise.resolve(() => null),
            getFieldsDefinition: () => Promise.resolve(fieldsDefinitions),
          },
        },
        fields: {
          fieldset: {
            'piped-group': {
              serializer: params => {
                return Object.entries(params)
                  .map(entry => entry.join(' = '))
                  .join(' | ');
              },
              deserializer: result => {
                return result
                  .split(' | ')
                  .map(pair => pair.split(' = '))
                  .reduce<{ [key: string]: string }>((curr, [key, value]) => {
                    curr[key] = value;
                    return curr;
                  }, {});
              },
            },
            'broken-group': {
              serializer: params => {
                throw new Error('Something is broken');
              },
              deserializer: result => {
                throw new Error('Something is broken');
              },
            },
          },
        },
      },
    };

    it('serialise should given transformers and extract values from fields that return `Option`', async () => {
      const result = await serialize(
        manifest,
        {
          title: 'testing serializers',
          settings: {
            Q: 'text',
            depth: 2,
            USER: {
              label: 'Leandro',
              value: 'llemos',
            },
          },
        },
        fieldsDefinitions,
      );

      expect(result).toEqual({
        title: 'testing serializers',
        settings: 'Q = text | depth = 2 | USER = llemos',
      });
    });

    it('serialise should strip empty values', async () => {
      const result = await serialize(
        manifest,
        {
          title: 'testing serializers',
          settings: {
            Q: 'text',
            USER: {
              label: 'Leandro',
              value: 'llemos',
            },
          },
        },
        fieldsDefinitions,
      );

      expect(result).toEqual({
        title: 'testing serializers',
        settings: 'Q = text | USER = llemos',
      });

      const result2 = await serialize(
        manifest,
        {
          title: 'testing serializers',
          settings: {
            Q: 'text',
            depth: undefined,
            USER: {
              label: 'Leandro',
              value: 'llemos',
            },
          },
        },
        fieldsDefinitions,
      );

      expect(result2).toEqual({
        title: 'testing serializers',
        settings: 'Q = text | USER = llemos',
      });

      const result3 = await serialize(
        manifest,
        { title: 'testing serializers', settings: { Q: undefined } },
        fieldsDefinitions,
      );

      expect(result3).toEqual({
        title: 'testing serializers',
        settings: '',
      });
    });

    it('deserialise should use any given transformers', async () => {
      const result = await deserialize(
        manifest,
        {
          title: 'testing serializers',
          settings: 'Q = text | depth = 2 | USER = llemos',
        },
        fieldsDefinitions,
      );

      expect(result).toEqual({
        title: 'testing serializers',
        settings: {
          Q: 'text',
          depth: '2',
          USER: 'llemos',
        },
      });
    });

    it('returns an errors object property for deserialization on failure for each field', async () => {
      const options = {
        isDynamic: true,
        transformer: {
          type: 'broken-group',
        },
      };
      const result = await deserialize(
        manifest,
        {
          title: 'testing errored serializers',
          settings: 'Q = texttt | depth = 23 | USER = llemos',
        },
        [
          {
            label: 'Confluence settings',
            name: 'settings',
            type: 'fieldset',
            options,
            fields: [],
          },
          {
            label: 'My title fieldset',
            name: 'title',
            type: 'fieldset',
            options,
            fields: [],
          },
        ],
      );
      const error = 'Something is broken';
      expect(result.errors.settings).toStrictEqual(error);
      expect(result.errors.title).toStrictEqual(error);
    });
  });
});
