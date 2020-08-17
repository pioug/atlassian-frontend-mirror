import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import { MobileEditor } from '../../mobile-editor-element';
import {
  createCardClient,
  createEmojiProvider,
  createMediaProvider,
  createMentionProvider,
  createCardProvider,
} from '../../../providers';
import { IntlProvider } from 'react-intl';
import { FetchProxy } from '../../../utils/fetch-proxy';
import { createCollabProviderFactory } from '../../../providers/collab-provider';
import WebBridgeImpl from '../../native-to-web';
import NativeBridge from '../../web-to-native/bridge';
jest.mock('../../web-to-native');

const initialDocument = JSON.stringify({
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is the mobile editor',
        },
      ],
    },
  ],
});

describe('mobile editor element', () => {
  let mobileEditor: ReactWrapper<typeof MobileEditor>;
  let fetchProxy: FetchProxy;
  let bridge: WebBridgeImpl;
  let toNativeBridge: jest.Mocked<NativeBridge>;

  const initEditor = (
    _bridge: WebBridgeImpl = new WebBridgeImpl(),
  ): ReactWrapper<typeof MobileEditor> => {
    bridge = _bridge;
    mobileEditor = mount(
      <MobileEditor
        mode="light"
        bridge={bridge}
        createCollabProvider={createCollabProviderFactory(fetchProxy)}
        cardClient={createCardClient()}
        cardProvider={createCardProvider()}
        defaultValue={initialDocument}
        emojiProvider={createEmojiProvider(fetchProxy)}
        mediaProvider={createMediaProvider()}
        mentionProvider={createMentionProvider()}
      />,
    );

    return mobileEditor;
  };

  beforeAll(() => {
    // avoid polluting test logs with error message in console
    // please ensure you fix it if you expect console.error to be thrown
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
    ({ toNativeBridge } = ((await import('../../web-to-native')) as any) as {
      toNativeBridge: jest.Mocked<NativeBridge>;
    });

    fetchProxy = new FetchProxy();
    fetchProxy.enable();
  });

  afterEach(() => {
    // We need to check for the length to prevent unmount a node
    // that was already unmounted by the test
    if (mobileEditor && mobileEditor.length > 0) {
      mobileEditor.unmount();
    }
    fetchProxy.disable();
    // eslint-disable-next-line no-console
    jest.clearAllMocks();
  });

  describe('when the mobile editor is mounted', () => {
    it('should set the editorView in the bridge', () => {
      bridge = new WebBridgeImpl();
      expect(bridge.editorView).toBeNull();

      initEditor(bridge);

      expect(bridge.editorView).not.toBeNull();
    });

    it('should register the editor in the bridge editor actions', () => {
      bridge = new WebBridgeImpl();
      expect(bridge.editorActions._privateGetEditorView()).toBeUndefined();
      expect(bridge.editorActions._privateGetEventDispatcher()).toBeUndefined();

      initEditor(bridge);

      expect(bridge.editorActions._privateGetEditorView()).not.toBeUndefined();
      expect(
        bridge.editorActions._privateGetEventDispatcher(),
      ).not.toBeUndefined();
    });

    it('should have called editorReady on native bridge', function() {
      initEditor(bridge);
      expect(toNativeBridge.editorReady).toHaveBeenCalled();
    });
  });

  describe('when the mobile editor is unmounted', () => {
    it('should remove the editorView from the bridge', () => {
      mobileEditor = initEditor(bridge);
      expect(bridge.editorView).not.toBeNull();

      mobileEditor.unmount();

      expect(bridge.editorView).toBeNull();
    });

    it('should unregister the editor in the bridge editor actions', () => {
      mobileEditor = initEditor(bridge);
      expect(bridge.editorActions._privateGetEditorView()).not.toBeUndefined();
      expect(
        bridge.editorActions._privateGetEventDispatcher(),
      ).not.toBeUndefined();

      mobileEditor.unmount();

      expect(bridge.editorActions._privateGetEditorView()).toBeUndefined();
      expect(bridge.editorActions._privateGetEventDispatcher()).toBeUndefined();
    });

    it('should have called editorDestroyed on native bridge', function() {
      initEditor(bridge);
      mobileEditor.unmount();

      expect(toNativeBridge.editorDestroyed).toHaveBeenCalled();
    });
  });

  describe.skip('i18n', () => {
    it('should load en locale by default', () => {
      initEditor();
      expect(mobileEditor.find(IntlProvider).prop('locale')).toBe('en');
    });

    describe('with locale query params set', () => {
      const get = jest.fn();

      beforeEach(() => {
        // @ts-ignore
        global.URLSearchParams = jest.fn(() => ({
          get,
        }));
      });

      it('should load proper locale', () => {
        get.mockImplementation(() => 'es');
        initEditor();

        expect(mobileEditor.find(IntlProvider).prop('locale')).toBe('es');
      });

      it('should load locale with region that is on whitelist', () => {
        get.mockImplementation(() => 'pt-BR');
        initEditor();

        expect(mobileEditor.find(IntlProvider).prop('locale')).toBe('pt-BR');
      });

      it('should fallback to english when translation is not loaded', () => {
        get.mockImplementation(() => 'xx');
        initEditor();

        expect(mobileEditor.find(IntlProvider).prop('locale')).toBe('en');
      });
    });
  });
});
