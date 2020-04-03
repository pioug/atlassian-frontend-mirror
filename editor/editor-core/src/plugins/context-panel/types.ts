import React from 'react';
import { EditorState } from 'prosemirror-state';

export type ContextPanelHandler = (state: EditorState) => React.ReactNode;
