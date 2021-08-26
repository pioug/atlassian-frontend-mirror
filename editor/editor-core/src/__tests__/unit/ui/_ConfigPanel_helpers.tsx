import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { IntlProvider } from 'react-intl';
import retry from 'async-retry';
import merge from 'lodash/merge';

import { setSmartUserPickerEnv } from '@atlaskit/user-picker';
import ConfigPanel from '../../../ui/ConfigPanel';
import {
  DefaultExtensionProvider,
  ExtensionManifest,
  ExtensionModule,
  ExtensionModuleNodes,
  FieldDefinition,
  Option,
  Parameters,
  UserFieldContext,
  combineExtensionProviders,
  UpdateExtension,
} from '@atlaskit/editor-common/extensions';

export function asOption(label: string): Option {
  return { label, value: label };
}

export function asOptions(labels: string[]) {
  return labels.map((x) => asOption(x));
}

export type Wrapper<T = any> = ReactWrapper<T, any, any>;
export async function eventuallyFind(
  wrapper: Wrapper,
  selector: string,
): Promise<Wrapper> {
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
}

export function typeInField(field: any, text: string) {
  (field.getDOMNode() as HTMLInputElement).value = text;
  field.simulate('change');
  field.simulate('blur');
}

export function toggleCheckbox(inputWrapper: any) {
  const input = inputWrapper.getDOMNode();

  input.checked = !input.checked;
  inputWrapper.simulate('change');
}

// supports Async(Creatable(Select)), Async(Select), Creatable(Select), Select
function getSelect(wrapper: any) {
  if (wrapper.is('Select')) {
    return wrapper;
  }
  return wrapper.find('Select');
}

export async function resolveOption(wrapper: any, label: string) {
  getSelect(wrapper).simulate('focus');
  getSelect(wrapper)
    .instance()
    .handleInputChange({
      currentTarget: {
        value: label,
      },
    });

  wrapper.update();
  return await selectOption(wrapper, label);
}

export async function selectLoaded(wrapper: any) {
  await retry(
    async () => {
      if (
        wrapper.state('loading') || // SmartUserPicker | CustomSelect
        wrapper.state('isLoading') || // AsyncSelect
        wrapper.prop('isLoading') // Select
      ) {
        throw new TypeError('Waiting for Select to load');
      }
    },
    {
      retries: 10,
      minTimeout: 100,
    },
  );
  wrapper.update(); // force re-render with any new options
}

async function selectOption(wrapper: any, label: string) {
  await selectLoaded(wrapper);
  const select = getSelect(wrapper);
  select.instance().openMenu('last'); // auto-focuses last option

  let { focusedOption } = select.state();
  if (!focusedOption || !focusedOption.label.includes(label)) {
    focusedOption = null;

    const options = select.prop('options');
    for (const option of options) {
      if (option.label.includes(label)) {
        focusedOption = option;
        break;
      }
    }

    if (!focusedOption) {
      return false;
    }
  }

  select.instance().selectOption(focusedOption);
  return true;
}

export function createOptionResolver(
  options: Option[],
  filter?: (option: Option, parameters?: Parameters) => boolean,
) {
  return async (searchTerm?: string, _?: any, parameters?: Parameters) => {
    let result = options;

    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      result = result.filter((x) => regex.test(x.label) || regex.test(x.value));
    }

    if (filter) {
      result = result.filter((x) => filter(x, parameters));
    }

    return result;
  };
}

export async function mockJiraSmartUserProvider() {
  // WARNING: this is required by the SmartUserPicker for testing environments
  setSmartUserPickerEnv('local');

  return {
    siteId: '49d8b9d6-ee7d-4931-a0ca-7fcae7d1c3b5',
    principalId: 'Context',
    fieldId: 'storybook',
    productKey: 'jira',
  } as UserFieldContext;
}

export function createProvider(
  getFieldsDefinition: (() => Promise<FieldDefinition[]>) | FieldDefinition[],
  mergeManifest?: Partial<ExtensionManifest>,
  extensionUpdater?: UpdateExtension<object>,
) {
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
      render: async () => () => null,
      getFieldsDefinition: async () => {
        if (Array.isArray(getFieldsDefinition)) {
          return getFieldsDefinition;
        }

        return await getFieldsDefinition();
      },
      update: extensionUpdater,
    },
  };

  const manifest: ExtensionManifest = {
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
        fieldset: {
          'json-group': {
            serializer: (value) => JSON.stringify(value),
            deserializer: (value) => JSON.parse(value),
          },
          'broken-group': {
            serializer: (params) => {
              throw new Error('Something is broken');
            },
            deserializer: (result) => {
              throw new Error('Something is broken');
            },
          },
        },
      },
    },
  };

  return combineExtensionProviders([
    new DefaultExtensionProvider([merge(manifest, mergeManifest)]),
  ]);
}

export type Props = React.ComponentProps<typeof ConfigPanel>;
export type MountResult<T> = {
  wrapper: Wrapper<T>;
  onChange: (parameters: Parameters) => void;
  trySubmit: () => Promise<void>;
};

export async function mountWithProviders(
  props: Props,
): Promise<MountResult<Props>> {
  const { onChange } = props;
  const wrapper = mount(
    <IntlProvider locale="en">
      <ConfigPanel {...props} />
    </IntlProvider>,
  );

  const form = await eventuallyFind(wrapper, 'form');
  wrapper.update();

  return {
    wrapper,
    onChange,
    async trySubmit() {
      form.simulate('submit');
      form.update();
      form.simulate('blur');
    },
  };
}

// useful for updating the parameters of a ConfigPanel generally
//   e.g when testing parameter driven state, akin to user collaboration
//   attempts to wait for each Field to have been updated and ready
export async function updateParameters(wrapper: any, parameters: Parameters) {
  // WARNING: {} required as .props() appears to be immutable
  const newProps = merge({}, wrapper.props(), {
    children: {
      props: {
        parameters,
      },
    },
  });

  wrapper.setProps(newProps);
  wrapper.update();

  // wait for any Select's to load
  const select = getSelect(wrapper);
  if (select) {
    await selectLoaded(wrapper);
  }

  // TODO: what are we waiting for
  await new Promise((resolve) => setTimeout(resolve, 100));
}

// silences act() related warnings and errors
export function silenceActErrors() {
  let consoleError: jest.SpyInstance;

  beforeAll(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleError.mockRestore();
  });
}

export function getFieldErrors(wrapper: any) {
  let errors: string[] = [];
  wrapper.find('FieldMessages').forEach((message: ReactWrapper) => {
    const error = message.prop('error') as string;
    if (error) {
      errors.push(error);
    }
  });
  return errors;
}
