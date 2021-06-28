import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { IntlProvider } from 'react-intl';

import { Parameters } from '@atlaskit/editor-common';
import {
  DefaultExtensionProvider,
  FieldDefinition,
} from '@atlaskit/editor-common/extensions';
import { createFakeExtensionManifest } from '@atlaskit/editor-test-helpers/extensions';

import { flushPromises } from '../../../__helpers/utils';
import ConfigPanelFieldsLoader from '../../../../ui/ConfigPanel/ConfigPanelFieldsLoader';

const getDynamicFieldsDefinition = (newParams: Parameters) => {
  return [
    {
      type: 'boolean',
      label: 'Checkbox',
      name: 'testToggle',
      description: 'Tick this to show numbers field',
    },
    { type: 'string', label: 'Text', name: 'testText' },
    newParams.testToggle || newParams.testText === '42'
      ? { name: 'num', label: 'Number', type: 'number' }
      : undefined,
  ].filter(Boolean) as FieldDefinition[];
};
const mockedGetDynamicFieldsDefinition = jest.fn(getDynamicFieldsDefinition);

const dynamicFieldsManifest = createFakeExtensionManifest({
  title: 'Dynamic Fields Example',
  type: 'confluence.macro',
  extensionKey: 'dynamic-fields',
  nodes: [
    {
      key: 'staticFields',
      getFieldsDefinition: async () => [
        { type: 'boolean', label: 'Checkbox', name: 'testToggle' },
        { type: 'string', label: 'Text', name: 'testText' },
      ],
    },
    {
      key: 'staticFieldsUndefined',
      // Intentionally returning a bad value to see what breaks
      // @ts-ignore
      getFieldsDefinition: async () => undefined,
    },
    {
      key: 'staticFieldsError',
      getFieldsDefinition: async () => {
        throw new Error('Failed to return value');
      },
    },
    {
      key: 'dynamicFields',
      getFieldsDefinition: async () => mockedGetDynamicFieldsDefinition,
    },
    {
      key: 'dynamicFieldsMaintainState',
      getFieldsDefinition: async () => (newParams: Parameters) => {
        const chartType = newParams?.chartType || 'line';
        const fields = [
          {
            type: 'enum',
            style: 'radio',
            label: 'Chart type',
            name: 'chartType',
            defaultValue: 'line',
            items: [
              { label: 'Line chart', value: 'line' },
              { label: 'Bar chart', value: 'bar' },
            ],
          },
          chartType === 'line'
            ? {
                type: 'boolean',
                label: 'Smooth lines',
                name: 'lineChartSmooth',
              }
            : undefined,
          chartType === 'bar'
            ? {
                type: 'number',
                label: 'Number of bars',
                name: 'barChartCount',
              }
            : undefined,
          chartType === 'bar'
            ? { type: 'date', label: 'As of date', name: 'barChartDate' }
            : undefined,
          {
            type: 'expand',
            label: 'Extra info',
            name: 'expandGroup',
            fields: [
              {
                type: 'string',
                label: 'Title',
                name: 'chartTitle',
              },
              {
                type: 'string',
                label: 'Description',
                name: 'chartDescription',
                style: 'multiline',
              },
            ],
          },
        ];

        return fields.filter(Boolean) as FieldDefinition[];
      },
    },
    {
      key: 'dynamicFieldsUndefined',
      // Intentionally returning a bad value to see what breaks
      // @ts-ignore
      getFieldsDefinition: async () => (newParams: Parameters) => {
        return undefined;
      },
    },
    {
      key: 'dynamicFieldsError',
      getFieldsDefinition: async () => (newParams: Parameters) => {
        throw new Error('Failed to return value');
      },
    },
  ],
});

const changeChartType = async (configForm: ReactWrapper, chartType: string) => {
  configForm
    .find('RadioGroup')
    .find('Consumer')
    .findWhere(
      (c) =>
        c.name() === 'input' &&
        c.prop('type') === 'radio' &&
        c.prop('value') === chartType,
    )
    .simulate('change', { target: { value: chartType, checked: true } });
  await flushPromises();
};

