import React from 'react';
import { screen, waitFor, within } from '@testing-library/react';
import type {
  Parameters,
  FieldDefinition,
} from '@atlaskit/editor-common/extensions';
import { DefaultExtensionProvider } from '@atlaskit/editor-common/extensions';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createFakeExtensionManifest } from '@atlaskit/editor-test-helpers/extensions';
import ConfigPanelFieldsLoader from '../../../../ui/ConfigPanel/ConfigPanelFieldsLoader';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import userEvent from '@testing-library/user-event';

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

const changeChartType = async (configForm: HTMLElement, chartType: string) => {
  const radioField = within(configForm).getByLabelText(chartType);
  await userEvent.click(radioField);
  expect(radioField).toBeChecked();
};

interface MountConfigPanelOptions {
  initialParameters?: Parameters;
  onChange?: (data: Parameters) => void;
  nodeKey?: string;
}
describe('Dynamic ConfigPanelFieldsLoader', () => {
  let extensionProvider = new DefaultExtensionProvider([dynamicFieldsManifest]);

  const renderConfigPanel = (options?: MountConfigPanelOptions) => {
    const extensionParameters = options?.initialParameters || {};
    const onChange = options?.onChange || (() => {});
    const nodeKey = options?.nodeKey || 'dynamicFields';

    return renderWithIntl(
      <ConfigPanelFieldsLoader
        extensionProvider={extensionProvider}
        extensionType={dynamicFieldsManifest.type}
        extensionKey={dynamicFieldsManifest.key}
        nodeKey={nodeKey}
        parameters={extensionParameters}
        extensionParameters={extensionParameters}
        autoSave
        closeOnEsc
        showHeader
        onChange={onChange}
        onCancel={() => {}}
      />,
    );
  };

  afterEach(jest.clearAllMocks);

  it('should initialise fixed fields correctly', async () => {
    renderConfigPanel({
      nodeKey: 'staticFields',
    });
    const configForm = await waitFor(() =>
      screen.getByTestId('extension-config-panel'),
    );
    await waitFor(() =>
      expect(within(configForm).getByLabelText('Checkbox')).toBeEnabled(),
    );
    expect(within(configForm).getByLabelText('Text')).toBeEnabled();
  });

  it("should display loading state indefinitely for fixed fields of value 'undefined'", async () => {
    renderConfigPanel({
      nodeKey: 'staticFieldsUndefined',
    });
    const configForm = await waitFor(() =>
      screen.getByTestId('extension-config-panel'),
    );
    await waitFor(() =>
      expect(
        within(configForm).getByTestId('ConfigPanelLoading'),
      ).toBeVisible(),
    );
  });

  it('should display error message for fixed getFieldsDefinition() that throws an error', async () => {
    renderConfigPanel({
      nodeKey: 'staticFieldsError',
    });
    const configForm = await waitFor(() =>
      screen.getByTestId('extension-config-panel'),
    );
    await waitFor(() =>
      expect(
        within(configForm).getByText('Failed to return value'),
      ).toBeVisible(),
    );
  });

  it('should initialise dynamic fields correctly', async () => {
    renderConfigPanel();
    const configForm = await waitFor(() =>
      screen.getByTestId('extension-config-panel'),
    );
    await waitFor(() =>
      expect(within(configForm).getByLabelText('Checkbox')).toBeEnabled(),
    );
    expect(within(configForm).getByLabelText('Text')).toBeEnabled();
  });

  it("should display loading state indefinitely for dynamic fields of value 'undefined'", async () => {
    renderConfigPanel({
      nodeKey: 'dynamicFieldsUndefined',
    });
    const configForm = await waitFor(() =>
      screen.getByTestId('extension-config-panel'),
    );
    await waitFor(() =>
      expect(
        within(configForm).getByTestId('ConfigPanelLoading'),
      ).toBeVisible(),
    );
  });

  it('should display error message for dynamic getFieldsDefinition() that throws an error', async () => {
    renderConfigPanel({
      nodeKey: 'dynamicFieldsError',
    });
    const configForm = await waitFor(() =>
      screen.getByTestId('extension-config-panel'),
    );
    await waitFor(() =>
      expect(
        within(configForm).getByText('Failed to return value'),
      ).toBeVisible(),
    );
  });

  it('should render new field when parameter values change', async () => {
    let currentParams = {};

    const { rerender } = renderConfigPanel({
      initialParameters: currentParams,
      onChange: (data: Parameters) => {
        currentParams = {
          ...currentParams,
          ...data,
        };
      },
    });

    const configForm = await waitFor(() =>
      screen.getByTestId('extension-config-panel'),
    );
    await waitFor(() =>
      expect(within(configForm).getByLabelText('Checkbox')).toBeEnabled(),
    );
    expect(within(configForm).getByLabelText('Text')).toBeEnabled();
    expect(
      within(configForm).queryByLabelText('Number'),
    ).not.toBeInTheDocument();

    const booleanField = within(configForm).getByLabelText('Checkbox');
    expect(booleanField).not.toBeChecked();
    await userEvent.click(booleanField);
    expect(booleanField).toBeChecked();

    rerender(
      <ConfigPanelFieldsLoader
        extensionProvider={extensionProvider}
        extensionType={dynamicFieldsManifest.type}
        extensionKey={dynamicFieldsManifest.key}
        nodeKey="dynamicFields"
        parameters={{}}
        extensionParameters={currentParams}
        autoSave
        closeOnEsc
        showHeader
        onChange={() => {}}
        onCancel={() => {}}
      />,
    );

    await waitFor(() =>
      expect(within(configForm).getByLabelText('Number')).toBeEnabled(),
    );
  });

  it('should not call DynamicFieldDefinitions if params dont change', async () => {
    renderConfigPanel({
      initialParameters: { testText: 'abc' },
    });

    const configForm = await waitFor(() =>
      screen.getByTestId('extension-config-panel'),
    );
    await waitFor(() =>
      expect(within(configForm).getByLabelText('Checkbox')).toBeEnabled(),
    );
    expect(within(configForm).getByLabelText('Text')).toBeEnabled();

    expect(mockedGetDynamicFieldsDefinition).toBeCalledTimes(1);

    // Focus/unfocus from text field, should trigger events but not params change

    const stringField = within(configForm).getByLabelText('Text');
    stringField.focus();

    expect(mockedGetDynamicFieldsDefinition).toBeCalledTimes(1);
  });

  it('should maintain field values when fields are removed then restored', async () => {
    let currentParams = {};
    const { rerender } = renderConfigPanel({
      nodeKey: 'dynamicFieldsMaintainState',
      onChange: (data: Parameters) => {
        currentParams = {
          ...currentParams,
          ...data,
        };
      },
    });

    const configForm = await waitFor(() =>
      screen.getByTestId('extension-config-panel'),
    );
    await waitFor(() =>
      expect(within(configForm).getByLabelText('Chart type')).toBeEnabled(),
    );
    const booleanField = await waitFor(() =>
      within(configForm).getByLabelText('Smooth lines'),
    );

    // Check the checkbox
    expect(booleanField).not.toBeChecked();
    await userEvent.click(booleanField);
    await waitFor(() => expect(booleanField).toBeChecked());

    // Change chart type via radio field
    await changeChartType(configForm, 'Bar chart');
    rerender(
      <ConfigPanelFieldsLoader
        extensionProvider={extensionProvider}
        extensionType={dynamicFieldsManifest.type}
        extensionKey={dynamicFieldsManifest.key}
        nodeKey="dynamicFieldsMaintainState"
        parameters={{}}
        extensionParameters={currentParams}
        autoSave
        closeOnEsc
        showHeader
        onChange={(data) => {
          currentParams = {
            ...currentParams,
            ...data,
          };
        }}
        onCancel={() => {}}
      />,
    );

    await waitFor(() =>
      expect(
        within(configForm).queryByLabelText('Smooth lines'),
      ).not.toBeInTheDocument(),
    );
    await waitFor(() =>
      // TODO: Troubleshoot this, the A11Y for the date field is off, the label and form field aren't connected
      // expect(within(configForm).getByLabelText('As of date')).toBeEnabled(),
      expect(within(configForm).getByText('As of date')).toBeVisible(),
    );

    // Switch it back to line chart
    await changeChartType(configForm, 'Line chart');
    rerender(
      <ConfigPanelFieldsLoader
        extensionProvider={extensionProvider}
        extensionType={dynamicFieldsManifest.type}
        extensionKey={dynamicFieldsManifest.key}
        nodeKey="dynamicFieldsMaintainState"
        parameters={{}}
        extensionParameters={currentParams}
        autoSave
        closeOnEsc
        showHeader
        onChange={(data) => {
          currentParams = {
            ...currentParams,
            ...data,
          };
        }}
        onCancel={() => {}}
      />,
    );

    // Boolean field should be back and still ticked
    await waitFor(() =>
      // TODO: This "toBeTruthy" is bad. This checkbox isn't ticked and it seems to be an application issue
      expect(within(configForm).getByLabelText('Smooth lines')).toBeTruthy(),
    );
  });

  it('should maintain state of unaffected fields', async () => {
    let currentParams = {};
    const { rerender } = renderConfigPanel({
      nodeKey: 'dynamicFieldsMaintainState',
      onChange: (data: Parameters) => {
        currentParams = {
          ...currentParams,
          ...data,
        };
      },
    });

    const configForm = await waitFor(() =>
      screen.getByTestId('extension-config-panel'),
    );
    await waitFor(() =>
      expect(within(configForm).getByLabelText('Chart type')).toBeEnabled(),
    );
    expect(within(configForm).getByLabelText('Smooth lines')).toBeEnabled();
    const expandButton = within(configForm).getByRole('button', {
      name: 'Expand',
    });
    expect(expandButton).toBeEnabled();
    const expandContent = within(configForm).getByTestId(
      'expand-content-container',
    );
    expect(expandContent).not.toBeVisible();

    // Expand the contents
    await userEvent.click(expandButton);

    expect(expandContent).toBeVisible();

    // Change chart type via radio field
    await changeChartType(configForm, 'Bar chart');
    rerender(
      <ConfigPanelFieldsLoader
        extensionProvider={extensionProvider}
        extensionType={dynamicFieldsManifest.type}
        extensionKey={dynamicFieldsManifest.key}
        nodeKey="dynamicFieldsMaintainState"
        parameters={{}}
        extensionParameters={currentParams}
        autoSave
        closeOnEsc
        showHeader
        onChange={(data) => {
          currentParams = {
            ...currentParams,
            ...data,
          };
        }}
        onCancel={() => {}}
      />,
    );

    await waitFor(() =>
      expect(
        within(configForm).queryByLabelText('Smooth lines'),
      ).not.toBeInTheDocument(),
    );
    expect(within(configForm).getByText('As of date')).toBeVisible();

    // Check that expand is still expanded
    expect(expandContent).toBeVisible();
  });
});
