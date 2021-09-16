import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider, addLocaleData } from 'react-intl';
import { EditorView } from 'prosemirror-view';
import { Step } from 'prosemirror-transform';
import { AnnotationTypes } from '@atlaskit/adf-schema';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import DeprecatedThemeProvider from '@atlaskit/theme/deprecated-provider-please-do-not-use';
import { ThemeProvider } from 'styled-components';
import {
  getEmojiProvider,
  currentUser,
} from '@atlaskit/util-data-test/get-emoji-provider';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import { createCollabEditProvider } from '@atlaskit/synchrony-test-helpers';
import { ExtensionHandlers } from '@atlaskit/editor-common';
import { cardProvider } from '@atlaskit/editor-test-helpers/card-provider';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import { macroProvider } from '@atlaskit/editor-test-helpers/mock-macro-provider';
import { extensionHandlers as exampleExtensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import {
  ExampleCreateInlineCommentComponent,
  ExampleViewInlineCommentComponent,
} from '@atlaskit/editor-test-helpers/example-inline-comment-component';
import { createEditorMediaMock } from '@atlaskit/editor-test-helpers/media-mock';
import { TestExtensionProviders } from '@atlaskit/editor-test-helpers/vr-utils';

import {
  JSONTransformer,
  JSONDocNode,
} from '@atlaskit/editor-json-transformer';
import { MockActivityResource } from './activity-provider';
import ClipboardHelper from '../examples/1-clipboard-helper';
import EditorActions from '../src/actions';
import { withSidebarContainer } from './SidebarContainer';
import quickInsertProviderFactory from './quick-insert-provider';

import { EditorProps } from '../src';
import { createTestExtensionProvider } from '../src/plugins/floating-toolbar/__tests__/_helpers';
import { createExtensionFramesProvider } from '../src/__tests__/visual-regression/common/__helpers__/extensionFrameManifest';

const mediaMockServer = createEditorMediaMock();
/**
 * Creates an example editor for VR or Integration tests.
 */
export function createEditorExampleForTests<T>(
  render: EditorExampleRenderFunction<T>,
  { clipboard = true },
) {
  createEditorWindowBindings<T>(window, render);
  return (
    <>
      <div id="editor-container" style={{ height: '100%', width: '100%' }} />
      {clipboard && <ClipboardHelper />}
    </>
  );
}

function createEditorWindowBindings<T>(
  win: WindowWithExtensionsForTesting,
  render: EditorExampleRenderFunction<T>,
) {
  if (win.__mountEditor) {
    return;
  }

  createLoadReactIntlLocale(win);
  const internalMediaMock = createMediaMockEnableOnce();

  const mountEditor: (
    props: T,
    opts: MountEditorOptions,
    MaybeWrapper?: EditorExampleComponent<T>,
  ) => void = (props, options = {}, MaybeWrapper) => {
    const target = document.getElementById('editor-container');

    if (!target) {
      return;
    }

    // If MaybeWrapper is defined it means that we are updating editor props.
    if (!MaybeWrapper) {
      ReactDOM.unmountComponentAtNode(target);
    }

    options.providers = mapPropsToProviders(options.providers, props);
    const providers = createProviders(options.providers, {
      editorProps: {},
      withTestExtensionProviders: options.withTestExtensionProviders,
    });

    const Wrapper = MaybeWrapper || createWrappers(options, render);
    const extensionHandlers = createExtensionHandlers(
      !!options.extensionHandlers,
      props,
    );

    if (options.providers && options.providers.media) {
      internalMediaMock.enable();
    } else {
      internalMediaMock.disable();
    }

    addDummyMediaAltTextValidator(options, props);
    createUpdateEditorProps(win, props, options, Wrapper);

    ReactDOM.render(
      <Wrapper
        props={props || {}}
        nonSerializableProps={{
          providers,
          extensionHandlers,
          withContextPanel: options.withContextPanel,
        }}
        lifeCycleHandlers={{
          onMount(actions: any) {
            const view = actions._privateGetEditorView();
            win.__editorView = view;
            win.__documentToJSON = function () {
              const transform = new JSONTransformer();
              const doc = view!.state.doc;

              return transform.encode(doc);
            };
            win.__applyRemoteSteps = function (stepsAsString: string[]) {
              const {
                state,
                state: { schema, tr },
              } = view!;

              const stepsAsJSON = stepsAsString.map((s) => JSON.parse(s));
              const steps = stepsAsJSON.map((step) =>
                Step.fromJSON(schema, step),
              );

              if (tr) {
                steps.forEach((step) => tr.step(step));

                tr.setMeta('addToHistory', false);
                tr.setMeta('isRemote', true);

                const { from, to } = state.selection;
                const [firstStep] = stepsAsJSON;

                /**
                 * If the cursor is a the same position as the first step in
                 * the remote data, we need to manually set it back again
                 * in order to prevent the cursor from moving.
                 */
                if (from === firstStep.from && to === firstStep.to) {
                  tr.setSelection(state.selection);
                }

                const newState = state.apply(tr);
                view!.updateState(newState);
              }
            };
          },
          onChange() {
            if (win.onChangeCounter !== undefined) {
              win.onChangeCounter++;
            }
          },
          onDestroy: () => {
            win.__editorView = undefined;
            win.__applyRemoteSteps = undefined;
            win.__documentToJSON = undefined;
            win.onChangeCounter = undefined;
          },
        }}
        withCollab={options.withCollab}
      />,
      target,
    );
  };

  win.__mountEditor = mountEditor;
}

/**
 *
 * Helper functions
 *
 */

function createMediaMockEnableOnce() {
  let enabled = false;
  return {
    enable() {
      if (!enabled) {
        enabled = true;
        mediaMockServer.enable();
      }
    },
    disable() {
      // We dont change enable to false, because disabled is not implemented in mock server
      mediaMockServer.disable();
    },
  };
}

function createExtensionHandlers(
  extensionHandlers: boolean,
  props: EditorProps,
) {
  return extensionHandlers || props.allowExtension
    ? exampleExtensionHandlers
    : {};
}

function addDummyMediaAltTextValidator(
  opts: Record<string, any> = {},
  props: EditorProps = {},
) {
  if (
    props &&
    props.media &&
    opts.invalidAltTextValues &&
    opts.invalidAltTextValues.length
  ) {
    props.media.altTextValidator = (value: any) =>
      (opts.invalidAltTextValues as string[]).includes(value)
        ? ['Invalid value']
        : [];
  }
}

function createProviders(
  opts: Record<string, any> = {},
  {
    withTestExtensionProviders = {},
    editorProps: props = {},
  }: {
    withTestExtensionProviders?: TestExtensionProviders;
    editorProps?: EditorProps;
  },
) {
  const providers: Record<string, any> = {
    emojiProvider: getEmojiProvider({
      uploadSupported: true,
      currentUser,
    }),
    mentionProvider: Promise.resolve(mentionResourceProvider),
    taskDecisionProvider: Promise.resolve(getMockTaskDecisionResource()),
    contextIdentifierProvider: storyContextIdentifierProviderFactory(),
    activityProvider: Promise.resolve(new MockActivityResource()),
    macroProvider: Promise.resolve(macroProvider),
    quickInsertProvider: Promise.resolve(quickInsertProviderFactory()),
  };

  if (opts.media || (props && props.media)) {
    providers.mediaProvider = storyMediaProviderFactory({
      useMediaPickerAuthProvider: false,
    });
  }
  if (opts.cards || (props && (props.smartLinks || props.UNSAFE_cards))) {
    providers.cardsProvider = Promise.resolve(cardProvider);
  }
  if (opts.collab) {
    providers.collabEditProvider = createCollabEditProvider(opts.collab);
  }

  if (opts.extensionProviders) {
    const extensionProvidersArr = [];
    if (withTestExtensionProviders.extensionFrameManifest) {
      extensionProvidersArr.push(createExtensionFramesProvider());
    }
    if (withTestExtensionProviders.floatingToolbarManifest) {
      extensionProvidersArr.push(createTestExtensionProvider(() => {}));
    }

    providers.extensionProviders = extensionProvidersArr;
  }

  return providers;
}

/**
 * Legacy editor props to providers mapping
 */
export function mapPropsToProviders(
  providers: Record<string, boolean> = {},
  props: EditorProps,
): Record<string, boolean> {
  if (props && (props.smartLinks || props.UNSAFE_cards)) {
    providers.cards = true;
  }

  if (props && props.media) {
    providers.media = true;
  }

  if (
    typeof props.allowExtension === 'object' &&
    props.allowExtension?.allowExtendFloatingToolbars
  ) {
    providers.extensionProviders = true;
  }

  return providers;
}

/**
 * Legacy providers to props mapping
 */
export function mapProvidersToProps(
  providers: Record<string, any> = {},
  props: EditorProps,
): EditorProps {
  if (props && props.smartLinks) {
    props.smartLinks = {
      ...props.smartLinks,
      provider: providers.cardsProvider,
    };
  }

  if (props && props.UNSAFE_cards) {
    props.UNSAFE_cards = {
      ...props.UNSAFE_cards,
      provider: providers.cardsProvider,
    };
  }

  if (props && props.media) {
    props.media.provider = providers.mediaProvider;
  }

  if (providers.quickInsertProvider) {
    props.quickInsert = { provider: providers.quickInsertProvider };
  }

  if (props && props.annotationProviders) {
    const isToolbarAbove =
      typeof props.annotationProviders === 'object'
        ? props.annotationProviders.inlineComment.isToolbarAbove
        : undefined;
    props.annotationProviders = {
      inlineComment: {
        createComponent: ExampleCreateInlineCommentComponent,
        viewComponent: ExampleViewInlineCommentComponent,
        getState: async (ids: string[]) =>
          ids.map((id) => ({
            annotationType: AnnotationTypes.INLINE_COMMENT,
            id,
            state: { resolved: false },
          })),
        isToolbarAbove,
      },
    };
  }

  return props;
}

function createWrappers(options: MountEditorOptions, RenderCmp: any) {
  let Cmp: EditorExampleComponent<any> = (props) =>
    RenderCmp(
      props.props,
      props.nonSerializableProps,
      props.lifeCycleHandlers,
      props.withCollab,
    );

  if (options.mode === 'dark') {
    Cmp = withDarkMode(Cmp);
  }

  if (options.i18n && options.i18n.locale) {
    Cmp = withI18n(options.i18n.locale, Cmp);
  }

  if (options.withSidebar) {
    Cmp = withSidebarContainer(Cmp);
  }

  return Cmp;
}

function withDarkMode(
  Wrapper: EditorExampleComponent<any>,
): EditorExampleComponent<any> {
  return (props) => (
    <DeprecatedThemeProvider provider={ThemeProvider} mode="dark">
      <Wrapper {...props} />
    </DeprecatedThemeProvider>
  );
}

function withI18n(
  locale: string,
  Wrapper: EditorExampleComponent<any>,
): EditorExampleComponent<any> {
  return (props) => (
    <IntlProvider locale={locale}>
      <Wrapper {...props} />
    </IntlProvider>
  );
}

function createLoadReactIntlLocale(win: WindowWithExtensionsForTesting) {
  win.__loadReactIntlLocale = (
    locales: Array<string>,
    done: (value?: any) => any,
  ) => {
    const modulesToLoad = locales.map(
      (locale) => import(`react-intl/locale-data/${locale}`),
    );
    Promise.all(modulesToLoad)
      .then((localeData) => {
        localeData.forEach((data) => addLocaleData(data.default));
        done();
      })
      .catch(() => {
        done();
      });
  };
}

function createUpdateEditorProps<T>(
  win: WindowWithExtensionsForTesting,
  props: T,
  opts: MountEditorOptions,
  Wrapper: EditorExampleComponent<T>,
) {
  win.__updateEditorProps = (
    newProps: Partial<T>,
    newOptions: Partial<MountEditorOptions>,
  ) => {
    if (!win.__mountEditor) {
      return;
    }
    win.__mountEditor(
      { ...props, ...newProps },
      { ...opts, ...newOptions },
      Wrapper,
    );
  };
}

/**
 *
 * Types
 *
 */

type WindowWithExtensionsForTesting = Window & {
  __mountEditor?: (
    props: any,
    opts: any,
    MaybeWrapper?: EditorExampleComponent<any>,
  ) => void;
  __updateEditorProps?: (props: any, opts: any) => void;
  __loadReactIntlLocale?: (
    locales: Array<string>,
    done: (value?: any) => any,
  ) => void;
  __editorView?: EditorView;
  __applyRemoteSteps?: (__applyRemoteSteps: Array<string>) => void;
  __documentToJSON?: () => JSONDocNode;
  onChangeCounter?: number;
};

type EditorExampleComponent<T> =
  | React.ComponentType<EditorExampleComponentProps<T>>
  | React.FunctionComponent<EditorExampleComponentProps<T>>;

type EditorExampleComponentProps<T> = {
  props: Partial<T>;
  nonSerializableProps: {
    providers?: Record<string, any>;
    extensionHandlers?: ExtensionHandlers;
    withContextPanel?: boolean;
  };
  lifeCycleHandlers: {
    onChange?: any;
    onMount?: (actions: EditorActions) => void;
    onDestroy?: () => void;
  };
  withCollab?: boolean;
};

type EditorExampleRenderFunction<T> = (
  props: EditorExampleComponentProps<T>['props'],
  nonSerializableProps: EditorExampleComponentProps<T>['nonSerializableProps'],
  lifeCycleHandlers: EditorExampleComponentProps<T>['lifeCycleHandlers'],
  withCollab?: boolean,
) => JSX.Element;

export type MountEditorOptions = {
  i18n?: { locale: string };
  mode?: 'dark';
  withSidebar?: boolean;
  /** Toggles chosen extension providers */
  withTestExtensionProviders?: TestExtensionProviders;
  withContextPanel?: boolean;
  providers?: Record<string, boolean>;
  extensionHandlers?: boolean;
  invalidAltTextValues?: string[];
  withCollab?: boolean;
};