interface MountConfigPanelOptions {
  initialParameters?: Parameters;
  onChange?: (data: Parameters) => void;
  nodeKey?: string;
}
describe('Dynamic ConfigPanelFieldsLoader', () => {
  let extensionProvider = new DefaultExtensionProvider([dynamicFieldsManifest]);

  const mountConfigPanel = async (options?: MountConfigPanelOptions) => {
    const extensionParameters = options?.initialParameters || {};
    const onChange = options?.onChange || (() => {});
    const nodeKey = options?.nodeKey || 'dynamicFields';

    const wrapper = mount(
      // Using React.createElement lets us get around the
      // "ReactWrapper::setProps() can only be called on the root" issue
      // https://github.com/enzymejs/enzyme/issues/1925#issuecomment-463248558
      React.createElement(
        (props) => (
          <IntlProvider locale="en">
            <ConfigPanelFieldsLoader
              extensionProvider={extensionProvider}
              extensionType={dynamicFieldsManifest.type}
              extensionKey={dynamicFieldsManifest.key}
              nodeKey={nodeKey}
              parameters={props.extensionParameters}
              extensionParameters={props.extensionParameters}
              autoSave
              closeOnEsc
              showHeader
              onChange={onChange}
              onCancel={() => {}}
            />
          </IntlProvider>
        ),
        { extensionParameters },
      ),
    );

    // clear the loader
    await flushPromises();
    wrapper.update();

    return wrapper;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialise fixed fields correctly', async () => {
    const wrapper = await mountConfigPanel({
      nodeKey: 'staticFields',
    });
    const configForm = wrapper?.find('ConfigForm');
    expect(configForm.exists('Boolean')).toBeTruthy();
    expect(configForm.exists('String')).toBeTruthy();
  });

  it("should display loading state indefinitely for fixed fields of value 'undefined'", async () => {
    const wrapper = await mountConfigPanel({
      nodeKey: 'staticFieldsUndefined',
    });
    expect(wrapper.find('ConfigForm').exists('LoadingState')).toBeTruthy();
  });

  it('should display error message for fixed getFieldsDefinition() that throws an error', async () => {
    const wrapper = await mountConfigPanel({
      nodeKey: 'staticFieldsError',
    });
    expect(wrapper.exists('ConfigPanelErrorMessage')).toBeTruthy();
  });

  it('should initialise dynamic fields correctly', async () => {
    const wrapper = await mountConfigPanel();
    const configForm = wrapper?.find('ConfigForm');
    expect(configForm.exists('Boolean')).toBeTruthy();
    expect(configForm.exists('String')).toBeTruthy();
  });

  it("should display loading state indefinitely for dynamic fields of value 'undefined'", async () => {
    const wrapper = await mountConfigPanel({
      nodeKey: 'dynamicFieldsUndefined',
    });
    expect(wrapper.find('ConfigForm').exists('LoadingState')).toBeTruthy();
  });

  it('should display error message for dynamic getFieldsDefinition() that throws an error', async () => {
    const wrapper = await mountConfigPanel({
      nodeKey: 'dynamicFieldsError',
    });
    expect(wrapper.exists('ConfigPanelErrorMessage')).toBeTruthy();
  });

  it('should render new field when parameter values change', async () => {
    let currentParams = {};

    const wrapper = await mountConfigPanel({
      initialParameters: currentParams,
      onChange: (data: Parameters) => {
        currentParams = {
          ...currentParams,
          ...data,
        };
      },
    });

    const configForm = wrapper?.find('ConfigForm');
    expect(configForm.exists('Boolean')).toBeTruthy();
    expect(configForm.exists('String')).toBeTruthy();
    expect(wrapper.exists('Number')).toBeFalsy();

    configForm
      .find('Boolean')
      .find('Checkbox')
      .find('input')
      .simulate('change', { target: { checked: true } });

    await flushPromises();
    wrapper.setProps({ extensionParameters: currentParams });
    await flushPromises();
    wrapper.update();

    expect(wrapper.exists('Number')).toBeTruthy();
  });

  it('should not call DynamicFieldDefinitions if params dont change', async () => {
    const wrapper = await mountConfigPanel({
      initialParameters: { testText: 'abc' },
    });

    const configForm = wrapper?.find('ConfigForm');
    expect(configForm.exists('Boolean')).toBeTruthy();
    expect(configForm.exists('String')).toBeTruthy();

    expect(mockedGetDynamicFieldsDefinition).toBeCalledTimes(1);

    // Focus/unfocus from text field, should trigger events but not params change
    configForm.find('String').find('input').simulate('focus').simulate('blur');

    expect(mockedGetDynamicFieldsDefinition).toBeCalledTimes(1);
  });

  it('should maintain field values when fields are removed then restored', async () => {
    let currentParams = {};
    const wrapper = await mountConfigPanel({
      nodeKey: 'dynamicFieldsMaintainState',
      onChange: (data: Parameters) => {
        currentParams = {
          ...currentParams,
          ...data,
        };
      },
    });

    let configForm = wrapper?.find('ConfigForm');
    expect(configForm.exists('RadioField')).toBeTruthy();
    expect(configForm.exists('Boolean')).toBeTruthy();

    // Check the checkbox
    configForm
      .find('Boolean')
      .find('Checkbox')
      .find('input')
      .simulate('change', { target: { checked: true } });

    // Change chart type via radio field
    await changeChartType(configForm, 'bar');
    wrapper.setProps({ extensionParameters: currentParams });
    await flushPromises();
    wrapper.update();

    configForm = wrapper?.find('ConfigForm');
    expect(configForm.exists('Boolean')).toBeFalsy();
    expect(configForm.find('Date').exists()).toBeTruthy();

    // Switch it back to line chart
    await changeChartType(configForm, 'line');
    wrapper.setProps({ extensionParameters: currentParams });
    await flushPromises();
    wrapper.update();

    // Boolean field should be back and still ticked
    configForm = wrapper?.find('ConfigForm');
    expect(configForm.exists('Boolean')).toBeTruthy();
    expect(
      configForm.find('Boolean').find('Checkbox').find('input').prop('checked'),
    ).toBeTruthy();
  });

  it('should maintain state of unaffected fields', async () => {
    let currentParams = {};
    const wrapper = await mountConfigPanel({
      nodeKey: 'dynamicFieldsMaintainState',
      onChange: (data: Parameters) => {
        currentParams = {
          ...currentParams,
          ...data,
        };
      },
    });

    let configForm = wrapper?.find('ConfigForm');
    expect(configForm.exists('RadioField')).toBeTruthy();
    expect(configForm.exists('Boolean')).toBeTruthy();
    expect(configForm.exists('Expand')).toBeTruthy();
    expect(
      configForm.find('Expand').find('ExpandContentContainer').prop('isHidden'),
    ).toBeTruthy();

    // Expand the contents
    configForm
      .find('Expand')
      .find('button[data-testid="form-expand-toggle"]')
      .simulate('click');

    configForm = wrapper?.find('ConfigForm');
    expect(
      configForm.find('Expand').find('ExpandContentContainer').prop('isHidden'),
    ).toBeFalsy();

    // Change chart type via radio field
    await changeChartType(configForm, 'bar');
    wrapper.setProps({ extensionParameters: currentParams });
    await flushPromises();
    wrapper.update();

    configForm = wrapper?.find('ConfigForm');
    expect(configForm.exists('Boolean')).toBeFalsy();
    expect(configForm.find('Date').exists()).toBeTruthy();

    // Check that expand is still expanded
    expect(
      configForm.find('Expand').find('ExpandContentContainer').prop('isHidden'),
    ).toBeFalsy();
  });
});
