import { mount } from 'enzyme';
import React from 'react';
import { ResolveResponse } from '@atlaskit/smart-card';
import {
  MobileSmartCardClient,
  createCardClient,
} from '../../../providers/cardProvider';
import { MobileRenderer } from '../../../renderer/mobile-renderer-element';
import {
  createEmojiProvider,
  createMediaProvider,
  createMentionProvider,
} from '../../../providers';
import { FetchProxy } from '../../../utils/fetch-proxy';
import { InjectedIntl } from 'react-intl';
import RendererBridgeImplementation from '../../../renderer/native-to-web/implementation';

type MockedEvent = { preventDefault: () => void; defaultPrevented: boolean };

function createMockedPreventableEvent(): MockedEvent {
  const e: MockedEvent = {
    defaultPrevented: false,
    preventDefault: () => {},
  };
  e.preventDefault = jest.fn(() => {
    e.defaultPrevented = true;
  });
  return e;
}

class MockedMobileSmartCardClient extends MobileSmartCardClient {
  async fetchData(url: string) {
    return Promise.resolve({
      meta: {
        visibility: 'restricted',
        access: 'granted',
        auth: [
          {
            displayName: 'github.com',
            key: 'default',
            url:
              'https://id.atlassian.com/outboundAuth/start?containerId=12e35df3-21ea-4225-bd53-7a6be9760507&serviceKey=default',
          },
        ],
        definitionId: 'c16ac6b8-6717-4d75-87ef-ff187a1aaaab',
      },
      data: {
        '@context': {
          '@vocab': 'https://www.w3.org/ns/activitystreams#',
          atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
          schema: 'http://schema.org/',
        },
        '@type': 'Object',
        url: 'https://github.com/ProseMirror/prosemirror-view',
        'atlassian:updatedBy': {
          '@type': 'Person',
          image: 'https://avatars.githubusercontent.com/u/20928690?',
          name: 'tuser',
        },
        generator: {
          '@type': 'Application',
          icon: {
            '@type': 'Image',
            url: 'https://github.githubassets.com/favicon.ico',
          },
          name: 'Github Object Provider',
        },
      },
    } as ResolveResponse);
  }
}

const mockCardClient = new MockedMobileSmartCardClient();

const linkADF = JSON.stringify({
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: "I'm a normal link",
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'http://prosemirror.net',
              },
            },
          ],
        },
      ],
    },
  ],
});
const smartLinkADF = JSON.stringify({
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'inlineCard',
          attrs: {
            url: 'https://github.com/ProseMirror/prosemirror-view',
          },
        },
      ],
    },
  ],
});

/**
 * This test suite ensures that clicking links inside the mobile renderer
 * correctly prevent the default browser behaviour.
 *
 * These tests mount the `<MobileRenderer />` component in order to
 * test the link click handlers which get defined in that file, and
 * are passed into the instance via the `eventHandler` prop.
 *
 * Unfortunately, the below warning is logged by `react-dom` because the
 * rendered smart card component uses async state updates.
 * We don't have the opportunity to wrap them in `act()` in this case.
 *
 * `Warning: An update to CardWithUrlContent inside a test was not wrapped in act(...).`
 */
describe('renderer bridge: links', () => {
  const intlMock = ({
    formatMessage: (messageDescriptor: any) =>
      messageDescriptor && messageDescriptor.defaultMessage,
  } as unknown) as InjectedIntl;
  const rendererBridge = new RendererBridgeImplementation();
  beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(1);
      return 1;
    });
  });

  it('should prevent WebView redirection when clicking regular links', () => {
    const mobileRenderer = mount(
      <MobileRenderer
        cardClient={createCardClient()}
        emojiProvider={createEmojiProvider(new FetchProxy())}
        mediaProvider={createMediaProvider()}
        mentionProvider={createMentionProvider()}
        document={linkADF}
        intl={intlMock}
        rendererBridge={rendererBridge}
      />,
    );

    const normalLink = mobileRenderer.find('a:not([role])').first();
    const mockMouseEvent = createMockedPreventableEvent();
    normalLink.simulate('click', mockMouseEvent);
    expect(mockMouseEvent.preventDefault).toHaveBeenCalled();
    expect(mockMouseEvent.defaultPrevented).toEqual(true);

    mobileRenderer.unmount();
  });

  it('should prevent WebView redirection when clicking smart links', async (done) => {
    const mobileRenderer = mount(
      <MobileRenderer
        document={smartLinkADF}
        cardClient={mockCardClient}
        emojiProvider={createEmojiProvider(new FetchProxy())}
        mediaProvider={createMediaProvider()}
        mentionProvider={createMentionProvider()}
        intl={intlMock}
        rendererBridge={rendererBridge}
      />,
    );

    // Wait 100ms for the smart link provider to resolve the url's data and re-render
    await new Promise((resolve) => {
      setTimeout(() => {
        mobileRenderer.update();
        resolve();
      }, 100);
    });

    const smartLink = mobileRenderer
      .find('span[data-inline-card] a[role]')
      .first();
    const mockMouseEvent = createMockedPreventableEvent();
    smartLink.simulate('click', mockMouseEvent);
    expect(mockMouseEvent.preventDefault).toHaveBeenCalled();
    expect(mockMouseEvent.defaultPrevented).toEqual(true);

    mobileRenderer.unmount();
    done();
  });
});
