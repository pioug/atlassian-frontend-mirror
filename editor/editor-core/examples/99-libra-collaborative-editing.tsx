import React from 'react';

import { createSocketIOCollabProvider } from '@atlaskit/collab-provider/socket-io-provider';
//import Editor from '../src/editor';
import { EditorContext } from '@atlaskit/editor-core';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type EditorActions from '../src/actions';
import type { EditorProps } from '../src/types/editor-props';

type CollabProviderProps = {
  documentAri: string;
  collabEndpoint: string;
};

type MountEditorOptions = CollabProviderProps;

type WindowForTesting = Window & {
  __mountEditor?: (props: EditorProps, opts: MountEditorOptions) => void;
  __unmountEditor?: () => void;
  __editorView?: EditorView | null;
  __TextSelection?: TextSelection | null;
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
        subProduct: 'Libra tests',
      },
      featureFlags: { testFF: false, testAF: true },
    });

    return collabProvider;
  }, [documentAri, collabEndpoint]);

  return provider;
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
  const onEditorReady = React.useCallback(
    (editorActions: EditorActions) => {
      const view = editorActions._privateGetEditorView();
      (window as WindowForTesting).__editorView = view;
      // @ts-ignore
      (window as WindowForTesting).__TextSelection = TextSelection;

      requestAnimationFrame(() => {
        // TODO: Write better Editor is ready with NCS shared state api
        setIsReady(true);
      });
    },
    [setIsReady],
  );

  const onDestroy = React.useCallback(() => {
    (window as WindowForTesting).__editorView = null;
    (window as WindowForTesting).__TextSelection = null;
  }, []);

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
    };
  }, [collabEdit]);
  const _preset = useUniversalPreset({ props });

  const createPreset = React.useCallback(() => {
    return _preset;
  }, [_preset]);

  const { preset } = usePreset(createPreset, []);

  return (
    <ComposableEditor
      appearance="full-page"
      preset={preset}
      collabEdit={collabEdit}
      onEditorReady={onEditorReady}
      onDestroy={onDestroy}
    />
  );
};

const style = { height: '100%', width: '100%' };
const urlParams = new URLSearchParams(window.location.search);
export default function EditorExampleForIntegrationTests() {
  const options = React.useMemo(() => {
    const documentAri = urlParams.get('documentAri') || '';
    const collabEndpoint = urlParams.get('collabEndpoint') || '';

    return {
      documentAri,
      collabEndpoint,
    };
  }, []);
  const userId = React.useMemo(() => {
    return urlParams.get('userId') || '';
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
