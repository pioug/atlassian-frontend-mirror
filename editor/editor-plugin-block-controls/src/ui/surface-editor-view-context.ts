import { createContext, useContext, type Context } from 'react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';

/** Provides registered block-control surface contributors with their owning editor view. */
export const SurfaceEditorViewContext: Context<EditorView | undefined> = createContext<
	EditorView | undefined
>(undefined);

export const useSurfaceEditorView = (): EditorView | undefined =>
	useContext(SurfaceEditorViewContext);
