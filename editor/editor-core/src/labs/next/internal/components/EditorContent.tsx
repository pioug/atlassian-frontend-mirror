import React from 'react';

const EditorContentContext = React.createContext<(ref: HTMLDivElement) => void>(
  () => {},
);

const EditorContentProvider = EditorContentContext.Provider;

/**
 * ProseMirror View mount point.
 */
const EditorContent = React.memo(() => {
  const handleRef = React.useContext(EditorContentContext);
  return <div style={{ height: '100%' }} ref={handleRef} />;
});

export { EditorContentProvider, EditorContent };
