import { createContext } from 'react';
import type { Context } from 'react';

import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { TypeAheadHandler } from '@atlaskit/editor-common/types/type-ahead';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { SurfaceContext } from '@atlaskit/editor-ui-control-model/types';

import type { TypeAheadPlugin } from '../../typeAheadPluginType';

export type TypeAheadContextValue = {
	activePreviewItemKey?: string;
	api: ExtractInjectionAPI<TypeAheadPlugin> | undefined;
	editorView: EditorView;
	inputMethod: INPUT_METHOD.QUICK_INSERT;
	menuOpenId: symbol;
	onClose: () => void;
	popupsMountPoint?: HTMLElement;
	query: string;
	surfaceContext: SurfaceContext;
	triggerHandler: TypeAheadHandler;
};

export const TypeAheadContext: Context<TypeAheadContextValue | null> =
	createContext<TypeAheadContextValue | null>(null);
