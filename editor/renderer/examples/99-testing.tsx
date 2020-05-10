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

import { RendererActionsContext as RendererContext } from '../src/ui/RendererActionsContext';
import { WithRendererActions } from '../src/ui/RendererActionsContext/WithRendererActions';
import RendererActions from '../src/actions/index';

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

interface MountProps {
  showSidebar?: boolean;
  withRendererActions?: boolean;
}

interface WindowBindings {
  __mountRenderer?: () => void;
  __rendererActions?: RendererActions;
}

const providerFactory = ProviderFactory.create({
  mediaProvider,
  mentionProvider,
  emojiProvider,
  contextIdentifierProvider,
  taskDecisionProvider,
});

function renderRenderer({ adf, props }: { props: MountProps; adf: any }) {
  const { showSidebar, ...reactProps } = props;
  return (
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
    </Provider>
  );
}

function createRendererWindowBindings(win: Window & WindowBindings) {
  if (win.__mountRenderer) {
    return;
  }

  (window as any)['__mountRenderer'] = (
    props: MountProps,
    adf: any = defaultDoc,
  ) => {
    const target = document.getElementById('renderer-container');

    if (!target) {
      return;
    }

    let render = renderRenderer({ adf, props });
    let content;
    if (props.withRendererActions) {
      content = (
        <RendererContext>
          <WithRendererActions
            render={actions => {
              win.__rendererActions = actions;
              return render;
            }}
          />
        </RendererContext>
      );
    }

    ReactDOM.unmountComponentAtNode(target);
    ReactDOM.render(content || render, target);
  };
}

export default function RendererExampleForTests() {
  createRendererWindowBindings(window);
  return <div id="renderer-container" />;
}
