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
});
