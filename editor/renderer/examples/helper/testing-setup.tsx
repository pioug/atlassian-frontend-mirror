import React from 'react';
import ReactDOM from 'react-dom';
import {
  ProviderFactory,
  AnnotationUpdateEmitter,
} from '@atlaskit/editor-common';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import { Provider as SmartCardProvider } from '@atlaskit/smart-card';
import { cardClient } from '@atlaskit/media-integration-test-helpers/card-client';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { createEditorMediaMock } from '@atlaskit/editor-test-helpers/media-mock';
import {
  default as Renderer,
  Props as RendererProps,
} from '../../src/ui/Renderer';
import { document as defaultDoc } from '../helper/story-data';
import Sidebar from '../helper/NavigationNext';
import { MentionProvider } from '@atlaskit/mention/types';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import DeprecatedThemeProvider from '@atlaskit/theme/deprecated-provider-please-do-not-use';
import { ThemeModes } from '@atlaskit/theme/types';
import { EmbedHelper } from '@atlaskit/media-integration-test-helpers/embed-helper';
import AnalyticsListeners from '@atlaskit/analytics-listeners';
import { GasPurePayload } from '@atlaskit/analytics-gas-types';

import { RendererActionsContext as RendererContext } from '../../src/ui/RendererActionsContext';
import { WithRendererActions } from '../../src/ui/RendererActionsContext/WithRendererActions';
import {
  AnnotationTypes,
  AnnotationId,
  AnnotationMarkStates,
} from '@atlaskit/adf-schema';
import { ExampleSelectionInlineComponent } from '../helper/annotations';

const mediaMockServer = createEditorMediaMock();
const mediaProvider = storyMediaProviderFactory({
  useMediaPickerAuthProvider: false,
});
const emojiProvider = getEmojiResource();
const contextIdentifierProvider = storyContextIdentifierProviderFactory();
const mentionProvider = Promise.resolve({
  shouldHighlightMention: (mention: { id: string }) =>
    mention.id === 'ABCDE-ABCDE-ABCDE-ABCDE',
} as MentionProvider);
const taskDecisionProvider = Promise.resolve(getMockTaskDecisionResource());

type MountProps = { [T in keyof RendererProps]?: RendererProps[T] } & {
  showSidebar?: boolean;
  withRendererActions?: boolean;
  mockInlineComments?: boolean;
  themeMode?: ThemeModes;
};

const providerFactory = ProviderFactory.create({
  mediaProvider,
  mentionProvider,
  emojiProvider,
  contextIdentifierProvider,
  taskDecisionProvider,
});

function renderRenderer({
  adf,
  props,
  setMode,
}: {
  props: MountProps;
  adf: any;
  setMode?: (mode: boolean) => void;
}) {
  const { showSidebar, ...reactProps } = props;
  return (
    <AnalyticsListeners client={(window as any).__analytics}>
      <SmartCardProvider client={cardClient}>
        <Sidebar showSidebar={!!showSidebar}>
          {(additionalRendererProps: any) => (
            <DeprecatedThemeProvider
              mode={props.themeMode}
              provider={StyledThemeProvider}
            >
              <Renderer
                dataProviders={providerFactory}
                document={adf}
                extensionHandlers={extensionHandlers}
                {...reactProps}
                {...additionalRendererProps}
                eventHandlers={
                  setMode
                    ? {
                        onUnhandledClick: (e) => setMode(true),
                      }
                    : undefined
                }
              />
            </DeprecatedThemeProvider>
          )}
        </Sidebar>
        <EmbedHelper />
      </SmartCardProvider>
    </AnalyticsListeners>
  );
}

const editorPlaceholderClassname = 'editor-vr-test-placeholder';
export const editorPlaceholderSelector = `.${editorPlaceholderClassname}`;

/**
 * Create a function on the window object that mounts the renderer when called.
 * If enableClickToEdit is true, swap out the renderer for a dummy editor when the
 * onUnhandledClick eventHandler is called by the renderer. An example of this behaviour is when
 * clicking in the Jira description, the renderer transitions to the editor.
 * @param win Window objest
 * @param enableClickToEdit Swap out renderer for dummy editor on onUnhandledClick
 */
export function createRendererWindowBindings(
  win: Window,
  enableClickToEdit?: boolean,
) {
  if ((win as any).__mountRenderer) {
    return;
  }

  mediaMockServer.enable();

  const events: GasPurePayload[] = [];
  const send = (e: any) => {
    events.push(e);
  };

  (window as any)['__analytics'] = {
    sendUIEvent: send,
    sendOperationalEvent: send,
    sendTrackEvent: send,
    sendScreenEvent: send,
    events,
  };

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

    /**
     * Callback given to the editor on what to do when onUnhandledClick is called.
     * Swap out the renderer for a dummy editor (which will be clearly identifiable in VR tests)
     */
    const setMode = enableClickToEdit
      ? (mode: boolean) => {
          const rendererContainer = document.getElementById(
            'renderer-container',
          );
          if (!rendererContainer) {
            return;
          }
          const editorPlaceholder = (
            <h1 className={editorPlaceholderClassname}>Editor placeholder</h1>
          );

          ReactDOM.unmountComponentAtNode(rendererContainer);
          ReactDOM.render(editorPlaceholder, rendererContainer);
        }
      : undefined;

    let render = renderRenderer({ adf, props, setMode });
    let content;
    if (props.withRendererActions) {
      content = (
        <RendererContext>
          <WithRendererActions
            render={(actions) => {
              (win as any).__rendererActions = actions;
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
      return annotationIds.map((id) => ({
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
