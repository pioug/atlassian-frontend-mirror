import {
  FieldDefinition,
  ExtensionManifest,
  TabField,
  NestedFieldDefinition,
  ExpandField,
} from '@atlaskit/editor-common/extensions';

import { serialize, deserialize, findDuplicateFields } from '../transformers';

const textField = (name: string): NestedFieldDefinition => ({
  name,
  type: 'string',
  label: `free-text-${name}`,
});

const tabGroup = (
  name: string,
  tabFields: TabField[],
  hasGroupedValues: boolean = false,
): FieldDefinition => {
  return {
    type: 'tab-group',
    label: `tab-group-${name}`,
    name,
    fields: tabFields,
    hasGroupedValues,
  };
};

const tabField = (
  name: string,
  fields: NestedFieldDefinition[],
  hasGroupedValues: boolean = false,
): TabField => {
  return {
    type: 'tab',
    label: `tab-${name}`,
    name,
    fields,
    hasGroupedValues,
  };
};

const expandField = (
  name: string,
  fields: NestedFieldDefinition[],
  hasGroupedValues: boolean = false,
): ExpandField => {
  return {
    name,
    type: 'expand',
    label: `expand-${name}`,
    fields,
    hasGroupedValues,
  };
};

interface InitManifestOptions {
  allowDuplicateTitles?: boolean;
  allowDuplicateFoo?: boolean;
}
const initManifest = (options: InitManifestOptions = {}) => {
  const fieldsDefinitions: FieldDefinition[] = [
    {
      label: 'Title',
      name: 'title',
      type: 'string',
      allowDuplicates: options.allowDuplicateTitles,
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
          allowDuplicates: options.allowDuplicateFoo,
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
      // eslint-disable-next-line import/dynamic-import-chunkname
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

  return {
    fieldsDefinitions,
    manifest,
  };
};

describe('Config panel', () => {
  describe('transformers', () => {
    const { fieldsDefinitions, manifest } = initManifest();

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
        settings: JSON.stringify({ foo: 'bar', depth: 99, USER: 'llemos' }),
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
        settings: JSON.stringify({ foo: 'bar', depth: 99, USER: 'llemos' }),
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
        settings: JSON.stringify({ depth: 99 }),
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

    // #region Duplicate fields
    it('serialize should ignore duplicate data if Field.allowDuplicates=false outside of fieldsets', async () => {
      const { fieldsDefinitions, manifest } = initManifest({
        allowDuplicateTitles: false,
      });

      const result = await serialize(
        manifest,
        { title: 'a title', 'title:1': ['second title', 'or this title'] },
        fieldsDefinitions,
      );

      expect(result).toEqual({
        title: 'a title',
        settings: JSON.stringify({ depth: 99 }),
      });
    });

    it('serialize should ignore duplicate data if Field.allowDuplicates=true outside of fieldsets', async () => {
      const { fieldsDefinitions, manifest } = initManifest({
        allowDuplicateTitles: true,
      });

      const result = await serialize(
        manifest,
        { title: 'a title', 'title:1': ['second title', 'or this title'] },
        fieldsDefinitions,
      );

      expect(result).toEqual({
        title: 'a title',
        settings: JSON.stringify({ depth: 99 }),
      });
    });

    it('serialize should ignore duplicate data if Field.allowDuplicates=false inside fieldsets', async () => {
      const { fieldsDefinitions, manifest } = initManifest({
        allowDuplicateFoo: false,
      });
      const result = await serialize(
        manifest,
        { settings: { foo: 'a', 'foo:1': ['b', 'c'], 'foo:2': 'd' } },
        fieldsDefinitions,
      );

      expect(result).toEqual({
        settings: JSON.stringify({
          foo: 'a',
          depth: 99,
        }),
      });
    });

    it('serialize should convert format of Field.allowDuplicates inside fieldsets', async () => {
      const { fieldsDefinitions, manifest } = initManifest({
        allowDuplicateFoo: true,
      });
      const result = await serialize(
        manifest,
        { settings: { foo: 'a', 'foo:1': ['b', 'c'], 'foo:2': 'd' } },
        fieldsDefinitions,
      );

      expect(result).toEqual({
        settings: JSON.stringify({
          foo: ['a', ['b', 'c'], 'd'],
          depth: 99,
        }),
      });
    });
    // #endregion

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
        settings: JSON.stringify({ depth: 99 }),
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

  describe('validators', () => {
    it('Return undefined when there is no duplicate field name', () => {
      const fields: FieldDefinition[] = [
        textField('textFieldOne'),
        textField('textFieldTwo'),
      ];

      expect(findDuplicateFields(fields)).toEqual(undefined);
    });

    it('Return first duplicate field name when there are duplicate field names', () => {
      const fields: FieldDefinition[] = [
        textField('textFieldOne'),
        textField('textFieldOne'),
      ];

      expect(findDuplicateFields(fields)?.name).toEqual('textFieldOne');
    });

    it('Return first duplicate field name when there are duplicate field names in a tab', () => {
      expect(
        findDuplicateFields([
          tabGroup(
            'tabGroup',
            [tabField('a', [textField('fieldA'), textField('fieldA')], false)],
            false,
          ),
        ])?.name,
      ).toEqual('fieldA');
    });

    it('Return first duplicate field name when there are duplicate field names in expand', () => {
      expect(
        findDuplicateFields([
          expandField('expand', [textField('fieldA'), textField('fieldA')]),
        ])?.name,
      ).toEqual('fieldA');
    });

    describe('grouped', () => {
      it('duplicate in tableGroup will not count as duplicate', () => {
        expect(
          findDuplicateFields([
            textField('fieldA'),
            tabGroup('tabGroup', [tabField('a', [textField('fieldA')])], true),
          ])?.name,
        ).toEqual(undefined);
      });

      it('duplicate in expand will not count as duplicate', () => {
        expect(
          findDuplicateFields([
            textField('fieldA'),
            expandField('expand', [textField('fieldA')], true),
          ])?.name,
        ).toEqual(undefined);
      });
    });
  });
});
