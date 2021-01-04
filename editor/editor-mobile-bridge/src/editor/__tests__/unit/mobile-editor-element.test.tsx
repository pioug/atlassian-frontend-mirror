import { mount, ReactWrapper } from 'enzyme';
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
import MobileEditorConfiguration from '../../editor-configuration';
import WebBridgeImpl from '../../native-to-web/implementation';

jest.mock('../../../query-param-reader');
jest.mock('../../web-to-native');
jest.mock('../../../i18n/use-translations', () => ({
  useTranslations: (locale: string) => ({
    locale,
    messages: {},
  }),
}));

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
      expect(mobileEditor.find('AtlaskitThemeProvider').prop('mode')).toEqual(
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

    it('should have light mode when the Editor is loaded with default config', () => {
      const mobileEditor = initEditor();
      expect(mobileEditor.find('AtlaskitThemeProvider').prop('mode')).toEqual(
        'light',
      );
    });

    it('should have called isPredictableListEnabled', () => {
      const mockedAllowPredictableList = jest.spyOn(
        MobileEditorConfiguration.prototype,
        'isPredictableListEnabled',
      );
      initEditor();
      expect(mockedAllowPredictableList).toBeCalled();
    });

    it('should have called isAllowScrollGutter', () => {
      const mockedAllowScrollGutter = jest.spyOn(
        MobileEditorConfiguration.prototype,
        'isAllowScrollGutter',
      );

      initEditor();

      expect(mockedAllowScrollGutter).toBeCalled();
    });
  });

  describe('Mobile Editor with Re Configuration', () => {
    it('should have called isPredictableListEnabled', () => {
      const mockedAllowPredictableList = jest.spyOn(
        MobileEditorConfiguration.prototype,
        'isPredictableListEnabled',
      );
      initEditor();
      bridge.configureEditor('{"allowPredictableList": true}');
      expect(mockedAllowPredictableList).toBeCalled();
    });
  });
});
