import type React from 'react';

import type { EditorState } from '@atlaskit/editor-prosemirror/state';

export type ContextPanelHandler = (state: EditorState) => React.ReactNode;
