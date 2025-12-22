import { createContext, useContext } from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { SelectionExtensionPlugin } from '../selectionExtensionPluginType';

/*
 * Common context passed down to selection extension components
 */
type SelectionExtensionComponentContextValue = {
	api: ExtractInjectionAPI<SelectionExtensionPlugin>;
	editorView: EditorView;
	extensionKey: string;
	extensionSource: string;
	extensionLocation: 'inline-toolbar' | 'primary-toolbar' | 'block-menu';
};

const SelectionExtensionComponentContext = createContext<
	SelectionExtensionComponentContextValue | undefined
>(undefined);

export const SelectionExtensionComponentContextProvider =
	SelectionExtensionComponentContext.Provider;

export const useSelectionExtensionComponentContext = () => {
	const context = useContext(SelectionExtensionComponentContext);

	if (!context) {
		throw new Error(
			'useSelectionExtensionComponentContext must be used within SelectionExtensionComponentContextProvider',
		);
	}

	return context;
};
