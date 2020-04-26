import React from 'react';
import { IntlProvider } from 'react-intl';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';

import {
  ExtensionManifest,
  ExtensionModule,
  ExtensionModuleNodes,
  combineExtensionProviders,
  DefaultExtensionProvider,
  Option,
  EnumField,
  FieldDefinition,
} from '@atlaskit/editor-common/extensions';

import { flushPromises } from '../../__helpers/utils';

import { FieldTypeError, ValidationError } from '../../../ui/ConfigPanel/types';
import { validate } from '../../../ui/ConfigPanel/utils';
import ConfigPanel from '../../../ui/ConfigPanel';

const createManifest = (testFields: FieldDefinition[]): ExtensionManifest => {
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
      getFieldsDefinition: () => Promise.resolve(testFields),
    },
  };

  return {
    title: 'Editor test extensions',
    type: 'twp.editor.test',
    key: 'just-for-tests',
    description: 'Extensions generated for testing purposes',
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
};

const createProvider = (fields: FieldDefinition[]) => {
  return combineExtensionProviders([
    new DefaultExtensionProvider([createManifest(fields)]),
  ]);
};

type Wrapper<T = any> = ReactWrapper<T, any, any>;
type MountResult<T> = {
  wrapper: Wrapper<T>;
  doSubmitForm: () => void;
};

const eventuallyFind = (
  wrapper: Wrapper,
  selector: string,
): Promise<Wrapper> => {
  return new Promise(resolve => {
    const loop = () => {
      setTimeout(() => {
        wrapper.update();
        const element = wrapper.find(selector);
        if (element.length === 0) {
          return loop();
        }
        resolve(element);
      }, 50);
    };

    loop();
  });
};

type Props = React.ComponentProps<typeof ConfigPanel>;

const mountWithProviders = async (
  props: Props,
): Promise<MountResult<Props>> => {
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
};

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

const selectOption = (inputWrapper: any, option: Option) => {
  act(() => {
    inputWrapper.instance().selectOption(option);
    inputWrapper.simulate('blur');
  });
};

