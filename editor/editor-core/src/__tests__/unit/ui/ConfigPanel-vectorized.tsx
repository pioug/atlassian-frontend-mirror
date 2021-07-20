import {
  FieldDefinition,
  Parameters,
} from '@atlaskit/editor-common/extensions';
import {
  asOptions,
  createOptionResolver,
  createProvider,
  getFieldErrors,
  mockJiraSmartUserProvider,
  mountWithProviders,
  resolveOption,
  silenceActErrors,
  toggleCheckbox,
  typeInField,
  updateParameters,
} from './_ConfigPanel_helpers';

type FieldTestCallOK = {
  parameters?: Parameters;
  call: (field: any) => void;
  expected: any;
};

type FieldTestCallInvalid = {
  parameters?: Parameters;
  call: (field: any) => void;
  invalid: true;
};

type FieldTest = {
  type: FieldDefinition['type'];
  style?: string;
  description?: string;
  selector: string;
  defaultValue: any;
  defaultValue2: any;
  tests: (FieldTestCallOK | FieldTestCallInvalid)[];
  fields?: FieldDefinition[]; // for dependencies
  [key: string]: any;
};

const FAKE_USER_A = {
  id: 'aaaaaaaaaaaaaaaaaaaaaaaaa',
  name: 'Dan Cousens',
  type: 'user',
};

const FAKE_USER_B = {
  id: 'bbbbbbbbbbbbbbbbbbbbbbbbb',
  name: 'Rifat Nabi',
  type: 'user',
};

const MOCK_FAKE_USERS = [FAKE_USER_A, FAKE_USER_B];

// the SUP requests returned an empty string when testing
//   probably needs cookie-based authentication
//   this request function is not needed for our purposes
//   but, mocking this prevents JSON.parse errors
jest.mock(
  '../../../../../../elements/user-picker/src/components/smart-user-picker/service/UsersClient',
  () => ({
    __esModule: true,
    default: async () => [],
  }),
);

// the SUP requests returned an empty string when testing
//   probably needs cookie-based authentication
//   easier to mock the request function for our purposes
jest.mock(
  '../../../../../../elements/user-picker/src/components/smart-user-picker/service/recommendationClient',
  () => ({
    __esModule: true,
    default: async ({ query }: { query?: string }) => {
      if (!query) {
        return [];
      }
      return MOCK_FAKE_USERS.filter((x) => x.name.includes(query));
    },
  }),
);

