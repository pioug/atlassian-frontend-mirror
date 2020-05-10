import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import MobileEditor from '../../../editor/mobile-editor-element';
import {
  createCardClient,
  createEmojiProvider,
  createMediaProvider,
  createMentionProvider,
  createCardProvider,
} from '../../../providers';
import { IntlProvider } from 'react-intl';
import waitUntil from '@atlaskit/media-test-helpers/waitUntil';

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

// avoid polluting test logs with error message in console
// please ensure you fix it if you expect console.error to be thrown
// eslint-disable-next-line no-console
let consoleError = console.error;

describe('mobile editor element', () => {
  let mobileEditor: ReactWrapper<typeof MobileEditor>;

  const initEditor = async (): Promise<ReactWrapper<typeof MobileEditor>> => {
    let wrapper: any;
    wrapper = mount(
      <MobileEditor
        mode="light"
        cardClient={createCardClient()}
        cardProvider={createCardProvider()}
        defaultValue={initialDocument}
        emojiProvider={createEmojiProvider()}
        mediaProvider={createMediaProvider()}
        mentionProvider={createMentionProvider()}
      />,
    );

    await waitUntil(() => wrapper.update().find(IntlProvider).length > 0, 1000);
    return wrapper.update();
  };

  beforeEach(() => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
  });

  afterEach(() => {
    mobileEditor.unmount();
    // eslint-disable-next-line no-console
    console.error = consoleError;
    jest.clearAllMocks();
  });

  describe('i18n', () => {
    it('should load en locale by default', async () => {
      mobileEditor = await initEditor();
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

      it('should load proper locale', async () => {
        get.mockImplementation(() => 'es');
        mobileEditor = await initEditor();

        expect(mobileEditor.find(IntlProvider).prop('locale')).toBe('es');
      });

      it('should load locale with region that is on whitelist', async () => {
        get.mockImplementation(() => 'pt-BR');
        mobileEditor = await initEditor();

        expect(mobileEditor.find(IntlProvider).prop('locale')).toBe('pt-BR');
      });

      it('should fallback to english when translation is not loaded', async () => {
        get.mockImplementation(() => 'xx');
        mobileEditor = await initEditor();

        expect(mobileEditor.find(IntlProvider).prop('locale')).toBe('en');
      });
    });
  });
});
