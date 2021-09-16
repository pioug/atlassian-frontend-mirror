import { mount, ReactWrapper } from 'enzyme';
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';

import React from 'react';
import { IntlProvider } from 'react-intl';
import MobileEditor from '../../mobile-editor-element';
import {
  createCardClient,
  createEmojiProvider,
  createMediaProvider,
  createMentionProvider,
  createCardProvider,
} from '../../../providers';
import { FetchProxy } from '../../../utils/fetch-proxy';
import { createCollabProviderFactory } from '../../../providers/collab-provider';
import * as UsePageTitleModule from '../../hooks/use-page-title';
import * as UseEditorLifecycleModule from '../../hooks/use-editor-life-cycle';
import * as UseQuickInsertModule from '../../hooks/use-quickinsert';
import * as UsePluginListenersModule from '../../hooks/use-plugin-listeners';
import * as UseToolbarSubscriptionModule from '../../hooks/use-toolbar-subscription';
import MobileEditorConfiguration from '../../editor-configuration';
import WebBridgeImpl from '../../native-to-web/implementation';
import { toNativeBridge } from '../../web-to-native';
import { Editor } from '@atlaskit/editor-core';

jest.mock('../../../query-param-reader');
jest.mock('../../web-to-native');
jest.mock('../../../i18n/use-translations', () => ({
  useTranslations: (locale: string) => ({
    locale,
    messages: {},
  }),
}));
jest.mock('lodash/throttle', () => jest.fn((fn) => fn));

// queueMicrotask is not defined in jest globals
let oldQueueMicrotask: any;
beforeAll(() => {
  oldQueueMicrotask = window.queueMicrotask;
  window.queueMicrotask = (fn) => setTimeout(fn, 0);
});

