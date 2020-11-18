import { FieldDefinition } from '@atlaskit/editor-common/extensions';

export const nativeFields: FieldDefinition[] = [
  {
    type: 'string',
    name: 'text-field',
    label: 'Free text',
    isRequired: true,
    description: 'Add any text',
    defaultValue: 'I am the default text',
  },
  {
    name: 'text-field-multiline',
    label: 'Free text',
    isRequired: true,
    description: 'Add any text across multiple lines',
    defaultValue: 'I am the default multiline text',
    style: 'multiline',
    type: 'string',
  },
  {
    name: 'text-field-optional',
    label: 'Text',
    isRequired: false,
    description: 'Leave it empty',
    placeholder: 'Text goes here',
    type: 'string',
  },
  {
    name: 'text-field-hidden',
    label: 'Hidden text field',
    defaultValue: 'this is a hidden value passed to the extension',
    isHidden: true,
    type: 'string',
  },
  {
    name: 'number-field',
    label: 'Number',
    isRequired: true,
    placeholder: 'Number goes here',
    type: 'number',
  },
  {
    name: 'boolean-field-required',
    label: 'Needs to be checked',
    description:
      '<b>A</b> <i>checkbox</i> that can be <code>true</code> or <strong>false</strong> <em>(by design)</em>',
    isRequired: true,
    type: 'boolean',
  },
  {
    name: 'boolean-field-optional',
    label: 'Do you want free shipping?',
    description: 'True or <b>FALSE</b> (should be bolded)',
    type: 'boolean',
  },
  {
    name: 'boolean-field-toggle',
    label: 'Turn on the Wi-Fi?',
    description: 'On or Off',
    type: 'boolean',
    style: 'toggle',
    defaultValue: true,
  },
  {
    name: 'date-start',
    label: 'Date',
    description: `Nothing of <a onclick="alert('something is wrong')">interest</a>`,
    placeholder: 'Date goes here',
    type: 'date',
  },
  {
    name: 'enum-select',
    label: 'Select one',
    isRequired: true,
    description: 'Pick one',
    type: 'enum',
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
    label: 'Select with icons',
    description: 'Pick one',
    type: 'enum',
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
        label: 'Option B',
        value: 'b',
        description: 'One of the best options out there',
        icon: 'https://i.picsum.photos/id/240/24/24.jpg',
      },
    ],
  },
  {
    name: 'enum-select-icon-multiple',
    label: 'Select with icons (multiple)',
    description: 'Pick many',
    type: 'enum',
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
    name: 'enum-radio-required',
    label: 'Radio - select one',
    description: 'One is always required',
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
    name: 'enum-radio-defaulted',
    label: 'Radio - select one (defaulted)',
    description: 'One is always required, but we default it',
    type: 'enum',
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
    label: 'Checkbox - select many',
    description: 'Pick multiple',
    type: 'enum',
    style: 'checkbox',
    isRequired: false,
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
    name: 'Q',
    label: 'Search term',
    type: 'string',
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
        name: 'created',
        label: 'Created at',
        description: `This is how we select date range in the cql component`,
        type: 'date-range',
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
        label: 'Last modified',
        type: 'date-range',
        items: [
          { label: 'Today', value: 'now(-1d)' },
          { label: 'This week', value: 'now(-1w)' },
          { label: 'This month', value: 'now(-1M)' },
          { label: 'This year', value: 'now(-1y)' },
        ],
      },
      {
        name: 'Q',
        label: 'Search term',
        type: 'string',
      },
      {
        name: 'fs-custom-select-icon',
        label: 'Custom: User',
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
    name: 'fieldset-without-label',
    label: 'Fieldset without label',
    type: 'fieldset',
    options: {
      isDynamic: true,
      showTitle: false,
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
        name: 'keywords',
        label: 'Keywords',
        type: 'string',
      },
    ],
  },
  {
    name: 'jira-filter',
    label: 'Issues filter',
    type: 'fieldset',
    options: {
      isDynamic: true,
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
    name: 'custom-label',
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
    name: 'custom-label-create',
    label: 'Custom: Create a Label',
    description: 'Select or create a label',
    type: 'custom',
    isRequired: true,
    options: {
      isCreatable: true,
      resolver: {
        type: 'label',
      },
    },
  },
  {
    name: 'custom-label-create-multiple',
    label: 'Custom: Create Label(s)',
    description: 'Select or create label(s)',
    type: 'custom',
    isMultiple: true,
    options: {
      isCreatable: true,
      resolver: {
        type: 'label',
      },
    },
  },
  {
    name: 'custom-user',
    label: 'Custom: User',
    type: 'custom',
    options: {
      resolver: {
        type: 'username',
      },
    },
  },
  {
    name: 'custom-user-lazy',
    label: 'Custom: User (lazy)',
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
  {
    name: 'user-jdog',
    label: 'JDog User',
    type: 'user',
    options: {
      provider: {
        type: 'user-jdog-provider',
      },
    },
  },
];
