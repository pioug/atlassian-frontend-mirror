import { createContext } from 'react';
import type { Context } from 'react';

import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { ExtractInjectionAPI, TypeAheadHandler } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { SurfaceContext } from '@atlaskit/editor-ui-control-model/types';

import type { TypeAheadPlugin } from '../../typeAheadPluginType';

export type TypeAheadContextValue = {
	api: ExtractInjectionAPI<TypeAheadPlugin> | undefined;
	editorView: EditorView;
	inputMethod: INPUT_METHOD.QUICK_INSERT;
	menuOpenId: symbol;
	onClose: () => void;
	query: string;
	surfaceContext: SurfaceContext;
	triggerHandler: TypeAheadHandler;
};

export const TypeAheadContext: Context<TypeAheadContextValue | null> =
	createContext<TypeAheadContextValue | null>(null);
