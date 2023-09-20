import React, { Profiler } from 'react';
//import ReactDOM from 'react-dom';
// @ts-expect-error TS7016: Could not find a declaration file for module 'react-dom/profiling'
import ReactDOM from 'react-dom/profiling';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import Editor from '../src/editor';
import type { EditorProps } from '../src/types/editor-props';
import type EditorActions from '../src/actions';

interface TestExtensionProviders {
  extensionFrameManifest?: boolean;
  floatingToolbarManifest?: boolean;
  [key: string]: boolean | undefined;
}
type MountEditorOptions = {
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

type LibraReactPerformanceEntry = {
  id: string;
  phase: string;
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
};
type WindowForTesting = Window & {
  __mountEditor?: (props: EditorProps, opts: MountEditorOptions) => void;
  __unmountEditor?: () => Array<LibraReactPerformanceEntry>;
  __editorView?: EditorView | null;
  __TextSelection?: TextSelection | null;
};

const RawEditor = (props: EditorProps) => {
  const onEditorReady = React.useCallback((editorActions: EditorActions) => {
    const view = editorActions._privateGetEditorView();
    (window as WindowForTesting).__editorView = view;
    // @ts-ignore
    (window as WindowForTesting).__TextSelection = TextSelection;
  }, []);

  const onDestroy = React.useCallback(() => {
    (window as WindowForTesting).__editorView = null;
    (window as WindowForTesting).__TextSelection = null;
  }, []);

  return (
    <Editor {...props} onEditorReady={onEditorReady} onDestroy={onDestroy} />
  );
};

function createEditorExampleForTests() {
  const win = window as WindowForTesting;

  if (win.__mountEditor) {
    return;
  }
  const reactPeformanceData: Array<LibraReactPerformanceEntry> = [];
  const onRender = (
    id: string,
    phase: string,
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number,
  ) => {
    const entry: LibraReactPerformanceEntry = {
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
    };

    reactPeformanceData.push(entry);
  };
  const mountEditor = (
    props: EditorProps,
    options: MountEditorOptions = {},
    platformFeatureFlags?: Record<string, boolean>,
  ) => {
    const target = document.getElementById('editor-container');

    if (!target) {
      return;
    }

    ReactDOM.render(
      <Profiler id="EditorMainComponent" onRender={onRender}>
        <RawEditor {...props} />
      </Profiler>,
      target,
    );
  };

  const unmountEditor = () => {
    const target = document.getElementById('editor-container');

    if (!target) {
      return [];
    }

    ReactDOM.unmountComponentAtNode(target);

    return reactPeformanceData;
  };

  win.__mountEditor = mountEditor;
  win.__unmountEditor = unmountEditor;
}

export default function EditorExampleForIntegrationTests() {
  React.useLayoutEffect(() => {
    console.log('LOL: mounting');
    createEditorExampleForTests();
  }, []);

  const style = React.useMemo(() => ({ height: '100%', width: '100%' }), []);

  return <div id="editor-container" style={style} />;
}
