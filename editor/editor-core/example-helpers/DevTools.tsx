import React from 'react';

import { WithEditorActions } from '../src';

const useDiffWorker = () => {
  let workerFile: URL | string | null = null;

  if (!process.env.IS_RSPACK) {
    try {
      workerFile = require('worker-plugin/loader!prosemirror-dev-tools/json-diff.worker');
    } catch (err) {}
  }

  return React.useMemo(
    () =>
      typeof Worker === 'undefined' || !workerFile
        ? undefined
        : new Worker(workerFile),
    [workerFile],
  );
};

export function DevTools() {
  const diffWorker = useDiffWorker();

  if (process.env.NODE_ENV !== 'test') {
    return (
      <WithEditorActions
        render={(actions) => {
          const editorView = actions._privateGetEditorView();
          if (editorView) {
            import(
              /* webpackChunkName: "@atlaskit-internal_prosemirror-dev-tools" */ 'prosemirror-dev-tools'
            ).then(({ applyDevTools }) =>
              applyDevTools(editorView, {
                diffWorker,
              }),
            );
          }
          return null;
        }}
      />
    );
  }

  return null;
}
