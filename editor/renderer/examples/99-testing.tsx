import React from 'react';
import ReactDOM from 'react-dom';
import {
  ProviderFactory,
  AnnotationUpdateEmitter,
} from '@atlaskit/editor-common';
import { taskDecision, emoji } from '@atlaskit/util-data-test';
import { Provider as SmartCardProvider } from '@atlaskit/smart-card';
import { cardClient } from '@atlaskit/media-integration-test-helpers';
import {
  MediaMock,
  generateFilesFromTestData,
  fakeImage,
  wideImage,
} from '@atlaskit/media-test-helpers';
import {
  testMediaFileId,
  testMediaGroupFileId,
  storyMediaProviderFactory,
  storyContextIdentifierProviderFactory,
  extensionHandlers,
  testMediaPictureFileId,
} from '@atlaskit/editor-test-helpers';
import {
  default as Renderer,
  Props as RendererProps,
} from '../src/ui/Renderer';
import { document as defaultDoc } from './helper/story-data';
import Sidebar from './helper/NavigationNext';
import { MentionProvider } from '@atlaskit/mention/types';

import { RendererActionsContext as RendererContext } from '../src/ui/RendererActionsContext';
import { WithRendererActions } from '../src/ui/RendererActionsContext/WithRendererActions';
import RendererActions from '../src/actions/index';
import {
  AnnotationTypes,
  AnnotationId,
  AnnotationMarkStates,
} from '@atlaskit/adf-schema';
import { ExampleSelectionInlineComponent } from './helper/annotations';

const mediaMockServer = new MediaMock({
  MediaServicesSample: generateFilesFromTestData([
    {
      id: testMediaFileId,
      name: 'one.svg',
      dataUri: fakeImage,
    },
    {
      id: testMediaGroupFileId,
      name: 'text_file.txt',
      mediaType: 'doc',
    },
    {
      id: testMediaPictureFileId,
      name: 'wide_image.png',
      mediaType: 'image',
      dataUri: wideImage,
    },
  ]),
});
const mediaProvider = storyMediaProviderFactory({
  useMediaPickerAuthProvider: false,
});
const emojiProvider = emoji.storyData.getEmojiResource();
const contextIdentifierProvider = storyContextIdentifierProviderFactory();
const mentionProvider = Promise.resolve({
  shouldHighlightMention: (mention: { id: string }) =>
    mention.id === 'ABCDE-ABCDE-ABCDE-ABCDE',
} as MentionProvider);
const taskDecisionProvider = Promise.resolve(
  taskDecision.getMockTaskDecisionResource(),
);

type MountProps = { [T in keyof RendererProps]?: RendererProps[T] } & {
  showSidebar?: boolean;
  withRendererActions?: boolean;
  mockInlineComments?: boolean;
};

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
    <SmartCardProvider client={cardClient}>
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
    </SmartCardProvider>
  );
}

function createRendererWindowBindings(win: Window & WindowBindings) {
  if (win.__mountRenderer) {
    return;
  }

  mediaMockServer.enable();

  (window as any)['__mountRenderer'] = (
    props: MountProps,
    adf: any = defaultDoc,
  ) => {
    const target = document.getElementById('renderer-container');

    if (!target) {
      return;
    }

    if (props && props.mockInlineComments) {
      mockAnnotationProps(props);
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

// helper function to add dummy inline comments related props
function mockAnnotationProps(props: MountProps) {
  const annotationInlineCommentProvider = {
    getState: async (annotationIds: AnnotationId[]) => {
      return annotationIds.map(id => ({
        id,
        annotationType: AnnotationTypes.INLINE_COMMENT,
        state: AnnotationMarkStates.ACTIVE,
      }));
    },
    allowDraftMode: true,
    selectionComponent: ExampleSelectionInlineComponent(() => {}),
    updateSubscriber: new AnnotationUpdateEmitter(),
  };
  // extend annotationProvider with dummy inline comment provier settings for testing
  props.annotationProvider = {
    ...props.annotationProvider,
    [AnnotationTypes.INLINE_COMMENT]: {
      ...(props.annotationProvider &&
        props.annotationProvider[AnnotationTypes.INLINE_COMMENT]),
      ...annotationInlineCommentProvider,
    },
  };

  return props;
}

export default function RendererExampleForTests() {
  createRendererWindowBindings(window);
  return <div id="renderer-container" />;
}