afterAll(() => {
  window.queueMicrotask = oldQueueMicrotask;
});

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

  const updateTextMock = jest.spyOn(toNativeBridge, 'updateText');
  const updateTextWithADFStatusMock = jest.spyOn(
    toNativeBridge,
    'updateTextWithADFStatus',
  );

  const initEditor = (
    editorConfig?: MobileEditorConfiguration,
  ): ReactWrapper<typeof MobileEditor> => {
    bridge = new WebBridgeImpl();
    const editorConfiguration = editorConfig || new MobileEditorConfiguration();

    mobileEditor = mount(
      <MobileEditor
        createCollabProvider={createCollabProviderFactory(fetchProxy)}
        cardClient={createCardClient()}
        cardProvider={createCardProvider()}
        defaultValue={initialDocument}
        emojiProvider={createEmojiProvider(fetchProxy)}
        mediaProvider={createMediaProvider()}
        mentionProvider={createMentionProvider()}
        bridge={bridge}
        editorConfiguration={editorConfiguration}
        locale="fr"
      />,
    );

    return mobileEditor;
  };

  beforeAll(() => {
    let observeMock = {
      observe: jest.fn(),
      disconnect: jest.fn(),
    };

    (window as any).ResizeObserver = () => observeMock;

    // avoid polluting test logs with error message in console
    // please ensure you fix it if you expect console.error to be thrown
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
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

  it('should use locale prop value in react intl provider', () => {
    const mobileEditor = initEditor();

    expect(mobileEditor.find(IntlProvider).prop('locale')).toBe('fr');
  });

  describe('should have correct default configurations', () => {
    it('should align media left on insert', () => {
      const editor = initEditor(
        new MobileEditorConfiguration(
          JSON.stringify({ editorAppearance: 'compact' }),
        ),
      ).find(Editor);
      expect((editor.prop('media') as any).alignLeftOnInsert).toBeTruthy();
    });

    it('should enable standard panels by default', () => {
      const editor = initEditor(
        new MobileEditorConfiguration(
          JSON.stringify({ editorAppearance: 'compact' }),
        ),
      ).find(Editor);
      expect(editor.prop('allowPanel')).toBeTruthy();
    });
  });

  describe('custom panel', () => {
    it('should disable custom panels when not configured', () => {
      const editor = initEditor(
        new MobileEditorConfiguration(
          JSON.stringify({
            editorAppearance: 'compact',
            allowCustomPanel: false,
          }),
        ),
      ).find(Editor);
      expect(editor.prop('allowPanel')).toBeTruthy();
    });

    it('should enable custom panels when configured', () => {
      const editor = initEditor(
        new MobileEditorConfiguration(
          JSON.stringify({
            editorAppearance: 'compact',
            allowCustomPanel: true,
          }),
        ),
      ).find(Editor);
      expect(editor.prop('allowPanel')).toEqual({
        UNSAFE_allowCustomPanel: true,
      });
    });
  });

  describe('when the mobile editor is mounted', () => {
    it('should have called useEditorLifecycle', () => {
      const useEditorLifecycle = jest.spyOn(
        UseEditorLifecycleModule,
        'useEditorLifecycle',
      );
      initEditor();
      expect(useEditorLifecycle).toBeCalled();
    });

    it('should have called usePageTitle', () => {
      const pageTitle = jest.spyOn(UsePageTitleModule, 'usePageTitle');
      initEditor();
      expect(pageTitle).toBeCalled();
    });

    it('should have light mode when the Editor is loaded with default config', () => {
      const mobileEditor = initEditor();
      expect(mobileEditor.find(AtlaskitThemeProvider).prop('mode')).toEqual(
        'light',
      );
    });

    it('should have called useQuickInsert', () => {
      const useQuickInsert = jest.spyOn(UseQuickInsertModule, 'useQuickInsert');
      initEditor();
      expect(useQuickInsert).toBeCalled();
    });

    it('should have called usePluginListeners', () => {
      const usePluginListeners = jest.spyOn(
        UsePluginListenersModule,
        'usePluginListeners',
      );
      initEditor();
      expect(usePluginListeners).toBeCalled();
    });

    it('should have called useToolbarSubscription', () => {
      const useToolbarSubscription = jest.spyOn(
        UseToolbarSubscriptionModule,
        'useToolbarSubscription',
      );
      initEditor();
      expect(useToolbarSubscription).toBeCalled();
    });

    it('should have called bridge.setCollabProviderPromise', () => {
      const setCollabProviderPromise = jest.spyOn(
        WebBridgeImpl.prototype,
        'setCollabProviderPromise',
      );
      initEditor();
      expect(setCollabProviderPromise).toBeCalled();
    });

    it('should have light mode when the Editor is loaded with default config', () => {
      const mobileEditor = initEditor();
      expect(mobileEditor.find(AtlaskitThemeProvider).prop('mode')).toEqual(
        'light',
      );
    });

    it('should have called isUnpredictableInputRuleEnabled', () => {
      const mockedUseUnpredictableInputRule = jest.spyOn(
        MobileEditorConfiguration.prototype,
        'isUnpredictableInputRuleEnabled',
      );
      initEditor();
      expect(mockedUseUnpredictableInputRule).toBeCalled();
    });

    it('should have called isScrollGutterPersisted', () => {
      const mockedPersistScrollGutter = jest.spyOn(
        MobileEditorConfiguration.prototype,
        'isScrollGutterPersisted',
      );

      initEditor();

      expect(mockedPersistScrollGutter).toBeCalled();
    });

    it('should have called isIndentationAllowed', () => {
      const mockedisIndentationAllowed = jest.spyOn(
        MobileEditorConfiguration.prototype,
        'isIndentationAllowed',
      );

      initEditor();

      expect(mockedisIndentationAllowed).toBeCalled();
    });
  });

  describe('Mobile Editor with Re Configuration', () => {
    it('should have called isUnpredictableInputRuleEnabled', () => {
      const mockedUseUnpredictableInputRule = jest.spyOn(
        MobileEditorConfiguration.prototype,
        'isUnpredictableInputRuleEnabled',
      );
      initEditor();
      bridge.configure('{"useUnpredictableInputRule": false}');
      expect(mockedUseUnpredictableInputRule).toBeCalled();
    });
  });

  describe('Mobile Editor on change content', () => {
    it('should call updateText with content when feature flag is disabled', () => {
      jest
        .spyOn(
          MobileEditorConfiguration.prototype,
          'isAllowEmptyADFCheckEnabled',
        )
        .mockImplementation(() => false);
      initEditor();
      bridge.setContent('{"version":1,"type":"doc","content":[]}');

      expect(updateTextMock).toBeCalledWith(
        '{"version":1,"type":"doc","content":[]}',
      );
    });

    it('should call updateText with content when feature flag is enabled', () => {
      jest
        .spyOn(
          MobileEditorConfiguration.prototype,
          'isAllowEmptyADFCheckEnabled',
        )
        .mockImplementation(() => true);
      initEditor();
      bridge.setContent('{"version":1,"type":"doc","content":[]}');

      expect(updateTextWithADFStatusMock).toBeCalledWith(
        '{"version":1,"type":"doc","content":[]}',
        true,
      );
    });
  });
});
