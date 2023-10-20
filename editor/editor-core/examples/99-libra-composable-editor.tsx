import React, { Profiler } from 'react';
//import ReactDOM from 'react-dom';
// @ts-expect-error TS7016: Could not find a declaration file for module 'react-dom/profiling'
import ReactDOM from 'react-dom/profiling';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import type { EditorNextProps } from '../src/types/editor-props';
import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';

type LibraReactPerformanceEntry = {
  id: string;
  phase: string;
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
};
type WindowForTesting = Window & {
  __mountEditor?: (
    props: EditorNextProps,
    opts: Record<string, boolean>,
  ) => void;
  __unmountEditor?: () => Array<LibraReactPerformanceEntry>;
  __editorView?: EditorView | null;
  __TextSelection?: TextSelection | null;
};

const RawEditor = (props: EditorNextProps) => {
  const onEditorReady = React.useCallback((editorActions: any) => {
    const view = editorActions._privateGetEditorView();
    (window as WindowForTesting).__editorView = view;
    // @ts-ignore
    (window as WindowForTesting).__TextSelection = TextSelection;
  }, []);

  const onDestroy = React.useCallback(() => {
    (window as WindowForTesting).__editorView = null;
    (window as WindowForTesting).__TextSelection = null;
  }, []);
  const preset = useUniversalPreset({ props });

  return (
    <ComposableEditor
      {...props}
      preset={preset}
      onEditorReady={onEditorReady}
      onDestroy={onDestroy}
    />
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
    props: EditorNextProps,
    options: Record<string, boolean> = {},
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
    createEditorExampleForTests();
  }, []);

  const style = React.useMemo(() => ({ height: '100%', width: '100%' }), []);

  return <div id="editor-container" style={style} />;
}
