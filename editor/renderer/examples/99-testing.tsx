import React from 'react';
import ReactDOM from 'react-dom';
import { ProviderFactory } from '@atlaskit/editor-common';
import { taskDecision, emoji } from '@atlaskit/util-data-test';
import { Provider } from '@atlaskit/smart-card';
import {
  storyMediaProviderFactory,
  storyContextIdentifierProviderFactory,
  extensionHandlers,
} from '@atlaskit/editor-test-helpers';
import { default as Renderer } from '../src/ui/Renderer';
import { document as defaultDoc } from './helper/story-data';
import Sidebar from './helper/NavigationNext';
import { MentionProvider } from '@atlaskit/mention/types';

const mediaProvider = storyMediaProviderFactory();
const emojiProvider = emoji.storyData.getEmojiResource();
const contextIdentifierProvider = storyContextIdentifierProviderFactory();
const mentionProvider = Promise.resolve({
  shouldHighlightMention: (mention: { id: string }) =>
    mention.id === 'ABCDE-ABCDE-ABCDE-ABCDE',
} as MentionProvider);
const taskDecisionProvider = Promise.resolve(
  taskDecision.getMockTaskDecisionResource(),
);

const providerFactory = ProviderFactory.create({
  mediaProvider,
  mentionProvider,
  emojiProvider,
  contextIdentifierProvider,
  taskDecisionProvider,
});

function createRendererWindowBindings(win: Window) {
  if ((win as Window & { __mountRenderer?: () => void }).__mountRenderer) {
    return;
  }

  (window as any)['__mountRenderer'] = (
    props: { showSidebar?: boolean },
    adf: any = defaultDoc,
  ) => {
    const target = document.getElementById('renderer-container');

    if (!target) {
      return;
    }

    const { showSidebar, ...reactProps } = props;

    ReactDOM.unmountComponentAtNode(target);
    ReactDOM.render(
      <Provider>
        <Sidebar showSidebar={!!showSidebar}>
          {(additionalRendererProps: any) => (
            <Renderer
              dataProviders={providerFactory}
              document={adf}
              extensionHandlers={extensionHandlers}
              {...reactProps}
              {...additionalRendererProps}
            />
          )}
        </Sidebar>
      </Provider>,
      target,
    );
  };
}

export default function RendererExampleForTests() {
  createRendererWindowBindings(window);
  return <div id="renderer-container" />;
}
