import React from 'react';
import MobileRenderer from '../../mobile-renderer-element';
import {
  createCardClient,
  createEmojiProvider,
  createMediaProvider,
  createMentionProvider,
} from '../../../providers';
import { eventDispatcher, EmitterEvents } from '../../dispatcher';
import { render, unmountComponentAtNode } from 'react-dom';
import { FetchProxy } from '../../../utils/fetch-proxy';
import { sendToBridge as originalSendToBridge } from '../../../bridge-utils';
import { doc, p, text } from '@atlaskit/adf-utils/builders';
import { render as renderTestingLib, cleanup } from '@testing-library/react';

jest.mock('../../../bridge-utils');

let container: HTMLElement;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
});

describe('renderer bridge', () => {
  const createPromiseMock = jest.fn();
  let fetchProxy: FetchProxy;

  beforeEach(() => {
    fetchProxy = new FetchProxy();
    fetchProxy.enable();
    createPromiseMock.mockReset();
    window.renderBridge = {
      onContentRendered: jest.fn(),
      onRenderedContentHeightChanged: jest.fn(),
    };
  });

  afterEach(() => {
    fetchProxy.disable();
    cleanup();
  });

  describe('when the Mobile Renderer is loaded without document', () => {
    it('should listener for setRendererContent', () => {
      expect(
        eventDispatcher.listeners(EmitterEvents.SET_RENDERER_CONTENT),
      ).toHaveLength(0);
      // do not wrapper this render with act
      render(
        <MobileRenderer
          document={''}
          cardClient={createCardClient()}
          emojiProvider={createEmojiProvider(fetchProxy)}
          mediaProvider={createMediaProvider()}
          mentionProvider={createMentionProvider()}
        />,
        container,
      );

      expect(
        eventDispatcher.listeners(EmitterEvents.SET_RENDERER_CONTENT),
      ).toHaveLength(1);
    });
  });

  describe('Lifecycle', () => {
    let sendToBridge: jest.Mocked<typeof originalSendToBridge>;

    beforeEach(async () => {
      ({ sendToBridge } = ((await import('../../../bridge-utils')) as any) as {
        sendToBridge: jest.Mocked<typeof originalSendToBridge>;
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call rendererReady when the initial document has been renderer', async () => {
      const initialDoc = doc(p(text('foo')));
      const result = renderTestingLib(
        <MobileRenderer
          document={JSON.stringify(initialDoc)}
          cardClient={createCardClient()}
          emojiProvider={createEmojiProvider(fetchProxy)}
          mediaProvider={createMediaProvider()}
          mentionProvider={createMentionProvider()}
        />,
      );

      await result.findByText('foo');
      expect(sendToBridge).toHaveBeenCalledWith(
        'lifecycleBridge',
        'rendererReady',
      );
    });

    it('should call rendererDestroyed when the renderer is unmounted', async () => {
      const initialDoc = doc(p(text('foo')));
      const result = renderTestingLib(
        <MobileRenderer
          document={JSON.stringify(initialDoc)}
          cardClient={createCardClient()}
          emojiProvider={createEmojiProvider(fetchProxy)}
          mediaProvider={createMediaProvider()}
          mentionProvider={createMentionProvider()}
        />,
      );

      await result.findByText('foo');
      result.unmount();

      expect(sendToBridge).toHaveBeenCalledWith(
        'lifecycleBridge',
        'rendererDestroyed',
      );
    });
  });
});
