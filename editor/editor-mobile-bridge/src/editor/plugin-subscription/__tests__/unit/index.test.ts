import { EventDispatcher } from '@atlaskit/editor-core';
import { PluginKey } from 'prosemirror-state';
import WebBridgeImpl from '../../../native-to-web';
import { initPluginListeners } from '../..';
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
});
