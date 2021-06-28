import {
  EventDispatcher,
  listsPredictableStateKey,
  listsStateKey,
} from '@atlaskit/editor-core';
import { PluginKey } from 'prosemirror-state';
import WebBridgeImpl from '../../../native-to-web';
import { initPluginListeners, configFactory } from '../..';
import MobileEditorConfiguration from '../../../editor-configuration';
import { EditorView } from 'prosemirror-view';

describe('Plugin Subscription', () => {
  const eventDispatcher = new EventDispatcher();
  const bridge = new WebBridgeImpl();
  const editorView = {} as EditorView;

  beforeEach(() => {
    jest.spyOn(PluginKey.prototype, 'getState').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should have called isQuickInsertEnabled when plugin is initialised', () => {
    const isQuickInsertEnabled = jest
      .spyOn(MobileEditorConfiguration.prototype, 'isQuickInsertEnabled')
      .mockReturnValue(false);

    initPluginListeners()(eventDispatcher, bridge, editorView);
    (bridge as any)[`typeAheadBridgeListener`]({
      active: true,
      query: '',
      trigger: '/',
    });

    expect(isQuickInsertEnabled).toHaveBeenCalledTimes(1);
  });

  describe('#configFactory', () => {
    describe('#predictableList', () => {
      describe.each<[string, boolean, PluginKey]>([
        ['predictable list', true, listsPredictableStateKey],
        ['legacy list', false, listsStateKey],
      ])(
        'when the %s feature flag is %b',
        (_listType, isEnabled, pluginKey) => {
          it('should use the right plugin key', () => {
            const newConfig = JSON.stringify({
              allowPredictableList: isEnabled,
            });
            const configs = configFactory(
              new MobileEditorConfiguration(newConfig),
            );
            const listConfig = configs.find((c) => {
              return c.bridge === 'listBridge';
            });

            expect(listConfig).toBeDefined();
            expect(listConfig!.pluginKey).toBe(pluginKey);
          });
        },
      );
    });
  });
});
