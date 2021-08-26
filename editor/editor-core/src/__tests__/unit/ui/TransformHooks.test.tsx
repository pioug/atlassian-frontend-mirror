import { extension } from '@atlaskit/editor-test-helpers/doc-builder';

import { pluginKey } from '../../../plugins/extension/plugin-key';
import { flushPromises } from '../../__helpers/utils';
import { setupConfigPanel } from '../_setup-config-panel';
import { Parameters } from '@atlaskit/editor-common/extensions';

describe('TransformHooks', () => {
  it('should not close the config panel after save if autosave is on', async () => {
    const content = [
      '{<node>}',
      extension({
        extensionType: 'fake.confluence',
        extensionKey: 'expand',
      })(),
    ];
    const { props, editorView } = await setupConfigPanel({
      content,
      // extensionHandler: ExtensionHandlerComponent,
      transformBefore: (parameters: Parameters) => {
        return parameters;
      },
      transformAfter: (parameters: Parameters) => {
        return Promise.resolve(parameters);
      },
    });

    props.onChange({
      title: 'changed',
    });

    await flushPromises();
    const pluginState = pluginKey.getState(editorView.state);
    expect(pluginState.showContextPanel).toBeTruthy();
  });

  describe('transformBefore', () => {
    it('should be able to change the parameter of color field', async () => {
      const content = [
        '{<node>}',
        extension({
          extensionType: 'fake.confluence',
          extensionKey: 'expand',
          parameters: {
            existingValue: true,
            changedValue: '#000000',
          },
        })(),
      ];

      const transformBefore = jest.fn((parameters: Parameters) => {
        return {
          ...parameters,
          changedValue: '#FF0000',
          insertedValue: 'hello!',
        };
      });

      const { wrapper } = await setupConfigPanel({
        content,
        transformBefore,
      });
      await flushPromises();

      const expectedParameters = {
        existingValue: true,
        changedValue: '#FF0000',
        insertedValue: 'hello!',
      };

      // It gets called during setup of the config panel with
      // initial params for extension.
      expect(transformBefore).toBeCalledWith({
        existingValue: true,
        changedValue: '#000000',
      });
      expect(transformBefore).toReturnWith(expectedParameters);

      expect(wrapper.find('ConfigPanel').prop('parameters')).toEqual(
        expectedParameters,
      );
    });
  });

  describe('transformAfter', () => {
    it('should be able to change the parameter of color field', async () => {
      const content = [
        '{<node>}',
        extension({
          extensionType: 'fake.confluence',
          extensionKey: 'expand',
          parameters: {
            existingValue: true,
            testColor: '#000000',
          },
        })(),
      ];

      const transformAfter = jest.fn(async (parameters: Parameters) => {
        return {
          ...parameters,
          testColor: '#FF0000',
          insertedValue: 'hello!',
        };
      });

      const { props, editorView } = await setupConfigPanel({
        content,
        transformAfter,
        nodes: [
          {
            key: 'default',
            getFieldsDefinition: async () => [
              { type: 'color', label: 'Color Picker', name: 'testColor' },
            ],
          },
        ],
      });

      props.onChange({
        dummy: 'value',
      });
      await flushPromises();

      const expectedParameters = {
        existingValue: true,
        testColor: '#FF0000',
        insertedValue: 'hello!',
        dummy: 'value',
      };

      expect(editorView.state.doc.firstChild?.attrs.parameters).toEqual(
        expectedParameters,
      );
    });
  });
});
