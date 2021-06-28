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
          transformer: {
            type: 'json-group',
          },
        },
        fields: [
          {
            name: 'foo',
            label: 'Search term',
            type: 'string',
          },
          {
            name: 'depth',
            label: 'Depth',
            type: 'number',
            defaultValue: 99,
          },
          {
            name: 'width',
            label: 'Width',
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
            'json-group': {
              serializer: (value) => JSON.stringify(value),
              deserializer: (value) => JSON.parse(value),
            },
            'broken-group': {
              serializer: (params) => {
                throw new Error('Something is broken');
              },
              deserializer: (result) => {
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
          title: 'a title',
          settings: {
            foo: 'bar',
            depth: 123,
            USER: {
              label: 'Leandro',
              value: 'llemos',
            },
          },
        },
        fieldsDefinitions,
      );

      expect(result).toEqual({
        title: 'a title',
        settings: JSON.stringify({ foo: 'bar', depth: 123, USER: 'llemos' }),
      });
    });

    it('serialise should skip missing values', async () => {
      const result = await serialize(
        manifest,
        {
          title: 'a title',
          settings: {
            foo: 'bar',
            USER: {
              label: 'Leandro',
              value: 'llemos',
            },
          },
        },
        fieldsDefinitions,
      );

      expect(result).toEqual({
        title: 'a title',
        settings: JSON.stringify({ foo: 'bar', USER: 'llemos' }),
      });
    });

    it('serialise should strip empty values', async () => {
      const result = await serialize(
        manifest,
        {
          title: 'a title',
          settings: {
            foo: 'bar',
            depth: undefined,
            width: '',
            USER: {
              label: 'Leandro',
              value: 'llemos',
            },
          },
        },
        fieldsDefinitions,
      );

      expect(result).toEqual({
        title: 'a title',
        settings: JSON.stringify({ foo: 'bar', USER: 'llemos' }),
      });
    });

    it('serialise should strip empty values [in fieldsets]', async () => {
      const result = await serialize(
        manifest,
        { title: 'a title', settings: { foo: undefined } },
        fieldsDefinitions,
      );

      expect(result).toEqual({
        title: 'a title',
        settings: JSON.stringify({}),
      });
    });

    it('serialize should not catch errors in the transformer', async () => {
      await expect(
        serialize(
          manifest,
          {
            foo: {
              bar: 1,
            },
          },
          [
            {
              label: 'Foo',
              name: 'foo',
              type: 'fieldset',
              options: {
                transformer: {
                  type: 'broken-group',
                },
              },
              fields: [],
            },
          ],
        ),
      ).rejects.toEqual(new Error('Something is broken'));
    });

    it('serialize should throw for a missing transformer', async () => {
      await expect(
        serialize(
          manifest,
          {
            foo: {
              bar: 1,
            },
          },
          [
            {
              label: 'Foo',
              name: 'foo',
              type: 'fieldset',
              options: {
                transformer: {
                  type: 'missing-group',
                },
              },
              fields: [],
            },
          ],
        ),
      ).rejects.toEqual(
        new Error(
          'No handler of type "missing-group" for extension type "twp.editor.test" and key "just-for-tests"',
        ),
      );
    });

    it('serialize should not throw for a missing transformer, if the parameter is undefined', async () => {
      async function test() {
        await serialize(
          manifest,
          {
            foo: undefined,
          },
          [
            {
              label: 'Foo',
              name: 'foo',
              type: 'fieldset',
              options: {
                transformer: {
                  type: 'missing-group',
                },
              },
              fields: [],
            },
          ],
        );

        return 'OK';
      }

      await expect(test()).resolves.toEqual('OK');
    });

    it('serialize should convert format of duplicate fields', async () => {
      const result = await serialize(
        manifest,
        { title: 'a title', 'title:1': ['second title', 'or this title'] },
        fieldsDefinitions,
      );

      expect(result).toEqual([
        { title: 'a title' },
        { title: ['second title', 'or this title'] },
      ]);
    });

    it('serialize should convert format of nested duplicate fields', async () => {
      const result = await serialize(
        manifest,
        { settings: { foo: 'a', 'foo:1': ['b', 'c'], 'foo:2': 'd' } },
        fieldsDefinitions,
      );

      expect(result).toEqual({
        settings: JSON.stringify([
          { foo: 'a' },
          { foo: ['b', 'c'] },
          { foo: 'd' },
        ]),
      });
    });

    it('deserialize should throw for a missing transformer', async () => {
      await expect(
        deserialize(
          manifest,
          {
            foo: {
              bar: 1,
            },
          },
          [
            {
              label: 'Foo',
              name: 'foo',
              type: 'fieldset',
              options: {
                transformer: {
                  type: 'missing-group',
                },
              },
              fields: [],
            },
          ],
        ),
      ).rejects.toEqual(
        new Error(
          'No handler of type "missing-group" for extension type "twp.editor.test" and key "just-for-tests"',
        ),
      );
    });

    it('deserialize should not throw for a missing transformer, if the parameter is undefined', async () => {
      async function test() {
        await deserialize(
          manifest,
          {
            foo: undefined,
          },
          [
            {
              label: 'Foo',
              name: 'foo',
              type: 'fieldset',
              options: {
                transformer: {
                  type: 'missing-group',
                },
              },
              fields: [],
            },
          ],
        );

        return 'OK';
      }

      await expect(test()).resolves.toEqual('OK');
    });

    it('serialize should skip fields if missing from the parameters', async () => {
      expect(
        await serialize(manifest, { title: 'a title' }, fieldsDefinitions),
      ).toEqual({
        title: 'a title',
      });
    });

    it('deserialise should inject defaultValues if provided', async () => {
      expect(
        await deserialize(manifest, { title: 'a title' }, fieldsDefinitions),
      ).toEqual({
        title: 'a title',
        settings: {
          depth: 99,
        },
      });
    });

    it('deserialise should use any given transformers', async () => {
      const result = await deserialize(
        manifest,
        {
          title: 'a title',
          settings: JSON.stringify({ foo: 'bar', depth: 123, USER: 'llemos' }),
        },
        fieldsDefinitions,
      );

      expect(result).toEqual({
        title: 'a title',
        settings: {
          foo: 'bar',
          depth: 123,
          USER: 'llemos',
        },
      });
    });

    it('deserialize adds an errors object to the deserialized object for any fields which threw errors on deserialization', async () => {
      const options = {
        transformer: {
          type: 'broken-group',
        },
      };
      const result = await deserialize(
        manifest,
        {
          title: 'testing errored serializers',
          settings: JSON.stringify({ foo: 'bar', depth: 123, USER: 'llemos' }),
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

    it('deserialize should convert format of duplicate fields', async () => {
      const result = await deserialize(
        manifest,
        [{ title: 'a title' }, { title: ['second title', 'or this title'] }],
        fieldsDefinitions,
      );

      expect(result).toEqual({
        title: 'a title',
        'title:1': ['second title', 'or this title'],
        settings: { depth: 99 },
      });
    });

    it('deserialize should convert format of nested duplicate fields', async () => {
      const result = await deserialize(
        manifest,
        {
          settings: JSON.stringify([
            { foo: 'a' },
            { foo: ['b', 'c'] },
            { foo: 'd' },
          ]),
        },
        fieldsDefinitions,
      );

      expect(result).toEqual({
        settings: { depth: 99, foo: 'a', 'foo:1': ['b', 'c'], 'foo:2': 'd' },
      });
    });
  });
});