const fieldTests: FieldTest[] = [
  {
    type: 'number',
    selector: 'Number',
    defaultValue: 99,
    defaultValue2: 33,
    tests: [
      {
        call: (field: any) => {
          typeInField(field.find('Textfield input[autoFocus=true]'), '123');
        },
        expected: 123,
      },
      {
        call: (field: any) => {
          typeInField(
            field.find('Textfield input[autoFocus=true]'),
            'not a number',
          );
        },
        invalid: true,
      },
    ],
  },
  {
    type: 'string',
    selector: 'String',
    defaultValue: 'hello',
    defaultValue2: 'world',
    tests: [
      {
        call: (field: any) => {
          typeInField(field.find('Textfield input[autoFocus=true]'), 'foo');
        },
        expected: 'foo',
      },
    ],
  },
  {
    type: 'string',
    style: 'multiline',
    selector: 'String',
    defaultValue: 'hello',
    defaultValue2: 'world',
    tests: [
      {
        call: (field: any) => {
          typeInField(field.find('textarea'), 'foo');
        },
        expected: 'foo',
      },
    ],
  },
  {
    type: 'boolean',
    style: 'checkbox',
    selector: 'Boolean',
    defaultValue: false,
    defaultValue2: true,
    tests: [
      {
        call: (field: any) => {
          toggleCheckbox(field.find('input[type="checkbox"]'));
        },
        expected: true,
      },
    ],
  },
  {
    type: 'boolean',
    style: 'toggle',
    selector: 'Boolean',
    defaultValue: false,
    defaultValue2: true,
    tests: [
      {
        call: (field: any) => {
          toggleCheckbox(field.find('input[type="checkbox"]'));
        },
        expected: true,
      },
    ],
  },
  {
    type: 'date',
    selector: 'Date',
    defaultValue: new Date('2020/02/17').toISOString(),
    defaultValue2: new Date('2021/04/19').toISOString(),
    tests: [
      // TODO: add interactive tests
    ],
  },
  {
    type: 'date-range',
    selector: 'DateRange',
    defaultValue: {
      type: 'date-range',
      value: 'now(-1d)',
      from: 'now(-1d)',
    },
    defaultValue2: {
      type: 'date-range',
      value: 'now(-1d)',
      from: 'now(-1d)',
    },
    items: [
      { label: 'Any date', value: '' },
      { label: 'Last 24 hours', value: 'now(-1d)' },
      { label: 'Last week', value: 'now(-1w)' },
      { label: 'Last month', value: 'now(-1M)' },
      { label: 'Last year', value: 'now(-1y)' },
    ],
    tests: [
      // TODO: add interactive tests, see ./ConfigPanel.tsx:522
    ],
  },
  {
    type: 'enum',
    style: 'checkbox',
    selector: 'Enum',
    defaultValue: ['a', 'b'],
    defaultValue2: ['b', 'c'],
    items: asOptions(['a', 'b', 'c']),
    isMultiple: true,
    tests: [
      {
        call: async (field: any) => {
          toggleCheckbox(field.find('input[type="checkbox"]').at(0));
          toggleCheckbox(field.find('input[type="checkbox"]').at(2));
        },
        expected: ['a', 'c'],
      },
    ],
  },
  {
    type: 'enum',
    style: 'select',
    selector: 'Enum',
    defaultValue: 'a',
    defaultValue2: 'b',
    items: asOptions(['a', 'b', 'c']),
    tests: [
      {
        call: async (field: any) => {
          expect(await resolveOption(field.find('Select'), 'b')).toBe(true);
        },
        expected: 'b',
      },
    ],
  },
  {
    type: 'enum',
    style: 'select',
    selector: 'Enum',
    defaultValue: ['a', 'b'],
    defaultValue2: ['b', 'c'],
    items: asOptions(['a', 'b', 'c']),
    isMultiple: true,
    tests: [
      {
        call: async (field: any) => {
          expect(await resolveOption(field.find('Select'), 'a')).toBe(true);
          expect(await resolveOption(field.find('Select'), 'c')).toBe(true);
        },
        expected: ['a', 'c'],
      },
    ],
  },
  {
    type: 'enum',
    style: 'select',
    selector: 'Enum',
    defaultValue: ['a', 'b'],
    defaultValue2: ['b', 'c'],
    items: asOptions(['a', 'b', 'c']),
    isMultiple: true,
    tests: [
      {
        call: async (field: any) => {
          expect(await resolveOption(field.find('Select'), 'a')).toBe(true);
          expect(await resolveOption(field.find('Select'), 'c')).toBe(true);
        },
        expected: ['a', 'c'],
      },
    ],
  },
  {
    type: 'enum',
    style: 'radio',
    selector: 'Enum',
    defaultValue: 'a',
    defaultValue2: 'b',
    items: asOptions(['a', 'b', 'c']),
    tests: [
      {
        call: async (field: any) => {
          toggleCheckbox(field.find('input[type="radio"]').at(1));
        },
        expected: 'b',
      },
    ],
  },
  {
    type: 'custom',
    selector: 'CustomSelect',
    defaultValue: 'a',
    defaultValue2: 'b',
    options: {
      resolver: {
        type: 'foo',
      },
    },
    manifest: {
      modules: {
        fields: {
          custom: {
            foo: {
              resolver: createOptionResolver([
                { label: 'a', value: 'a' },
                { label: 'b', value: 'b' },
                { label: 'c', value: 'c' },
              ]),
            },
          },
        },
      },
    },
    tests: [
      {
        call: async (field: any) => {
          expect(await resolveOption(field.find('Select'), 'b')).toBe(true);
        },
        expected: 'b',
      },
    ],
  },
  {
    type: 'custom',
    selector: 'CustomSelect',
    defaultValue: ['a'],
    defaultValue2: ['b'],
    options: {
      resolver: {
        type: 'foo',
      },
    },
    isMultiple: true,
    manifest: {
      modules: {
        fields: {
          custom: {
            foo: {
              resolver: createOptionResolver([
                { label: 'a', value: 'a' },
                { label: 'b', value: 'b' },
                { label: 'c', value: 'c' },
              ]),
            },
          },
        },
      },
    },
    tests: [
      {
        call: async (field: any) => {
          expect(await resolveOption(field.find('Select'), 'a')).toBe(true);
          expect(await resolveOption(field.find('Select'), 'c')).toBe(true);
        },
        expected: ['a', 'c'],
      },
    ],
  },
  {
    type: 'custom',
    selector: 'CustomSelect',
    description: 'with dependencies',
    defaultValue: 'a',
    defaultValue2: 'b',
    options: {
      resolver: {
        type: 'foo',
      },
    },
    fields: [
      {
        type: 'string',
        label: 'String dependency field',
        name: 'depend0',
        defaultValue: 'morning',
      },
    ],
    manifest: {
      modules: {
        fields: {
          custom: {
            foo: {
              resolver: createOptionResolver(
                [
                  { label: 'xa', value: 'a' },
                  { label: 'xb', value: 'b' },
                  { label: 'xc', value: 'c' },
                ],
                (option, parameters) => {
                  return (
                    parameters?.depend0 === 'morning' ||
                    (option.value === 'a' && parameters?.depend0 === 'alpha') ||
                    (option.value === 'b' && parameters?.depend0 === 'beta')
                  );
                },
              ),
            },
          },
        },
      },
    },
    tests: [
      {
        parameters: {
          depend0: 'alpha',
        },
        call: async (field: any) => {
          expect(await resolveOption(field.find('Select'), 'x')).toBe(true);
        },
        expected: 'a',
      },
      {
        parameters: {
          depend0: 'beta',
        },
        call: async (field: any) => {
          expect(await resolveOption(field.find('Select'), 'x')).toBe(true);
        },
        expected: 'b',
      },
    ],
  },
  {
    type: 'user',
    selector: 'UserSelect',
    defaultValue: FAKE_USER_A.id,
    defaultValue2: FAKE_USER_B.id,
    options: {
      provider: {
        type: 'foo',
      },
    },
    manifest: {
      modules: {
        fields: {
          user: {
            foo: {
              provider: mockJiraSmartUserProvider,
            },
          },
        },
      },
    },
    tests: [
      {
        call: async (field: any) => {
          field.find('SmartUserPicker').instance().onFocus();
          field.update();

          expect(
            await resolveOption(
              field.find('SmartUserPicker'),
              FAKE_USER_A.name,
            ),
          ).toBe(true);
        },
        expected: FAKE_USER_A.id,
      },
    ],
  },
  {
    type: 'user',
    selector: 'UserSelect',
    defaultValue: [FAKE_USER_A.id],
    defaultValue2: [FAKE_USER_B.id],
    options: {
      provider: {
        type: 'foo',
      },
    },
    isMultiple: true,
    manifest: {
      modules: {
        fields: {
          user: {
            foo: {
              provider: mockJiraSmartUserProvider,
            },
          },
        },
      },
    },
    tests: [
      {
        call: async (field: any) => {
          field.find('SmartUserPicker').instance().onFocus();
          field.update();

          expect(
            await resolveOption(
              field.find('SmartUserPicker'),
              FAKE_USER_A.name,
            ),
          ).toBe(true);
        },
        expected: [FAKE_USER_A.id],
      },
    ],
  },
];

