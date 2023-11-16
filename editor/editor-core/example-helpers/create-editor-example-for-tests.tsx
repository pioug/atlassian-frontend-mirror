import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl-next';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { Step } from '@atlaskit/editor-prosemirror/transform';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { AnnotationTypes } from '@atlaskit/adf-schema';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import DeprecatedThemeProvider from '@atlaskit/theme/deprecated-provider-please-do-not-use';
import { ThemeProvider } from '@emotion/react';
import {
  getEmojiProvider,
  currentUser,
} from '@atlaskit/util-data-test/get-emoji-provider';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import { createCollabEditProvider } from '@atlaskit/synchrony-test-helpers';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { cardProvider } from '@atlaskit/editor-test-helpers/card-provider';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { macroProvider } from '@atlaskit/editor-test-helpers/mock-macro-provider';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { extensionHandlers as exampleExtensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  ExampleCreateInlineCommentComponent,
  ExampleViewInlineCommentComponent,
} from '@atlaskit/editor-test-helpers/example-inline-comment-component';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorMediaMock } from '@atlaskit/editor-test-helpers/media-mock';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { TestExtensionProviders } from '@atlaskit/editor-test-helpers/vr-utils';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';

import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { MockActivityResource } from './activity-provider';
import ClipboardHelper from '../examples/1-clipboard-helper';
import type EditorActions from '../src/actions';
import { withSidebarContainer } from './SidebarContainer';
import quickInsertProviderFactory from './quick-insert-provider';

import type { EditorProps } from '../src';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createTestExtensionProvider } from '@atlaskit/editor-test-helpers/create-test-extension-provider';
import { createExtensionFramesProvider } from '../src/__tests__/visual-regression/common/__helpers__/extensionFrameManifest';
import { getConfluenceMacrosExtensionProvider } from './confluence-macros';
import {
  mockAssetsClientFetchRequests,
  mockDatasourceFetchRequests,
} from '@atlaskit/link-test-helpers/datasource';
import { DefaultExtensionProvider } from '@atlaskit/editor-common/extensions';
import { manifest as jiraCreate } from '@atlassian/editor-extension-link-create';

const mediaMockServer = createEditorMediaMock();
/**
 * Creates an example editor for VR or Integration tests.
 */
export function createEditorExampleForTests<T extends EditorProps>(
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

function createEditorWindowBindings<T extends EditorProps>(
  win: WindowWithExtensionsForTesting,
  render: EditorExampleRenderFunction<T>,
) {
  if (win.__mountEditor) {
    return;
  }

  const internalMediaMock = createMediaMockEnableOnce();

  const mountEditor: (
    props: T,
    opts: MountEditorOptions,
    MaybeWrapper?: EditorExampleComponent<T>,
    platformFeatureFlags?: Record<string, boolean>,
  ) => void = (props, options = {}, MaybeWrapper, platformFeatureFlags) => {
    if (platformFeatureFlags) {
      setBooleanFeatureFlagResolver((ffName) => {
        return platformFeatureFlags[ffName] ?? false;
      });
    }

    if (options.datasourceMocks) {
      mockDatasourceFetchRequests({
        initialVisibleColumnKeys:
          options.datasourceMocks.initialVisibleColumnKeys,
        shouldMockORSBatch: options.datasourceMocks.shouldMockORSBatch,
        delayedResponse: false,
      });
      if (options.datasourceMocks.shouldMockAssets) {
        mockAssetsClientFetchRequests({ delayedResponse: false });
      }
    }

    const target = document.getElementById('editor-container');

    if (!target) {
      return;
    }

    // If MaybeWrapper is defined it means that we are updating editor props.
    if (!MaybeWrapper) {
      ReactDOM.unmountComponentAtNode(target);
    }

    options.providers = mapPropsToProviders(options.providers, props);

    // If extensions are allowed and withLinkCreateJira is allowed, enable extension providers
    if (options.withLinkCreateJira) {
      options.providers.extensionProviders = true;
    }

    const providers = createProviders(options.providers, {
      editorProps: {},
      withTestExtensionProviders: options.withTestExtensionProviders,
      withConfluenceMacrosExtensionProvider:
        options.withConfluenceMacrosExtensionProvider,
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
          withLinkPickerOptions: options.withLinkPickerOptions,
          withTitleFocusHandler: options.withTitleFocusHandler,
        }}
        lifeCycleHandlers={{
          onMount(actions: any) {
            const view = actions._privateGetEditorView();
            win.__editorView = view;
            // @ts-ignore
            win.__TextSelection = TextSelection;
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
    withConfluenceMacrosExtensionProvider = false,
    editorProps: props = {},
  }: {
    withConfluenceMacrosExtensionProvider?: boolean;
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
    providers.mediaProvider = storyMediaProviderFactory();
  }
  if (
    opts.cards ||
    (props &&
      (props.linking?.smartLinks || props.smartLinks || props.UNSAFE_cards))
  ) {
    providers.cardsProvider = Promise.resolve(cardProvider);
  }
  if (opts.collab) {
    providers.collabEditProvider = createCollabEditProvider(opts.collab);
  }

  if (opts.extensionProviders) {
    const extensionProvidersArr: (
      | DefaultExtensionProvider<any>
      | Promise<DefaultExtensionProvider<any>>
    )[] = [];
    if (withTestExtensionProviders.extensionFrameManifest) {
      extensionProvidersArr.push(createExtensionFramesProvider());
    }
    if (withTestExtensionProviders.floatingToolbarManifest) {
      extensionProvidersArr.push(createTestExtensionProvider(() => {}));
    }

    const jiraCreateExtensionProvider = new DefaultExtensionProvider<any>([
      jiraCreate({
        intlLocale: 'en',
        defaultCloudId: 'DUMMY-123',
        location: 'confluence-page',
      }),
    ]);

    extensionProvidersArr.push(jiraCreateExtensionProvider);
    providers.extensionProviders = extensionProvidersArr;
  }

  if (withConfluenceMacrosExtensionProvider) {
    providers.extensionProviders = [
      getConfluenceMacrosExtensionProvider(undefined),
    ];
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
  if (
    props &&
    (props.linking?.smartLinks || props.smartLinks || props.UNSAFE_cards)
  ) {
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

  if (props && props.linking?.smartLinks) {
    props.linking = {
      ...props.linking,
      smartLinks: {
        ...props.linking.smartLinks,
        provider: providers.cardsProvider,
      },
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
  __editorView?: EditorView;
  __TextSelection?: TextSelection;
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
    withLinkPickerOptions?: boolean;
    withTitleFocusHandler?: boolean;
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
  withLinkPickerOptions?: boolean;
  withConfluenceMacrosExtensionProvider?: boolean;
  withTitleFocusHandler?: boolean;
  withLinkCreateJira?: boolean;
  /** Api mock configurations */
  datasourceMocks?: {
    initialVisibleColumnKeys?: string[];
    shouldMockORSBatch?: boolean;
    shouldMockAssets?: boolean;
  };
};
