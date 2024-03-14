import React, { useEffect, useMemo, useRef } from 'react';

import { AnnotationTypes } from '@atlaskit/adf-schema';
import { createSocketIOCollabProvider } from '@atlaskit/collab-provider/socket-io-provider';
import { AnnotationUpdateEmitter } from '@atlaskit/editor-common/annotation';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { EditorContext } from '@atlaskit/editor-core/editor-context';
import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { editorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
  ExampleCreateInlineCommentComponent,
  ExampleViewInlineCommentComponent,
} from '@atlaskit/editor-test-helpers/example-helpers';

import type { EditorProps } from '../src/types/editor-props';

type CollabProviderProps = {
  documentAri: string;
  collabEndpoint: string;
};

type OrNull<T> = T | null;
type MountEditorOptions = CollabProviderProps;
type WindowForTesting = Window & {
  __mountEditor?: (props: EditorProps, opts: MountEditorOptions) => void;
  __unmountEditor?: () => void;
  __editorView?: EditorView | null;
  __TextSelection?: TextSelection | null;
  __setViewMode?: OrNull<(mode: 'view' | 'edit') => void>;
};

const useCollabProvider = ({
  documentAri,
  collabEndpoint,
}: CollabProviderProps) => {
  const provider = React.useMemo(() => {
    const collabProvider = createSocketIOCollabProvider({
      url: collabEndpoint,
      need404: false,
      documentAri,
      productInfo: {
        product: 'editor-core',
        subProduct: 'Libra ViewMode tests',
      },
      featureFlags: { testFF: false, testAF: true },
    });

    return collabProvider;
  }, [documentAri, collabEndpoint]);

  return provider;
};

const emitter = new AnnotationUpdateEmitter();

const annotationStates = new Map();
const inlineCommentGetState = async (annotationsIds: string[]) => {
  return annotationsIds.map((id) => ({
    id,
    annotationType: AnnotationTypes.INLINE_COMMENT,
    state: { resolved: annotationStates.get(id) || false },
  }));
};
const annotationProviders = {
  inlineComment: {
    createComponent: ExampleCreateInlineCommentComponent,
    viewComponent: ExampleViewInlineCommentComponent,
    updateSubscriber: emitter,
    getState: inlineCommentGetState,
    disallowOnWhitespace: false,
  },
};

type CollabEditorProps = {
  collabProps: CollabProviderProps;
  setIsReady: (value: boolean) => void;
  userId: string;
};
const CollabEditor = ({
  userId,
  collabProps,
  setIsReady,
}: CollabEditorProps) => {
  const collabProvider = useCollabProvider(collabProps);
  const collabEdit = React.useMemo(() => {
    return {
      useNativePlugin: true,
      provider: Promise.resolve(collabProvider),
      userId,
    };
  }, [collabProvider, userId]);

  const props: EditorProps = React.useMemo(() => {
    return {
      appearance: 'full-page',
      collabEdit,
      annotationProviders,
    };
  }, [collabEdit]);

  const universal = useUniversalPreset({ props });
  const universalWithViewMode = useMemo(() => {
    return universal.add(editorViewModePlugin);
  }, [universal]);

  const { preset, editorApi } = usePreset(() => {
    return universalWithViewMode;
  }, [universalWithViewMode]);

  const apiRef = useRef(editorApi);
  apiRef.current = editorApi;

  const onEditorReady = React.useCallback((editorActions: any) => {
    const view = editorActions._privateGetEditorView();
    (window as WindowForTesting).__editorView = view;
    // @ts-ignore
    (window as WindowForTesting).__TextSelection = TextSelection;

    (window as WindowForTesting).__setViewMode = (mode: 'edit' | 'view') => {
      const api = apiRef.current;
      api?.core?.actions.execute(
        api?.editorViewMode?.commands.updateViewMode(mode),
      );
    };
  }, []);

  const { collabEditState } = useSharedPluginState(editorApi, ['collabEdit']);

  useEffect(() => {
    if (!collabEditState?.initialised?.collabInitialisedAt) {
      return;
    }

    setIsReady(true);
  }, [collabEditState?.initialised, setIsReady]);

  const onDestroy = React.useCallback(() => {
    (window as WindowForTesting).__editorView = null;
    (window as WindowForTesting).__TextSelection = null;
    (window as WindowForTesting).__setViewMode = null;
  }, []);

  return (
    <ComposableEditor
      {...props}
      preset={preset}
      onEditorReady={onEditorReady}
      onDestroy={onDestroy}
    />
  );
};

const style = { height: '100%', width: '100%' };
const urlParams = new URLSearchParams(window.location.search);
export default function EditorExampleForIntegrationTests() {
  const options = React.useMemo(() => {
    const fakeAri = `ari:cloud:confluence:collab-test:blog/${crypto.randomUUID()}`;
    const documentAri = urlParams.get('documentAri') || fakeAri;
    const collabEndpoint =
      urlParams.get('collabEndpoint') ||
      'https://pf-collab-service--app.ap-southeast-2.dev.atl-paas.net/ccollab';

    return {
      documentAri,
      collabEndpoint,
    };
  }, []);
  const userId = React.useMemo(() => {
    const randomUsername = `lol_editor_test_user_${crypto.randomUUID()}`;
    return urlParams.get('userId') || randomUsername;
  }, []);
  const [isReady, setIsReady] = React.useState(false);

  return (
    <div id="editor-container" data-collab-is-ready={isReady} style={style}>
      <EditorContext>
        <CollabEditor
          userId={userId}
          collabProps={options}
          setIsReady={setIsReady}
        />
      </EditorContext>
    </div>
  );
}
