import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { IntlProvider } from 'react-intl';
import retry from 'async-retry';
import merge from 'lodash/merge';
import { flushPromises } from '../../__helpers/utils';

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
} from '@atlaskit/editor-common/extensions';

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
  inputWrapper.simulate('blur');
}

export async function createOption(select: any, value: string) {
  const instance = select.instance();
  instance.handleInputChange({ currentTarget: { value } });

  // internal setState may not be synchronous, wait
  await flushPromises();
  return await selectOption(select, value);
}

export async function selectOption(select: any, value: string) {
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

export function createOptionResolver(options: Option[]) {
  return async (searchTerm?: string) => {
    if (searchTerm) {
      return options.filter(
        item =>
          item.label.search(new RegExp(searchTerm, 'i')) !== -1 ||
          item.value.search(new RegExp(searchTerm, 'i')) !== -1,
      );
    }

    return options;
  };
}

export async function mockJiraSmartUserProvider() {
  // WARNING: this is required by the SmartUserPicker for testing environments
  setSmartUserPickerEnv('local');

  return {
    siteId: '497ea592-beb4-43c3-9137-a6e5fa301088',
    principalId: 'Context',
    fieldId: 'storybook',
    productKey: 'jira',
  } as UserFieldContext;
}

export function createProvider(
  getFieldsDefinition: (() => Promise<FieldDefinition[]>) | FieldDefinition[],
  mergeManifest?: Partial<ExtensionManifest>,
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
    trySubmit: async () => {
      form.simulate('submit');
      await flushPromises();
    },
  };
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
