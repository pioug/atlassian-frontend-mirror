import {
  FieldDefinition,
  ExtensionManifest,
} from '@atlaskit/editor-common/extensions';

import { serialize } from '../transformers';
import { createFieldDefinitions, createFieldset } from './__transformers-utils';

const createManifest = (fieldDefinitions: FieldDefinition[]) => {
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
          getFieldsDefinition: async () => fieldDefinitions,
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
  return manifest;
};

describe('serialize with flattening', () => {
  it('should serialize given parameters data', async () => {
    const fieldDefinitions = [...createFieldDefinitions(), createFieldset()];

    const manifest = createManifest(fieldDefinitions);
    const result = await serialize(
      manifest,
      {
        radio: 'bar',
        color: '#FFFFFF88',
        boolean: false,
        number: 3,
        date: '2021-07-01',
        string: 'Bye world!',
        'expand-string': 'Omae wa mou...',
        fieldset: {
          query: 'shindeiru',
          depth: 1234,
          customUser: 'twig',
        },
        'tabA-color': '#0000FF88',
        'tabA-string': 'In TabA, next to dark blue',
        'tabA-expand-string': 'Inside TabA {expand}',
        'tabA-expand-number': 9,
        'tabB-boolean': true,
        'tabB-string': 'String in TabBee',
        'tabC-select': 'bar',
      },
      fieldDefinitions,
    );

    expect(result).toEqual({
      radio: 'bar',
      color: '#FFFFFF88',
      boolean: false,
      number: 3,
      date: '2021-07-01',
      string: 'Bye world!',
      'expand-string': 'Omae wa mou...',
      fieldset: JSON.stringify({
        query: 'shindeiru',
        depth: 1234,
        customUser: 'twig',
      }),
      'tabA-color': '#0000FF88',
      'tabA-string': 'In TabA, next to dark blue',
      'tabA-expand-string': 'Inside TabA {expand}',
      'tabA-expand-number': 9,
      'tabB-boolean': true,
      'tabB-string': 'String in TabBee',
      'tabC-select': 'bar',
    });
  });

  it('should populate data with defaultValue from fieldDefinitions if missing', async () => {
    const fieldDefinitions = [...createFieldDefinitions(), createFieldset()];

    const manifest = createManifest(fieldDefinitions);
    const result = await serialize(manifest, {}, fieldDefinitions);

    expect(result).toEqual({
      radio: 'line',
      color: '#FC552CFF',
      boolean: true,
      number: 42,
      date: '2021-07-15',
      string: 'Hello world!',
      'expand-string': 'Omae wa mou shindeiru',
      fieldset: JSON.stringify({
        depth: 99,
      }),
      'tabA-color': '#247FFFFF',
      'tabA-string': 'In TabA, next to blue',
      'tabA-expand-string': 'Inside TabA expand',
      'tabA-expand-number': 8,
      'tabB-string': 'String in TabB',
      'tabC-select': 'map',
    });
  });

  it('should fail with error when fieldset transformer throws exception', async () => {
    const fieldDefinitions = [
      ...createFieldDefinitions(),
      createFieldset({ invalidTransformer: true }),
    ];

    const manifest = createManifest(fieldDefinitions);
    await expect(serialize(manifest, {}, fieldDefinitions)).rejects.toEqual(
      new Error('Something is broken'),
    );
  });

  it('should structure expand field data when hasGroupedValues=true for expands', async () => {
    const fieldDefinitions = createFieldDefinitions({
      groupExpand: true,
      groupExpandTabA: true,
    });

    const manifest = createManifest(fieldDefinitions);
    const result = await serialize(manifest, {}, fieldDefinitions);

    expect(result).toEqual({
      radio: 'line',
      color: '#FC552CFF',
      boolean: true,
      number: 42,
      date: '2021-07-15',
      string: 'Hello world!',
      expand: {
        'expand-string': 'Omae wa mou shindeiru',
      },
      'tabA-color': '#247FFFFF',
      'tabA-string': 'In TabA, next to blue',
      expandTabA: {
        'tabA-expand-string': 'Inside TabA expand',
        'tabA-expand-number': 8,
      },
      'tabB-string': 'String in TabB',
      'tabC-select': 'map',
    });
  });

  it('should structure field data when hasGroupedValues=true for tab group', async () => {
    const fieldDefinitions = createFieldDefinitions({
      groupTabGroup: true,
    });

    const manifest = createManifest(fieldDefinitions);
    const result = await serialize(manifest, {}, fieldDefinitions);

    expect(result).toEqual({
      radio: 'line',
      color: '#FC552CFF',
      boolean: true,
      number: 42,
      date: '2021-07-15',
      string: 'Hello world!',
      'expand-string': 'Omae wa mou shindeiru',
      tabGroup: {
        'tabA-color': '#247FFFFF',
        'tabA-string': 'In TabA, next to blue',
        'tabA-expand-string': 'Inside TabA expand',
        'tabA-expand-number': 8,
        'tabB-string': 'String in TabB',
        'tabC-select': 'map',
      },
    });
  });

  it('should structure field data when hasGroupedValues=true for tabA', async () => {
    const fieldDefinitions = createFieldDefinitions({
      groupTabA: true,
    });

    const manifest = createManifest(fieldDefinitions);
    const result = await serialize(manifest, {}, fieldDefinitions);

    expect(result).toEqual({
      radio: 'line',
      color: '#FC552CFF',
      boolean: true,
      number: 42,
      date: '2021-07-15',
      string: 'Hello world!',
      'expand-string': 'Omae wa mou shindeiru',
      tabA: {
        'tabA-color': '#247FFFFF',
        'tabA-string': 'In TabA, next to blue',
        'tabA-expand-string': 'Inside TabA expand',
        'tabA-expand-number': 8,
      },
      'tabB-string': 'String in TabB',
      'tabC-select': 'map',
    });
  });

  it('should structure field data when hasGroupedValues=true for tabB/tabC', async () => {
    const fieldDefinitions = createFieldDefinitions({
      groupTabB: true,
      groupTabC: true,
    });

    const manifest = createManifest(fieldDefinitions);
    const result = await serialize(manifest, {}, fieldDefinitions);

    expect(result).toEqual({
      radio: 'line',
      color: '#FC552CFF',
      boolean: true,
      number: 42,
      date: '2021-07-15',
      string: 'Hello world!',
      'expand-string': 'Omae wa mou shindeiru',
      'tabA-color': '#247FFFFF',
      'tabA-string': 'In TabA, next to blue',
      'tabA-expand-string': 'Inside TabA expand',
      'tabA-expand-number': 8,
      tabB: {
        'tabB-string': 'String in TabB',
      },
      tabC: {
        'tabC-select': 'map',
      },
    });
  });

  it('should structure field data when hasGroupedValues=true for tabGroup/tabA/tabC', async () => {
    const fieldDefinitions = createFieldDefinitions({
      groupTabGroup: true,
      groupTabA: true,
      groupTabC: true,
    });

    const manifest = createManifest(fieldDefinitions);
    const result = await serialize(manifest, {}, fieldDefinitions);

    expect(result).toEqual({
      radio: 'line',
      color: '#FC552CFF',
      boolean: true,
      number: 42,
      date: '2021-07-15',
      string: 'Hello world!',
      'expand-string': 'Omae wa mou shindeiru',
      tabGroup: {
        tabA: {
          'tabA-color': '#247FFFFF',
          'tabA-string': 'In TabA, next to blue',
          'tabA-expand-string': 'Inside TabA expand',
          'tabA-expand-number': 8,
        },
        'tabB-string': 'String in TabB',
        tabC: {
          'tabC-select': 'map',
        },
      },
    });
  });

  it('should structure field data when hasGroupedValues=true for tabGroup/expand', async () => {
    const fieldDefinitions = createFieldDefinitions({
      groupTabGroup: true,
      groupExpandTabA: true,
    });

    const manifest = createManifest(fieldDefinitions);
    const result = await serialize(manifest, {}, fieldDefinitions);

    expect(result).toEqual({
      radio: 'line',
      color: '#FC552CFF',
      boolean: true,
      number: 42,
      date: '2021-07-15',
      string: 'Hello world!',
      'expand-string': 'Omae wa mou shindeiru',
      tabGroup: {
        'tabA-color': '#247FFFFF',
        'tabA-string': 'In TabA, next to blue',
        expandTabA: {
          'tabA-expand-string': 'Inside TabA expand',
          'tabA-expand-number': 8,
        },
        'tabB-string': 'String in TabB',
        'tabC-select': 'map',
      },
    });
  });

  it('should structure field data when hasGroupedValues=true for tabA/expand', async () => {
    const fieldDefinitions = createFieldDefinitions({
      groupTabA: true,
      groupExpandTabA: true,
    });

    const manifest = createManifest(fieldDefinitions);
    const result = await serialize(manifest, {}, fieldDefinitions);

    expect(result).toEqual({
      radio: 'line',
      color: '#FC552CFF',
      boolean: true,
      number: 42,
      date: '2021-07-15',
      string: 'Hello world!',
      'expand-string': 'Omae wa mou shindeiru',
      tabA: {
        'tabA-color': '#247FFFFF',
        'tabA-string': 'In TabA, next to blue',
        expandTabA: {
          'tabA-expand-string': 'Inside TabA expand',
          'tabA-expand-number': 8,
        },
      },
      'tabB-string': 'String in TabB',
      'tabC-select': 'map',
    });
  });

  it('should structure field data when hasGroupedValues=true for tabA/expand/tabC', async () => {
    const fieldDefinitions = createFieldDefinitions({
      groupTabA: true,
      groupTabC: true,
      groupExpandTabA: true,
    });

    const manifest = createManifest(fieldDefinitions);
    const result = await serialize(manifest, {}, fieldDefinitions);

    expect(result).toEqual({
      radio: 'line',
      color: '#FC552CFF',
      boolean: true,
      number: 42,
      date: '2021-07-15',
      string: 'Hello world!',
      'expand-string': 'Omae wa mou shindeiru',
      tabA: {
        'tabA-color': '#247FFFFF',
        'tabA-string': 'In TabA, next to blue',
        expandTabA: {
          'tabA-expand-string': 'Inside TabA expand',
          'tabA-expand-number': 8,
        },
      },
      'tabB-string': 'String in TabB',
      tabC: {
        'tabC-select': 'map',
      },
    });
  });

  it('should structure field data when hasGroupedValues=true for tabGroup/tabA/expand/tabC', async () => {
    const fieldDefinitions = createFieldDefinitions({
      groupTabGroup: true,
      groupTabA: true,
      groupTabC: true,
      groupExpandTabA: true,
    });

    const manifest = createManifest(fieldDefinitions);
    const result = await serialize(manifest, {}, fieldDefinitions);

    expect(result).toEqual({
      radio: 'line',
      color: '#FC552CFF',
      boolean: true,
      number: 42,
      date: '2021-07-15',
      string: 'Hello world!',
      'expand-string': 'Omae wa mou shindeiru',
      tabGroup: {
        tabA: {
          'tabA-color': '#247FFFFF',
          'tabA-string': 'In TabA, next to blue',
          expandTabA: {
            'tabA-expand-string': 'Inside TabA expand',
            'tabA-expand-number': 8,
          },
        },
        'tabB-string': 'String in TabB',
        tabC: {
          'tabC-select': 'map',
        },
      },
    });
  });

  describe('with duplicates', () => {
    it('should group duplicate values for fields with allowDuplicates in fieldsets using given parameters', async () => {
      const fieldDefinitions = [
        ...createFieldDefinitions(),
        createFieldset({ allowDuplicateFields: true }),
      ];

      const manifest = createManifest(fieldDefinitions);
      const result = await serialize(
        manifest,
        {
          radio: 'bar',
          fieldset: {
            labels: 'A',
            'labels:1': 'B',
            'labels:2': 'C',
          },
        },
        fieldDefinitions,
      );

      expect(result).toEqual({
        radio: 'bar',
        color: '#FC552CFF',
        boolean: true,
        number: 42,
        date: '2021-07-15',
        string: 'Hello world!',
        'expand-string': 'Omae wa mou shindeiru',
        fieldset: JSON.stringify({
          labels: ['A', 'B', 'C'],
          depth: 99,
        }),
        'tabA-color': '#247FFFFF',
        'tabA-string': 'In TabA, next to blue',
        'tabA-expand-string': 'Inside TabA expand',
        'tabA-expand-number': 8,
        'tabB-string': 'String in TabB',
        'tabC-select': 'map',
      });
    });

    it('should group duplicate values for fields with allowDuplicates in fieldsets using defaultValue', async () => {
      const fieldDefinitions = [
        ...createFieldDefinitions(),
        createFieldset({ allowDuplicateFields: true }),
      ];

      const manifest = createManifest(fieldDefinitions);
      const result = await serialize(manifest, {}, fieldDefinitions);

      expect(result).toEqual({
        radio: 'line',
        color: '#FC552CFF',
        boolean: true,
        number: 42,
        date: '2021-07-15',
        string: 'Hello world!',
        'expand-string': 'Omae wa mou shindeiru',
        fieldset: JSON.stringify({
          labels: [''],
          depth: 99,
        }),
        'tabA-color': '#247FFFFF',
        'tabA-string': 'In TabA, next to blue',
        'tabA-expand-string': 'Inside TabA expand',
        'tabA-expand-number': 8,
        'tabB-string': 'String in TabB',
        'tabC-select': 'map',
      });
    });

    it('should group duplicate values for fields with allowDuplicates in fieldsets using given parameters with hasGroupedValues', async () => {
      const fieldDefinitions = [
        ...createFieldDefinitions({
          groupTabA: true,
        }),
        createFieldset({ allowDuplicateFields: true }),
      ];

      const manifest = createManifest(fieldDefinitions);
      const result = await serialize(
        manifest,
        {
          radio: 'bar',
          fieldset: {
            labels: 'A',
            'labels:1': 'B',
            'labels:2': 'C',
          },
        },
        fieldDefinitions,
      );

      expect(result).toEqual({
        radio: 'bar',
        color: '#FC552CFF',
        boolean: true,
        number: 42,
        date: '2021-07-15',
        string: 'Hello world!',
        'expand-string': 'Omae wa mou shindeiru',
        fieldset: JSON.stringify({
          labels: ['A', 'B', 'C'],
          depth: 99,
        }),
        tabA: {
          'tabA-color': '#247FFFFF',
          'tabA-string': 'In TabA, next to blue',
          'tabA-expand-string': 'Inside TabA expand',
          'tabA-expand-number': 8,
        },
        'tabB-string': 'String in TabB',
        'tabC-select': 'map',
      });
    });

    it('should group duplicate values for fields with allowDuplicates in fieldsets using defaultValue with hasGroupedValues', async () => {
      const fieldDefinitions = [
        ...createFieldDefinitions({
          groupTabA: true,
        }),
        createFieldset({ allowDuplicateFields: true }),
      ];

      const manifest = createManifest(fieldDefinitions);
      const result = await serialize(manifest, {}, fieldDefinitions);

      expect(result).toEqual({
        radio: 'line',
        color: '#FC552CFF',
        boolean: true,
        number: 42,
        date: '2021-07-15',
        string: 'Hello world!',
        'expand-string': 'Omae wa mou shindeiru',
        fieldset: JSON.stringify({
          labels: [''],
          depth: 99,
        }),
        tabA: {
          'tabA-color': '#247FFFFF',
          'tabA-string': 'In TabA, next to blue',
          'tabA-expand-string': 'Inside TabA expand',
          'tabA-expand-number': 8,
        },
        'tabB-string': 'String in TabB',
        'tabC-select': 'map',
      });
    });
  });
});
