import { mockCreateAnalyticsEvent } from '@atlaskit/editor-test-helpers/mock-analytics-next';

import React from 'react';
import { IntlProvider } from 'react-intl';
import { mount, ReactWrapper } from 'enzyme';
import CreatableSelect from 'react-select/creatable';
import AsyncCreatableSelect from 'react-select/async-creatable';
import retry from 'async-retry';
import merge from 'lodash/merge';

import {
  ExtensionManifest,
  ExtensionModule,
  ExtensionModuleNodes,
  combineExtensionProviders,
  DefaultExtensionProvider,
  EnumField,
  BooleanField,
  StringField,
  NumberField,
  FieldDefinition,
  Fieldset,
  Parameters,
} from '@atlaskit/editor-common/extensions';

import { flushPromises } from '../../__helpers/utils';

import { setEnv } from '@atlaskit/user-picker/src/components/smart-user-picker/config';
import { FieldTypeError, ValidationError } from '../../../ui/ConfigPanel/types';
import { validate } from '../../../ui/ConfigPanel/utils';
import ConfigPanel from '../../../ui/ConfigPanel';

beforeEach(() => {
  /* The first test of this module that loads ConfigPanel is sometimes timing out with our repo's
   * default timeout of 30 seconds. This is because ConfigPanel is asynchronously loaded and jest
   * has to resolve & transpile all modules asynchronously during the test which takes up valuable
   * test time.
   *
   * A longer term fix would be to provide a global mock of react-loadable that loaded these modules
   * in advance and showed the loading state after a tick or so.
   *
   * Alternatively, the actual module that is asynchronously loaded can be 'preloaded' in this test by importing it.
   */
  jest.setTimeout(60000);
});

