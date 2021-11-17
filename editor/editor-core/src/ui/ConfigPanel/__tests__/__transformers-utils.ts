import {
  FieldDefinition,
  NestedFieldDefinition,
} from '@atlaskit/editor-common/extensions';

interface CreateFieldsetOptions {
  invalidTransformer?: boolean;
  allowDuplicateFields?: boolean;
}
export const createFieldset = (
  options: CreateFieldsetOptions = {},
): FieldDefinition => {
  const queryField: NestedFieldDefinition[] = !options.allowDuplicateFields
    ? [
        {
          name: 'query',
          label: 'Query',
          type: 'string',
        },
      ]
    : [
        {
          name: 'labels',
          label: 'Labels',
          type: 'string',
          allowDuplicates: true,
          defaultValue: '',
        },
      ];

  return {
    label: 'Fieldset',
    name: 'fieldset',
    type: 'fieldset',
    options: {
      transformer: {
        type: options.invalidTransformer ? 'broken-group' : 'json-group',
      },
    },
    fields: [
      ...queryField,
      {
        type: 'number',
        name: 'depth',
        label: 'Depth',
        defaultValue: 99,
      },
      {
        type: 'custom',
        name: 'customUser',
        label: 'Custom User',
        options: {
          resolver: {
            type: 'userpicker',
          },
        },
      },
    ],
  };
};

interface BaseFieldsOptions {
  groupExpand?: boolean;
  groupExpandTabA?: boolean;
  groupTabGroup?: boolean;
  groupTabA?: boolean;
  groupTabB?: boolean;
  groupTabC?: boolean;
}
export const createFieldDefinitions = (
  options: BaseFieldsOptions = {},
): FieldDefinition[] => {
  return [
    {
      type: 'enum',
      style: 'radio',
      label: 'Radio',
      name: 'radio',
      defaultValue: 'line',
      items: [
        { label: 'Line', value: 'line' },
        { label: 'Bar', value: 'bar' },
        { label: 'Map', value: 'map' },
      ],
    },
    {
      type: 'color',
      label: 'Color',
      name: 'color',
      defaultValue: '#FC552CFF', // red
    },
    {
      type: 'boolean',
      label: 'Boolean',
      name: 'boolean',
      defaultValue: true,
    },
    {
      type: 'number',
      label: 'Number',
      name: 'number',
      defaultValue: 42,
    },
    {
      type: 'date',
      label: 'Date',
      name: 'date',
      defaultValue: '2021-07-15',
    },
    {
      type: 'string',
      label: 'String',
      name: 'string',
      defaultValue: 'Hello world!',
    },
    // Expand
    {
      type: 'expand',
      name: 'expand',
      label: 'awesome expand field',
      hasGroupedValues: options.groupExpand,
      fields: [
        {
          type: 'string',
          label: 'Expand String',
          name: 'expand-string',
          defaultValue: 'Omae wa mou shindeiru',
        },
      ],
    },
    // Tab
    {
      type: 'tab-group',
      label: 'Tab group',
      name: 'tabGroup',
      defaultTab: 'tabB',
      hasGroupedValues: options.groupTabGroup,
      fields: [
        {
          type: 'tab',
          label: 'Tab A',
          name: 'tabA',
          hasGroupedValues: options.groupTabA,
          fields: [
            {
              type: 'color',
              name: 'tabA-color',
              label: 'TabA Color',
              defaultValue: '#247FFFFF', // blue
            },
            {
              name: 'tabA-string',
              type: 'string',
              label: 'TabA string',
              defaultValue: 'In TabA, next to blue',
            },
            {
              type: 'expand',
              name: 'expandTabA',
              label: 'Expand in Tab A',
              hasGroupedValues: options.groupExpandTabA,
              fields: [
                {
                  name: 'tabA-expand-string',
                  type: 'string',
                  label: 'TabA expand string',
                  defaultValue: 'Inside TabA expand',
                },
                {
                  name: 'tabA-expand-number',
                  type: 'number',
                  label: 'TabA expand number',
                  defaultValue: 8,
                },
              ],
            },
          ],
        },
        {
          type: 'tab',
          name: 'tabB',
          label: 'Tab B',
          hasGroupedValues: options.groupTabB,
          fields: [
            {
              type: 'boolean',
              label: 'TabB Boolean',
              name: 'tabB-boolean',
            },
            {
              name: 'tabB-string',
              type: 'string',
              label: 'TabB string',
              defaultValue: 'String in TabB',
            },
          ],
        },
        {
          type: 'tab',
          label: 'Tab C',
          name: 'tabC',
          hasGroupedValues: options.groupTabC,
          fields: [
            {
              type: 'enum',
              name: 'tabC-select',
              label: 'TabC Select',
              style: 'select',
              defaultValue: 'map',
              items: [
                { label: 'Line', value: 'line' },
                { label: 'Bar', value: 'bar' },
                { label: 'Map', value: 'map' },
              ],
            },
          ],
        },
      ],
    },
  ];
};
