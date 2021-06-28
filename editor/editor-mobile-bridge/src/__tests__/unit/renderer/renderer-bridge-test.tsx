import { ReactWrapper } from 'enzyme';
import React from 'react';
import { MobileRenderer } from '../../../renderer/mobile-renderer-element';
import WebBridgeImpl from '../../../renderer/native-to-web/implementation';
import { InjectedIntl } from 'react-intl';
import { mountWithIntl } from 'enzyme-react-intl';
import {
  createCardClient,
  createEmojiProvider,
  createMediaProvider,
  createMentionProvider,
} from '../../../providers';
import { FetchProxy } from '../../../utils/fetch-proxy';
import RendererBridgeImplementation from '../../../renderer/native-to-web/implementation';

const initialDocument = JSON.stringify({
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is the mobile renderer',
        },
      ],
    },
  ],
});

const invalidDocument = JSON.stringify({
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'mention',
      content: [
        {
          type: 'paragraph',
          text: 'This is invalid adf',
        },
      ],
    },
  ],
});

jest.mock('../../../version.json', () => ({
  name: '@atlaskit/editor-mobile-bridge',
  version: '1.2.3.4',
}));

describe('general', () => {
  const bridge: any = new WebBridgeImpl();

  it('should return valid bridge version', () => {
    expect(bridge.currentVersion()).toEqual('1.2.3.4');
  });
});

describe('renderer bridge', () => {
  let onContentRendered: jest.Mock;
  let mobileRenderer: ReactWrapper;
  const rendererBridge = new RendererBridgeImplementation();
  const intlMock = ({
    formatMessage: (messageDescriptor: any) =>
      messageDescriptor && messageDescriptor.defaultMessage,
  } as unknown) as InjectedIntl;

  const initRenderer = (adf: string): ReactWrapper =>
    mountWithIntl(
      <MobileRenderer
        document={adf}
        cardClient={createCardClient()}
        emojiProvider={createEmojiProvider(new FetchProxy())}
        mediaProvider={createMediaProvider()}
        mentionProvider={createMentionProvider()}
        intl={intlMock}
        rendererBridge={rendererBridge}
      />,
    );

  beforeEach(() => {
    // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
    //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(1);
    });
    onContentRendered = jest.fn();
    window.renderBridge = {
      onContentRendered,
      onRenderedContentHeightChanged() {},
    };
  });

  afterEach(() => {
    mobileRenderer.unmount();
  });

  it('should call renderBridge.onContentRendered() once rendered', () => {
    mobileRenderer = initRenderer(initialDocument);
    expect(onContentRendered).toHaveBeenCalled();
  });

  it('should still call renderBridge.onContentRendered() when given invalid adf', () => {
    mobileRenderer = initRenderer(invalidDocument);
    expect(onContentRendered).toHaveBeenCalled();
  });
});
