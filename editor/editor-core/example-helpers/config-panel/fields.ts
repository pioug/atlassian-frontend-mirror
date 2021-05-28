import { FieldDefinition } from '@atlaskit/editor-common/extensions';

export const nativeFields: FieldDefinition[] = [
  {
    type: 'tab-group',
    label: 'Tab type',
    name: 'tabGroup',
    fields: [
      {
        type: 'tab',
        label: 'Tab A',
        name: 'optionA',
        fields: [
          {
            name: 'expandField',
            type: 'expand',
            label: 'awesome expand field',
            isExpanded: true,
            fields: [
              {
                name: 'textFieldOne',
                type: 'string',
                label: 'Free text',
              },
            ],
          },
          {
            name: 'textFieldThree',
            type: 'string',
            label: 'Free text',
          },
        ],
      },
      {
        type: 'tab',
        label: 'Tab B',
        name: 'optionB',
        fields: [
          {
            name: 'textFieldTwo',
            type: 'string',
            label: 'Free text',
          },
        ],
      },
    ],
  },
  {
    name: 'text-field',
    type: 'string',
    label: 'Free text',
    isRequired: true,
    description: 'Add any text',
    defaultValue: 'I am the default text',
  },
  {
    name: 'text-field-multiline',
    type: 'string',
    label: 'Free text',
    isRequired: true,
    description: 'Add any text across multiple lines',
    defaultValue: 'I am the default multiline text',
    style: 'multiline',
  },
  {
    name: 'text-field-optional',
    type: 'string',
    label: 'Text',
    isRequired: false,
    description: 'Leave it empty',
    placeholder: 'Text goes here',
  },
  {
    name: 'text-field-hidden',
    type: 'string',
    label: 'Hidden text field',
    defaultValue: 'this is a hidden value passed to the extension',
    isHidden: true,
  },
  {
    name: 'number-field',
    type: 'number',
    label: 'Number',
    isRequired: true,
    placeholder: 'Number goes here',
  },
  {
    name: 'boolean-field-required',
    type: 'boolean',
    label: 'Needs to be checked',
    description:
      '<b>A</b> <i>checkbox</i> that can be <code>true</code> or <strong>false</strong> <em>(by design)</em>',
    isRequired: true,
  },
  {
    name: 'boolean-field-optional',
    type: 'boolean',
    label: 'Do you want free shipping?',
    description: 'True or <b>FALSE</b> (should be bolded)',
  },
  {
    name: 'boolean-field-toggle',
    type: 'boolean',
    label: 'Turn on the Wi-Fi?',
    description: 'On or Off',
    style: 'toggle',
    defaultValue: true,
  },
  {
    name: 'date-start',
    type: 'date',
    label: 'Date',
    description: `Nothing of <a onclick="alert('something is wrong')">interest</a>`,
    placeholder: 'Date goes here',
  },
  {
    name: 'enum-select',
    type: 'enum',
    label: 'Select one',
    isRequired: true,
    description: 'Pick one',
    style: 'select',
    isMultiple: false,
    placeholder: 'Selected option goes here',
    items: [
      { label: 'Option A', value: 'a' },
      { label: 'Option B', value: 'b' },
    ],
  },
  {
    name: 'enum-select-icon',
    type: 'enum',
    label: 'Select with icons',
    description: 'Pick one',
    style: 'select',
    isMultiple: false,
    items: [
      {
        label: 'Option A',
        value: 'a',
        description: 'Recommended',
        icon: 'https://i.picsum.photos/id/237/24/24.jpg',
      },
      {
        label:
          'Option B with a really really really really really really long label',
        value: 'b',
        description: 'One of the best options out there',
        icon: 'https://i.picsum.photos/id/240/24/24.jpg',
      },
    ],
  },
  {
    name: 'enum-select-icon-multiple',
    type: 'enum',
    label: 'Select with icons (multiple)',
    description: 'Pick many',
    defaultValue: ['a', 'b'],
    style: 'select',
    placeholder: 'Selected options go here',
    isMultiple: true,
    items: [
      {
        label: 'Option A',
        value: 'a',
        description: 'Our most popular pick',
        icon: 'https://i.picsum.photos/id/237/24/24.jpg',
      },
      {
        label: 'Option B',
        value: 'b',
        description: 'Many people like this one',
        icon: 'https://i.picsum.photos/id/240/24/24.jpg',
      },
    ],
  },
  {
    name: 'enum-select-multiple',
    type: 'enum',
    label: 'Select 1 or many',
    description: '1 required, no default',
    style: 'select',
    isRequired: true,
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
    name: 'enum-radio-required',
    type: 'enum',
    label: 'Select one',
    description: 'One is always required',
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
    name: 'enum-radio-defaulted',
    type: 'enum',
    label: 'Select one (defaulted)',
    description: 'One is always required, but we default it',
    style: 'radio',
    isRequired: false,
    defaultValue: 'a',
    items: [
      { label: 'Option A', value: 'a' },
      { label: 'Option B', value: 'b' },
      { label: 'Option C', value: 'c' },
      { label: 'Option D', value: 'd' },
      { label: 'Option E', value: 'e' },
    ],
  },
  {
    name: 'enum-checkbox-multiple',
    type: 'enum',
    label: 'Select 1 or many, or none',
    description: 'Nothing required, no default',
    style: 'checkbox',
    isRequired: false,
    isMultiple: true,
    items: [
      {
        label: 'Option A',
        value: 'a',
        description: 'tooltip description for a',
      },
      {
        label: 'Option B',
        value: 'b',
        description: 'tooltip description for b',
      },
      {
        label: 'Option C',
        value: 'c',
        description: 'tooltip description for c',
      },
      {
        label: 'Option D',
        value: 'd',
        description: 'tooltip description for d',
      },
      {
        label: 'Option E',
        value: 'e',
        description: 'tooltip description for e',
      },
    ],
  },
  {
    name: 'enum-checkbox-multiple-required',
    type: 'enum',
    label: 'Select 1 or many',
    description: 'Something required',
    style: 'checkbox',
    isRequired: true,
    isMultiple: true,
    items: [
      {
        label: 'Option A',
        value: 'a',
        description: 'tooltip description for a',
      },
      {
        label: 'Option B',
        value: 'b',
        description: 'tooltip description for b',
      },
      {
        label: 'Option C',
        value: 'c',
        description: 'tooltip description for c',
      },
      {
        label: 'Option D',
        value: 'd',
        description: 'tooltip description for d',
      },
      {
        label: 'Option E',
        value: 'e',
        description: 'tooltip description for e',
      },
    ],
  },
  {
    name: 'unhandled',
    type: 'foobar' as any,
    label: 'Unknown type',
  },
  {
    name: 'fieldset-cql',
    type: 'fieldset',
    label: 'CQL',
    options: {
      isDynamic: true,
      transformer: {
        type: 'cql',
      },
    },
    fields: [
      {
        name: 'created-at',
        type: 'date-range',
        label: 'Created at',
        description: `This is how we select date range in the cql component`,
        items: [
          { label: 'Any date', value: '' },
          { label: 'Last 24 hours', value: 'now(-1d)' },
          { label: 'Last week', value: 'now(-1w)' },
          { label: 'Last month', value: 'now(-1M)' },
          { label: 'Last year', value: 'now(-1y)' },
        ],
      },
      {
        name: 'last-modified',
        type: 'date-range',
        label: 'Last modified',
        items: [
          { label: 'Today', value: 'now(-1d)' },
          { label: 'This week', value: 'now(-1w)' },
          { label: 'This month', value: 'now(-1M)' },
          { label: 'This year', value: 'now(-1y)' },
        ],
      },
      {
        name: 'query',
        type: 'string',
        label: 'Search term',
      },
      {
        name: 'custom',
        type: 'custom',
        label: 'Custom: Select anything',
        isRequired: true,
        options: {
          resolver: {
            type: 'mock-resolver',
          },
        },
      },
      {
        name: 'content',
        type: 'enum',
        label: 'Content Type',
        isRequired: false,
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
    name: 'fieldset-without-label',
    type: 'fieldset',
    label: 'Fieldset without label',
    options: {
      isDynamic: true,
      showTitle: false,
      transformer: {
        type: 'cql',
      },
    },
    fields: [
      {
        name: 'inner-text',
        type: 'string',
        label: 'Search term',
      },
    ],
  },
  {
    name: 'fieldset-jira-filter',
    type: 'fieldset',
    label: 'Issues filter',
    options: {
      isDynamic: true,
      transformer: {
        type: 'cql',
      },
    },
    fields: [
      {
        name: 'keywords',
        type: 'string',
        label: 'Keywords',
      },
      {
        name: 'project',
        type: 'enum',
        label: 'Project',
        isRequired: false,
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
        type: 'enum',
        label: 'Status',
        isRequired: false,
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
  {
    name: 'expand field',
    type: 'expand',
    label: 'awesome expand field',
    fields: [
      {
        name: 'enum-select',
        type: 'enum',
        label: 'Select one',
        isRequired: true,
        description: 'Pick one',
        style: 'select',
        isMultiple: false,
        placeholder: 'Selected option goes here',
        items: [
          { label: 'Option A', value: 'a' },
          { label: 'Option B', value: 'b' },
        ],
      },
      {
        name: 'enum-select-icon',
        type: 'enum',
        label: 'Select with icons',
        description: 'Pick one',
        style: 'select',
        isMultiple: false,
        items: [
          {
            label: 'Option A',
            value: 'a',
            description: 'Recommended',
          },
          {
            label:
              'Option B with a really really really really really really long label',
            value: 'b',
            description: 'One of the best options out there',
          },
        ],
      },
    ],
  },
  {
    name: 'color-picker',
    label: 'Color Picker',
    type: 'color',
    description: 'Pick your color',
    defaultValue: '#7AB2FF',
  },
  {
    name: 'color-picker-req',
    label: 'Color Picker Required',
    type: 'color',
    isRequired: true,
    description: 'Pick your color',
    defaultValue: '#7AB2FF',
  },
];

export const customFields: FieldDefinition[] = [
  {
    name: 'custom-required',
    type: 'custom',
    label: 'Custom: Required',
    description: 'Select the option',
    isRequired: true,
    options: {
      resolver: {
        type: 'mock-resolver',
      },
    },
  },
  {
    name: 'custom-optional',
    type: 'custom',
    label: 'Custom: Optional',
    description: 'Select the option, maybe',
    options: {
      resolver: {
        type: 'mock-resolver',
      },
    },
  },
  {
    name: 'custom-required-create',
    type: 'custom',
    label: 'Custom: Create an option',
    description: 'Select or create an option',
    isRequired: true,
    options: {
      isCreatable: true,
      resolver: {
        type: 'mock-resolver',
      },
    },
  },
  {
    name: 'custom-create-multiple',
    type: 'custom',
    label: 'Custom: Create option(s)',
    description: 'Select or create option(s)',
    isMultiple: true,
    options: {
      isCreatable: true,
      resolver: {
        type: 'mock-resolver',
      },
    },
  },
  {
    name: 'unsupported',
    type: 'custom',
    label: 'Custom: Missing provider',
    options: {
      resolver: {
        type: 'missing-type',
      },
    },
  },
  {
    name: 'user-jdog',
    type: 'user',
    label: 'JDog User',
    options: {
      provider: {
        type: 'user-jdog-provider',
      },
    },
  },
  {
    name: 'user-jdog-required',
    type: 'user',
    label: 'JDog User (Required)',
    isRequired: true,
    options: {
      provider: {
        type: 'user-jdog-provider',
      },
    },
  },
  {
    name: 'user-jdog-multiple',
    type: 'user',
    label: 'JDog User (Multiple, Required)',
    isRequired: true,
    isMultiple: true,
    options: {
      provider: {
        type: 'user-jdog-provider',
      },
    },
  },
];
