import type React from 'react';

import type { EditorState } from 'prosemirror-state';

export type ContextPanelHandler = (state: EditorState) => React.ReactNode;