function testToLabel(fieldTest: FieldTest) {
  const { type, style, description, isMultiple } = fieldTest;
  let label = `type: ${type}`;
  if (style) {
    label = `${label}-${style}`;
  }

  if (description) {
    label = `${label} (${description})`;
  }

  if (isMultiple) {
    label = `${label} (isMultiple)`;
  }

  return label;
}

describe('ConfigPanel', () => {
  // TODO: there are many warnings due to hooks usage and async code,
  //   these should be resolved by the next react update
  silenceActErrors();

  for (const fieldTest of fieldTests) {
    const {
      type,
      selector,
      description,
      defaultValue,
      defaultValue2,
      manifest,
      fields,
      tests,
      ...rest
    } = fieldTest;

    const mountFields = async (attributes: Record<string, any> = {}) => {
      return await mountWithProviders({
        showHeader: true,
        onCancel: jest.fn(),
        onChange: jest.fn(),
        autoSave: false,
        extensionType: 'twp.editor.test',
        extensionKey: 'just-for-tests',
        nodeKey: 'test-item',
        extensionProvider: createProvider(
          [
            ...(fields || []),
            ({
              type,
              name: 'azerty',
              label: 'My test field',
              ...rest,
              ...attributes,
            } as unknown) as FieldDefinition,
          ],
          manifest,
        ),
      });
    };

    describe(testToLabel(fieldTest), () => {
      it(`should mount`, async () => {
        const { wrapper } = await mountFields();
        expect(wrapper.find(selector).exists()).toBe(true);
      });

      const valid = tests.filter((x): x is FieldTestCallOK => 'expected' in x);
      const invalid = tests.filter(
        (x): x is FieldTestCallInvalid => !('expected' in x),
      );

      for (const { call, parameters, expected } of valid) {
        it(`should submit successfully for valid values`, async () => {
          const { onChange, wrapper, trySubmit } = await mountFields();

          if (parameters) {
            await updateParameters(wrapper, parameters);
          }
          await call(wrapper.find(selector));
          await trySubmit();

          // no errors
          expect(getFieldErrors(wrapper.find(selector))).toStrictEqual([]);

          // called onChange
          expect(onChange).toHaveBeenCalledWith({
            ...parameters,
            azerty: expected,
          });
        });
      }

      for (const { call, parameters } of invalid) {
        it('should show an InvalidError and skip submission for invalid values', async () => {
          const { onChange, wrapper, trySubmit } = await mountFields();

          if (parameters) {
            await updateParameters(wrapper, parameters);
          }
          await call(wrapper.find(selector));
          await trySubmit();

          // displayed an error
          expect(getFieldErrors(wrapper.find(selector))).toStrictEqual([
            'invalid',
          ]);

          // did not call onChange
          expect(onChange).toBeCalledTimes(0);
        });
      }

      it(`should be parameter driven`, async () => {
        const { onChange, wrapper, trySubmit } = await mountFields({
          defaultValue,
        });

        await trySubmit();
        expect(getFieldErrors(wrapper.find(selector))).toStrictEqual([]);
        expect(onChange).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({ azerty: defaultValue }),
        );

        await updateParameters(wrapper, {
          azerty: defaultValue2,
        });
        await trySubmit();

        expect(getFieldErrors(wrapper.find(selector))).toStrictEqual([]);
        expect(onChange).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({ azerty: defaultValue2 }),
        );
      });

      it('if isRequired, show error and stop submission when missing', async () => {
        const { onChange, wrapper, trySubmit } = await mountFields({
          isRequired: true,
        });

        // no errors
        expect(getFieldErrors(wrapper.find(selector))).toStrictEqual([]);

        // until submission
        await trySubmit();

        expect(onChange).toBeCalledTimes(0);
        expect(getFieldErrors(wrapper.find(selector))).toStrictEqual([
          'required',
        ]);
      });
    });
  }
});
