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
import { InjectedIntl } from 'react-intl';
import { FetchProxy } from '../../../utils/fetch-proxy';
import { createCollabProviderFactory } from '../../../providers/collab-provider';
import { toNativeBridge } from '../../web-to-native';
import * as UseEditorReadyModule from '../../hooks/use-editor-ready';
import * as UsePageTitleModule from '../../hooks/use-page-title';
import * as UseEditorDestroyedModule from '../../hooks/use-editor-destroyed';
import MobileEditorConfiguration from '../../editor-configuration';
import WebBridgeImpl from '../../native-to-web/implementation';
import * as UseEditorConfigurationModule from '../../hooks/use-editor-configuration';

jest.mock('../../../query-param-reader');
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

  const intlMock = {
    formatMessage: messageDescriptor =>
      messageDescriptor && messageDescriptor.defaultMessage,
  } as InjectedIntl;
  const initEditor = (
    editorConfig?: MobileEditorConfiguration,
  ): ReactWrapper<typeof MobileEditor> => {
    bridge = new WebBridgeImpl();
    mobileEditor = mount(
      <MobileEditor
        createCollabProvider={createCollabProviderFactory(fetchProxy)}
        cardClient={createCardClient()}
        cardProvider={createCardProvider()}
        defaultValue={initialDocument}
        emojiProvider={createEmojiProvider(fetchProxy)}
        mediaProvider={createMediaProvider()}
        mentionProvider={createMentionProvider()}
        intl={intlMock}
        initialEditorConfig={editorConfig}
        bridge={bridge}
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

  describe('when the mobile editor is mounted', () => {
    it('should have called useEditorReady', () => {
      jest.spyOn(toNativeBridge, 'editorReady').mockImplementation(jest.fn());
      const editorReady = jest.spyOn(UseEditorReadyModule, 'useEditorReady');
      initEditor();
      expect(editorReady).toBeCalled();
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

    it('should have called useEditorConfiguration', () => {
      const editorconfiguration = jest.spyOn(
        UseEditorConfigurationModule,
        'useEditorConfiguration',
      );
      initEditor();
      expect(editorconfiguration).toBeCalled();
    });
  });

  describe('when the mobile editor is unmounted', () => {
    it('it should have called useEditorDestroyed', () => {
      const editorDestroyed = jest.spyOn(
        UseEditorDestroyedModule,
        'useEditorDestroyed',
      );
      mobileEditor = initEditor();
      mobileEditor.unmount();
      expect(editorDestroyed).toBeCalled();
    });
  });

  describe('Mobile Editor with default editor configuration', () => {
    it('should set the editorConfiguration with dark mode', () => {
      const editorConfig = new MobileEditorConfiguration('{ "mode": "dark" }');

      mobileEditor = initEditor(editorConfig);

      expect(mobileEditor.find('AtlaskitThemeProvider').prop('mode')).toEqual(
        'dark',
      );
    });

    it('should set the default editor configuration to the bridge', () => {
      const editorConfig = new MobileEditorConfiguration(
        '{"mode": "dark","enableQuickInsert": true}',
      );
      mobileEditor = initEditor(editorConfig);

      expect(bridge.getEditorConfiguration().mode()).toEqual('dark');
      expect(bridge.getEditorConfiguration().isQuickInsertEnabled()).toEqual(
        true,
      );
    });
  });
});
