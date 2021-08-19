import { mockCreateAnalyticsEvent } from '@atlaskit/editor-test-helpers/mock-analytics-next';

import React from 'react';
import { IntlProvider } from 'react-intl';
import { mount, ReactWrapper } from 'enzyme';

import {
  ExtensionManifest,
  EnumField,
  BooleanField,
  StringField,
  NumberField,
  FieldDefinition,
  Fieldset,
  Parameters,
  NestedFieldDefinition,
} from '@atlaskit/editor-common/extensions';

import { flushPromises } from '../../__helpers/utils';

import { FieldTypeError, ValidationError } from '../../../ui/ConfigPanel/types';
import { validate } from '../../../ui/ConfigPanel/utils';
import ConfigPanel from '../../../ui/ConfigPanel';

import {
  MountResult,
  Props,
  Wrapper,
  createOptionResolver,
  createProvider,
  eventuallyFind,
  getFieldErrors,
  mockJiraSmartUserProvider,
  mountWithProviders,
  resolveOption,
  silenceActErrors,
  toggleCheckbox,
  typeInField,
} from './_ConfigPanel_helpers';

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

const mockUserPickerResolver = createOptionResolver([
  { label: 'Leandro', value: 'u123i1431' },
  { label: 'Rifat', value: 'u456y1987' },
  { label: 'Rodrigo', value: 'j78635820' },
  { label: 'Eduard', value: 'h76543890' },
]);

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
      const creationDate = new Date('02/22/2020').toISOString();
      // TODO: there are many warnings due to hooks usage and async code,
      //   these should be resolved by the next react update
      silenceActErrors();

      afterEach(() => {
        onChange.mockClear();
      });

      async function expectFieldMessageRequiredOnSubmit<T>({
        wrapper,
        trySubmit,
      }: Pick<MountResult<T>, 'wrapper' | 'trySubmit'>) {
        expect(getFieldErrors(wrapper)).toStrictEqual([]);
        await trySubmit();
        expect(onChange).toBeCalledTimes(0);
        expect(getFieldErrors(wrapper)).toStrictEqual(['required']);
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

        it('should fire an "opened" when extensionManifest is initially loaded', async () => {
          await mountBasic();

          expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
            action: 'opened',
            actionSubject: 'configPanel',
            eventType: 'ui',
            attributes: {
              extensionType: 'twp.editor.test',
              extensionKey: 'just-for-tests',
            },
          });
        });

        it('should fire an "closed" event on unmount', async () => {
          (await mountBasic()).wrapper.unmount();

          expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
            action: 'closed',
            actionSubject: 'configPanel',
            eventType: 'ui',
            attributes: {
              extensionType: 'twp.editor.test',
              extensionKey: 'just-for-tests',
            },
          });
        });
      });

      describe('UI States', () => {
        describe('Loading', () => {
          it('should show a spinner before the manifest is loaded', async () => {
            const provider = createProvider([]);

            // never resolves the manifest
            provider.getExtension = () => new Promise((resolve) => {});

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
            const extensionProvider = createProvider(async () => []);
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
            const extensionProvider = createProvider(async () => {
              throw new Error('Error loading fields');
            });

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
              async () => [],
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

      describe('Expand', () => {
        it('should serialize a correct object', async () => {
          const { wrapper, trySubmit } = await mountWithProviders({
            ...defaultProps,
            extensionProvider: createProvider([
              {
                name: 'expandField',
                type: 'expand',
                label: 'awesome expand field',
                fields: [
                  {
                    name: 'textField',
                    type: 'string',
                    label: 'Free text',
                  },
                  {
                    type: 'enum',
                    label: 'My enum field',
                    style: 'select',
                    name: 'enumList',
                    defaultValue: 'a',
                    items: [
                      { label: 'label-A', value: 'a' },
                      { label: 'label-B', value: 'b' },
                      { label: 'label-C', value: 'c' },
                    ],
                  },
                ],
              },
            ]),
          });

          const field = wrapper.find('Textfield');
          typeInField(field.find('input'), 'hello');
          await trySubmit();
          await flushPromises();
          expect(onChange).toHaveBeenCalledWith({
            expandField: { textField: 'hello', enumList: 'a' },
          });
        });
      });

      describe('Tabs', () => {
        it('should serialize a correct object', async () => {
          const { wrapper, trySubmit } = await mountWithProviders({
            ...defaultProps,
            extensionProvider: createProvider([
              {
                type: 'tab-group',
                label: 'Tab type',
                name: 'tabGroup',
                defaultTab: 'optionB',
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
                        fields: [
                          {
                            name: 'textFieldOne',
                            type: 'string',
                            label: 'Free text',
                          },
                          {
                            type: 'enum',
                            label: 'My first enum field',
                            style: 'select',
                            name: 'enumListA',
                            defaultValue: 'a',
                            items: [
                              { label: 'label-A', value: 'a' },
                              { label: 'label-B', value: 'b' },
                              { label: 'label-C', value: 'c' },
                            ],
                          },
                        ],
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
                      {
                        type: 'enum',
                        label: 'My enum field',
                        style: 'select',
                        name: 'enumListB',
                        defaultValue: 'b',
                        items: [
                          { label: 'label-A', value: 'a' },
                          { label: 'label-B', value: 'b' },
                          { label: 'label-C', value: 'c' },
                        ],
                      },
                    ],
                  },
                ],
              },
            ]),
          });

          const tab1 = wrapper.find('#configPanelTabs-tabGroup-0');
          const tab2 = wrapper.find('#configPanelTabs-tabGroup-1');

          // Tab 2 should be selected by default.
          expect(tab1.prop('aria-selected')).toEqual(false);
          expect(tab2.prop('aria-selected')).toEqual(true);

          // table 2 should be displayed
          expect(wrapper.find('#configPanelTabs-tabGroup-0-tab').length).toBe(
            0,
          );
          expect(
            wrapper.find('#configPanelTabs-tabGroup-1-tab').prop('hidden'),
          ).toBeUndefined();

          typeInField(
            wrapper.find('#configPanelTabs-tabGroup-1-tab Textfield input'),
            'tab 2 text',
          );

          // click on tab1
          tab1.simulate('click');
          wrapper.update();

          expect(
            wrapper.find('#configPanelTabs-tabGroup-0-tab').prop('hidden'),
          ).toBeUndefined();
          expect(
            wrapper.find('#configPanelTabs-tabGroup-1-tab').prop('hidden'),
          ).toBe(true);

          wrapper
            .find('button[data-testid="form-expand-toggle"]')
            .simulate('click');
          wrapper.update();

          typeInField(
            wrapper.find('#configPanelTabs-tabGroup-0-tab Textfield input'),
            'tab 1 text',
          );

          tab2.simulate('click');

          await trySubmit();
          await flushPromises();

          expect(onChange).toHaveBeenCalledWith({
            tabGroup: {
              optionA: {
                expandField: {
                  textFieldOne: 'tab 1 text',
                  enumListA: 'a',
                },
              },
              optionB: {
                textFieldTwo: 'tab 2 text',
                enumListB: 'b',
              },
            },
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
            const { wrapper, trySubmit } = await mountString({
              name: 'foo',
            });
            const field = wrapper.find('Textfield');
            typeInField(field.find('input'), 'bar');
            await trySubmit();

            expect(onChange).toHaveBeenCalledWith({ foo: 'bar' });
          });

          describe('prop: isRequired', () => {
            it('should show error and skip submission if not filled', async () => {
              const { wrapper, trySubmit } = await mountString({
                isRequired: true,
              });

              await expectFieldMessageRequiredOnSubmit({
                wrapper,
                trySubmit,
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
              const { wrapper, trySubmit } = await mountString({
                name: 'foo',
                style: 'multiline',
              });
              const field = wrapper.find('textarea');
              typeInField(field, 'bar');
              await trySubmit();

              expect(onChange).toHaveBeenCalledWith({ foo: 'bar' });
            });

            describe('prop: isRequired', () => {
              it('should show error and skip submission if not filled', async () => {
                const { wrapper, trySubmit } = await mountString({
                  style: 'multiline',
                  isRequired: true,
                });

                await expectFieldMessageRequiredOnSubmit({
                  wrapper,
                  trySubmit,
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
            const { wrapper, trySubmit } = await mountNumber();

            typeInField(wrapper.find('input[autoFocus=true]'), '123');
            await trySubmit();

            expect(onChange).toHaveBeenCalledWith({ n: 123 });
          });

          if (autoSave) {
            it('should show an InvalidError and do partial submit for invalid values', async () => {
              const { wrapper, trySubmit } = await mountNumber();

              typeInField(
                wrapper.find('input[autoFocus=true]'),
                'not a number',
              );
              await trySubmit();

              expect(onChange).toBeCalledWith({});
              expect(getFieldErrors(wrapper)).toStrictEqual(['invalid']);
            });
          } else {
            it('should show an InvalidError and skip submission for invalid values', async () => {
              const { wrapper, trySubmit } = await mountNumber();

              typeInField(
                wrapper.find('input[autoFocus=true]'),
                'not a number',
              );
              await trySubmit();

              expect(onChange).toBeCalledTimes(0);
              expect(getFieldErrors(wrapper)).toStrictEqual(['invalid']);
            });
          }

          describe('prop: isRequired', () => {
            it('should show error and skip submission if not filled', async () => {
              const { wrapper, trySubmit } = await mountNumber({
                isRequired: true,
              });

              await expectFieldMessageRequiredOnSubmit({
                wrapper,
                trySubmit,
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
                creationDate,
              },
            });
          });

          it('should create a DatePicker', () => {
            const { wrapper } = mountResult;
            const field = wrapper.find('DatePicker');

            expect(field.length).toBe(1);
          });

          it('should serialize to an object', async () => {
            const { trySubmit } = mountResult;
            await trySubmit();

            expect(onChange).toHaveBeenCalledWith({
              creationDate,
            });
          });

          describe('prop: isRequired', () => {
            it('should show error and skip submission if not filled', async () => {
              const { wrapper, trySubmit } = await mountWithProviders({
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
                trySubmit,
              });
            });
          });
        });

        describe('type: date-range', () => {
          const mountDateRangeWithParameters = async (
            params: Parameters,
            isRequired: boolean = false,
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
                  isRequired,
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
            const { trySubmit } = await mountDateRangeWithParameters({
              type: 'date-range',
              value: 'custom',
              from: '2020-10-05',
              to: '2020-10-22',
            });

            await trySubmit();

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
            const { wrapper, trySubmit } = await mountDateRangeWithParameters({
              type: 'date-range',
              value: 'custom',
              from: '2020-10-05',
              to: '2020-10-22',
            });

            const field = wrapper.find('RadioGroup');

            toggleCheckbox(field.find('input').at(1));

            await trySubmit();
            await flushPromises(); // TODO: why

            expect(onChange).toHaveBeenCalledWith({
              created: {
                type: 'date-range',
                value: 'now(-1d)',
                from: 'now(-1d)',
              },
            });

            toggleCheckbox(field.find('input').at(2));

            await trySubmit();
            await flushPromises(); // TODO: why

            expect(onChange).toHaveBeenCalledWith({
              created: {
                type: 'date-range',
                value: 'now(-1w)',
                from: 'now(-1w)',
              },
            });

            toggleCheckbox(field.find('input').at(3));

            await trySubmit();
            //await flushPromises(); // TODO: why not

            expect(onChange).toHaveBeenCalledWith({
              created: {
                type: 'date-range',
                value: 'now(-1M)',
                from: 'now(-1M)',
              },
            });
          });

          describe('prop: isRequired', () => {
            it('should not show validation error if not required on submit', async () => {
              const { wrapper, trySubmit } = await mountDateRangeWithParameters(
                {
                  type: 'date-range',
                  value: 'custom',
                },
              );

              await trySubmit();
              expect(getFieldErrors(wrapper)).toStrictEqual([]);
              expect(onChange).toHaveBeenCalledWith({
                created: {
                  type: 'date-range',
                  value: 'custom',
                  from: undefined,
                  to: undefined,
                },
              });
            });
            it('should show validation error if required on submit', async () => {
              const { wrapper, trySubmit } = await mountDateRangeWithParameters(
                {
                  type: 'date-range',
                  value: 'custom',
                },
                true,
              );
              await trySubmit();
              expect(getFieldErrors(wrapper)).toStrictEqual([
                'required',
                'required',
              ]);
            });
          });
        });

        describe('type: color', () => {
          let mountResult: MountResult<Props>;
          beforeEach(async () => {
            mountResult = await mountWithProviders({
              ...defaultProps,
              extensionProvider: createProvider([
                {
                  label: 'My color field',
                  type: 'color',
                  name: 'color-picker',
                },
              ]),
            });
          });

          afterEach(() => {
            onChange.mockClear();
          });

          it('should create a ColorPicker', () => {
            const { wrapper } = mountResult;
            const field = wrapper.find('ColorPicker');

            expect(field.length).toBe(1);
          });

          it('should serialize to an object', async () => {
            const clickColor = (wrapper: Wrapper<Props>) => {
              wrapper.find('ColorPicker button').simulate('click');
              wrapper
                .find('Color')
                .findWhere(
                  (node: ReactWrapper): boolean =>
                    node.prop('label') === 'Light Blue',
                )
                .find('button')
                .simulate('click');
            };
            const { wrapper, trySubmit } = mountResult;
            clickColor(wrapper);
            await trySubmit();

            expect(onChange).toHaveBeenCalledWith({
              'color-picker': '#7AB2FFFF',
            });
          });

          describe('prop: isRequired', () => {
            it('should show error and skip submission if not filled', async () => {
              const { wrapper, trySubmit } = await mountWithProviders({
                ...defaultProps,
                extensionProvider: createProvider([
                  {
                    label: 'My color field',
                    type: 'color',
                    name: 'color-picker',
                    isRequired: true,
                    defaultValue: undefined,
                  },
                ]),
              });

              onChange.mockClear();

              await expectFieldMessageRequiredOnSubmit({
                wrapper,
                trySubmit,
              });
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
            const field = wrapper.find('input[type="checkbox"]');

            expect(field.length).toBe(1);
          });

          it('should create a Checkbox when styled', async () => {
            const { wrapper } = await mountBoolean({ style: 'checkbox' });
            const field = wrapper.find('input[type="checkbox"]');

            expect(field.length).toBe(1);
          });

          it('should create a Toggle when styled', async () => {
            const { wrapper } = await mountBoolean({ style: 'toggle' });
            const field = wrapper.find('ForwardRef(Toggle)');

            expect(field.length).toBe(1);
          });

          it('should serialize to an object', async () => {
            const { wrapper, trySubmit } = await mountBoolean({
              name: 'foo',
            });
            const field = wrapper.find('input[type="checkbox"]');
            toggleCheckbox(field);
            if (!autoSave) {
              await trySubmit();
            } else {
              await flushPromises();
            }
            expect(onChange).toHaveBeenCalledWith({ foo: true });
          });

          describe('prop: isRequired', () => {
            it('should show error and skip submission if not filled', async () => {
              const { wrapper, trySubmit } = await mountBoolean({
                isRequired: true,
                defaultValue: undefined,
              });

              await expectFieldMessageRequiredOnSubmit({
                wrapper,
                trySubmit,
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
            const { wrapper, trySubmit } = mountResult;

            expect(await resolveOption(wrapper, 'A')).toBe(true);
            await trySubmit();

            expect(onChange).toHaveBeenCalledWith({ list: 'a' });
          });

          it('can be cleared if field is optional', async () => {
            const { wrapper } = mountResult;

            expect(await resolveOption(wrapper, 'A')).toBe(true);
            wrapper.update();
            const field = wrapper.find('Select');
            const clearButton = field.find('span[aria-label="clear"]');
            expect(clearButton.length).toBe(1);
          });

          describe('prop: isRequired', () => {
            it('should show error and skip submission if not filled', async () => {
              const { wrapper, trySubmit } = await mountEnumWithProps({
                isRequired: true,
              });

              await expectFieldMessageRequiredOnSubmit({
                wrapper,
                trySubmit,
              });
            });

            it('cannot be cleared if field is required and defaultValue is set', async () => {
              const { wrapper } = await mountEnumWithProps({
                isRequired: true,
                defaultValue: 'b',
              });

              expect(await resolveOption(wrapper, 'A')).toBe(true);
              wrapper.update();
              const field = wrapper.find('Select');
              const clearButton = field.find('span[aria-label="clear"]');
              expect(clearButton.length).toBe(0);
            });
          });

          describe('prop: defaultValue', () => {
            it('cannot be cleared if defaultValue is set', async () => {
              const { wrapper } = await mountEnumWithProps({
                defaultValue: 'b',
              });
              expect(await resolveOption(wrapper, 'A')).toBe(true);
              wrapper.update();
              const field = wrapper.find('Select');
              const clearButton = field.find('span[aria-label="clear"]');
              expect(clearButton.length).toBe(0);
            });

            it('can be cleared if defaultValue is set but allows multiple values', async () => {
              const { wrapper } = await mountEnumWithProps({
                defaultValue: ['b'],
                isMultiple: true,
              });
              expect(await resolveOption(wrapper, 'A')).toBe(true);
              wrapper.update();
              const field = wrapper.find('Select');
              const clearButton = field.find('span[aria-label="clear"]');
              expect(clearButton.length).toBe(1);
            });
          });

          describe('prop: style="radio"', () => {
            it('should serialize to {name: a}', async () => {
              const { wrapper, trySubmit } = await mountEnumWithProps({
                style: 'radio',
              });

              const field = wrapper.find('RadioGroup');

              toggleCheckbox(field.find('input').at(0));

              await trySubmit();

              expect(onChange).toHaveBeenCalledWith({ list: 'a' });
            });

            describe('prop: isRequired', () => {
              it('should show error and skip submission if not filled', async () => {
                const { wrapper, trySubmit } = await mountEnumWithProps({
                  style: 'radio',
                  isRequired: true,
                });

                await expectFieldMessageRequiredOnSubmit({
                  wrapper,
                  trySubmit,
                });
              });
            });
          });

          describe('prop: isMultiple', () => {
            it('should serialize to {name: [c, b]}', async () => {
              const { wrapper, trySubmit } = await mountEnumWithProps({
                isMultiple: true,
              });

              expect(await resolveOption(wrapper, 'C')).toBe(true);
              expect(await resolveOption(wrapper, 'B')).toBe(true);
              await trySubmit();

              expect(onChange).toHaveBeenCalledWith({ list: ['c', 'b'] });
            });

            it('can be cleared if field is optional', async () => {
              const { wrapper } = await mountEnumWithProps({
                isMultiple: true,
              });

              expect(await resolveOption(wrapper, 'A')).toBe(true);
              wrapper.update();
              const field = wrapper.find('Select');
              const clearButton = field.find('span[aria-label="clear"]');
              expect(clearButton.length).toBe(1);
            });

            describe('prop: isRequired', () => {
              it('should show error and skip submission if not filled', async () => {
                const { wrapper, trySubmit } = await mountEnumWithProps({
                  isMultiple: true,
                  isRequired: true,
                });

                await expectFieldMessageRequiredOnSubmit({
                  wrapper,
                  trySubmit,
                });
              });

              it('can be cleared if field is required but default value is not set', async () => {
                const { wrapper } = await mountEnumWithProps({
                  isRequired: true,
                  isMultiple: true,
                });

                expect(await resolveOption(wrapper, 'A')).toBe(true);
                wrapper.update();
                const field = wrapper.find('Select');
                const clearButton = field.find('span[aria-label="clear"]');
                expect(clearButton.length).toBe(1);
              });
            });

            describe('prop: style="checkbox"', () => {
              it('should serialize to {name: [a, c]}', async () => {
                const { wrapper, trySubmit } = await mountEnumWithProps({
                  isMultiple: true,
                  style: 'checkbox',
                });

                const field = wrapper.find('input[type="checkbox"]');

                toggleCheckbox(field.at(0).find('input'));
                toggleCheckbox(field.at(2).find('input'));

                await trySubmit();

                expect(onChange).toHaveBeenCalledWith({ list: ['a', 'c'] });
              });
            });

            describe('prop: style="radio"', () => {
              it('should show an error', async () => {
                const { wrapper } = await mountEnumWithProps({
                  isMultiple: true,
                  style: 'radio' as any /* set to any because is invalid */,
                });

                expect(getFieldErrors(wrapper)).toStrictEqual([
                  FieldTypeError.isMultipleAndRadio,
                ]);
              });
            });
          });
        });
      });

      describe('type: Custom', () => {
        async function mountCustom(
          attributes?: Record<string, any>,
          options?: Record<string, any>,
        ) {
          return await mountWithProviders({
            ...defaultProps,
            extensionProvider: createProvider(
              [
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
              ],
              {
                modules: {
                  fields: {
                    custom: {
                      userpicker: {
                        resolver: mockUserPickerResolver,
                      },
                    },
                  },
                },
              },
            ),
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
            const { wrapper, trySubmit } = await mountCustom();

            expect(await resolveOption(wrapper, 'Leandro')).toBe(true);
            await trySubmit();

            expect(onChange).toHaveBeenCalledWith({ user: 'u123i1431' });
          });

          describe('prop: isCreatable', () => {
            it('when false, should stop creation of new elements', async () => {
              const { wrapper, trySubmit } = await mountCustom(
                {},
                {
                  isCreatable: false,
                },
              );

              expect(await resolveOption(wrapper, 'foo')).toBe(false);
              await trySubmit();

              expect(onChange).toHaveBeenCalledWith({
                user: undefined,
              });
            });

            it('when true, should allow creating new elements', async () => {
              const { wrapper, trySubmit } = await mountCustom(
                {},
                {
                  isCreatable: true,
                },
              );

              expect(await resolveOption(wrapper, 'foo')).toBe(true);
              await trySubmit();

              expect(onChange).toHaveBeenCalledWith({
                user: 'foo',
              });
            });

            it('should serialize to {user: value}', async () => {
              const { wrapper, trySubmit } = await mountCustom(
                {},
                {
                  isCreatable: true,
                },
              );

              expect(await resolveOption(wrapper, 'foo')).toBe(true);
              await trySubmit();

              expect(onChange).toHaveBeenCalledWith({
                user: 'foo',
              });
            });
          });

          describe('prop: isRequired', () => {
            it('should show error and skip submission if not filled', async () => {
              const { wrapper, trySubmit } = await mountCustom({
                isRequired: true,
              });

              await expectFieldMessageRequiredOnSubmit({
                wrapper,
                trySubmit,
              });
            });
          });

          describe('prop: isMultiple', () => {
            it('should serialize to {user: value[]}', async () => {
              const { wrapper, trySubmit } = await mountCustom({
                isMultiple: true,
              });

              expect(await resolveOption(wrapper, 'Leandro')).toBe(true);
              expect(await resolveOption(wrapper, 'Rodrigo')).toBe(true);
              await trySubmit();

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
            extensionProvider: createProvider(
              [
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
              ],
              {
                modules: {
                  fields: {
                    user: {
                      'user-jdog-provider': {
                        provider: mockJiraSmartUserProvider,
                      },
                    },
                  },
                },
              },
            ),
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
          options?: { extraFields?: NestedFieldDefinition[] },
        ) {
          return mountWithProviders({
            ...defaultProps,
            extensionProvider: createProvider(
              [
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
                    ...(options && options.extraFields
                      ? options.extraFields
                      : []),
                  ],
                },
              ],
              {
                modules: {
                  fields: {
                    custom: {
                      userpicker: {
                        resolver: mockUserPickerResolver,
                      },
                    },
                  },
                },
              },
            ),
            ...otherProps,
          });
        }

        const getAllExistingVisibleFieldNames = (wrapper: Wrapper) => {
          return wrapper.find('Field').map((node) => node.prop('name'));
        };

        describe('All', () => {
          it('should create a group of fields', async () => {
            const { wrapper } = await mountFieldSet(false);

            expect(wrapper.find('Textfield').length).toBe(2);
            expect(wrapper.find('Select').length).toBe(1);
          });

          it('should serialize using the serializer', async () => {
            const { wrapper, trySubmit } = await mountFieldSet(false);

            typeInField(wrapper.find('Textfield').at(0).find('input'), 'foo');
            typeInField(wrapper.find('Textfield').at(1).find('input'), '123');

            expect(await resolveOption(wrapper, 'Leandro')).toBe(true);
            await trySubmit();
            await flushPromises(); // TODO: why

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

            const { wrapper, trySubmit } = await mountFieldSet(
              false,
              {},
              'broken-group',
            );

            const field = wrapper.find('Textfield').at(0).find('input');
            typeInField(field, 'bar');

            await trySubmit();
            await flushPromises(); // TODO: why

            expect(consoleError).toHaveBeenCalledWith(
              'Error serializing parameters',
              new Error('Something is broken'),
            );

            consoleError.mockClear();
          });

          it('should deserialize using the deserializer', async () => {
            const { trySubmit } = await mountFieldSet(false, {
              parameters: {
                settings: JSON.stringify({
                  Q: 'foo',
                  depth: 123,
                  USER: 'u123i1431',
                }),
              },
            });

            await trySubmit();
            await flushPromises(); // TODO: why

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
            const { wrapper, trySubmit } = await mountWithProviders({
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

            await flushPromises(); // TODO: why
            await trySubmit();
            await flushPromises(); // TODO: why

            expect(onChange).toHaveBeenCalledWith({
              foo: 'hello',
              nested: JSON.stringify({ foo: 'world' }),
            });

            const textfields = wrapper.find('Textfield');

            typeInField(textfields.at(0).find('input'), 'bye');
            typeInField(textfields.at(1).find('input'), 'editor');

            await trySubmit();
            await flushPromises(); // TODO: why

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

          it('should show required fields when first rendering', async () => {
            const { wrapper } = await mountFieldSet(
              true,
              undefined,
              undefined,
              {
                extraFields: [
                  { name: 'ID', label: 'id', type: 'string', isRequired: true },
                  {
                    name: 'ID2',
                    label: 'id',
                    type: 'string',
                    isRequired: true,
                  },
                  {
                    name: 'ID3',
                    label: 'id',
                    type: 'string',
                    isRequired: true,
                  },
                ],
              },
            );
            expect(getAllExistingVisibleFieldNames(wrapper)).toEqual([
              'settings.ID',
              'settings.ID2',
              'settings.ID3',
            ]);
          });

          it('should allow adding more fields when clicking the + button', async () => {
            const { wrapper } = await mountFieldSet(true);
            expect(getAllExistingVisibleFieldNames(wrapper)).toEqual([
              'settings.Q',
            ]);

            clickAddFieldButton(wrapper);

            expect(
              await resolveOption(
                wrapper.find('[testId="fieldset-actions"]'),
                'User',
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
              await resolveOption(
                wrapper.find('[testId="fieldset-actions"]'),
                'Depth',
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

          it('should not allow to remove required fields', async () => {
            const { wrapper } = await mountFieldSet(
              true,
              {
                parameters: {
                  settings: JSON.stringify({
                    Q: 'foo',
                    depth: 123,
                    USER: 'u123i1431',
                  }),
                },
              },
              undefined,
              {
                extraFields: [
                  { name: 'ID', label: 'id', type: 'string', isRequired: true },
                ],
              },
            );

            expect(
              wrapper.find('RemovableField').find('[testId="remove-field-ID"]')
                .length,
            ).toBe(0);
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
              fieldNames.forEach((fieldName) => {
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
          const { trySubmit } = await mountWithProviders({
            ...defaultProps,
            extensionProvider: createProvider(
              [
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
              ],
              {
                modules: {
                  fields: {
                    custom: {
                      userpicker: {
                        resolver: mockUserPickerResolver,
                      },
                    },
                  },
                },
              },
            ),
            parameters: {
              t: 'abcd',
              n: 1234,
              d: creationDate,
              b: true,
              esm: ['a', 'c'],
              ess: 'b',
              user: 'u123i1431',
            },
          });

          await trySubmit();

          expect(onChange).toHaveBeenCalledWith({
            t: 'abcd',
            n: 1234,
            d: creationDate,
            b: true,
            esm: ['a', 'c'],
            ess: 'b',
            user: 'u123i1431',
          });
        });

        it('should populate nested fields with passed parameters', async () => {
          const { trySubmit } = await mountWithProviders({
            ...defaultProps,
            extensionProvider: createProvider(
              [
                {
                  name: 'expandField',
                  type: 'expand',
                  label: 'awesome expand field',
                  fields: [
                    {
                      name: 'textField',
                      type: 'string',
                      label: 'Free text',
                    },
                    {
                      type: 'enum',
                      label: 'My enum field',
                      style: 'select',
                      name: 'enumList',
                      defaultValue: 'a',
                      items: [
                        { label: 'label-A', value: 'a' },
                        { label: 'label-B', value: 'b' },
                        { label: 'label-C', value: 'c' },
                      ],
                    },
                  ],
                },
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
                          fields: [
                            {
                              name: 'textFieldOne',
                              type: 'string',
                              label: 'Free text',
                            },
                            {
                              type: 'enum',
                              label: 'My first enum field',
                              style: 'select',
                              name: 'enumListA',
                              items: [
                                { label: 'label-A', value: 'a' },
                                { label: 'label-B', value: 'b' },
                                { label: 'label-C', value: 'c' },
                              ],
                            },
                          ],
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
                        {
                          type: 'enum',
                          label: 'My enum field',
                          style: 'select',
                          name: 'enumListB',
                          items: [
                            { label: 'label-A', value: 'a' },
                            { label: 'label-B', value: 'b' },
                            { label: 'label-C', value: 'c' },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
              {},
            ),
            parameters: {
              expandField: {
                textField: 'test value',
                enumList: 'c',
              },
              tabGroup: {
                optionA: {
                  expandField: {
                    enumListA: 'a',
                    textFieldOne: 'test field one',
                  },
                },
                optionB: {
                  textFieldTwo: 'test field two',
                  enumListB: 'b',
                },
              },
            },
          });

          await trySubmit();
          await flushPromises();

          expect(onChange).toHaveBeenCalledWith({
            expandField: {
              enumList: 'c',
              textField: 'test value',
            },
            tabGroup: {
              optionA: {
                expandField: {
                  enumListA: 'a',
                  textFieldOne: 'test field one',
                },
              },
              optionB: {
                enumListB: 'b',
                textFieldTwo: 'test field two',
              },
            },
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
            const { trySubmit } = await mountWithProviders({
              ...defaultProps,
              extensionProvider: createProvider(
                [
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
                ],
                {
                  modules: {
                    fields: {
                      custom: {
                        userpicker: {
                          resolver: mockUserPickerResolver,
                        },
                      },
                    },
                  },
                },
              ),
              parameters: {
                user: 'u123i1431',
              },
            });

            await flushPromises();
            await trySubmit();

            expect(onChange).toHaveBeenCalledWith({
              user: 'u123i1431',
            });
          });
        });

        describe('defaultValue', () => {
          it('should pass defaultValue and parameters to the fieldResolver', async () => {
            const pickerWithDefaultValue = jest.fn(async () => []);
            const parameters = {
              'user-lazy': 'akumar',
            };
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
              parameters,
            });
            expect(pickerWithDefaultValue).toHaveBeenCalledTimes(1);
            expect(pickerWithDefaultValue).toHaveBeenCalledWith(
              undefined,
              'akumar',
              parameters,
            );
          });

          describe('prop: isMultiple', () => {
            it('should pass an array of defaultValues and parameters to the fieldResolver', async () => {
              const pickerWithDefaultValue = jest.fn(async () => []);
              const parameters = {
                'user-lazy': ['akumar', 'llemos', 'rnabi', 'jquintana'],
              };
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
                parameters,
              });
              expect(pickerWithDefaultValue).toHaveBeenCalledTimes(1);
              expect(pickerWithDefaultValue).toHaveBeenCalledWith(
                undefined,
                ['akumar', 'llemos', 'rnabi', 'jquintana'],
                parameters,
              );
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
            extensionProvider: createProvider(
              [
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
              ],
              {
                modules: {
                  fields: {
                    custom: {
                      userpicker: {
                        resolver: mockUserPickerResolver,
                      },
                    },
                  },
                },
              },
            ),
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