const createFakeFieldResolver = (items: { label: string; value: string }[]) => (
  searchTerm?: string,
) => {
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

const userPicker = createFakeFieldResolver([
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
      let onChange = jest.fn();

      const defaultProps = {
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

      describe('Native types', () => {
        describe('type: string', () => {
          let mountResult: MountResult<Props>;
          beforeEach(async () => {
            mountResult = await mountWithProviders({
              ...defaultProps,
              extensionProvider: createProvider([
                {
                  label: 'My text field',
                  type: 'string',
                  name: 't',
                },
              ]),
            });
          });

          it('should create a TextField with type text', () => {
            const { wrapper } = mountResult;

            const field = wrapper.find('Textfield');

            expect(field.length).toBe(1);
            expect(field.prop('type')).toBe('text');
          });

          it('should serialize to {name: value}', async () => {
            const { wrapper, doSubmitForm } = mountResult;

            const field = wrapper.find('Textfield');

            typeInField(field.find('input'), 'content');

            await doSubmitForm();

            expect(onChange).toHaveBeenCalledWith({ t: 'content' });
          });

          describe('prop: isRequired', () => {
            beforeEach(async () => {
              mountResult = await mountWithProviders({
                ...defaultProps,
                extensionProvider: createProvider([
                  {
                    label: 'My text field',
                    type: 'string',
                    name: 't',
                    isRequired: true,
                  },
                ]),
              });
            });

            it('should show error and skip submission if not filled', async () => {
              const { wrapper, doSubmitForm } = mountResult;

              await doSubmitForm();

              expect(onChange).toBeCalledTimes(0);
              expect(wrapper.find('FieldMessages').prop('error')).toBe(
                'required',
              );
            });
          });
        });

        describe('type: number', () => {
          let mountResult: MountResult<Props>;
          beforeEach(async () => {
            mountResult = await mountWithProviders({
              ...defaultProps,
              extensionProvider: createProvider([
                {
                  label: 'My number field',
                  type: 'number',
                  name: 'n',
                },
              ]),
            });
          });

          it('should create a TextField with type number', () => {
            const { wrapper } = mountResult;

            const field = wrapper.find('Textfield');

            expect(field.length).toBe(1);
            expect(field.prop('type')).toBe('number');
          });

          it('should serialize to {name: value}', async () => {
            const { wrapper, doSubmitForm } = mountResult;

            const field = wrapper.find('Textfield');

            typeInField(field.find('input'), '12345');

            await doSubmitForm();

            expect(onChange).toHaveBeenCalledWith({ n: '12345' });
          });

          describe('prop: isRequired', () => {
            beforeEach(async () => {
              mountResult = await mountWithProviders({
                ...defaultProps,
                extensionProvider: createProvider([
                  {
                    label: 'My number field',
                    type: 'number',
                    name: 'n',
                    isRequired: true,
                  },
                ]),
              });
            });

            it('should show error and skip submission if not filled', async () => {
              const { wrapper, doSubmitForm } = mountResult;

              await doSubmitForm();

              expect(onChange).toBeCalledTimes(0);
              expect(wrapper.find('FieldMessages').prop('error')).toBe(
                'required',
              );
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

          it('should serialize to {name: value}', async () => {
            const { doSubmitForm } = mountResult;
            await doSubmitForm();

            expect(onChange).toHaveBeenCalledWith({
              creationDate: '02/02/2020',
            });
          });

          describe('prop: isRequired', () => {
            beforeEach(async () => {
              mountResult = await mountWithProviders({
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
            });

            it('should show error and skip submission if not filled', async () => {
              const { wrapper, doSubmitForm } = mountResult;

              await doSubmitForm();

              expect(onChange).toBeCalledTimes(0);
              expect(wrapper.find('FieldMessages').prop('error')).toBe(
                'required',
              );
            });
          });
        });

        describe('type: boolean', () => {
          let mountResult: MountResult<Props>;
          beforeEach(async () => {
            mountResult = await mountWithProviders({
              ...defaultProps,
              extensionProvider: createProvider([
                {
                  label: 'My boolean field',
                  type: 'boolean',
                  name: 'canDoSomething',
                },
              ]),
            });
          });

          it('should create a Checkbox', () => {
            const { wrapper } = mountResult;

            const field = wrapper.find('Checkbox');

            expect(field.length).toBe(1);
          });

          it('should serialize to {name: value}', async () => {
            const { wrapper, doSubmitForm } = mountResult;

            const field = wrapper.find('Checkbox');

            toggleCheckbox(field.find('input'));

            await doSubmitForm();

            expect(onChange).toHaveBeenCalledWith({ canDoSomething: true });
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

          it('should serialize to {name: value}', async () => {
            const { wrapper, doSubmitForm } = mountResult;

            const field = wrapper.find('Select');

            selectOption(field, { label: 'A', value: 'a' });

            await doSubmitForm();

            expect(onChange).toHaveBeenCalledWith({ list: 'a' });
          });

          describe('prop: isRequired', () => {
            beforeEach(async () => {
              mountResult = await mountEnumWithProps({ isRequired: true });
            });

            it('should show error and skip submission if not filled', async () => {
              const { wrapper, doSubmitForm } = mountResult;

              await doSubmitForm();

              expect(onChange).toBeCalledTimes(0);
              expect(wrapper.find('FieldMessages').prop('error')).toBe(
                'required',
              );
            });
          });

          describe('prop: style="radio"', () => {
            beforeEach(async () => {
              mountResult = await mountEnumWithProps({ style: 'radio' });
            });

            it('should serialize to {name: a}', async () => {
              const { wrapper, doSubmitForm } = mountResult;

              const field = wrapper.find('RadioGroup');

              toggleCheckbox(field.find('input').at(0));

              await doSubmitForm();

              expect(onChange).toHaveBeenCalledWith({ list: 'a' });
            });

            describe('prop: isRequired', () => {
              beforeEach(async () => {
                mountResult = await mountEnumWithProps({
                  style: 'radio',
                  isRequired: true,
                });
              });

              it('should show error and skip submission if not filled', async () => {
                const { wrapper, doSubmitForm } = mountResult;

                await doSubmitForm();

                expect(onChange).toBeCalledTimes(0);
                expect(wrapper.find('FieldMessages').prop('error')).toBe(
                  'required',
                );
              });
            });
          });

          describe('prop: isMultiple', () => {
            beforeEach(async () => {
              mountResult = await mountEnumWithProps({ isMultiple: true });
            });

            it('should serialize to {name: [c, b]}', async () => {
              const { wrapper, doSubmitForm } = mountResult;

              const field = wrapper.find('Select');

              selectOption(field, { label: 'C', value: 'c' });
              selectOption(field, { label: 'B', value: 'b' });

              await doSubmitForm();

              expect(onChange).toHaveBeenCalledWith({ list: ['c', 'b'] });
            });

            describe('prop: isRequired', () => {
              beforeEach(async () => {
                mountResult = await mountEnumWithProps({
                  isMultiple: true,
                  isRequired: true,
                });
              });

              it('should show error and skip submission if not filled', async () => {
                const { wrapper, doSubmitForm } = mountResult;

                await doSubmitForm();

                expect(onChange).toBeCalledTimes(0);
                expect(wrapper.find('FieldMessages').prop('error')).toBe(
                  'required',
                );
              });
            });

            describe('prop: style="checkbox"', () => {
              beforeEach(async () => {
                mountResult = await mountEnumWithProps({
                  isMultiple: true,
                  style: 'checkbox',
                });
              });

              it('should serialize to {name: [a, c]}', async () => {
                const { wrapper, doSubmitForm } = mountResult;

                const field = wrapper.find('Checkbox');

                toggleCheckbox(field.at(0).find('input'));
                toggleCheckbox(field.at(2).find('input'));

                await doSubmitForm();

                expect(onChange).toHaveBeenCalledWith({ list: ['a', 'c'] });
              });
            });

            describe('prop: style="radio"', () => {
              beforeEach(async () => {
                mountResult = await mountEnumWithProps({
                  isMultiple: true,
                  style: 'radio' as any /* set to any because is invalid */,
                });
              });

              it('should show an error', () => {
                const { wrapper } = mountResult;
                expect(wrapper.find('FieldMessages').prop('error')).toBe(
                  FieldTypeError.isMultipleAndRadio,
                );
              });
            });
          });
        });
      });

      describe('Custom types', () => {
        describe('Pickers', () => {
          let mountResult: MountResult<Props>;

          beforeEach(async () => {
            mountResult = await mountWithProviders({
              ...defaultProps,
              extensionProvider: createProvider([
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
            });
          });

          it('should create a Select', () => {
            const { wrapper } = mountResult;

            const field = wrapper.find('Select');

            expect(field.length).toBe(1);
          });

          it('should serialize to {name: value}', async () => {
            const { wrapper, doSubmitForm } = mountResult;

            const field = wrapper.find('Select');

            selectOption(field, { label: 'Leandro', value: 'u123i1431' });

            await doSubmitForm();

            expect(onChange).toHaveBeenCalledWith({ user: 'u123i1431' });
          });

          describe('prop: isRequired', () => {
            beforeEach(async () => {
              mountResult = await mountWithProviders({
                ...defaultProps,
                extensionProvider: createProvider([
                  {
                    label: 'My text field',
                    type: 'custom',
                    options: {
                      resolver: {
                        type: 'userpicker',
                      },
                    },
                    name: 'user',
                    isRequired: true,
                  },
                ]),
              });
            });

            it('should show error and skip submission if not filled', async () => {
              const { wrapper, doSubmitForm } = mountResult;

              await doSubmitForm();

              expect(onChange).toBeCalledTimes(0);
              expect(wrapper.find('FieldMessages').prop('error')).toBe(
                'required',
              );
            });
          });

          describe('prop: isMultiple', () => {
            beforeEach(async () => {
              mountResult = await mountWithProviders({
                ...defaultProps,
                extensionProvider: createProvider([
                  {
                    label: 'My text field',
                    type: 'custom',
                    options: {
                      resolver: {
                        type: 'userpicker',
                      },
                    },
                    name: 'user',
                    isMultiple: true,
                  },
                ]),
              });
            });
            it('should serialize to {name: [value]}', async () => {
              const { wrapper, doSubmitForm } = mountResult;

              const field = wrapper.find('Select');

              selectOption(field, { label: 'Leandro', value: 'u123i1431' });
              selectOption(field, { label: 'Rodrigo', value: 'j78635820' });

              await doSubmitForm();

              expect(onChange).toHaveBeenCalledWith({
                user: ['u123i1431', 'j78635820'],
              });
            });
          });
        });
      });

      describe('Fieldset', () => {
        let mountResult: MountResult<Props>;
        const createFieldSet = (
          isDynamic: boolean,
          type: string = 'piped-group',
        ): FieldDefinition => {
          return {
            label: 'My settings',
            name: 'settings',
            type: 'fieldset',
            options: {
              isDynamic,
              transformer: {
                type,
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
          };
        };

        describe('All', () => {
          beforeEach(async () => {
            mountResult = await mountWithProviders({
              ...defaultProps,
              extensionProvider: createProvider([createFieldSet(false)]),
            });
          });

          it('should create a group of fields', () => {
            const { wrapper } = mountResult;

            expect(wrapper.find('Textfield').length).toBe(2);
            expect(wrapper.find('Select').length).toBe(1);
          });

          it('should serialize to Q = content | depth = 12 | USER = u123i1431', async () => {
            const { wrapper, doSubmitForm } = mountResult;

            typeInField(
              wrapper
                .find('Textfield')
                .at(0)
                .find('input'),
              'content',
            );

            typeInField(
              wrapper
                .find('Textfield')
                .at(1)
                .find('input'),
              '12',
            );

            selectOption(wrapper.find('Select'), {
              label: 'Leandro',
              value: 'u123i1431',
            });

            await doSubmitForm();

            expect(onChange).toHaveBeenCalledWith({
              settings: 'Q = content | depth = 12 | USER = u123i1431',
            });
          });

          it('should log to the console if the serializer fails', async () => {
            const consoleError = jest
              .spyOn(console, 'error')
              .mockImplementation(() => {});

            const { wrapper, doSubmitForm } = await mountWithProviders({
              ...defaultProps,
              extensionProvider: createProvider([
                createFieldSet(false, 'broken-group'),
              ]),
            });

            typeInField(
              wrapper
                .find('Textfield')
                .at(0)
                .find('input'),
              'content',
            );

            await doSubmitForm();

            expect(consoleError).toHaveBeenCalledWith(
              'Error serializing parameters',
              new Error('Something is broken'),
            );

            consoleError.mockClear();
          });

          it('should deserialize to {Q: content, depth: 12, USER: u123i1431 }', async () => {
            const { doSubmitForm } = await mountWithProviders({
              ...defaultProps,
              extensionProvider: createProvider([createFieldSet(false)]),
              parameters: {
                settings: 'Q = content | depth = 12 | USER = u123i1431',
              },
            });

            await doSubmitForm();

            expect(onChange).toHaveBeenCalledWith({
              settings: 'Q = content | depth = 12 | USER = u123i1431',
            });
          });

          it('should log to the console if the deserializer fails', async () => {
            const consoleError = jest
              .spyOn(console, 'error')
              .mockImplementation(() => {});

            mountResult = await mountWithProviders({
              ...defaultProps,
              parameters: {
                settings: 'this value will fail',
              },
              extensionProvider: createProvider([
                createFieldSet(false, 'broken-group'),
              ]),
            });

            expect(consoleError).toHaveBeenCalledWith(
              'Error deserializing parameters',
              new Error('Something is broken'),
            );

            consoleError.mockClear();
          });
        });

        describe('Dynamic', () => {
          const clickAddFieldButton = (wrapper: Wrapper) => {
            wrapper
              .find('Button[testId="add-more"]')
              .first()
              .simulate('click');
            wrapper.update();
          };

          const hasAddButton = (wrapper: Wrapper) => {
            return wrapper.find('Button[testId="add-more"]').exists();
          };

          const getAllExistingVisibleFieldNames = (wrapper: Wrapper) => {
            return wrapper.find('Field').map(node => node.prop('name'));
          };

          beforeEach(async () => {
            mountResult = await mountWithProviders({
              ...defaultProps,
              extensionProvider: createProvider([createFieldSet(true)]),
            });
          });

          it('should show only 1 field when first rendering', () => {
            const { wrapper } = mountResult;

            expect(getAllExistingVisibleFieldNames(wrapper)).toEqual(['Q']);
          });

          it('should allow adding more fields when clicking the + button', () => {
            const { wrapper } = mountResult;

            expect(getAllExistingVisibleFieldNames(wrapper)).toEqual(['Q']);

            clickAddFieldButton(wrapper);

            selectOption(
              wrapper.find('[testId="fieldset-actions"]').find('Select'),
              {
                label: 'User',
                value: 'USER',
              },
            );
            wrapper.update();

            expect(getAllExistingVisibleFieldNames(wrapper)).toEqual([
              'Q',
              'USER',
            ]);

            expect(hasAddButton(wrapper)).toBe(true);
          });

          it('should remove the add button after all fields are added', async () => {
            const { wrapper } = await mountWithProviders({
              ...defaultProps,
              extensionProvider: createProvider([createFieldSet(true)]),
              parameters: {
                settings: 'Q = content | USER = u123i1431',
              },
            });

            expect(getAllExistingVisibleFieldNames(wrapper)).toEqual([
              'Q',
              'USER',
            ]);

            expect(hasAddButton(wrapper)).toBe(true);

            clickAddFieldButton(wrapper);

            selectOption(
              wrapper.find('[testId="fieldset-actions"]').find('Select'),
              {
                label: 'Depth',
                value: 'depth',
              },
            );

            wrapper.update();

            expect(getAllExistingVisibleFieldNames(wrapper)).toEqual([
              'Q',
              'USER',
              'depth',
            ]);

            expect(hasAddButton(wrapper)).toBe(false);
          });

          it('should show all fields that have parameters passed down when first rendering', async () => {
            const { wrapper } = await mountWithProviders({
              ...defaultProps,
              extensionProvider: createProvider([createFieldSet(true)]),
              parameters: {
                settings: 'Q = content | depth = 1 | USER = u123i1431',
              },
            });

            expect(getAllExistingVisibleFieldNames(wrapper)).toEqual([
              'Q',
              'depth',
              'USER',
            ]);

            expect(hasAddButton(wrapper)).toBe(false);
          });

          it('should allow to remove fields', async () => {
            const { wrapper } = await mountWithProviders({
              ...defaultProps,
              extensionProvider: createProvider([createFieldSet(true)]),
              parameters: {
                settings: 'Q = content | depth = 1 | USER = u123i1431',
              },
            });

            expect(getAllExistingVisibleFieldNames(wrapper)).toEqual([
              'Q',
              'depth',
              'USER',
            ]);

            expect(hasAddButton(wrapper)).toBe(false);

            wrapper
              .find('RemovableField')
              .find('[testId="remove-field-USER"]')
              .first()
              .simulate('click');
            wrapper.update();

            expect(getAllExistingVisibleFieldNames(wrapper)).toEqual([
              'Q',
              'depth',
            ]);

            expect(hasAddButton(wrapper)).toBe(true);
          });
        });
      });

      describe('Parameters', () => {
        let mountResult: MountResult<Props>;
        beforeEach(async () => {
          mountResult = await mountWithProviders({
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
        });

        it('should populate the fields with passed parameters', async () => {
          const { doSubmitForm } = mountResult;

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
          beforeEach(async () => {
            mountResult = await mountWithProviders({
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
          });

          /**
           * This test ensures that custom fields can also be populated by parameters.
           *
           * Unfortunately, it will raise a warning due to the async state update that
           * happens within the component boundaries and that we can't wrap with `act()`.
           */
          it('should populate the fields with passed parameters', async () => {
            const { doSubmitForm } = mountResult;

            await flushPromises();

            await doSubmitForm();

            expect(onChange).toHaveBeenCalledWith({
              user: 'u123i1431',
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
    });
  });
};

createConfigPanelTestSuite({ autoSave: true });
createConfigPanelTestSuite({ autoSave: false });
