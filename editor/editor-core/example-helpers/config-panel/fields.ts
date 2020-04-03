import { FieldDefinition } from '@atlaskit/editor-common/extensions';

export const nativeFields: FieldDefinition[] = [
  {
    name: 'free-text-field',
    label: 'Free text',
    isRequired: true,
    description: 'Add any text',
    defaultValue: 'hey',
    type: 'string',
  },
  {
    name: 'number-field',
    label: 'Number',
    isRequired: true,
    type: 'number',
  },
  {
    name: 'bool-field',
    label: 'Boolean',
    isRequired: true,
    type: 'boolean',
  },
  {
    name: 'text-non-required',
    label: 'Text',
    isRequired: false,
    description: 'Leave it empty',
    type: 'string',
  },
  {
    name: 'hidden-text-field',
    label: 'Hidden text field',
    defaultValue: 'this is a hidden value passed to the extension',
    isHidden: true,
    type: 'string',
  },
  {
    name: 'hidden-date-field',
    label: '',
    defaultValue: '02/02/2020',
    isHidden: true,
    type: 'date',
  },
  {
    name: 'start-date',
    label: 'Date',
    type: 'date',
  },
  {
    name: 'multiple-options-select-single-choice',
    label: 'Select single choice',
    isRequired: true,
    description: 'Pick one',
    type: 'enum',
    style: 'select',
    isMultiple: false,
    items: [
      { label: 'Option A', value: 'a' },
      { label: 'Option B', value: 'b' },
    ],
  },
  {
    name: 'boolean-field',
    label: 'Will you confirm it?',
    description: 'True or False',
    type: 'boolean',
  },
  {
    name: 'multiple-options-select-multiple-choice',
    label: 'Select multiple choice',
    isRequired: true,
    description: 'Pick one',
    type: 'enum',
    style: 'select',
    isMultiple: true,
    items: [
      { label: 'Option A', value: 'a' },
      { label: 'Option B', value: 'b' },
      { label: 'Option C', value: 'c' },
      { label: 'Option D', value: 'd' },
      { label: 'Option E', value: 'e' },
    ],
  },
  {
    name: 'multiple-options-checkbox-single-choice',
    label: 'Multiple options - Checkbox - Single choice',
    type: 'enum',
    style: 'radio',
    isRequired: true,
    isMultiple: false,
    items: [
      { label: 'Option A', value: 'a' },
      { label: 'Option B', value: 'b' },
      { label: 'Option C', value: 'c' },
      { label: 'Option D', value: 'd' },
      { label: 'Option E', value: 'e' },
    ],
  },
  {
    name: 'multiple-options-checkbox-multiple-choice',
    label: 'Multiple options - Checkbox - Multiple choice',
    isRequired: false,
    description: 'Pick one',
    type: 'enum',
    style: 'checkbox',
    isMultiple: true,
    items: [
      {
        label: 'Option A',
        value: 'a',
        description: 'cool tooltip description for a',
      },
      {
        label: 'Option B',
        value: 'b',
        description: 'cool tooltip description for b',
      },
      {
        label: 'Option C',
        value: 'c',
        description: 'cool tooltip description for c',
      },
      {
        label: 'Option D',
        value: 'd',
        description: 'cool tooltip description for d',
      },
      {
        label: 'Option E',
        value: 'e',
        description: 'cool tooltip description for e',
      },
    ],
  },
  {
    name: 'unhandled',
    label: 'Unknown type',
    type: 'foobar' as any,
  },
  {
    name: 'cql',
    label: 'CQL',
    type: 'fieldset',
    options: {
      isDynamic: true,
      transformer: {
        type: 'cql',
      },
    },
    fields: [
      {
        name: 'Q',
        label: 'Search term',
        type: 'string',
      },
      {
        name: 'USER',
        label: 'User',
        type: 'custom',
        options: {
          resolver: {
            type: 'username',
          },
        },
      },
      {
        name: 'SPACE',
        label: 'Space',
        isRequired: true,
        type: 'custom',
        options: {
          resolver: {
            type: 'spacekey',
          },
        },
      },
      {
        name: 'contentType',
        label: 'Content Type',
        isRequired: false,
        type: 'enum',
        style: 'checkbox',
        isMultiple: true,
        items: [
          {
            label: 'Page',
            value: 'page',
          },
          {
            label: 'Blogpost',
            value: 'blogpost',
          },
          {
            label: 'Question',
            value: 'question',
          },
        ],
      },
    ],
  },
  {
    name: 'jira-filter',
    label: 'Issues filter',
    type: 'fieldset',
    options: {
      transformer: {
        type: 'cql',
      },
    },
    fields: [
      {
        name: 'keywords',
        label: 'Keywords',
        type: 'string',
      },
      {
        name: 'project',
        label: 'Project',
        isRequired: false,
        type: 'enum',
        style: 'select',
        items: [
          {
            label: 'Editor platform',
            value: 'editor-platform',
          },
          {
            label: 'Editor experiences',
            value: 'editor-experiences',
          },
        ],
      },
      {
        name: 'status',
        label: 'Status',
        isRequired: false,
        type: 'enum',
        style: 'select',
        items: [
          {
            label: 'To do',
            value: 'to-do',
          },
          {
            label: 'In Progress',
            value: 'in-progress',
          },
          {
            label: 'Done',
            value: 'Done',
          },
        ],
      },
    ],
  },
];

export const customFields: FieldDefinition[] = [
  {
    name: 'space-key',
    label: 'Custom: Space',
    isRequired: true,
    type: 'custom',
    options: {
      resolver: {
        type: 'spacekey',
      },
    },
  },
  {
    name: 'spaces',
    label: 'Custom: Spaces',
    isRequired: true,
    isMultiple: true,
    type: 'custom',
    options: {
      resolver: {
        type: 'spacekey',
      },
    },
  },
  {
    name: 'label',
    label: 'Custom: Label',
    description: 'Select the label',
    type: 'custom',
    options: {
      resolver: {
        type: 'label',
      },
    },
  },
  {
    name: 'user',
    label: 'Custom: User',
    type: 'custom',
    options: {
      resolver: {
        type: 'username',
      },
    },
  },
  {
    name: 'unsupported',
    label: 'Custom: Missing provider',
    type: 'custom',
    options: {
      resolver: {
        type: 'missing-type',
      } as any,
    },
  },
  {
    name: 'page',
    label: 'Custom: Page',
    description: 'Select the page',
    type: 'custom',
    options: {
      resolver: {
        type: 'confluence-content',
      },
    },
  },
];