const createManifest = (
  fieldsDefinitionsGetter:
    | (() => Promise<FieldDefinition[]>)
    | FieldDefinition[],
): ExtensionManifest => {
  const key = 'test-item';

  const quickInsert: ExtensionModule[] = [
    {
      key,
      title: 'All fields',
      icon: () => import('@atlaskit/icon/glyph/editor/code'),
      action: {
        type: 'node',
        key,
        parameters: {},
      },
    },
  ];

  const nodes: ExtensionModuleNodes = {
    [key]: {
      type: 'extension',
      render: () => Promise.resolve(() => null),
      getFieldsDefinition: () =>
        typeof fieldsDefinitionsGetter === 'function'
          ? fieldsDefinitionsGetter()
          : Promise.resolve(fieldsDefinitionsGetter),
    },
  };

  return {
    title: 'Editor test extensions',
    type: 'twp.editor.test',
    key: 'just-for-tests',
    description: 'Extensions generated for testing purposes.',
    documentationUrl: 'http://atlassian.com',
    icons: {
      '48': () => import('@atlaskit/icon/glyph/editor/code'),
    },
    modules: {
      quickInsert,
      nodes,
      fields: {
        custom: {
          userpicker: {
            resolver: userPicker,
          },
        },
        fieldset: {
          'json-group': {
            serializer: value => JSON.stringify(value),
            deserializer: value => JSON.parse(value),
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
        user: {
          'user-jdog-provider': {
            provider: async () => {
              // WARNING: this is required by the SmartUserPicker for testing environments
              setEnv('local');

              return {
                siteId: '497ea592-beb4-43c3-9137-a6e5fa301088',
                principalId: 'Context',
                fieldId: 'storybook',
                productKey: 'jira',
              };
            },
          },
        },
      },
    },
  };
};

const createProvider = (
  fieldsDefinitionsGetter:
    | (() => Promise<FieldDefinition[]>)
    | FieldDefinition[],

  mergeManifest?: Partial<ExtensionManifest>,
) => {
  return combineExtensionProviders([
    new DefaultExtensionProvider([
      merge(createManifest(fieldsDefinitionsGetter), mergeManifest),
    ]),
  ]);
};

type Wrapper<T = any> = ReactWrapper<T, any, any>;

const eventuallyFind = async (
  wrapper: Wrapper,
  selector: string,
): Promise<Wrapper> => {
  return await retry(
    async () => {
      wrapper.update();

      const element = wrapper.find(selector);
      if (element.length === 0) {
        throw Error(`Could not find ${selector}`);
      }
      return element;
    },
    {
      retries: 10,
      minTimeout: 25,
    },
  );
};

type Props = React.ComponentProps<typeof ConfigPanel>;
type MountResult<T> = {
  wrapper: Wrapper<T>;
  doSubmitForm: () => Promise<void>;
};

async function mountWithProviders(props: Props): Promise<MountResult<Props>> {
  const wrapper = mount(
    <IntlProvider locale="en">
      <ConfigPanel {...props} />
    </IntlProvider>,
  );

  const form = await eventuallyFind(wrapper, 'form');
  wrapper.update();

  return {
    wrapper,
    doSubmitForm: async () => {
      form.simulate('submit');
      await flushPromises();
    },
  };
}

const typeInField = (field: any, text: string) => {
  (field.getDOMNode() as HTMLInputElement).value = text;
  field.simulate('change');
  field.simulate('blur');
};

const toggleCheckbox = (inputWrapper: any) => {
  const input = inputWrapper.getDOMNode();

  input.checked = !input.checked;
  inputWrapper.simulate('change');
  inputWrapper.simulate('blur');
};

async function createOption(select: any, value: string) {
  const instance = select.instance();
  instance.handleInputChange({ currentTarget: { value } });

  // internal setState may not be synchronous, wait
  await flushPromises();
  return await selectOption(select, value);
}

async function selectOption(select: any, value: string) {
  const instance = select.instance();
  instance.openMenu('last'); // auto-focuses any createOption
  const { options, isLoading } = instance.props;
  if (isLoading) {
    throw new TypeError('Cannot select an option if loading');
  }

  let { focusedOption } = instance.state;
  if (!focusedOption || focusedOption.value !== value) {
    focusedOption = null;
    for (const option of options) {
      if (option.value === value) {
        focusedOption = option;
        break;
      }
    }

    if (!focusedOption) {
      return false;
    }
  }

  instance.selectOption(focusedOption);
  return true;
}

describe('createOption/selectOption', () => {
  it('work as intended', async () => {
    const OPTIONS = [{ value: 'bar', label: 'Bar' }];

    const spy = jest.fn();
    const wrapper = await mount(
      <CreatableSelect onChange={spy} options={OPTIONS} />,
    );

    const select = wrapper.find('Select');
    expect(await createOption(select, 'foo')).toBe(true);
    expect(await selectOption(select, 'bar')).toBe(true);
    expect(await selectOption(select, 'nope')).toBe(false);
    expect(await selectOption(select, 'foo')).toBe(false);

    expect(spy).toBeCalledTimes(2);
    expect(spy).nthCalledWith(
      1,
      expect.objectContaining({ label: 'Create "foo"', value: 'foo' }),
      expect.anything(),
    );

    expect(spy).nthCalledWith(
      2,
      expect.objectContaining({ label: 'Bar', value: 'bar' }),
      expect.anything(),
    );
  });

  it('works with no options', async () => {
    const spy = jest.fn();
    const wrapper = await mount(<CreatableSelect onChange={spy} />);

    const select = wrapper.find('Select');
    expect(await createOption(select, 'foo')).toBe(true);
    expect(await selectOption(select, 'bar')).toBe(false);
    expect(await selectOption(select, 'nope')).toBe(false);
    expect(await selectOption(select, 'foo')).toBe(false);

    expect(spy).toBeCalledTimes(1);
    expect(spy).nthCalledWith(
      1,
      expect.objectContaining({ label: 'Create "foo"', value: 'foo' }),
      expect.anything(),
    );
  });

  it('works with AsyncCreatableSelect', async () => {
    const spy = jest.fn();
    const wrapper = await mount(
      <AsyncCreatableSelect
        onChange={spy}
        isValidNewOption={() => true}
        loadOptions={async () => []}
      />,
    );

    const select = wrapper.find('Select');
    expect(await createOption(select, 'foo')).toBe(true);
    expect(await selectOption(select, 'bar')).toBe(false);
    expect(await selectOption(select, 'nope')).toBe(false);
    expect(await selectOption(select, 'foo')).toBe(false);

    expect(spy).toBeCalledTimes(1);
    expect(spy).nthCalledWith(
      1,
      expect.objectContaining({ label: 'Create "foo"', value: 'foo' }),
      expect.anything(),
    );
  });
});

const createFakeCustomFieldResolver = (
  items: { label: string; value: string }[],
) => (searchTerm?: string) => {
  if (searchTerm) {
    return Promise.resolve(
      items.filter(
        item =>
          item.label.search(new RegExp(searchTerm, 'i')) !== -1 ||
          item.value.search(new RegExp(searchTerm, 'i')) !== -1,
      ),
    );
  }

  return Promise.resolve(items);
};

const userPicker = createFakeCustomFieldResolver([
  { label: 'Leandro', value: 'u123i1431' },
  { label: 'Rifat', value: 'u456y1987' },
  { label: 'Rodrigo', value: 'j78635820' },
  { label: 'Eduard', value: 'h76543890' },
]);

// there are many warnings due to hooks usage and async code that will be solved with the next react update.
// this function will keep then silent so we can still read the tests.
const silenceActErrors = () => {
  let consoleError: jest.SpyInstance;

  beforeAll(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleError.mockRestore();
  });
};

const createConfigPanelTestSuite = ({ autoSave }: { autoSave: boolean }) => {
  describe('ConfigPanel', () => {
    describe(`autoSave ${autoSave ? 'enabled' : 'disabled'}`, () => {
      const noop = () => {};
      const onChange = jest.fn();
      const defaultProps = {
        showHeader: true,
        onCancel: noop,
        onChange,
        autoSave,
        extensionType: 'twp.editor.test',
        extensionKey: 'just-for-tests',
        nodeKey: 'test-item',
      };

      silenceActErrors();

      afterEach(() => {
        onChange.mockClear();
      });

      async function expectFieldMessageRequiredOnSubmit<T>({
        wrapper,
        doSubmitForm,
      }: MountResult<T>) {
        expect(wrapper.find('FieldMessages').prop('error')).toStrictEqual(
          undefined,
        );

        await doSubmitForm();

        expect(onChange).toBeCalledTimes(0);
        expect(wrapper.find('FieldMessages').prop('error')).toStrictEqual(
          'required',
        );
      }

      describe('Analytics', () => {
        async function mountBasic() {
          return mountWithProviders({
            ...defaultProps,
            extensionProvider: createProvider([
              {
                label: 'My text field',
                type: 'string',
                name: 't',
              },
            ]),
          });
        }

        it('should fire an "opened" event on mount', async () => {
          await mountBasic();

          expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
            action: 'opened',
            actionSubject: 'configPanel',
            eventType: 'ui',
            attributes: {},
          });
        });

        it('should fire an "closed" event on unmount', async () => {
          (await mountBasic()).wrapper.unmount();

          expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
            action: 'closed',
            actionSubject: 'configPanel',
            eventType: 'ui',
            attributes: {},
          });
        });
      });

      describe('UI States', () => {
        describe('Loading', () => {
          it('should show a spinner before the manifest is loaded', async () => {
            const provider = createProvider([]);

            // never resolves the manifest
            provider.getExtension = () => new Promise(resolve => {});

            const wrapper = await mount(
              <IntlProvider locale="en">
                <ConfigPanel {...defaultProps} extensionProvider={provider} />
              </IntlProvider>,
            );

            await flushPromises();

            wrapper.update();

            expect(wrapper.find('LoadingState')).toHaveLength(1);
          });

          it('should show a spinner, the title and the description while loading fields', async () => {
            const extensionProvider = createProvider(
              () => new Promise(() => {}),
            );

            const mountResult = await mountWithProviders({
              ...defaultProps,
              extensionProvider,
            });

            const header = await eventuallyFind(mountResult.wrapper, 'Header');

            expect(header.props().title).toBe('Editor test extensions');
            expect(mountResult.wrapper.find('LoadingState')).toHaveLength(1);
          });
        });

        describe('Error', () => {
          it('should show an error message if it fails to load the fields', async () => {
            const extensionProvider = createProvider(() =>
              Promise.reject(new Error('Error loading fields')),
            );

            const mountResult = await mountWithProviders({
              ...defaultProps,
              extensionProvider,
            });

            const header = await eventuallyFind(mountResult.wrapper, 'Header');
            const errorMessage = await eventuallyFind(
              mountResult.wrapper,
              'ConfigPanelErrorMessage',
            );

            expect(header.props().title).toBe('Editor test extensions');
            expect(errorMessage.props().errorMessage).toBe(
              'Error loading fields',
            );
          });
        });

        describe('Header', () => {
          const setupHeader = async (
            manifestAtributes: Partial<ExtensionManifest> = {},
          ) => {
            const extensionProvider = createProvider(
              () => new Promise(() => {}),
              manifestAtributes,
            );

            const mountResult = await mountWithProviders({
              ...defaultProps,
              extensionProvider,
            });

            const header = await eventuallyFind(mountResult.wrapper, 'Header');

            return header;
          };

          it('should show the description with a full stop and a link when provided', async () => {
            const header = await setupHeader({
              description: 'This is a description',
              documentationUrl: 'http://atlassian.com/docs',
            });

            const description = header.find('Description');

            expect(description.text()).toBe(
              'This is a description. Documentation',
            );

            expect(description.find('a').prop('href')).toBe(
              'http://atlassian.com/docs',
            );
            expect(description.find('a').prop('rel')).toBe(
              'noopener noreferrer',
            );
          });

          it('should not add 2 full stops to the description', async () => {
            const header = await setupHeader({
              description: 'This is a description.',
              documentationUrl: 'http://atlassian.com/docs',
            });

            expect(header.find('Description').text()).toBe(
              'This is a description. Documentation',
            );
          });

          it('should show the summary under the title', async () => {
            const header = await setupHeader({
              summary: 'This is the summary',
            });

            expect(header.find('.item-summary').text()).toBe(
              'This is the summary',
            );
          });

          it('should show the title centered when there is no summary', async () => {
            const header = await setupHeader({
              title: 'Extension Title',
              summary: undefined,
            });

            expect(header.find('CenteredItemTitle').text()).toBe(
              'Extension Title',
            );
          });
        });
      });

      describe('Native types', () => {
        describe('type: string', () => {
          async function mountString(attributes?: Partial<StringField>) {
            return await mountWithProviders({
              ...defaultProps,
              extensionProvider: createProvider([
                {
                  type: 'string',
                  name: 's',
                  label: 'My text field',
                  ...attributes,
                },
              ]),
            });
          }

          it('should create a TextField with type text', async () => {
            const { wrapper } = await mountString({ name: 'foo' });
            const field = wrapper.find('Textfield');

            expect(field.length).toBe(1);
            expect(field.prop('name')).toBe('foo');
          });

          it('should serialize to an object', async () => {
            const { wrapper, doSubmitForm } = await mountString({
              name: 'foo',
            });
            const field = wrapper.find('Textfield');
            typeInField(field.find('input'), 'bar');
            await doSubmitForm();

            expect(onChange).toHaveBeenCalledWith({ foo: 'bar' });
          });

          describe('prop: isRequired', () => {
            it('should show error and skip submission if not filled', async () => {
              const { wrapper, doSubmitForm } = await mountString({
                isRequired: true,
              });

              await expectFieldMessageRequiredOnSubmit({
                wrapper,
                doSubmitForm,
              });
            });
          });

          describe('prop: style="multiline"', () => {
            it('should create a TextArea with type text', async () => {
              const { wrapper } = await mountString({
                name: 'foo',
                style: 'multiline',
              });
              const field = wrapper.find('textarea');
              expect(field.length).toBe(1);
              expect(field.prop('name')).toBe('foo');
            });

            it('should serialize to an object', async () => {
              const { wrapper, doSubmitForm } = await mountString({
                name: 'foo',
                style: 'multiline',
              });
              const field = wrapper.find('textarea');
              typeInField(field, 'bar');
              await doSubmitForm();

              expect(onChange).toHaveBeenCalledWith({ foo: 'bar' });
            });

            describe('prop: isRequired', () => {
              it('should show error and skip submission if not filled', async () => {
                const { wrapper, doSubmitForm } = await mountString({
                  style: 'multiline',
                  isRequired: true,
                });

                await expectFieldMessageRequiredOnSubmit({
                  wrapper,
                  doSubmitForm,
                });
              });
            });
          });
        });

        describe('type: number', () => {
          async function mountNumber(attributes?: Partial<NumberField>) {
            return await mountWithProviders({
              ...defaultProps,
              extensionProvider: createProvider([
                {
                  type: 'number',
                  name: 'n',
                  label: 'My number field',
                  ...attributes,
                },
              ]),
            });
          }

          it('should create a TextField with type text', async () => {
            const { wrapper } = await mountNumber();
            const field = wrapper.find('Textfield');

            expect(field.length).toBe(1);
            expect(field.prop('type')).toBe('text');
          });

          it('should serialize to an object', async () => {
            const { wrapper, doSubmitForm } = await mountNumber();

            typeInField(wrapper.find('input[autoFocus=true]'), '123');
            await doSubmitForm();

            expect(onChange).toHaveBeenCalledWith({ n: 123 });
          });

          it('should show an InvalidError and skip submission for invalid values', async () => {
            const { wrapper, doSubmitForm } = await mountNumber();

            typeInField(wrapper.find('input[autoFocus=true]'), 'not a number');
            await doSubmitForm();

            expect(onChange).toBeCalledTimes(0);
            expect(wrapper.find('FieldMessages').prop('error')).toStrictEqual(
              'invalid',
            );
          });

          describe('prop: isRequired', () => {
            it('should show error and skip submission if not filled', async () => {
              const { wrapper, doSubmitForm } = await mountNumber({
                isRequired: true,
              });

              await expectFieldMessageRequiredOnSubmit({
                wrapper,
                doSubmitForm,
              });
            });
          });
        });

        describe('type: date', () => {
          let mountResult: MountResult<Props>;
          beforeEach(async () => {
            mountResult = await mountWithProviders({
              ...defaultProps,
              extensionProvider: createProvider([
                {
                  label: 'My date field',
                  type: 'date',
                  name: 'creationDate',
                },
              ]),
              parameters: {
                creationDate: '02/02/2020',
              },
            });
          });

          it('should create a DatePicker', () => {
            const { wrapper } = mountResult;
            const field = wrapper.find('DatePicker');

            expect(field.length).toBe(1);
          });

          it('should serialize to an object', async () => {
            const { doSubmitForm } = mountResult;
            await doSubmitForm();

            expect(onChange).toHaveBeenCalledWith({
              creationDate: '02/02/2020',
            });
          });

          describe('prop: isRequired', () => {
            it('should show error and skip submission if not filled', async () => {
              const { wrapper, doSubmitForm } = await mountWithProviders({
                ...defaultProps,
                extensionProvider: createProvider([
                  {
                    label: 'My date field',
                    type: 'date',
                    name: 'creationDate',
                    isRequired: true,
                  },
                ]),
              });

              await expectFieldMessageRequiredOnSubmit({
                wrapper,
                doSubmitForm,
              });
            });
          });
        });

        describe('type: date-range', () => {
          const mountDateRangeWithParameters = async (
            params: Parameters,
          ): Promise<MountResult<Props>> => {
            return await mountWithProviders({
              ...defaultProps,
              extensionProvider: createProvider([
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
              ]),
              parameters: {
                created: params,
              },
            });
          };

          it('should create a DateRange component', async () => {
            const { wrapper } = await mountDateRangeWithParameters({
              type: 'date-range',
              value: 'custom',
              from: '2020-10-05',
              to: '2020-10-22',
            });
            const field = wrapper.find('DateRange');

            expect(field.length).toBe(1);
          });

          it(`should serialize to a complex object with type 'date-range'`, async () => {
            const { doSubmitForm } = await mountDateRangeWithParameters({
              type: 'date-range',
              value: 'custom',
              from: '2020-10-05',
              to: '2020-10-22',
            });

            await doSubmitForm();

            expect(onChange).toHaveBeenCalledWith({
              created: {
                type: 'date-range',
                value: 'custom',
                from: '2020-10-05',
                to: '2020-10-22',
              },
            });
          });

          it(`should omit the field 'to' when an option different from 'custom' is selected`, async () => {
            const {
              wrapper,
              doSubmitForm,
            } = await mountDateRangeWithParameters({
              type: 'date-range',
              value: 'custom',
              from: '2020-10-05',
              to: '2020-10-22',
            });

            const field = wrapper.find('RadioGroup');

            toggleCheckbox(field.find('input').at(1));

            await doSubmitForm();

            expect(onChange).toHaveBeenCalledWith({
              created: {
                type: 'date-range',
                value: 'now(-1d)',
                from: 'now(-1d)',
              },
            });

            toggleCheckbox(field.find('input').at(2));

            await doSubmitForm();

            expect(onChange).toHaveBeenCalledWith({
              created: {
                type: 'date-range',
                value: 'now(-1w)',
                from: 'now(-1w)',
              },
            });

            toggleCheckbox(field.find('input').at(3));

            await doSubmitForm();

            expect(onChange).toHaveBeenCalledWith({
              created: {
                type: 'date-range',
                value: 'now(-1M)',
                from: 'now(-1M)',
              },
            });
          });
        });

        describe('type: boolean', () => {
          async function mountBoolean(attributes?: Partial<BooleanField>) {
            return await mountWithProviders({
              ...defaultProps,
              extensionProvider: createProvider([
                {
                  type: 'boolean',
                  name: 'b',
                  label: 'My boolean field',
                  ...attributes,
                },
              ]),
            });
          }

          it('should create a Checkbox by default', async () => {
            const { wrapper } = await mountBoolean();
            const field = wrapper.find('Checkbox');

            expect(field.length).toBe(1);
          });

          it('should create a Checkbox when styled', async () => {
            const { wrapper } = await mountBoolean({ style: 'checkbox' });
            const field = wrapper.find('Checkbox');

            expect(field.length).toBe(1);
          });

          it('should create a Toggle when styled', async () => {
            const { wrapper } = await mountBoolean({ style: 'toggle' });
            const field = wrapper.find('ForwardRef(Toggle)');

            expect(field.length).toBe(1);
          });

          it('should serialize to an object', async () => {
            const { wrapper, doSubmitForm } = await mountBoolean({
              name: 'foo',
            });
            const field = wrapper.find('Checkbox');

            toggleCheckbox(field.find('input'));

            await doSubmitForm();

            expect(onChange).toHaveBeenCalledWith({ foo: true });
          });

          describe('prop: isRequired', () => {
            it('should show error and skip submission if not filled', async () => {
              const { wrapper, doSubmitForm } = await mountBoolean({
                isRequired: true,
                defaultValue: undefined,
              });

              await expectFieldMessageRequiredOnSubmit({
                wrapper,
                doSubmitForm,
              });
            });
          });
        });

        describe('type: enum', () => {
          let mountResult: MountResult<Props>;
          const items = [
            {
              label: 'A',
              value: 'a',
            },
            {
              label: 'B',
              value: 'b',
            },
            {
              label: 'C',
              value: 'c',
            },
          ];

          const mountEnumWithProps = (props: Partial<EnumField> = {}) => {
            return mountWithProviders({
              ...defaultProps,
              extensionProvider: createProvider([
                {
                  type: 'enum',
                  label: 'My enum field',
                  style: 'select',
                  name: 'list',
                  items,
                  ...props,
                },
              ] as EnumField[]),
            });
          };

          beforeEach(async () => {
            mountResult = await mountEnumWithProps();
          });

          it('should create a Select', () => {
            const { wrapper } = mountResult;

            const field = wrapper.find('Select');

            expect(field.length).toBe(1);
          });

          it('should serialize to an object', async () => {
            const { wrapper, doSubmitForm } = mountResult;

            const field = wrapper.find('Select');

            expect(await selectOption(field, 'a')).toBe(true);
            await doSubmitForm();

            expect(onChange).toHaveBeenCalledWith({ list: 'a' });
          });

          describe('prop: isRequired', () => {
            it('should show error and skip submission if not filled', async () => {
              const { wrapper, doSubmitForm } = await mountEnumWithProps({
                isRequired: true,
              });

              await expectFieldMessageRequiredOnSubmit({
                wrapper,
                doSubmitForm,
              });
            });
          });

          describe('prop: style="radio"', () => {
            it('should serialize to {name: a}', async () => {
              const { wrapper, doSubmitForm } = await mountEnumWithProps({
                style: 'radio',
              });

              const field = wrapper.find('RadioGroup');

              toggleCheckbox(field.find('input').at(0));

              await doSubmitForm();

              expect(onChange).toHaveBeenCalledWith({ list: 'a' });
            });

            describe('prop: isRequired', () => {
              it('should show error and skip submission if not filled', async () => {
                const { wrapper, doSubmitForm } = await mountEnumWithProps({
                  style: 'radio',
                  isRequired: true,
                });

                await expectFieldMessageRequiredOnSubmit({
                  wrapper,
                  doSubmitForm,
                });
              });
            });
          });

          describe('prop: isMultiple', () => {
            it('should serialize to {name: [c, b]}', async () => {
              const { wrapper, doSubmitForm } = await mountEnumWithProps({
                isMultiple: true,
              });
              const field = wrapper.find('Select');

              expect(await selectOption(field, 'c')).toBe(true);
              expect(await selectOption(field, 'b')).toBe(true);
              await doSubmitForm();

              expect(onChange).toHaveBeenCalledWith({ list: ['c', 'b'] });
            });

            describe('prop: isRequired', () => {
              it('should show error and skip submission if not filled', async () => {
                const { wrapper, doSubmitForm } = await mountEnumWithProps({
                  isMultiple: true,
                  isRequired: true,
                });

                await expectFieldMessageRequiredOnSubmit({
                  wrapper,
                  doSubmitForm,
                });
              });
            });

            describe('prop: style="checkbox"', () => {
              it('should serialize to {name: [a, c]}', async () => {
                const { wrapper, doSubmitForm } = await mountEnumWithProps({
                  isMultiple: true,
                  style: 'checkbox',
                });

                const field = wrapper.find('Checkbox');

                toggleCheckbox(field.at(0).find('input'));
                toggleCheckbox(field.at(2).find('input'));

                await doSubmitForm();

                expect(onChange).toHaveBeenCalledWith({ list: ['a', 'c'] });
              });
            });

            describe('prop: style="radio"', () => {
              it('should show an error', async () => {
                const { wrapper } = await mountEnumWithProps({
                  isMultiple: true,
                  style: 'radio' as any /* set to any because is invalid */,
                });
                expect(wrapper.find('FieldMessages').prop('error')).toBe(
                  FieldTypeError.isMultipleAndRadio,
                );
              });
            });
          });
        });
      });

      describe('Custom types', () => {
        async function mountCustom(
          attributes?: Record<string, any>,
          options?: Record<string, any>,
        ) {
          return await mountWithProviders({
            ...defaultProps,
            extensionProvider: createProvider([
              {
                label: 'My text field',
                type: 'custom',
                options: {
                  resolver: {
                    type: 'userpicker',
                  },
                  ...options,
                },
                name: 'user',
                ...attributes,
              },
            ]),
          });
        }

        describe('Pickers', () => {
          it('should create a Select', async () => {
            const { wrapper } = await mountCustom();
            const field = wrapper.find('Select');

            expect(field.length).toBe(1);
          });

          it('can be cleared', async () => {
            const { wrapper } = await mountCustom();
            const field = wrapper.find('Select');

            const { isClearable } = (field.instance() as any).props;
            expect(isClearable).toBe(true);
          });

          it('should serialize to {user: value}', async () => {
            const { wrapper, doSubmitForm } = await mountCustom();
            const field = wrapper.find('Select');

            expect(await selectOption(field, 'u123i1431')).toBe(true);
            await doSubmitForm();

            expect(onChange).toHaveBeenCalledWith({ user: 'u123i1431' });
          });

          describe('prop: isCreatable', () => {
            it('when false, should stop creation of new elements', async () => {
              const { wrapper, doSubmitForm } = await mountCustom(
                {},
                {
                  isCreatable: false,
                },
              );
              const select = wrapper.find('Select');

              expect(await createOption(select, 'foo')).toBe(false);
              await doSubmitForm();

              expect(onChange).toHaveBeenCalledWith({
                user: undefined,
              });
            });

            it('when true, should allow creating new elements', async () => {
              const { wrapper, doSubmitForm } = await mountCustom(
                {},
                {
                  isCreatable: true,
                },
              );
              const select = wrapper.find('Select');

              expect(await createOption(select, 'foo')).toBe(true);
              await doSubmitForm();

              expect(onChange).toHaveBeenCalledWith({
                user: 'foo',
              });
            });

            it('should serialize to {user: value}', async () => {
              const { wrapper, doSubmitForm } = await mountCustom(
                {},
                {
                  isCreatable: true,
                },
              );
              const select = wrapper.find('Select');

              expect(await createOption(select, 'foo')).toBe(true);
              await doSubmitForm();

              expect(onChange).toHaveBeenCalledWith({
                user: 'foo',
              });
            });
          });

          describe('prop: isRequired', () => {
            it('should show error and skip submission if not filled', async () => {
              const { wrapper, doSubmitForm } = await mountCustom({
                isRequired: true,
              });

              await expectFieldMessageRequiredOnSubmit({
                wrapper,
                doSubmitForm,
              });
            });
          });

          describe('prop: isMultiple', () => {
            it('should serialize to {user: value[]}', async () => {
              const { wrapper, doSubmitForm } = await mountCustom({
                isMultiple: true,
              });
              const field = wrapper.find('Select');

              expect(await selectOption(field, 'u123i1431')).toBe(true);
              expect(await selectOption(field, 'j78635820')).toBe(true);
              await doSubmitForm();

              expect(onChange).toHaveBeenCalledWith({
                user: ['u123i1431', 'j78635820'],
              });
            });
          });
        });
      });

      describe('type: User', () => {
        async function mountUser(attributes?: Record<string, any>) {
          return await mountWithProviders({
            ...defaultProps,
            extensionProvider: createProvider([
              {
                label: 'My friends',
                name: 'user',
                type: 'user',
                options: {
                  provider: {
                    type: 'user-jdog-provider',
                  },
                },
                ...attributes,
              },
            ]),
          });
        }

        it('should create a SmartUserPicker', async () => {
          const { wrapper } = await mountUser();
          const field = wrapper.find('SmartUserPicker');

          expect(field.length).toBe(1);
        });
      });

      describe('Fieldset', () => {
        async function mountFieldSet(
          isDynamic: boolean,
          otherProps: Record<string, any> = {},
          transformerType: string = 'json-group',
        ) {
          return mountWithProviders({
            ...defaultProps,
            extensionProvider: createProvider([
              {
                label: 'My settings',
                name: 'settings',
                type: 'fieldset',
                options: {
                  isDynamic,
                  transformer: {
                    type: transformerType,
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
            ]),
            ...otherProps,
          });
        }

        const getAllExistingVisibleFieldNames = (wrapper: Wrapper) => {
          return wrapper.find('Field').map(node => node.prop('name'));
        };

        describe('All', () => {
          it('should create a group of fields', async () => {
            const { wrapper } = await mountFieldSet(false);

            expect(wrapper.find('Textfield').length).toBe(2);
            expect(wrapper.find('Select').length).toBe(1);
          });

          it('should serialize using the serializer', async () => {
            const { wrapper, doSubmitForm } = await mountFieldSet(false);

            typeInField(wrapper.find('Textfield').at(0).find('input'), 'foo');
            typeInField(wrapper.find('Textfield').at(1).find('input'), '123');

            expect(
              await selectOption(wrapper.find('Select'), 'u123i1431'),
            ).toBe(true);
            await doSubmitForm();

            expect(onChange).toHaveBeenCalledWith({
              settings: JSON.stringify({
                Q: 'foo',
                depth: 123,
                USER: 'u123i1431',
              }),
            });
          });

          it('should log to the console if the serializer fails', async () => {
            const consoleError = jest
              .spyOn(console, 'error')
              .mockImplementation(() => {});

            const { wrapper, doSubmitForm } = await mountFieldSet(
              false,
              {},
              'broken-group',
            );

            const field = wrapper.find('Textfield').at(0).find('input');
            typeInField(field, 'bar');

            await doSubmitForm();

            expect(consoleError).toHaveBeenCalledWith(
              'Error serializing parameters',
              new Error('Something is broken'),
            );

            consoleError.mockClear();
          });

          it('should deserialize using the deserializer', async () => {
            const { doSubmitForm } = await mountFieldSet(false, {
              parameters: {
                settings: JSON.stringify({
                  Q: 'foo',
                  depth: 123,
                  USER: 'u123i1431',
                }),
              },
            });

            await doSubmitForm();

            expect(onChange).toHaveBeenCalledWith({
              settings: JSON.stringify({
                Q: 'foo',
                depth: 123,
                USER: 'u123i1431',
              }),
            });
          });

          it('should show an error message on deserialization failure', async () => {
            const { wrapper } = await mountFieldSet(
              false,
              {
                parameters: {
                  settings: 'this value will fail',
                },
              },
              'broken-group',
            );
            const FieldsetError = wrapper.find('FieldsetError');
            expect(FieldsetError).toHaveLength(1);
            expect(FieldsetError.prop('message')).toStrictEqual(
              'Something is broken',
            );
          });

          it('should not have a name collision between fields when a fieldset contain a field with the same name as another outside of the fieldset', async () => {
            const { wrapper, doSubmitForm } = await mountWithProviders({
              ...defaultProps,
              extensionProvider: createProvider([
                {
                  label: 'Text',
                  type: 'string',
                  name: 'foo',
                },
                {
                  label: 'Nesting test',
                  type: 'fieldset',
                  name: 'nested',
                  options: {
                    transformer: {
                      type: 'json-group',
                    },
                  },
                  fields: [
                    {
                      label: 'Fieldset Text',
                      type: 'string',
                      name: 'foo',
                    },
                  ],
                },
              ]),
              parameters: {
                foo: 'hello',
                nested: JSON.stringify({ foo: 'world' }),
              },
            });

            expect(getAllExistingVisibleFieldNames(wrapper)).toEqual([
              'foo',
              'nested.foo',
            ]);

            await doSubmitForm();

            expect(onChange).toHaveBeenCalledWith({
              foo: 'hello',
              nested: JSON.stringify({ foo: 'world' }),
            });

            const textfields = wrapper.find('Textfield');

            typeInField(textfields.at(0).find('input'), 'bye');
            typeInField(textfields.at(1).find('input'), 'editor');

            await doSubmitForm();

            expect(onChange).toHaveBeenCalledWith({
              foo: 'bye',
              nested: JSON.stringify({ foo: 'editor' }),
            });
          });
        });

        describe('Dynamic', () => {
          const clickAddFieldButton = (wrapper: Wrapper) => {
            wrapper.find('[data-testid="add-more"]').first().simulate('click');
            wrapper.update();
          };

          const hasAddButton = (wrapper: Wrapper) => {
            return wrapper.find('[data-testid="add-more"]').exists();
          };

          it('should show only 1 field when first rendering', async () => {
            const { wrapper } = await mountFieldSet(true);
            expect(getAllExistingVisibleFieldNames(wrapper)).toEqual([
              'settings.Q',
            ]);
          });

          it('should allow adding more fields when clicking the + button', async () => {
            const { wrapper } = await mountFieldSet(true);
            expect(getAllExistingVisibleFieldNames(wrapper)).toEqual([
              'settings.Q',
            ]);

            clickAddFieldButton(wrapper);

            expect(
              await selectOption(
                wrapper.find('[testId="fieldset-actions"]').find('Select'),
                'USER',
              ),
            ).toBe(true);

            wrapper.update();
            expect(getAllExistingVisibleFieldNames(wrapper)).toEqual([
              'settings.Q',
              'settings.USER',
            ]);

            expect(hasAddButton(wrapper)).toBe(true);
          });

          it('should remove the add button after all fields are added', async () => {
            const { wrapper } = await mountFieldSet(true, {
              parameters: {
                settings: JSON.stringify({ Q: 'foo', USER: 'u123i1431' }),
              },
            });

            expect(getAllExistingVisibleFieldNames(wrapper)).toEqual([
              'settings.Q',
              'settings.USER',
            ]);

            expect(hasAddButton(wrapper)).toBe(true);
            clickAddFieldButton(wrapper);

            expect(
              await selectOption(
                wrapper.find('[testId="fieldset-actions"]').find('Select'),
                'depth',
              ),
            ).toBe(true);

            wrapper.update();
            expect(getAllExistingVisibleFieldNames(wrapper)).toEqual([
              'settings.Q',
              'settings.USER',
              'settings.depth',
            ]);

            expect(hasAddButton(wrapper)).toBe(false);
          });

          it('should show all fields that have parameters passed down when first rendering', async () => {
            const { wrapper } = await mountFieldSet(true, {
              parameters: {
                settings: JSON.stringify({
                  Q: 'foo',
                  depth: 123,
                  USER: 'u123i1431',
                }),
              },
            });

            expect(getAllExistingVisibleFieldNames(wrapper)).toEqual([
              'settings.Q',
              'settings.depth',
              'settings.USER',
            ]);

            expect(hasAddButton(wrapper)).toBe(false);
          });

          it('should allow to remove fields', async () => {
            const { wrapper } = await mountFieldSet(true, {
              parameters: {
                settings: JSON.stringify({
                  Q: 'foo',
                  depth: 123,
                  USER: 'u123i1431',
                }),
              },
            });

            expect(getAllExistingVisibleFieldNames(wrapper)).toEqual([
              'settings.Q',
              'settings.depth',
              'settings.USER',
            ]);

            expect(hasAddButton(wrapper)).toBe(false);

            wrapper
              .find('RemovableField')
              .find('[testId="remove-field-USER"]')
              .first()
              .simulate('click');
            wrapper.update();

            expect(getAllExistingVisibleFieldNames(wrapper)).toEqual([
              'settings.Q',
              'settings.depth',
            ]);

            expect(hasAddButton(wrapper)).toBe(true);
          });

          it("shouldn't remove the last visible field", async () => {
            const { wrapper } = await mountFieldSet(true, {
              parameters: {
                settings: JSON.stringify({
                  Q: 'foo',
                  depth: 2,
                  USER: 'u123i1431',
                }),
              },
            });

            const removeFields = (fieldNames: string[]) => {
              fieldNames.forEach(fieldName => {
                const fieldElement = wrapper
                  .find('RemovableField')
                  .find(`[testId="remove-field-${fieldName}"]`)
                  .first();

                // For the only remaining field, RemovableField would be hidden.
                if (fieldElement.length > 0) {
                  fieldElement.simulate('click');
                }
              });
              wrapper.update();
            };
            expect(getAllExistingVisibleFieldNames(wrapper)).toEqual([
              'settings.Q',
              'settings.depth',
              'settings.USER',
            ]);
            removeFields(['Q', 'depth', 'USER']);
            expect(getAllExistingVisibleFieldNames(wrapper)).toEqual([
              'settings.USER',
            ]);
            removeFields(['USER']);
            expect(getAllExistingVisibleFieldNames(wrapper)).toEqual([
              'settings.USER',
            ]);
          });
        });
      });

      describe('Parameters', () => {
        it('should populate the fields with passed parameters', async () => {
          const { doSubmitForm } = await mountWithProviders({
            ...defaultProps,
            extensionProvider: createProvider([
              {
                label: 'Text',
                type: 'string',
                name: 't',
              },
              {
                label: 'Number',
                type: 'number',
                name: 'n',
              },
              {
                label: 'Date',
                type: 'date',
                name: 'd',
              },
              {
                label: 'Bool',
                type: 'boolean',
                name: 'b',
              },
              {
                label: 'Enum Select Multiple',
                type: 'enum',
                name: 'esm',
                isMultiple: true,
                style: 'select',
                items: [
                  {
                    label: 'A',
                    value: 'a',
                  },
                  {
                    label: 'B',
                    value: 'b',
                  },
                  {
                    label: 'C',
                    value: 'c',
                  },
                ],
              },
              {
                label: 'Enum Select Single',
                type: 'enum',
                name: 'ess',
                style: 'select',
                items: [
                  {
                    label: 'A',
                    value: 'a',
                  },
                  {
                    label: 'B',
                    value: 'b',
                  },
                  {
                    label: 'C',
                    value: 'c',
                  },
                ],
              },
              {
                label: 'User',
                type: 'custom',
                options: {
                  resolver: {
                    type: 'userpicker',
                  },
                },
                name: 'user',
              },
            ]),
            parameters: {
              t: 'abcd',
              n: 1234,
              d: '02/02/2020',
              b: true,
              esm: ['a', 'c'],
              ess: 'b',
              user: 'u123i1431',
            },
          });

          await doSubmitForm();

          expect(onChange).toHaveBeenCalledWith({
            t: 'abcd',
            n: 1234,
            d: '02/02/2020',
            b: true,
            esm: ['a', 'c'],
            ess: 'b',
            user: 'u123i1431',
          });
        });

        describe('Custom fields', () => {
          /**
           * This test ensures that custom fields can also be populated by parameters.
           *
           * Unfortunately, it will raise a warning due to the async state update that
           * happens within the component boundaries and that we can't wrap with `act()`.
           */
          it('should populate the fields with passed parameters', async () => {
            const { doSubmitForm } = await mountWithProviders({
              ...defaultProps,
              extensionProvider: createProvider([
                {
                  label: 'User',
                  type: 'custom',
                  options: {
                    resolver: {
                      type: 'userpicker',
                    },
                  },
                  name: 'user',
                },
              ]),
              parameters: {
                user: 'u123i1431',
              },
            });

            await flushPromises();
            await doSubmitForm();

            expect(onChange).toHaveBeenCalledWith({
              user: 'u123i1431',
            });
          });
        });

        describe('defaultValue', () => {
          it('should pass defaultValue to the fieldResolver', async () => {
            const pickerWithDefaultValue = jest.fn(async () => []);
            await mountWithProviders({
              ...defaultProps,
              extensionProvider: createProvider(
                [
                  {
                    label: 'User',
                    type: 'custom',
                    options: {
                      resolver: {
                        type: 'pickerWithDefaultValue',
                      },
                    },
                    name: 'user-lazy',
                  },
                ],
                {
                  modules: {
                    fields: {
                      custom: {
                        pickerWithDefaultValue: {
                          resolver: pickerWithDefaultValue,
                        },
                      },
                    },
                  },
                },
              ),
              parameters: {
                'user-lazy': 'akumar',
              },
            });

            expect(pickerWithDefaultValue).toHaveBeenCalledWith(
              undefined,
              'akumar',
            );
          });

          describe('prop: isMultiple', () => {
            it('should pass an array of defaultValues to the fieldResolver', async () => {
              const pickerWithDefaultValue = jest.fn(async () => []);
              await mountWithProviders({
                ...defaultProps,
                extensionProvider: createProvider(
                  [
                    {
                      label: 'User',
                      type: 'custom',
                      options: {
                        resolver: {
                          type: 'pickerWithDefaultValue',
                        },
                      },
                      name: 'user-lazy',
                      isMultiple: true,
                    },
                  ],
                  {
                    modules: {
                      fields: {
                        custom: {
                          pickerWithDefaultValue: {
                            resolver: pickerWithDefaultValue,
                          },
                        },
                      },
                    },
                  },
                ),
                parameters: {
                  'user-lazy': ['akumar', 'llemos', 'rnabi', 'jquintana'],
                },
              });

              expect(pickerWithDefaultValue).toHaveBeenCalledWith(undefined, [
                'akumar',
                'llemos',
                'rnabi',
                'jquintana',
              ]);
            });
          });
        });
      });

      describe('validate', () => {
        describe('required', () => {
          describe('text/number', () => {
            it('should fail if empty string is passed', () => {
              const textField: FieldDefinition = {
                label: 'Text',
                type: 'string',
                name: 't',
                isRequired: true,
              };
              expect(validate<string>(textField, '')).toBe(
                ValidationError.Required,
              );
              expect(validate<string>(textField, '0')).toBe(undefined);
              expect(validate<string>(textField, 'false')).toBe(undefined);
            });
          });

          describe('enum', () => {
            describe('isMultiple = true', () => {
              it('should fail if empty array is passed', () => {
                const enumField: FieldDefinition = {
                  label: 'Enum Select Single',
                  type: 'enum',
                  name: 'ess',
                  style: 'select',
                  isMultiple: true,
                  items: [
                    {
                      label: 'A',
                      value: 'a',
                    },
                    {
                      label: 'B',
                      value: 'b',
                    },
                    {
                      label: 'C',
                      value: 'c',
                    },
                  ],
                  isRequired: true,
                };

                expect(validate<string[]>(enumField, [])).toBe(
                  ValidationError.Required,
                );
                expect(
                  validate<string[]>(enumField, ['0']),
                ).toBe(undefined);
                expect(
                  validate<string[]>(enumField, ['false']),
                ).toBe(undefined);
              });
            });

            describe('isMultiple = false', () => {
              it('should fail if empty string is passed', () => {
                const enumField: FieldDefinition = {
                  label: 'Enum Select Single',
                  type: 'enum',
                  name: 'ess',
                  style: 'select',
                  isMultiple: false,
                  items: [
                    {
                      label: 'A',
                      value: 'a',
                    },
                    {
                      label: 'B',
                      value: 'b',
                    },
                    {
                      label: 'C',
                      value: 'c',
                    },
                  ],
                  isRequired: true,
                };

                expect(validate<string>(enumField, '')).toBe(
                  ValidationError.Required,
                );
                expect(validate<string>(enumField, '0')).toBe(undefined);
                expect(validate<string>(enumField, 'false')).toBe(undefined);
              });
            });
          });
        });
      });

      describe('should focus on the first visible field', () => {
        it('should work on text field', async () => {
          const { wrapper } = await mountWithProviders({
            ...defaultProps,
            extensionProvider: createProvider([
              {
                label: 'Text',
                type: 'string',
                name: 't',
                isHidden: true,
              },
              {
                label: 'Text',
                type: 'string',
                name: 't2',
              },
            ]),
            parameters: {},
          });

          const focusedField = wrapper.find('input[autoFocus=true]');

          expect(focusedField.prop('name')).toBe('t2');
        });

        it('should work on number field', async () => {
          const { wrapper } = await mountWithProviders({
            ...defaultProps,
            extensionProvider: createProvider([
              {
                label: 'Text',
                type: 'string',
                name: 't',
                isHidden: true,
              },
              {
                label: 'Text',
                type: 'number',
                name: 'n2',
              },
            ]),
            parameters: {},
          });

          const focusedField = wrapper.find('input[autoFocus=true]');

          expect(focusedField.prop('name')).toBe('n2');
        });

        it('should work on select field', async () => {
          const { wrapper } = await mountWithProviders({
            ...defaultProps,
            extensionProvider: createProvider([
              {
                label: 'Text',
                type: 'string',
                name: 't',
                isHidden: true,
              },
              {
                label: 'Text',
                type: 'string',
                name: 't2',
                isHidden: true,
              },
              {
                type: 'enum',
                label: 'My enum field',
                style: 'select',
                name: 'list',
                items: [],
              },
            ]),
            parameters: {},
          });

          const focusedField = wrapper.find('Select[autoFocus=true]');

          expect(focusedField.prop('name')).toBe('list');
        });

        it('should work on custom field', async () => {
          const { wrapper } = await mountWithProviders({
            ...defaultProps,
            extensionProvider: createProvider([
              {
                label: 'Text',
                type: 'string',
                name: 't',
                isHidden: true,
              },
              {
                label: 'Text',
                type: 'string',
                name: 't2',
                isHidden: true,
              },
              {
                label: 'My text field',
                type: 'custom',
                options: {
                  resolver: {
                    type: 'userpicker',
                  },
                },
                name: 'user',
              },
            ]),
            parameters: {},
          });

          const focusedField = wrapper.find('Select[autoFocus=true]');

          expect(focusedField.prop('name')).toBe('user');
        });

        it('should work on fieldsets', async () => {
          const { wrapper } = await mountWithProviders({
            ...defaultProps,
            extensionProvider: createProvider([
              {
                label: 'Text',
                type: 'string',
                name: 't',
                isHidden: true,
              },
              {
                label: 'CQL',
                name: 'cql',
                type: 'fieldset',
                options: {
                  isDynamic: true,
                  transformer: {
                    type: 'missing-group',
                  },
                },
                fields: [
                  {
                    name: 'label',
                    label: 'Label',
                    type: 'string',
                  },
                ],
              } as Fieldset,
            ]),
            parameters: {},
          });

          const focusedField = wrapper.find('input[autoFocus=true]');

          expect(focusedField.prop('name')).toBe('cql.label');
        });
      });
    });
  });
};

createConfigPanelTestSuite({ autoSave: true });
createConfigPanelTestSuite({ autoSave: false });
